"use client";

import { useState, useEffect, useCallback } from "react";

interface UsePersistedStateOptions<T> {
  /**
   * The sessionStorage key for this feature's state
   * Convention: "{feature-name}-state"
   */
  storageKey: string;

  /**
   * Initial state value
   */
  initialState: T;

  /**
   * Optional cross-tool input key to check first
   * Convention: "cross-tool-input-{feature-name}"
   */
  crossToolKey?: string;

  /**
   * Optional callback when cross-tool data is loaded
   * Use this to handle cross-tool data differently than persisted state
   */
  onCrossToolData?: (data: string) => void;
}

/**
 * Hook for persisting feature state to sessionStorage with SSR hydration safety
 *
 * Handles:
 * - SSR hydration safety (waits for client mount)
 * - Cross-tool data transfer (checks cross-tool key first)
 * - Automatic state persistence on changes
 * - Error handling for corrupted storage data
 *
 * @example
 * ```tsx
 * const { state, setState, mounted } = usePersistedState({
 *   storageKey: "text-counter-state",
 *   initialState: { text: "" },
 *   crossToolKey: "cross-tool-input-text-counter"
 * });
 * ```
 */
export function usePersistedState<T extends Record<string, unknown>>({
  storageKey,
  initialState,
  crossToolKey,
  onCrossToolData,
}: UsePersistedStateOptions<T>) {
  const [state, setState] = useState<T>(initialState);
  const [mounted, setMounted] = useState(false);

  // Load state on mount
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);

      // Check for cross-tool data first (takes precedence)
      if (crossToolKey) {
        const crossToolData = sessionStorage.getItem(crossToolKey);
        if (crossToolData) {
          sessionStorage.removeItem(crossToolKey);
          if (onCrossToolData) {
            onCrossToolData(crossToolData);
          }
          return;
        }
      }

      // Load persisted state from sessionStorage
      const persistedState = sessionStorage.getItem(storageKey);
      if (persistedState) {
        try {
          const parsed = JSON.parse(persistedState);
          setState(parsed);
        } catch (err) {
          console.error(
            `Failed to load persisted state from ${storageKey}:`,
            err,
          );
        }
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state whenever it changes
  useEffect(() => {
    if (!mounted) return;
    sessionStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, mounted, storageKey]);

  // Helper to update specific fields
  const updateState = useCallback((updates: Partial<T>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    state,
    setState,
    updateState,
    mounted,
  };
}
