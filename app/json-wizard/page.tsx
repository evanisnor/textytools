"use client";

import {
  Fragment,
  useState,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useToast } from "@/app/components/Toast";
import {
  TextEditorContainer,
  type TextEditorContainerRef,
} from "@/app/components/TextEditorContainer";
import { ToolFrame } from "@/app/components/ToolFrame";
import { SearchBox } from "@/app/components/SearchBox";
import {
  trackCopyEvent,
  trackToolConversion,
  trackClearEvent,
} from "@/app/lib/analytics";
import { TOOL_NAMES } from "@/app/lib/constants";
import {
  useJsonSyntaxHighlighter,
  tokenizeJson,
  type JsonSyntaxTheme,
} from "@/app/hooks/useJsonSyntaxHighlighter";

type ViewMode = "pretty" | "minified" | "escaped";

interface ValidationResult {
  isValid: boolean;
  error?: string;
  lineNumber?: number;
  columnNumber?: number;
}

function validateJSON(text: string): ValidationResult {
  if (!text.trim()) {
    return { isValid: true };
  }

  try {
    JSON.parse(text);
    return { isValid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      const match = error.message.match(/position (\d+)/);
      const position = match ? parseInt(match[1]) : undefined;

      if (position !== undefined) {
        const lines = text.substring(0, position).split("\n");
        const lineNumber = lines.length;
        const columnNumber = lines[lines.length - 1].length + 1;

        return {
          isValid: false,
          error: error.message,
          lineNumber,
          columnNumber,
        };
      }

      return {
        isValid: false,
        error: error.message,
      };
    }
    return {
      isValid: false,
      error: "Unknown parsing error",
    };
  }
}

function getJSONStats(text: string): {
  keys: number;
  depth: number;
  size: number;
} {
  try {
    const parsed = JSON.parse(text);

    const countKeys = (obj: unknown): number => {
      if (typeof obj !== "object" || obj === null) return 0;

      let count = 0;
      for (const key in obj) {
        count++;
        count += countKeys((obj as Record<string, unknown>)[key]);
      }
      return count;
    };

    const getDepth = (obj: unknown, current = 1): number => {
      if (typeof obj !== "object" || obj === null) return current;

      let maxDepth = current;
      for (const key in obj) {
        const depth = getDepth(
          (obj as Record<string, unknown>)[key],
          current + 1,
        );
        maxDepth = Math.max(maxDepth, depth);
      }
      return maxDepth;
    };

    return {
      keys: countKeys(parsed),
      depth: getDepth(parsed),
      size: new Blob([text]).size,
    };
  } catch {
    return { keys: 0, depth: 0, size: new Blob([text]).size };
  }
}

export default function JSONWizard() {
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("pretty");
  const [indentSize, setIndentSize] = useState(2);
  const [searchTerm, setSearchTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [sortKeys, setSortKeys] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const inputEditorRef = useRef<TextEditorContainerRef>(null);
  const outputEditorRef = useRef<TextEditorContainerRef>(null);
  const { showToast, ToastComponent } = useToast();

  // Track if component has mounted to avoid hydration mismatches
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setMounted(true);

      // Check for cross-tool data first (takes precedence)
      const storedInput = sessionStorage.getItem(
        "cross-tool-input-json-wizard",
      );
      if (storedInput) {
        sessionStorage.removeItem("cross-tool-input-json-wizard");
        setInput(storedInput);
        return;
      }

      // Load persisted state from sessionStorage
      const persistedState = sessionStorage.getItem("json-wizard-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.input !== undefined) setInput(state.input);
          if (state.viewMode !== undefined) setViewMode(state.viewMode);
          if (state.indentSize !== undefined) setIndentSize(state.indentSize);
          if (state.sortKeys !== undefined) setSortKeys(state.sortKeys);
          if (state.caseSensitive !== undefined)
            setCaseSensitive(state.caseSensitive);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state whenever inputs change
  useEffect(() => {
    if (!mounted) return;
    const state = { input, viewMode, indentSize, sortKeys, caseSensitive };
    sessionStorage.setItem("json-wizard-state", JSON.stringify(state));
  }, [input, viewMode, indentSize, sortKeys, caseSensitive, mounted]);

  const validation = useMemo(() => validateJSON(input), [input]);
  const stats = useMemo(() => getJSONStats(input), [input]);

  // Check if input is an escaped JSON string (valid JSON that is a string containing JSON)
  const isEscapedString = useMemo(() => {
    if (!validation.isValid || !input.trim()) return false;
    try {
      const parsed = JSON.parse(input);
      if (typeof parsed === "string") {
        // Check if the string itself is valid JSON
        try {
          JSON.parse(parsed);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    } catch {
      return false;
    }
  }, [input, validation.isValid]);

  // Build ordered list of JSON paths where matches occur in input (in document order)
  const inputMatchPaths = useMemo(() => {
    if (!searchTerm || !validation.isValid || !input.trim()) return [];

    try {
      const parsed = JSON.parse(input);
      const paths: string[] = [];
      const regex = new RegExp(
        searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        caseSensitive ? "g" : "gi",
      );

      const traverse = (obj: unknown, path: string[] = []): void => {
        if (typeof obj === "object" && obj !== null) {
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              traverse(item, [...path, `[${index}]`]);
            });
          } else {
            // Keys appear in the order they are in the input JSON
            Object.keys(obj).forEach((key) => {
              traverse((obj as Record<string, unknown>)[key], [...path, key]);
            });
          }
        } else {
          // Check if this value contains matches
          const valueStr = String(obj);
          const matches = valueStr.match(regex);
          if (matches) {
            // Add the path once for each match in this value
            for (let i = 0; i < matches.length; i++) {
              paths.push(path.join("."));
            }
          }
        }
      };

      traverse(parsed);
      return paths;
    } catch {
      return [];
    }
  }, [searchTerm, caseSensitive, input, validation.isValid]);

  // Calculate search matches in input
  const searchMatches = useMemo(() => {
    if (!searchTerm || !input) return [];

    const matches: {
      lineIndex: number;
      matchIndex: number;
      columnStart: number;
      jsonPath?: string;
    }[] = [];
    const lines = input.split("\n");

    lines.forEach((line, lineIndex) => {
      let match;
      const lineRegex = new RegExp(
        searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        caseSensitive ? "g" : "gi",
      );
      while ((match = lineRegex.exec(line)) !== null) {
        const jsonPath = inputMatchPaths[matches.length];
        matches.push({
          lineIndex,
          matchIndex: matches.length,
          columnStart: match.index,
          jsonPath,
        });
      }
    });

    return matches;
  }, [searchTerm, caseSensitive, input, inputMatchPaths]);

  const totalMatches = searchMatches.length;

  // Create a map for quick lookup of match indices by line and column
  const matchPositions = useMemo(() => {
    const map = new Map<number, Map<number, number>>();
    searchMatches.forEach((match) => {
      if (!map.has(match.lineIndex)) {
        map.set(match.lineIndex, new Map());
      }
      map.get(match.lineIndex)!.set(match.columnStart, match.matchIndex);
    });
    return map;
  }, [searchMatches]);

  const processedJSON = useMemo(() => {
    if (!input.trim()) return input;
    if (!validation.isValid) return input;

    try {
      let parsed = JSON.parse(input);

      // Auto-unescape: If the parsed result is an escaped JSON string, unescape it
      if (isEscapedString && typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (sortKeys) {
        const sortObject = (obj: unknown): unknown => {
          if (typeof obj !== "object" || obj === null) return obj;
          if (Array.isArray(obj)) return obj.map(sortObject);

          const sorted: Record<string, unknown> = {};
          Object.keys(obj as Record<string, unknown>)
            .sort()
            .forEach((key) => {
              sorted[key] = sortObject((obj as Record<string, unknown>)[key]);
            });
          return sorted;
        };
        parsed = sortObject(parsed);
      }

      let result: string;
      switch (viewMode) {
        case "pretty":
          result = JSON.stringify(parsed, null, indentSize);
          break;
        case "minified":
          result = JSON.stringify(parsed);
          break;
        case "escaped":
          result = JSON.stringify(JSON.stringify(parsed));
          break;
      }

      return result;
    } catch {
      return input;
    }
  }, [
    input,
    viewMode,
    indentSize,
    sortKeys,
    validation.isValid,
    isEscapedString,
  ]);

  const inputJsonSyntax = useJsonSyntaxHighlighter({
    enabled: Boolean(input.trim()),
  });
  const inputSyntaxTheme = inputJsonSyntax?.theme;

  const outputJsonSyntax = useJsonSyntaxHighlighter({
    enabled: Boolean(processedJSON.trim()),
  });
  const outputJsonSyntaxRenderer = outputJsonSyntax?.renderContent;
  const outputSyntaxTheme = outputJsonSyntax?.theme;

  // Build ordered list of JSON paths where matches occur in output (in sort order if enabled)
  const outputMatchPaths = useMemo(() => {
    if (!searchTerm || !validation.isValid || !processedJSON.trim()) return [];

    try {
      const parsed = JSON.parse(processedJSON);
      const paths: string[] = [];
      const regex = new RegExp(
        searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        caseSensitive ? "g" : "gi",
      );

      const traverse = (obj: unknown, path: string[] = []): void => {
        if (typeof obj === "object" && obj !== null) {
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              traverse(item, [...path, `[${index}]`]);
            });
          } else {
            // When sortKeys is enabled, Object.keys() returns keys in alphabetical order
            // Otherwise, it preserves document order
            Object.keys(obj).forEach((key) => {
              traverse((obj as Record<string, unknown>)[key], [...path, key]);
            });
          }
        } else {
          // Check if this value contains matches
          const valueStr = String(obj);
          const matches = valueStr.match(regex);
          if (matches) {
            // Add the path once for each match in this value
            for (let i = 0; i < matches.length; i++) {
              paths.push(path.join("."));
            }
          }
        }
      };

      traverse(parsed);
      return paths;
    } catch {
      return [];
    }
  }, [searchTerm, caseSensitive, processedJSON, validation.isValid]);

  // Calculate search matches in the output JSON
  const outputSearchMatches = useMemo(() => {
    if (!searchTerm || !processedJSON) return [];

    const matches: {
      lineIndex: number;
      matchIndex: number;
      columnStart: number;
      jsonPath?: string;
    }[] = [];
    const lines = processedJSON.split("\n");

    lines.forEach((line, lineIndex) => {
      let match;
      const lineRegex = new RegExp(
        searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        caseSensitive ? "g" : "gi",
      );
      while ((match = lineRegex.exec(line)) !== null) {
        const jsonPath = outputMatchPaths[matches.length];
        matches.push({
          lineIndex,
          matchIndex: matches.length,
          columnStart: match.index,
          jsonPath,
        });
      }
    });

    return matches;
  }, [searchTerm, caseSensitive, processedJSON, outputMatchPaths]);

  // Map input match indices to output match indices based on JSON structural paths
  const inputToOutputMatchMap = useMemo(() => {
    const map = new Map<number, number>();

    // Build a queue of output match indices for each path
    const pathToOutputIndices = new Map<string, number[]>();
    outputSearchMatches.forEach((outputMatch) => {
      if (outputMatch.jsonPath !== undefined) {
        if (!pathToOutputIndices.has(outputMatch.jsonPath)) {
          pathToOutputIndices.set(outputMatch.jsonPath, []);
        }
        pathToOutputIndices
          .get(outputMatch.jsonPath)!
          .push(outputMatch.matchIndex);
      }
    });

    // Track how many times we've used each path from input side
    const pathUsageCount = new Map<string, number>();

    // Map each input match to the corresponding output match via structural path
    searchMatches.forEach((inputMatch) => {
      if (inputMatch.jsonPath !== undefined) {
        const outputIndices = pathToOutputIndices.get(inputMatch.jsonPath);
        if (outputIndices && outputIndices.length > 0) {
          const usageCount = pathUsageCount.get(inputMatch.jsonPath) || 0;
          const outputIndex =
            outputIndices[Math.min(usageCount, outputIndices.length - 1)];
          map.set(inputMatch.matchIndex, outputIndex);
          pathUsageCount.set(inputMatch.jsonPath, usageCount + 1);
        }
      } else {
        // Fallback to sequential for invalid JSON
        if (inputMatch.matchIndex < outputSearchMatches.length) {
          map.set(inputMatch.matchIndex, inputMatch.matchIndex);
        }
      }
    });

    return map;
  }, [searchMatches, outputSearchMatches]);

  // Create a map for quick lookup of output match indices
  const outputMatchPositions = useMemo(() => {
    const map = new Map<number, Map<number, number>>();
    outputSearchMatches.forEach((match) => {
      if (!map.has(match.lineIndex)) {
        map.set(match.lineIndex, new Map());
      }
      map.get(match.lineIndex)!.set(match.columnStart, match.matchIndex);
    });
    return map;
  }, [outputSearchMatches]);

  // Scroll to error line when validation fails
  useEffect(() => {
    if (
      !validation.isValid &&
      validation.lineNumber &&
      inputEditorRef.current
    ) {
      const lineHeight = 20; // Approximate line height in pixels
      const errorLine = validation.lineNumber - 1;
      const scrollPosition = errorLine * lineHeight;

      inputEditorRef.current.scrollTo({
        top: Math.max(0, scrollPosition - 100),
      });
    }
  }, [validation]);

  // Scroll to current match
  useEffect(() => {
    if (!searchTerm || searchMatches.length === 0) return;

    const currentMatch = searchMatches[currentMatchIndex];
    if (!currentMatch) return;

    // Use setTimeout to ensure the DOM has updated with the new highlighted elements
    setTimeout(() => {
      // Scroll input to current match within its container only
      const inputMatchElement = document.getElementById(
        `input-match-${currentMatchIndex}`,
      );
      const inputContainer = inputEditorRef.current?.getScrollContainer();
      if (inputMatchElement && inputContainer) {
        const elementRect = inputMatchElement.getBoundingClientRect();
        const containerRect = inputContainer.getBoundingClientRect();

        // Calculate the scroll position to center the match in the container
        const relativeTop =
          elementRect.top - containerRect.top + inputContainer.scrollTop;
        const centerOffset =
          inputContainer.clientHeight / 2 - elementRect.height / 2;
        const relativeLeft =
          elementRect.left - containerRect.left + inputContainer.scrollLeft;
        const centerOffsetX =
          inputContainer.clientWidth / 2 - elementRect.width / 2;

        inputEditorRef.current?.scrollTo({
          top: relativeTop - centerOffset,
          left: relativeLeft - centerOffsetX,
          behavior: "smooth",
        });
      }

      // Scroll output to the corresponding match within its container only
      if (outputSearchMatches.length > 0) {
        const outputMatchIndex = inputToOutputMatchMap.get(currentMatchIndex);
        if (outputMatchIndex !== undefined && outputMatchIndex >= 0) {
          const outputMatchElement = document.getElementById(
            `output-match-${outputMatchIndex}`,
          );
          const outputContainer = outputEditorRef.current?.getScrollContainer();
          if (outputMatchElement && outputContainer) {
            const elementRect = outputMatchElement.getBoundingClientRect();
            const containerRect = outputContainer.getBoundingClientRect();

            // Calculate the scroll position to center the match in the container
            const relativeTop =
              elementRect.top - containerRect.top + outputContainer.scrollTop;
            const centerOffset =
              outputContainer.clientHeight / 2 - elementRect.height / 2;
            const relativeLeft =
              elementRect.left -
              containerRect.left +
              outputContainer.scrollLeft;
            const centerOffsetX =
              outputContainer.clientWidth / 2 - elementRect.width / 2;

            outputEditorRef.current?.scrollTo({
              top: relativeTop - centerOffset,
              left: relativeLeft - centerOffsetX,
              behavior: "smooth",
            });
          }
        }
      }
    }, 0);
  }, [
    currentMatchIndex,
    searchMatches,
    outputSearchMatches,
    searchTerm,
    inputToOutputMatchMap,
  ]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(processedJSON);
      showToast("Copied to clipboard");
      trackCopyEvent({
        tool: TOOL_NAMES.JSON_WIZARD,
        viewMode,
        sortKeys,
        indentSize: viewMode === "pretty" ? indentSize : undefined,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const goToNextMatch = () => {
    if (totalMatches > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % totalMatches);
    }
  };

  const goToPreviousMatch = () => {
    if (totalMatches > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + totalMatches) % totalMatches);
    }
  };

  const renderHighlightedText = (
    text: string,
    lineIndex?: number,
    useOutputMatches = false,
    currentLocalMatchIndex?: number,
    syntaxTheme?: JsonSyntaxTheme,
  ) => {
    // 1. Identify Error on this line
    const errorColIndex =
      !useOutputMatches &&
      !validation.isValid &&
      validation.lineNumber === (lineIndex ?? -1) + 1 &&
      validation.columnNumber
        ? validation.columnNumber - 1
        : -1;

    // 2. Identify Search Matches on this line
    const positions = useOutputMatches ? outputMatchPositions : matchPositions;
    const lineMatches =
      lineIndex !== undefined ? positions.get(lineIndex) : undefined;

    // 3. If no error and no matches, return syntax highlighted text (fast path)
    if (errorColIndex === -1 && (!lineMatches || lineMatches.size === 0)) {
      if (syntaxTheme && text.trim()) {
        const tokens = tokenizeJson(text);
        return tokens.map((token, tokenIndex) => {
          if (token.type === "plain") {
            return <Fragment key={tokenIndex}>{token.text}</Fragment>;
          }
          return (
            <span key={tokenIndex} className={syntaxTheme[token.type]}>
              {token.text}
            </span>
          );
        });
      }
      return text;
    }

    // 4. Build mask for the line
    // We use a mask array to handle overlapping highlights (error takes precedence)
    const mask = new Array(text.length)
      .fill(null)
      .map(() => ({ type: "plain", matchIndex: -1 }));

    // Apply matches
    if (lineMatches && searchTerm) {
      const len = searchTerm.length;
      for (const [start, matchIndex] of lineMatches.entries()) {
        for (let i = start; i < start + len && i < text.length; i++) {
          mask[i] = { type: "match", matchIndex };
        }
      }
    }

    // Apply error (overrides matches)
    let errorAtEnd = false;
    if (errorColIndex !== -1) {
      if (errorColIndex >= text.length) {
        errorAtEnd = true;
      } else {
        for (let i = errorColIndex; i < text.length; i++) {
          mask[i] = { type: "error", matchIndex: -1 };
        }
      }
    }

    // 5. Group consecutive identical mask items into parts
    const parts: Array<{
      text: string;
      type: string;
      matchIndex: number;
      start: number;
    }> = [];

    if (text.length > 0) {
      let currentType = mask[0].type;
      let currentMatchIndex = mask[0].matchIndex;
      let currentStart = 0;

      for (let i = 1; i < text.length; i++) {
        if (
          mask[i].type !== currentType ||
          mask[i].matchIndex !== currentMatchIndex
        ) {
          parts.push({
            text: text.substring(currentStart, i),
            type: currentType,
            matchIndex: currentMatchIndex,
            start: currentStart,
          });
          currentType = mask[i].type;
          currentMatchIndex = mask[i].matchIndex;
          currentStart = i;
        }
      }
      parts.push({
        text: text.substring(currentStart),
        type: currentType,
        matchIndex: currentMatchIndex,
        start: currentStart,
      });
    }

    // 6. Helper for syntax highlighting inside a part
    const syntaxTokens = syntaxTheme ? tokenizeJson(text) : null;

    const renderPartContent = (segment: string, startIndex: number) => {
      if (!segment) return segment;
      if (!syntaxTokens || !syntaxTheme) return segment;

      const segmentEnd = startIndex + segment.length;
      const pieces: ReactNode[] = [];

      syntaxTokens.forEach((token, tokenIndex) => {
        const overlapStart = Math.max(startIndex, token.start);
        const overlapEnd = Math.min(segmentEnd, token.end);
        if (overlapStart >= overlapEnd) return;

        const sliceStart = overlapStart - startIndex;
        const sliceEnd = overlapEnd - startIndex;
        const slice = segment.slice(sliceStart, sliceEnd);
        if (!slice) return;

        const className =
          token.type === "plain" ? undefined : syntaxTheme[token.type];
        const key = `${startIndex}-${tokenIndex}-${overlapStart}`;

        pieces.push(
          className ? (
            <span key={key} className={className}>
              {slice}
            </span>
          ) : (
            <Fragment key={key}>{slice}</Fragment>
          ),
        );
      });

      return pieces.length > 0 ? pieces : segment;
    };

    // 7. Render parts
    const result = parts.map((part, index) => {
      if (part.type === "error") {
        return (
          <span
            key={index}
            className="bg-red-500/30 decoration-red-500 underline decoration-wavy text-red-900 dark:text-red-100"
          >
            {renderPartContent(part.text, part.start)}
          </span>
        );
      }
      if (part.type === "match") {
        const matchIndexToHighlight =
          currentLocalMatchIndex !== undefined && currentLocalMatchIndex >= 0
            ? currentLocalMatchIndex
            : currentLocalMatchIndex === undefined
              ? currentMatchIndex
              : -999;
        const isCurrentMatch = part.matchIndex === matchIndexToHighlight;

        return (
          <span
            key={index}
            id={
              useOutputMatches
                ? `output-match-${part.matchIndex}`
                : `input-match-${part.matchIndex}`
            }
            className={
              isCurrentMatch
                ? "bg-green-300 dark:bg-green-600 text-black"
                : "bg-yellow-300 dark:bg-yellow-600 text-black"
            }
          >
            {renderPartContent(part.text, part.start)}
          </span>
        );
      }
      return (
        <Fragment key={index}>
          {renderPartContent(part.text, part.start)}
        </Fragment>
      );
    });

    if (errorAtEnd) {
      result.push(
        <span
          key="error-end"
          className="bg-red-500/30 decoration-red-500 underline decoration-wavy text-red-900 dark:text-red-100"
        >
          &nbsp;
        </span>,
      );
    }

    return result;
  };

  return (
    <ToolFrame
      title="JSON Wizard"
      description="Format, validate, and search JSON with real-time feedback."
      toolName={TOOL_NAMES.JSON_WIZARD}
      headerRight={
        <div className="grid grid-cols-3 gap-3 lg:min-w-[400px]">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Total Keys
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {mounted && validation.isValid && input.trim()
                ? stats.keys.toLocaleString()
                : "—"}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Max Depth
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {mounted && validation.isValid && input.trim()
                ? stats.depth
                : "—"}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">Size</div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {mounted && validation.isValid && input.trim()
                ? `${stats.size.toLocaleString()} bytes`
                : "—"}
            </div>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:items-start">
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          {/* Input */}
          <div>
            <div className="mb-2 grid grid-cols-[auto_1fr_auto] items-center gap-3 min-h-9">
              <label
                htmlFor="json-wizard-input"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Input JSON
              </label>
              {input.trim() ? (
                <div className="flex justify-center">
                  <div
                    className={`inline-flex h-full items-center gap-2 px-3 py-1.5 rounded border text-xs font-medium ${
                      validation.isValid
                        ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                        : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {validation.isValid ? "✓ Valid JSON" : "✗ Invalid JSON"}
                    {/* Error location hidden, now highlighted in editor */}
                  </div>
                </div>
              ) : (
                <div />
              )}
              {input.trim() ? (
                <button
                  onClick={() => {
                    trackClearEvent({
                      tool: TOOL_NAMES.JSON_WIZARD,
                      viewMode,
                      sortKeys,
                    });
                    setInput("");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear
                </button>
              ) : (
                <div />
              )}
            </div>
            <TextEditorContainer
              id="json-wizard-input"
              ref={inputEditorRef}
              value={input}
              onChange={setInput}
              wrap={true}
              placeholder='Paste your JSON here, e.g., {"key": "value"}'
              renderLineContent={(line, index) =>
                renderHighlightedText(
                  line,
                  index,
                  false,
                  undefined,
                  inputSyntaxTheme,
                )
              }
            />
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2 min-h-9">
              <label
                htmlFor="json-wizard-output"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Output
              </label>
              <div className="flex items-center gap-2">
                {processedJSON &&
                  validation.isValid &&
                  ["minified", "escaped"].includes(viewMode) && (
                    <Link
                      href="/text-encoder"
                      onClick={(e) => {
                        e.preventDefault();
                        trackToolConversion({
                          sourceTool: "json-wizard",
                          destinationTool: "text-encoder",
                          viewMode,
                          sortKeys,
                        });
                        sessionStorage.setItem(
                          "json-wizard-state",
                          JSON.stringify({
                            input,
                            viewMode,
                            indentSize,
                            sortKeys,
                            caseSensitive,
                          }),
                        );
                        sessionStorage.setItem(
                          "cross-tool-input-text-encoder",
                          processedJSON,
                        );
                        window.location.href = "/text-encoder";
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 active:bg-purple-300 dark:active:bg-purple-900/70 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      Open in Text Encoder
                    </Link>
                  )}
                {processedJSON &&
                  validation.isValid &&
                  viewMode !== "escaped" && (
                    <Link
                      href="/csv-json-converter"
                      onClick={(e) => {
                        e.preventDefault();
                        // Track cross-tool conversion
                        trackToolConversion({
                          sourceTool: "json-wizard",
                          destinationTool: "csv-json-converter",
                          viewMode,
                          sortKeys,
                        });
                        // Save current JSON input for restoration on back navigation
                        sessionStorage.setItem(
                          "json-wizard-state",
                          JSON.stringify({
                            input,
                            viewMode,
                            indentSize,
                            sortKeys,
                            caseSensitive,
                          }),
                        );
                        // Save processed JSON for CSV Converter
                        sessionStorage.setItem(
                          "cross-tool-input-csv-json-converter",
                          processedJSON,
                        );
                        window.location.href = "/csv-json-converter";
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 active:bg-blue-300 dark:active:bg-blue-900/70 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      Convert to CSV
                    </Link>
                  )}
                {processedJSON && validation.isValid && (
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </button>
                )}
              </div>
            </div>
            <TextEditorContainer
              id="json-wizard-output"
              ref={outputEditorRef}
              value={processedJSON || ""}
              readOnly
              placeholder="Formatted JSON will appear here..."
              height="h-64"
              wrap={viewMode === "minified" || viewMode === "escaped"}
              renderContent={
                !searchTerm && outputJsonSyntaxRenderer
                  ? outputJsonSyntaxRenderer
                  : undefined
              }
              renderLineContent={
                searchTerm && processedJSON
                  ? (line, index) => {
                      const outputMatchIndex =
                        inputToOutputMatchMap.get(currentMatchIndex) ?? -1;
                      return renderHighlightedText(
                        line,
                        index,
                        true,
                        outputMatchIndex,
                        outputSyntaxTheme,
                      );
                    }
                  : undefined
              }
            />
          </div>
        </div>

        {/* Controls Panel */}
        <div className="flex flex-col h-full">
          {/* Search */}
          <div>
            <div className="mb-2 min-h-9">
              <label
                htmlFor="json-search"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Search
              </label>
            </div>
            <div className="space-y-2">
              <SearchBox
                id="json-search"
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setCurrentMatchIndex(0);
                }}
                onEnter={goToNextMatch}
                placeholder="Search in JSON..."
                disabled={!validation.isValid || !input.trim()}
              />

              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="case-sensitive"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    id="case-sensitive"
                    type="checkbox"
                    checked={caseSensitive}
                    onChange={(e) => {
                      setCaseSensitive(e.target.checked);
                      setCurrentMatchIndex(0);
                    }}
                    disabled={!validation.isValid}
                    className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Case Sensitive
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPreviousMatch}
                    disabled={!searchTerm || totalMatches === 0}
                    className="p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous match"
                  >
                    ←
                  </button>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 min-w-[60px] text-center">
                    {searchTerm && totalMatches > 0
                      ? `${currentMatchIndex + 1} / ${totalMatches}`
                      : "0 / 0"}
                  </span>
                  <button
                    onClick={goToNextMatch}
                    disabled={!searchTerm || totalMatches === 0}
                    className="p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next match"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 min-h-9">
              <div className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Modify
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setViewMode("pretty")}
                disabled={!validation.isValid}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  viewMode === "pretty"
                    ? "border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-800"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                } ${!validation.isValid ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                  Pretty Print
                </div>
              </button>
              <button
                onClick={() => setViewMode("minified")}
                disabled={!validation.isValid}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  viewMode === "minified"
                    ? "border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-800"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                } ${!validation.isValid ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                  Minified
                </div>
              </button>
              <button
                onClick={() => setViewMode("escaped")}
                disabled={!validation.isValid || !input.trim()}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  viewMode === "escaped"
                    ? "border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-800"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                } ${!validation.isValid || !input.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                  Escaped
                </div>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="mt-4">
            <div className="mb-2 min-h-9">
              <div className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Options
              </div>
            </div>
            <div className="space-y-3">
              <label
                htmlFor="sort-keys"
                className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer"
              >
                <input
                  id="sort-keys"
                  type="checkbox"
                  checked={sortKeys}
                  onChange={(e) => setSortKeys(e.target.checked)}
                  disabled={!validation.isValid}
                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
                <span className="text-sm text-zinc-900 dark:text-zinc-50">
                  Sort Keys
                </span>
              </label>

              {/* Indent Size */}
              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <label
                  htmlFor="indent-size"
                  className="block text-sm text-zinc-900 dark:text-zinc-50 mb-2"
                >
                  Indent Size: {indentSize}
                </label>
                <input
                  id="indent-size"
                  type="range"
                  min="2"
                  max="8"
                  step="2"
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  disabled={viewMode !== "pretty" || !validation.isValid}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {ToastComponent}
    </ToolFrame>
  );
}
