"use client";

import { useMemo } from "react";

import { computeDiff } from "../lib/diff";

import type { DiffLine } from "./types";

export interface UseTextDiffResult {
  diffLines: DiffLine[];
  stats: {
    added: number;
    removed: number;
    modified: number;
  };
}

/**
 * Hook for computing text diffs between two strings.
 *
 * @param input - The original/left text to compare
 * @param output - The modified/right text to compare
 * @returns An object containing the diff lines and statistics
 */
export function useTextDiff(input: string, output: string): UseTextDiffResult {
  const diffLines = useMemo(() => {
    if (!input && !output) return [];
    return computeDiff(input, output);
  }, [input, output]);

  const stats = useMemo(
    () => ({
      added: diffLines.filter((l) => l.type === "added").length,
      removed: diffLines.filter((l) => l.type === "removed").length,
      modified: diffLines.filter((l) => l.type === "modified").length,
    }),
    [diffLines],
  );

  return {
    diffLines,
    stats,
  };
}
