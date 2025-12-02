/**
 * Apogee Context Provider
 *
 * Provides document management state and actions to child components
 * via React Context API.
 */

"use client";

import React, { createContext, useContext, type ReactNode } from "react";

import type { DocumentManager } from "./useDocumentManager";
import { useDocumentManager } from "./useDocumentManager";

// ============================================================================
// Context Definition
// ============================================================================

const ApogeeContext = createContext<DocumentManager | null>(null);

// ============================================================================
// Provider Component
// ============================================================================

export interface ApogeeProviderProps {
  children: ReactNode;
}

export function ApogeeProvider({
  children,
}: ApogeeProviderProps): React.JSX.Element {
  const documentManager = useDocumentManager();

  return (
    <ApogeeContext.Provider value={documentManager}>
      {children}
    </ApogeeContext.Provider>
  );
}

// ============================================================================
// Consumer Hook
// ============================================================================

/**
 * Hook to access Apogee document management context
 *
 * @throws Error if used outside ApogeeProvider
 */
export function useApogeeContext(): DocumentManager {
  const context = useContext(ApogeeContext);

  if (!context) {
    throw new Error(
      "useApogeeContext must be used within an ApogeeProvider. " +
        "Make sure your component is wrapped in <ApogeeProvider>.",
    );
  }

  return context;
}

// ============================================================================
// Exports
// ============================================================================

export default ApogeeProvider;
