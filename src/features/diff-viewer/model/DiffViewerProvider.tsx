"use client";

import { createContext, useContext, ReactNode } from "react";

import type { SearchMatch } from "./types";
import { useDiffViewer } from "./useDiffViewer";

import type { DiffLine } from "@/entities/compare";

interface DiffStats {
  added: number;
  removed: number;
  modified: number;
}

interface DiffViewerContextValue {
  input: string;
  setInput: (value: string) => void;
  output: string;
  setOutput: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  caseSensitive: boolean;
  setCaseSensitive: (value: boolean) => void;
  currentMatchIndex: number;
  setCurrentMatchIndex: (value: number) => void;
  mounted: boolean;
  diffLines: DiffLine[];
  searchMatches: SearchMatch[];
  totalMatches: number;
  inputMatchMap: Map<number, Set<number>>;
  outputMatchMap: Map<number, Set<number>>;
  currentInputMatchMap: Map<number, Set<number>>;
  currentOutputMatchMap: Map<number, Set<number>>;
  goToNextMatch: () => void;
  goToPreviousMatch: () => void;
  stats: DiffStats;
}

const DiffViewerContext = createContext<DiffViewerContextValue | null>(null);

export function DiffViewerProvider({ children }: { children: ReactNode }) {
  const value = useDiffViewer();
  return (
    <DiffViewerContext.Provider value={value}>
      {children}
    </DiffViewerContext.Provider>
  );
}

export function useDiffViewerContext() {
  const context = useContext(DiffViewerContext);
  if (!context) {
    throw new Error(
      "useDiffViewerContext must be used within DiffViewerProvider",
    );
  }
  return context;
}
