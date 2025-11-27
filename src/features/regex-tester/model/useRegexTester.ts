import { useState, useEffect, useMemo } from "react";

import { useRegexMatchHighlighter } from "@/shared/hooks/useRegexMatchHighlighter";

const STORAGE_KEY = "regex-tester-state";
const CROSS_TOOL_KEY = "cross-tool-input-regex-tester";

export function useRegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { matches, error, isHighlighted, getMatchIndex } =
    useRegexMatchHighlighter(pattern, flags, testString);

  const captureGroupCount = useMemo(() => {
    if (!pattern) return 0;
    const capturingGroupPattern = /\((?!\?:)(?!\?=)(?!\?!)(?!\?<=)(?!\?<!)/g;
    return pattern.match(capturingGroupPattern)?.length ?? 0;
  }, [pattern]);

  // Load persisted state on mount
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);

      // Check for cross-tool data first (takes precedence)
      const crossToolInput = sessionStorage.getItem(CROSS_TOOL_KEY);
      if (crossToolInput) {
        sessionStorage.removeItem(CROSS_TOOL_KEY);
        setTestString(crossToolInput);
        return;
      }

      // Load persisted state from sessionStorage
      const persistedState = sessionStorage.getItem(STORAGE_KEY);
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
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

  const clearTestString = () => {
    setTestString("");
    setCurrentMatchIndex(0);
  };

  return {
    // State
    pattern,
    flags,
    testString,
    currentMatchIndex,
    mounted,
    matches,
    error,
    captureGroupCount,

    // Actions
    setPattern,
    setFlags,
    setTestString,
    toggleFlag,
    goToNextMatch,
    goToPreviousMatch,
    clearTestString,

    // Highlighter functions
    isHighlighted,
    getMatchIndex,
  };
}
