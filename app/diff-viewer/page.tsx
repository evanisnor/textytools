"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useToast } from "@/app/components/Toast";
import {
  TextEditorContainer,
  type TextEditorContainerRef,
} from "@/app/components/TextEditorContainer";
import { ToolFrame } from "@/app/components/ToolFrame";
import { SearchBox } from "@/app/components/SearchBox";
import { trackClearEvent } from "@/app/lib/analytics";
import { TOOL_NAMES } from "@/app/lib/constants";

// Diff types
type DiffType = "unchanged" | "added" | "removed" | "modified";

interface DiffLine {
  type: DiffType;
  inputLineNumber: number | null; // null for added lines
  outputLineNumber: number | null; // null for removed lines
  inputContent: string;
  outputContent: string;
}

interface SearchMatch {
  lineIndex: number; // The line number where this match occurs
  matchIndex: number; // Global index of this match pair
  inputMatches: number[]; // Column positions of matches in input/left pane
  outputMatches: number[]; // Column positions of matches in output/right pane
}

// Simple line-by-line diff
function computeDiff(input: string, output: string): DiffLine[] {
  // Treat empty text as zero lines — prevent the placeholder/non-value
  // from being interpreted as a single empty line in the diff.
  const inputLines = input === "" ? [] : input.split("\n");
  const outputLines = output === "" ? [] : output.split("\n");

  const diffLines: DiffLine[] = [];

  // Two-pointer approach to handle simple single-line insertions/deletions
  let a = 0; // input index
  let b = 0; // output index

  while (a < inputLines.length || b < outputLines.length) {
    const inLine = inputLines[a] ?? "";
    const outLine = outputLines[b] ?? "";

    // If both lines exist and are equal -> unchanged
    if (a < inputLines.length && b < outputLines.length && inLine === outLine) {
      diffLines.push({
        type: "unchanged",
        inputLineNumber: a + 1,
        outputLineNumber: b + 1,
        inputContent: inLine,
        outputContent: outLine,
      });
      a++;
      b++;
      continue;
    }

    // Detect a removed line in input when the next input line matches current output
    if (
      a < inputLines.length &&
      a + 1 < inputLines.length &&
      b < outputLines.length &&
      inputLines[a + 1] === outputLines[b]
    ) {
      // inputLines[a] was removed
      diffLines.push({
        type: "removed",
        inputLineNumber: a + 1,
        outputLineNumber: null,
        inputContent: inputLines[a],
        outputContent: "",
      });
      a++;
      continue;
    }

    // Detect an added line in output when the next output line matches current input
    if (
      b < outputLines.length &&
      b + 1 < outputLines.length &&
      a < inputLines.length &&
      outputLines[b + 1] === inputLines[a]
    ) {
      // outputLines[b] was added
      diffLines.push({
        type: "added",
        inputLineNumber: null,
        outputLineNumber: b + 1,
        inputContent: "",
        outputContent: outputLines[b],
      });
      b++;
      continue;
    }

    // Fallback: treat as modified (both exist but differ), or leftover single-side lines
    if (a < inputLines.length && b < outputLines.length) {
      diffLines.push({
        type: "modified",
        inputLineNumber: a + 1,
        outputLineNumber: b + 1,
        inputContent: inputLines[a],
        outputContent: outputLines[b],
      });
      a++;
      b++;
    } else if (a < inputLines.length) {
      // Remaining input lines are removed
      diffLines.push({
        type: "removed",
        inputLineNumber: a + 1,
        outputLineNumber: null,
        inputContent: inputLines[a],
        outputContent: "",
      });
      a++;
    } else if (b < outputLines.length) {
      // Remaining output lines are added
      diffLines.push({
        type: "added",
        inputLineNumber: null,
        outputLineNumber: b + 1,
        inputContent: "",
        outputContent: outputLines[b],
      });
      b++;
    }
  }

  return diffLines;
}

export default function DiffViewer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const inputEditorRef = useRef<TextEditorContainerRef>(null);
  const outputEditorRef = useRef<TextEditorContainerRef>(null);
  const { ToastComponent } = useToast();

  // Compute diff
  const diffLines = useMemo(() => {
    if (!input && !output) return [];
    return computeDiff(input, output);
  }, [input, output]);

  // Find search matches in both input and output, paired by line number
  const searchMatches = useMemo(() => {
    if (!searchTerm) return [];

    const regex = new RegExp(
      searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      caseSensitive ? "g" : "gi",
    );

    // Collect matches per line for both panes
    const inputLines = input.split("\n");
    const outputLines = output.split("\n");

    // Map of line index to matches in that line
    const lineMatchMap = new Map<
      number,
      { inputMatches: number[]; outputMatches: number[] }
    >();

    // Search in input
    inputLines.forEach((line, lineIndex) => {
      let match;
      const lineRegex = new RegExp(regex.source, regex.flags);
      const matches: number[] = [];
      while ((match = lineRegex.exec(line)) !== null) {
        matches.push(match.index);
      }
      if (matches.length > 0) {
        if (!lineMatchMap.has(lineIndex)) {
          lineMatchMap.set(lineIndex, { inputMatches: [], outputMatches: [] });
        }
        lineMatchMap.get(lineIndex)!.inputMatches = matches;
      }
    });

    // Search in output
    outputLines.forEach((line, lineIndex) => {
      let match;
      const lineRegex = new RegExp(regex.source, regex.flags);
      const matches: number[] = [];
      while ((match = lineRegex.exec(line)) !== null) {
        matches.push(match.index);
      }
      if (matches.length > 0) {
        if (!lineMatchMap.has(lineIndex)) {
          lineMatchMap.set(lineIndex, { inputMatches: [], outputMatches: [] });
        }
        lineMatchMap.get(lineIndex)!.outputMatches = matches;
      }
    });

    // Convert to array and sort by line index
    const sortedMatches: SearchMatch[] = Array.from(lineMatchMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([lineIndex, { inputMatches, outputMatches }], index) => ({
        lineIndex,
        matchIndex: index,
        inputMatches,
        outputMatches,
      }));

    return sortedMatches;
  }, [searchTerm, caseSensitive, input, output]);

  const totalMatches = searchMatches.length;

  // Create match position maps for quick lookup
  // Maps line index -> Set of column positions that are part of current match
  const inputMatchPositions = useMemo(() => {
    const map = new Map<number, Set<number>>();
    if (searchMatches.length === 0) return map;

    const currentMatch = searchMatches[currentMatchIndex];
    if (!currentMatch) return map;

    searchMatches.forEach((match) => {
      if (match.inputMatches.length > 0) {
        map.set(match.lineIndex, new Set(match.inputMatches));
      }
    });

    return map;
  }, [searchMatches, currentMatchIndex]);

  const outputMatchPositions = useMemo(() => {
    const map = new Map<number, Set<number>>();
    if (searchMatches.length === 0) return map;

    const currentMatch = searchMatches[currentMatchIndex];
    if (!currentMatch) return map;

    searchMatches.forEach((match) => {
      if (match.outputMatches.length > 0) {
        map.set(match.lineIndex, new Set(match.outputMatches));
      }
    });

    return map;
  }, [searchMatches, currentMatchIndex]);

  // Scroll to current match in both panes
  useEffect(() => {
    if (!searchTerm || searchMatches.length === 0) return;

    const currentMatch = searchMatches[currentMatchIndex];
    if (!currentMatch) return;

    setTimeout(() => {
      // Scroll both panes to the same line number
      const scrollToLine = (
        editorRef: React.RefObject<TextEditorContainerRef | null>,
      ) => {
        const container = editorRef.current?.getScrollContainer();
        if (!container) return;

        // The TextEditor renders lines as divs in the overlay
        // Find the content overlay div that contains the rendered lines
        const overlay = container.querySelector(".pointer-events-none");
        if (!overlay) return;

        // Get all line divs
        const lineDivs = overlay.querySelectorAll(":scope > div");
        const targetLine = lineDivs[currentMatch.lineIndex] as HTMLElement;

        if (targetLine) {
          const elementRect = targetLine.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          const relativeTop =
            elementRect.top - containerRect.top + container.scrollTop;
          const centerOffset =
            container.clientHeight / 2 - elementRect.height / 2;

          editorRef.current?.scrollTo({
            top: relativeTop - centerOffset,
            behavior: "smooth",
          });
        }
      };

      // Scroll both panes
      scrollToLine(inputEditorRef);
      scrollToLine(outputEditorRef);
    }, 0);
  }, [currentMatchIndex, searchMatches, searchTerm]);

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
    lineIndex: number,
    pane: "input" | "output",
  ) => {
    if (!searchTerm) return text;

    const positions =
      pane === "input" ? inputMatchPositions : outputMatchPositions;
    const lineMatches = positions.get(lineIndex);
    if (!lineMatches || lineMatches.size === 0) return text;

    const regex = new RegExp(
      searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      caseSensitive ? "g" : "gi",
    );

    // Find the current match for this line
    const currentMatch = searchMatches[currentMatchIndex];
    const isCurrentMatchLine =
      currentMatch && currentMatch.lineIndex === lineIndex;

    const parts: Array<{ text: string; isMatch: boolean; isCurrent: boolean }> =
      [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, match.index),
          isMatch: false,
          isCurrent: false,
        });
      }

      // This match is current if we're on the current match line and this column is in the matches
      const isCurrent = isCurrentMatchLine && lineMatches.has(match.index);

      parts.push({
        text: match[0],
        isMatch: true,
        isCurrent,
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        isMatch: false,
        isCurrent: false,
      });
    }

    return parts.map((part, index) => {
      if (part.isMatch) {
        return (
          <span
            key={index}
            className={
              part.isCurrent
                ? "bg-green-300 dark:bg-green-600 text-black font-bold"
                : "bg-yellow-300 dark:bg-yellow-600 text-black"
            }
          >
            {part.text}
          </span>
        );
      }
      return <span key={index}>{part.text}</span>;
    });
  };

  // Get diff stats
  const stats = useMemo(() => {
    const added = diffLines.filter((l) => l.type === "added").length;
    const removed = diffLines.filter((l) => l.type === "removed").length;
    const modified = diffLines.filter((l) => l.type === "modified").length;
    return { added, removed, modified };
  }, [diffLines]);

  // Create line number to diff type mapping
  // Map actual line numbers (0-indexed) to their diff type
  const inputLineDiffType = useMemo(() => {
    const map = new Map<number, DiffType>();
    diffLines.forEach((line) => {
      if (line.inputLineNumber !== null && line.type !== "unchanged") {
        // For added lines, don't highlight the (empty) left side
        if (line.type !== "added") {
          map.set(line.inputLineNumber - 1, line.type);
        }
      }
    });
    return map;
  }, [diffLines]);

  const outputLineDiffType = useMemo(() => {
    const map = new Map<number, DiffType>();
    diffLines.forEach((line) => {
      if (line.outputLineNumber !== null && line.type !== "unchanged") {
        // For removed lines, don't highlight the (empty) right side
        if (line.type !== "removed") {
          map.set(line.outputLineNumber - 1, line.type);
        }
      }
    });
    return map;
  }, [diffLines]);

  // Render line with diff highlighting
  const renderDiffLine = (
    text: string,
    lineIndex: number,
    pane: "input" | "output",
  ) => {
    const diffType =
      pane === "input"
        ? inputLineDiffType.get(lineIndex)
        : outputLineDiffType.get(lineIndex);

    let bgClass = "";
    switch (diffType) {
      case "added":
        bgClass = "bg-green-200/60 dark:bg-green-800/40";
        break;
      case "removed":
        bgClass = "bg-red-200/60 dark:bg-red-800/40";
        break;
      case "modified":
        bgClass = "bg-yellow-200/60 dark:bg-yellow-800/40";
        break;
      default:
        bgClass = "";
    }

    const content = searchTerm
      ? renderHighlightedText(text, lineIndex, pane)
      : text;

    // For empty lines, ensure we render a non-breaking space to maintain line height
    const displayContent = text === "" ? "\u00A0" : content;

    if (bgClass) {
      return (
        <span className={`${bgClass} px-0.5 block`}>{displayContent}</span>
      );
    }

    return displayContent;
  };

  return (
    <ToolFrame
      title="Diff Viewer"
      description="Compare two text blocks with side-by-side diff highlighting and search"
      toolName={TOOL_NAMES.DIFF_VIEWER}
      maxWidth="7xl"
      headerRight={
        <div className="grid grid-cols-3 gap-3 lg:min-w-[350px]">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Added
            </div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {stats.added}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Removed
            </div>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">
              {stats.removed}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Modified
            </div>
            <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.modified}
            </div>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:items-start">
        {/* Main content area */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-4">
            {/* Left */}
            <div>
              <div className="flex items-center justify-between mb-2 min-h-9">
                <label
                  htmlFor="diff-input"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Left
                </label>
                {input.trim() && (
                  <button
                    onClick={() => {
                      trackClearEvent({ tool: TOOL_NAMES.DIFF_VIEWER });
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
                )}
              </div>
              <TextEditorContainer
                id="diff-input"
                ref={inputEditorRef}
                value={input}
                onChange={setInput}
                placeholder="Paste first text here..."
                height="h-[600px]"
                renderLineContent={(line, index) =>
                  renderDiffLine(line, index, "input")
                }
              />
            </div>

            {/* Right */}
            <div>
              <div className="flex items-center justify-between mb-2 min-h-9">
                <label
                  htmlFor="diff-output"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Right
                </label>
                {output.trim() && (
                  <button
                    onClick={() => {
                      trackClearEvent({ tool: TOOL_NAMES.DIFF_VIEWER });
                      setOutput("");
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
                )}
              </div>
              <TextEditorContainer
                id="diff-output"
                ref={outputEditorRef}
                value={output}
                onChange={setOutput}
                placeholder="Paste second text here..."
                height="h-[600px]"
                renderLineContent={(line, index) =>
                  renderDiffLine(line, index, "output")
                }
              />
            </div>
          </div>
        </div>

        {/* Search and controls panel */}
        <div className="flex flex-col h-full">
          {/* Search */}
          <div>
            <div className="mb-2 min-h-9">
              <label
                htmlFor="diff-search"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Search
              </label>
            </div>
            <div className="space-y-2">
              <SearchBox
                id="diff-search"
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setCurrentMatchIndex(0);
                }}
                onEnter={goToNextMatch}
                placeholder="Search in both panes..."
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

          {/* Legend */}
          <div className="mt-6">
            <div className="mb-2">
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Legend
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200/60 dark:bg-green-800/40 rounded border border-green-300 dark:border-green-700"></div>
                <span className="text-zinc-600 dark:text-zinc-400">
                  Added lines
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200/60 dark:bg-red-800/40 rounded border border-red-300 dark:border-red-700"></div>
                <span className="text-zinc-600 dark:text-zinc-400">
                  Removed lines
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200/60 dark:bg-yellow-800/40 rounded border border-yellow-300 dark:border-yellow-700"></div>
                <span className="text-zinc-600 dark:text-zinc-400">
                  Modified lines
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {ToastComponent}
    </ToolFrame>
  );
}
