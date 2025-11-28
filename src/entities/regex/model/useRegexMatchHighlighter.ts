import { useMemo } from "react";

import {
  highlightMatches,
  isPositionHighlighted,
  getMatchIndexAtPosition,
} from "../lib/matchHighlighter";

import type { RegexMatch } from "./types";

export interface RegexHighlighterResult {
  matches: RegexMatch[];
  error: string | null;
  /**
   * Function to determine if a character position should be highlighted
   * @param index - The character index in the text
   * @returns true if the character is part of a match
   */
  isHighlighted: (index: number) => boolean;
  /**
   * Get the match index for a character position (0-based)
   * @param index - The character index in the text
   * @returns The match index (0-based) or -1 if not in a match
   */
  getMatchIndex: (index: number) => number;
}

/**
 * Hook for highlighting regex matches in text
 *
 * @param pattern - The regex pattern to match
 * @param flags - Regex flags (e.g., "gi")
 * @param text - The text to search in
 * @returns Match information and highlighting utilities
 *
 * @example
 * ```tsx
 * const { matches, error, isHighlighted } = useRegexMatchHighlighter(
 *   "\\d+",
 *   "g",
 *   "Numbers: 123 and 456"
 * );
 * ```
 */
export function useRegexMatchHighlighter(
  pattern: string,
  flags: string,
  text: string,
): RegexHighlighterResult {
  return useMemo(() => {
    const { matches, error, highlightRanges } = highlightMatches(
      pattern,
      flags,
      text,
    );

    return {
      matches,
      error,
      isHighlighted: (index: number) =>
        isPositionHighlighted(index, highlightRanges),
      getMatchIndex: (index: number) =>
        getMatchIndexAtPosition(index, highlightRanges),
    };
  }, [pattern, flags, text]);
}
