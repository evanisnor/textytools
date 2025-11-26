"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useToast } from "@/app/components/Toast";
import { TextEditorContainer } from "@/app/components/TextEditorContainer";
import { ToolFrame } from "@/app/components/ToolFrame";
import {
  trackCopyEvent,
  trackClearEvent,
  trackToolConversion,
} from "@/shared/lib/analytics";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { useRegexMatchHighlighter } from "@/app/hooks/useRegexMatchHighlighter";

interface RegexFlag {
  id: string;
  label: string;
  description: string;
}

const FLAGS: RegexFlag[] = [
  { id: "g", label: "g", description: "Global - find all matches" },
  { id: "i", label: "i", description: "Case insensitive" },
  { id: "m", label: "m", description: "Multiline - ^ and $ match line breaks" },
  { id: "s", label: "s", description: "Dotall - . matches newlines" },
  { id: "u", label: "u", description: "Unicode - treat pattern as Unicode" },
  { id: "y", label: "y", description: "Sticky - match from lastIndex only" },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const { matches, error, isHighlighted, getMatchIndex } =
    useRegexMatchHighlighter(pattern, flags, testString);

  const captureGroupCount = useMemo(() => {
    if (!pattern) return 0;
    const capturingGroupPattern = /\((?!\?:)(?!\?=)(?!\?\!)(?!\?<=)(?!\?<!)/g;
    return pattern.match(capturingGroupPattern)?.length ?? 0;
  }, [pattern]);

  // Load persisted state on mount
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);

      // Check for cross-tool data first (takes precedence)
      const crossToolInput = sessionStorage.getItem(
        "cross-tool-input-regex-tester",
      );
      if (crossToolInput) {
        sessionStorage.removeItem("cross-tool-input-regex-tester");
        setTestString(crossToolInput);
        return;
      }

      // Load persisted state from sessionStorage
      const persistedState = sessionStorage.getItem("regex-tester-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.pattern !== undefined) setPattern(state.pattern);
          if (state.flags !== undefined) setFlags(state.flags);
          if (state.testString !== undefined) setTestString(state.testString);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state whenever inputs change
  useEffect(() => {
    if (!mounted) return;

    const state = {
      pattern,
      flags,
      testString,
    };
    sessionStorage.setItem("regex-tester-state", JSON.stringify(state));
  }, [pattern, flags, testString, mounted]);

  // Reset current match index when pattern or text changes
  useEffect(() => {
    if (currentMatchIndex !== 0) {
      setCurrentMatchIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, flags, testString]);

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""));
    } else {
      setFlags(flags + flag);
    }
  };

  const goToNextMatch = () => {
    if (matches.length > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
    }
  };

  const goToPreviousMatch = () => {
    if (matches.length > 0) {
      setCurrentMatchIndex(
        (prev) => (prev - 1 + matches.length) % matches.length,
      );
    }
  };

  const copyMatches = async () => {
    const matchText = matches.map((m) => m.fullMatch).join("\n");
    try {
      await navigator.clipboard.writeText(matchText);
      showToast("Matches copied to clipboard");
      trackCopyEvent({
        tool: TOOL_NAMES.REGEX_TESTER,
        matchCount: matches.length,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toSnakeCase = (str: string): string => {
    return str
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_/, "")
      .replace(/\s+/g, "_");
  };

  const convertToJson = () => {
    if (matches.length === 0) return;

    const hasGroups = matches[0].groups.length > 0;
    if (!hasGroups) return;

    // Build array of objects from matches
    const jsonArray = matches.map((match) => {
      const obj: Record<string, string> = {};

      match.groups.forEach((group, idx) => {
        const groupName = match.groupNames[idx];
        const key = groupName ? toSnakeCase(groupName) : `group_${idx + 1}`;
        obj[key] = group || "";
      });

      return obj;
    });

    const jsonOutput = JSON.stringify(jsonArray, null, 2);

    // Save JSON for json-wizard
    sessionStorage.setItem("cross-tool-input-json-wizard", jsonOutput);

    // Track the conversion
    trackToolConversion({
      sourceTool: "regex-tester",
      destinationTool: "json-wizard",
      matchCount: matches.length,
      hasNamedGroups: matches[0].groupNames.some((name) => name !== null),
    });

    // Navigate to json-wizard
    window.location.href = "/json-wizard";
  };

  const convertToCsv = () => {
    if (matches.length === 0) return;

    // Check if we have named groups
    const hasNamedGroups = matches[0].groupNames.some((name) => name !== null);
    const hasGroups = matches[0].groups.length > 0;

    if (!hasGroups) return;

    const lines: string[] = [];

    // Add header row if we have named groups
    if (hasNamedGroups) {
      const headers = matches[0].groupNames
        .map((name, idx) => name || `Group ${idx + 1}`)
        .filter((_, idx) => matches[0].groupNames[idx] !== null);
      lines.push(headers.join(","));
    }

    // Add data rows
    for (const match of matches) {
      const values = match.groups.map((group) => {
        const value = group || "";
        // Escape CSV values - quote if contains comma, newline, or quotes
        if (
          value.includes(",") ||
          value.includes("\n") ||
          value.includes('"')
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      lines.push(values.join(","));
    }

    const csvOutput = lines.join("\n");

    // Save CSV for csv-json-converter
    sessionStorage.setItem("cross-tool-input-csv-json-converter", csvOutput);

    // Track the conversion
    trackToolConversion({
      sourceTool: "regex-tester",
      destinationTool: "csv-json-converter",
      matchCount: matches.length,
      hasNamedGroups,
    });

    // Navigate to csv-json-converter
    window.location.href = "/csv-json-converter";
  };

  // Custom renderer for highlighting matches
  const renderContent = (content: string) => {
    if (!content) return null;

    const result: React.ReactNode[] = [];
    let localMatchIndex = -1;

    for (let i = 0; i < content.length; i++) {
      const matchIndex = getMatchIndex(i);
      const highlighted = isHighlighted(i);

      // Start a new span when match state changes
      if (matchIndex !== localMatchIndex) {
        localMatchIndex = matchIndex;
      }

      // Accumulate characters in the same highlight state
      let segment = content[i];
      let j = i + 1;
      while (j < content.length && getMatchIndex(j) === localMatchIndex) {
        segment += content[j];
        j++;
      }
      i = j - 1; // Update loop counter

      if (highlighted) {
        // Check if this is the currently selected match
        const isCurrentMatch = matchIndex === currentMatchIndex;
        result.push(
          <span
            key={i}
            className={
              isCurrentMatch
                ? "bg-green-300 dark:bg-green-600 text-black font-bold"
                : "bg-yellow-300 dark:bg-yellow-600 text-black"
            }
          >
            {segment}
          </span>,
        );
      } else {
        result.push(<span key={i}>{segment}</span>);
      }
    }

    return <>{result}</>;
  };

  return (
    <ToolFrame
      title="Regex Tester"
      description="Test regular expressions with real-time match highlighting and capture group extraction."
      toolName={TOOL_NAMES.REGEX_TESTER}
      headerRight={
        <div className="grid grid-cols-2 gap-3 min-w-[220px]">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Matches
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {mounted ? matches.length.toLocaleString() : "—"}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Groups
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {mounted ? captureGroupCount.toLocaleString() : "—"}
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Pattern and Flags Input */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="regex-pattern"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Pattern
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-zinc-400 dark:text-zinc-600">
                /
              </span>
              <div className="relative flex-1">
                <input
                  id="regex-pattern"
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter your regex pattern..."
                  className="w-full px-4 py-2 pr-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 font-mono"
                  spellCheck={false}
                />
                {pattern && (
                  <button
                    onClick={() => setPattern("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                    title="Clear pattern"
                    type="button"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <span className="text-2xl text-zinc-400 dark:text-zinc-600">
                /
              </span>
              <input
                id="regex-flags"
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="flags"
                className="w-24 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 font-mono"
                spellCheck={false}
              />
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400 font-mono">
                Error: {error}
              </div>
            )}
          </div>

          {/* Flag Buttons */}
          <div>
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Flags
            </div>
            <div className="flex flex-wrap gap-2">
              {FLAGS.map((flag) => (
                <button
                  key={flag.id}
                  onClick={() => toggleFlag(flag.id)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer ${
                    flags.includes(flag.id)
                      ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-zinc-900 dark:border-zinc-50"
                      : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                  title={flag.description}
                >
                  <span className="font-mono font-bold">{flag.label}</span>
                  <span className="ml-2 text-xs opacity-75">
                    {flag.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test String with Inline Highlighting */}
        <div>
          <div className="flex items-center justify-between mb-2 min-h-9">
            <div className="flex items-center gap-2">
              <label
                htmlFor="regex-test-string"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Test String
              </label>
            </div>
            <div className="flex items-center gap-2">
              {matches.length > 0 && (
                <>
                  <button
                    onClick={goToPreviousMatch}
                    className="inline-flex items-center px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm cursor-pointer"
                    title="Previous match"
                  >
                    ←
                  </button>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 min-w-[60px] text-center">
                    {currentMatchIndex + 1} / {matches.length}
                  </span>
                  <button
                    onClick={goToNextMatch}
                    className="inline-flex items-center px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm cursor-pointer"
                    title="Next match"
                  >
                    →
                  </button>
                  <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800"></div>
                </>
              )}
              {testString.trim() && (
                <button
                  onClick={() => {
                    trackClearEvent({ tool: TOOL_NAMES.REGEX_TESTER });
                    setTestString("");
                    setCurrentMatchIndex(0);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors cursor-pointer"
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
          </div>
          <TextEditorContainer
            id="regex-test-string"
            value={testString}
            onChange={setTestString}
            placeholder="Enter text to test against your regex..."
            height="h-96"
            showLineNumbers={true}
            wrap={true}
            renderContent={pattern && testString ? renderContent : undefined}
          />
        </div>

        {/* Match Details */}
        {matches.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Match Details
              </div>
              <div className="flex items-center gap-2">
                {matches[0].groups.length > 0 && (
                  <>
                    <Link
                      href="/json-wizard"
                      onClick={(e) => {
                        e.preventDefault();
                        convertToJson();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 active:bg-purple-300 dark:active:bg-purple-900/70 transition-colors cursor-pointer"
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
                      Convert to JSON
                    </Link>
                    <Link
                      href="/csv-json-converter"
                      onClick={(e) => {
                        e.preventDefault();
                        convertToCsv();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 active:bg-blue-300 dark:active:bg-blue-900/70 transition-colors cursor-pointer"
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
                  </>
                )}
                <button
                  onClick={copyMatches}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors cursor-pointer"
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
                  Copy All Matches
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                        #
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                        Match
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                        Index
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                        Groups
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {matches.map((match, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      >
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-900 dark:text-zinc-50">
                          {match.fullMatch}
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-600 dark:text-zinc-400">
                          {match.index}
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-600 dark:text-zinc-400">
                          {match.groups.length > 0 ? (
                            <div className="space-y-1">
                              {match.groups.map((group, gIdx) => {
                                const groupName = match.groupNames[gIdx];
                                return (
                                  <div key={gIdx}>
                                    <span className="text-zinc-500">
                                      {groupName || `Group ${gIdx + 1}`}:
                                    </span>{" "}
                                    {group || "(empty)"}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-zinc-400 dark:text-zinc-600">
                              No groups
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      {ToastComponent}
    </ToolFrame>
  );
}
