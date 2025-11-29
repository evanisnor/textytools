/**
 * Blastoff Context Provider
 * Provides blastoff state to all child components
 */

"use client";

import { createContext, useContext, ReactNode } from "react";

import { useBlastoff, BlastoffContextValue } from "./useBlastoff";

const BlastoffContext = createContext<BlastoffContextValue | null>(null);

interface BlastoffProviderProps {
  children: ReactNode;
  documentId?: string;
}

export function BlastoffProvider({
  children,
  documentId,
}: BlastoffProviderProps) {
  const value = useBlastoff(documentId);

  return (
    <BlastoffContext.Provider value={value}>
      {children}
    </BlastoffContext.Provider>
  );
}

export function useBlastoffContext() {
  const context = useContext(BlastoffContext);
  if (!context) {
    throw new Error("useBlastoffContext must be used within BlastoffProvider");
  }
  return context;
}
