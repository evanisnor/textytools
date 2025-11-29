"use client";

import { useState, useCallback } from "react";

import { getNextMatchIndex, getPreviousMatchIndex } from "../lib/search-utils";

/**
 * Composable hook for managing search state
 */
export function useSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const goToNextMatch = useCallback((totalMatches: number) => {
    setCurrentMatchIndex((prev) => getNextMatchIndex(prev, totalMatches));
  }, []);

  const goToPreviousMatch = useCallback((totalMatches: number) => {
    setCurrentMatchIndex((prev) => getPreviousMatchIndex(prev, totalMatches));
  }, []);

  const resetMatchIndex = useCallback(() => {
    setCurrentMatchIndex(0);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    caseSensitive,
    setCaseSensitive,
    currentMatchIndex,
    setCurrentMatchIndex,
    goToNextMatch,
    goToPreviousMatch,
    resetMatchIndex,
  };
}
