"use client";

import { createContext, useContext, ReactNode } from "react";

import { useRegexTester } from "./useRegexTester";

import type { RegexMatch } from "@/entities/regex";

interface RegexTesterContextValue {
  pattern: string;
  flags: string;
  testString: string;
  currentMatchIndex: number;
  mounted: boolean;
  matches: RegexMatch[];
  error: string | null;
  captureGroupCount: number;
  setPattern: (pattern: string) => void;
  setFlags: (flags: string) => void;
  setTestString: (testString: string) => void;
  toggleFlag: (flag: string) => void;
  goToNextMatch: () => void;
  goToPreviousMatch: () => void;
  clearTestString: () => void;
  isHighlighted: (index: number) => boolean;
  getMatchIndex: (index: number) => number;
}

const RegexTesterContext = createContext<RegexTesterContextValue | null>(null);

export function RegexTesterProvider({ children }: { children: ReactNode }) {
  const value = useRegexTester();
  return (
    <RegexTesterContext.Provider value={value}>
      {children}
    </RegexTesterContext.Provider>
  );
}

export function useRegexTesterContext() {
  const context = useContext(RegexTesterContext);
  if (!context) {
    throw new Error(
      "useRegexTesterContext must be used within RegexTesterProvider",
    );
  }
  return context;
}
