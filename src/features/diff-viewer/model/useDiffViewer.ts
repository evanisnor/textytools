"use client";

import { useState, useMemo, useEffect } from "react";

import { useTextDiff } from "@/entities/compare";
import {
  findDualPaneMatches,
  createMatchMap,
  createCurrentMatchMap,
  getNextMatchIndex,
  getPreviousMatchIndex,
} from "@/entities/search";

export function useDiffViewer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);

      // Check for cross-tool data first
      const storedInput = sessionStorage.getItem(
        "cross-tool-input-diff-viewer",
      );
      if (storedInput) {
        sessionStorage.removeItem("cross-tool-input-diff-viewer");
        setInput(storedInput);
        return;
      }

      // Load persisted state
      const persistedState = sessionStorage.getItem("diff-viewer-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.input !== undefined) setInput(state.input);
          if (state.output !== undefined) setOutput(state.output);
          if (state.caseSensitive !== undefined)
            setCaseSensitive(state.caseSensitive);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state
  useEffect(() => {
    if (!mounted) return;
    const state = { input, output, caseSensitive };
    sessionStorage.setItem("diff-viewer-state", JSON.stringify(state));
  }, [input, output, caseSensitive, mounted]);

  const { diffLines, stats } = useTextDiff(input, output);

  const searchResult = useMemo(
    () => findDualPaneMatches(input, output, searchTerm, caseSensitive),
    [searchTerm, caseSensitive, input, output],
  );

  const { leftMatches, rightMatches, totalMatches } = searchResult;

  const inputMatchMap = useMemo(
    () => createMatchMap(leftMatches),
    [leftMatches],
  );

  const outputMatchMap = useMemo(
    () => createMatchMap(rightMatches),
    [rightMatches],
  );

  const currentInputMatchMap = useMemo(() => {
    // Find which match is current and if it's in the left pane
    const allMatches = [...leftMatches, ...rightMatches];
    const currentMatch = allMatches[currentMatchIndex];
    if (!currentMatch) return new Map();

    // Check if current match is in left pane
    const isInLeftPane = leftMatches.some(
      (m) => m.matchIndex === currentMatch.matchIndex,
    );
    return isInLeftPane
      ? createCurrentMatchMap(leftMatches, leftMatches.indexOf(currentMatch))
      : new Map();
  }, [leftMatches, rightMatches, currentMatchIndex]);

  const currentOutputMatchMap = useMemo(() => {
    // Find which match is current and if it's in the right pane
    const allMatches = [...leftMatches, ...rightMatches];
    const currentMatch = allMatches[currentMatchIndex];
    if (!currentMatch) return new Map();

    // Check if current match is in right pane
    const isInRightPane = rightMatches.some(
      (m) => m.matchIndex === currentMatch.matchIndex,
    );
    return isInRightPane
      ? createCurrentMatchMap(rightMatches, rightMatches.indexOf(currentMatch))
      : new Map();
  }, [leftMatches, rightMatches, currentMatchIndex]);

  const goToNextMatch = () => {
    setCurrentMatchIndex((prev) => getNextMatchIndex(prev, totalMatches));
  };

  const goToPreviousMatch = () => {
    setCurrentMatchIndex((prev) => getPreviousMatchIndex(prev, totalMatches));
  };

  return {
    input,
    setInput,
    output,
    setOutput,
    searchTerm,
    setSearchTerm,
    caseSensitive,
    setCaseSensitive,
    currentMatchIndex,
    setCurrentMatchIndex,
    mounted,
    diffLines,
    leftMatches,
    rightMatches,
    totalMatches,
    inputMatchMap,
    outputMatchMap,
    currentInputMatchMap,
    currentOutputMatchMap,
    goToNextMatch,
    goToPreviousMatch,
    stats,
  };
}
