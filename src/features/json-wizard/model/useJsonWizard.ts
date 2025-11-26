"use client";

import { useState, useMemo, useEffect } from "react";
import type { ViewMode, ValidationResult, JSONStats, SearchMatch } from "./types";
import { validateJSON } from "../lib/validators";
import { getJSONStats } from "../lib/stats";
import { processJSON, checkIsEscapedString } from "../lib/formatter";
import {
  findJSONMatchPaths,
  findSearchMatches,
  createMatchPositionMap,
  mapInputToOutputMatches,
} from "../lib/search";

export function useJsonWizard() {
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("pretty");
  const [indentSize, setIndentSize] = useState(2);
  const [searchTerm, setSearchTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [sortKeys, setSortKeys] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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

  const validation: ValidationResult = useMemo(() => validateJSON(input), [input]);
  const stats: JSONStats = useMemo(() => getJSONStats(input), [input]);

  const isEscapedString = useMemo(
    () => checkIsEscapedString(input, validation.isValid),
    [input, validation.isValid],
  );

  const inputMatchPaths = useMemo(
    () => findJSONMatchPaths(input, searchTerm, caseSensitive),
    [searchTerm, caseSensitive, input],
  );

  const searchMatches: SearchMatch[] = useMemo(
    () => findSearchMatches(input, searchTerm, caseSensitive, inputMatchPaths),
    [searchTerm, caseSensitive, input, inputMatchPaths],
  );

  const matchPositions = useMemo(
    () => createMatchPositionMap(searchMatches),
    [searchMatches],
  );

  const processedJSON = useMemo(
    () =>
      processJSON(
        input,
        viewMode,
        indentSize,
        sortKeys,
        validation.isValid,
        isEscapedString,
      ),
    [input, viewMode, indentSize, sortKeys, validation.isValid, isEscapedString],
  );

  const outputMatchPaths = useMemo(
    () => findJSONMatchPaths(processedJSON, searchTerm, caseSensitive),
    [searchTerm, caseSensitive, processedJSON],
  );

  const outputSearchMatches: SearchMatch[] = useMemo(
    () => findSearchMatches(processedJSON, searchTerm, caseSensitive, outputMatchPaths),
    [searchTerm, caseSensitive, processedJSON, outputMatchPaths],
  );

  const inputToOutputMatchMap = useMemo(
    () => mapInputToOutputMatches(searchMatches, outputSearchMatches),
    [searchMatches, outputSearchMatches],
  );

  const outputMatchPositions = useMemo(
    () => createMatchPositionMap(outputSearchMatches),
    [outputSearchMatches],
  );

  const totalMatches = searchMatches.length;

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

  return {
    input,
    setInput,
    viewMode,
    setViewMode,
    indentSize,
    setIndentSize,
    searchTerm,
    setSearchTerm,
    caseSensitive,
    setCaseSensitive,
    sortKeys,
    setSortKeys,
    currentMatchIndex,
    setCurrentMatchIndex,
    validation,
    stats,
    isEscapedString,
    processedJSON,
    searchMatches,
    matchPositions,
    outputSearchMatches,
    inputToOutputMatchMap,
    outputMatchPositions,
    totalMatches,
    goToNextMatch,
    goToPreviousMatch,
  };
}
