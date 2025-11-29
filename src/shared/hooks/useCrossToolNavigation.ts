"use client";

import { useCallback } from "react";

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
 * const { navigateToTool } = useCrossToolNavigation();
 *
 * navigateToTool({
 *   destination: "/json-wizard",
 *   saveState: { key: "jwt-decoder-state", value: { input } },
 *   transferData: { key: "cross-tool-input-json-wizard", value: formattedOutput }
 * });
 * ```
 */
export function useCrossToolNavigation() {
  const navigateToTool = useCallback(
    ({
      destination,
      saveState,
      transferData,
    }: {
      /**
       * The destination path (e.g., "/json-wizard")
       */
      destination: string;

      /**
       * Optional: Current feature state to save for restoration on back navigation
       */
      saveState?: {
        key: string;
        value: Record<string, unknown>;
      };

      /**
       * The data to transfer to the destination tool
       */
      transferData: {
        /**
         * The cross-tool key for the destination feature
         * Convention: "cross-tool-input-{destination-feature-name}"
         */
        key: string;
        /**
         * The data to transfer
         */
        value: string;
      };
    }) => {
      // Save current state for restoration on back navigation
      if (saveState) {
        sessionStorage.setItem(saveState.key, JSON.stringify(saveState.value));
      }

      // Save data for destination tool
      sessionStorage.setItem(transferData.key, transferData.value);

      // Navigate to destination
      window.location.href = destination;
    },
    [],
  );

  return {
    navigateToTool,
  };
}
