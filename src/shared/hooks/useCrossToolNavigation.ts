"use client";

import { useCallback } from "react";

interface CrossToolNavigationOptions {
  /**
   * The current feature's storage key for saving state before navigation
   */
  currentFeatureKey: string;

  /**
   * The current feature's state to save
   */
  currentState: Record<string, unknown>;
}

/**
 * Hook for navigating between tools with data transfer via sessionStorage
 *
 * Handles:
 * - Saving current feature state before navigation
 * - Transferring data to destination tool via cross-tool key
 * - Navigation via window.location.href
 *
 * @example
 * ```tsx
 * const { navigateToTool } = useCrossToolNavigation({
 *   currentFeatureKey: "jwt-decoder-state",
 *   currentState: { input }
 * });
 *
 * navigateToTool({
 *   destination: "/json-wizard",
 *   data: formattedOutput,
 *   crossToolKey: "cross-tool-input-json-wizard"
 * });
 * ```
 */
export function useCrossToolNavigation({
  currentFeatureKey,
  currentState,
}: CrossToolNavigationOptions) {
  const navigateToTool = useCallback(
    ({
      destination,
      data,
      crossToolKey,
    }: {
      /**
       * The destination path (e.g., "/json-wizard")
       */
      destination: string;

      /**
       * The data to transfer to the destination tool
       */
      data: string;

      /**
       * The cross-tool key for the destination feature
       * Convention: "cross-tool-input-{destination-feature-name}"
       */
      crossToolKey: string;
    }) => {
      // Save current state for restoration on back navigation
      sessionStorage.setItem(currentFeatureKey, JSON.stringify(currentState));

      // Save data for destination tool
      sessionStorage.setItem(crossToolKey, data);

      // Navigate to destination
      window.location.href = destination;
    },
    [currentFeatureKey, currentState],
  );

  return {
    navigateToTool,
  };
}
