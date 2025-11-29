"use client";

import { createContext, useContext, ReactNode } from "react";

import type { ViewMode, ValidationResult, JSONStats } from "./types";
import { useJsonWizard } from "./useJsonWizard";

import type { SearchMatch } from "@/entities/search";

interface JsonWizardContextValue {
  input: string;
  setInput: (value: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  indentSize: number;
  setIndentSize: (size: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  caseSensitive: boolean;
  setCaseSensitive: (value: boolean) => void;
  sortKeys: boolean;
  setSortKeys: (value: boolean) => void;
  currentMatchIndex: number;
  setCurrentMatchIndex: (index: number) => void;
  mounted: boolean;
  validation: ValidationResult;
  stats: JSONStats;
  isEscapedString: boolean;
  processedJSON: string;
  searchMatches: SearchMatch[];
  matchPositions: Map<number, Map<number, number>>;
  outputSearchMatches: SearchMatch[];
  inputToOutputMatchMap: Map<number, number>;
  outputMatchPositions: Map<number, Map<number, number>>;
  totalMatches: number;
  goToNextMatch: () => void;
  goToPreviousMatch: () => void;
}

const JsonWizardContext = createContext<JsonWizardContextValue | null>(null);

export function JsonWizardProvider({ children }: { children: ReactNode }) {
  const value = useJsonWizard();
  return (
    <JsonWizardContext.Provider value={value}>
      {children}
    </JsonWizardContext.Provider>
  );
}

export function useJsonWizardContext() {
  const context = useContext(JsonWizardContext);
  if (!context) {
    throw new Error(
      "useJsonWizardContext must be used within JsonWizardProvider",
    );
  }
  return context;
}
