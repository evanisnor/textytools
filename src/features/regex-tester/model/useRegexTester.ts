import { useState, useEffect, useMemo } from "react";

import { useRegexMatchHighlighter } from "@/entities/regex";

import { usePersistedState } from "@/shared/hooks";

export function useRegexTester() {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const { state, updateState, mounted } = usePersistedState({
    storageKey: "regex-tester-state",
    initialState: {
      pattern: "",
      flags: "g",
      testString: "",
    },
    crossToolKey: "cross-tool-input-regex-tester",
    crossToolField: "testString",
  });

  const { pattern, flags, testString } = state;

  const { matches, error, isHighlighted, getMatchIndex } =
    useRegexMatchHighlighter(pattern, flags, testString);

  const captureGroupCount = useMemo(() => {
    if (!pattern) return 0;
    const capturingGroupPattern = /\((?!\?:)(?!\?=)(?!\?!)(?!\?<=)(?!\?<!)/g;
    return pattern.match(capturingGroupPattern)?.length ?? 0;
  }, [pattern]);

  // Reset current match index when pattern or text changes
  useEffect(() => {
    if (currentMatchIndex !== 0) {
      setCurrentMatchIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, flags, testString]);

  const toggleFlag = (flag: string) => {
    const newFlags = flags.includes(flag)
      ? flags.replace(flag, "")
      : flags + flag;
    updateState({ flags: newFlags });
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
    updateState({ testString: "" });
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
    setPattern: (newPattern: string) => updateState({ pattern: newPattern }),
    setFlags: (newFlags: string) => updateState({ flags: newFlags }),
    setTestString: (newTestString: string) =>
      updateState({ testString: newTestString }),
    toggleFlag,
    goToNextMatch,
    goToPreviousMatch,
    clearTestString,

    // Highlighter functions
    isHighlighted,
    getMatchIndex,
  };
}
