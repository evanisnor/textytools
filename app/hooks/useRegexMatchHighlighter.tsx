import { useMemo } from "react";

export interface RegexMatch {
  fullMatch: string;
  groups: string[];
  index: number;
  length: number;
}

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
    if (!pattern || !text) {
      return {
        matches: [],
        error: null,
        isHighlighted: () => false,
        getMatchIndex: () => -1,
      };
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matchResults: RegexMatch[] = [];
      let match;

      if (flags.includes("g")) {
        // Global flag - find all matches
        while ((match = regex.exec(text)) !== null) {
          matchResults.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
            length: match[0].length,
          });
          // Prevent infinite loop on zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // Non-global - find first match only
        match = regex.exec(text);
        if (match) {
          matchResults.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
            length: match[0].length,
          });
        }
      }

      // Create efficient lookup for highlighting
      const highlightRanges: Array<{
        start: number;
        end: number;
        matchIndex: number;
      }> = matchResults.map((m, idx) => ({
        start: m.index,
        end: m.index + m.length,
        matchIndex: idx,
      }));

      const isHighlighted = (index: number): boolean => {
        return highlightRanges.some(
          (range) => index >= range.start && index < range.end,
        );
      };

      const getMatchIndex = (index: number): number => {
        const range = highlightRanges.find(
          (range) => index >= range.start && index < range.end,
        );
        return range ? range.matchIndex : -1;
      };

      return {
        matches: matchResults,
        error: null,
        isHighlighted,
        getMatchIndex,
      };
    } catch (err) {
      return {
        matches: [],
        error: err instanceof Error ? err.message : "Invalid regex pattern",
        isHighlighted: () => false,
        getMatchIndex: () => -1,
      };
    }
  }, [pattern, flags, text]);
}
