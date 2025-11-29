"use client";

import { useState, useMemo } from "react";

import { processJSON, checkIsEscapedString } from "../lib/formatter";
import {
  findJSONMatchPaths,
  findSearchMatches,
  createMatchPositionMap,
  mapInputToOutputMatches,
} from "../lib/search";
import { getJSONStats } from "../lib/stats";
import { validateJSON } from "../lib/validators";

import type {
  ViewMode,
  ValidationResult,
  JSONStats,
  SearchMatch,
} from "./types";

import { usePersistedState } from "@/shared/hooks";

export function useJsonWizard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const { state, updateState, mounted } = usePersistedState({
    storageKey: "json-wizard-state",
    initialState: {
      input: "",
      viewMode: "pretty" as ViewMode,
      indentSize: 2,
      sortKeys: false,
    },
    crossToolKey: "cross-tool-input-json-wizard",
    crossToolField: "input",
  });

  const validation: ValidationResult = useMemo(
    () => validateJSON(state.input),
    [state.input],
  );
  const stats: JSONStats = useMemo(
    () => getJSONStats(state.input),
    [state.input],
  );

  const isEscapedString = useMemo(
    () => checkIsEscapedString(state.input, validation.isValid),
    [state.input, validation.isValid],
  );

  const inputMatchPaths = useMemo(
    () => findJSONMatchPaths(state.input, searchTerm, caseSensitive),
    [searchTerm, caseSensitive, state.input],
  );

  const searchMatches: SearchMatch[] = useMemo(
    () =>
      findSearchMatches(
        state.input,
        searchTerm,
        caseSensitive,
        inputMatchPaths,
      ),
    [searchTerm, caseSensitive, state.input, inputMatchPaths],
  );

  const matchPositions = useMemo(
    () => createMatchPositionMap(searchMatches),
    [searchMatches],
  );

  const processedJSON = useMemo(
    () =>
      processJSON(
        state.input,
        state.viewMode,
        state.indentSize,
        state.sortKeys,
        validation.isValid,
        isEscapedString,
      ),
    [
      state.input,
      state.viewMode,
      state.indentSize,
      state.sortKeys,
      validation.isValid,
      isEscapedString,
    ],
  );

  const outputMatchPaths = useMemo(
    () => findJSONMatchPaths(processedJSON, searchTerm, caseSensitive),
    [searchTerm, caseSensitive, processedJSON],
  );

  const outputSearchMatches: SearchMatch[] = useMemo(
    () =>
      findSearchMatches(
        processedJSON,
        searchTerm,
        caseSensitive,
        outputMatchPaths,
      ),
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
    input: state.input,
    setInput: (newInput: string) => updateState({ input: newInput }),
    viewMode: state.viewMode,
    setViewMode: (mode: ViewMode) => updateState({ viewMode: mode }),
    indentSize: state.indentSize,
    setIndentSize: (size: number) => updateState({ indentSize: size }),
    searchTerm,
    setSearchTerm,
    caseSensitive,
    setCaseSensitive,
    sortKeys: state.sortKeys,
    setSortKeys: (sort: boolean) => updateState({ sortKeys: sort }),
    currentMatchIndex,
    setCurrentMatchIndex,
    mounted,
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
