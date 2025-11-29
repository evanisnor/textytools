"use client";

import { useState, useMemo, useEffect } from "react";

import {
  findSearchMatches,
  createInputMatchMap,
  createOutputMatchMap,
  createCurrentInputMatchMap,
  createCurrentOutputMatchMap,
} from "../lib/search";

import { useTextDiff } from "@/entities/compare";

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

  const searchMatches = useMemo(
    () => findSearchMatches(searchTerm, caseSensitive, input, output),
    [searchTerm, caseSensitive, input, output],
  );

  const totalMatches = searchMatches.length;

  const inputMatchMap = useMemo(
    () => createInputMatchMap(searchMatches),
    [searchMatches],
  );

  const outputMatchMap = useMemo(
    () => createOutputMatchMap(searchMatches),
    [searchMatches],
  );

  const currentInputMatchMap = useMemo(
    () => createCurrentInputMatchMap(searchMatches, currentMatchIndex),
    [searchMatches, currentMatchIndex],
  );

  const currentOutputMatchMap = useMemo(
    () => createCurrentOutputMatchMap(searchMatches, currentMatchIndex),
    [searchMatches, currentMatchIndex],
  );

  const goToNextMatch = () => {
    setCurrentMatchIndex((prev) => {
      if (totalMatches === 0) return 0;
      return (prev + 1) % totalMatches;
    });
  };

  const goToPreviousMatch = () => {
    setCurrentMatchIndex((prev) => {
      if (totalMatches === 0) return 0;
      return (prev - 1 + totalMatches) % totalMatches;
    });
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
    searchMatches,
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
