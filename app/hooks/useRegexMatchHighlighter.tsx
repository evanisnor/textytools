import { useMemo } from "react";

export interface RegexMatch {
  fullMatch: string;
  groups: string[];
  namedGroups: Record<string, string | undefined>;
  groupNames: (string | null)[]; // Array mapping group index to name (null if unnamed)
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
    if (!pattern) {
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

      // Extract group names from the pattern by parsing (?<name>...)
      const groupNamePattern = /\(\?<([^>]+)>/g;
      const extractedGroupNames: string[] = [];
      let nameMatch;
      while ((nameMatch = groupNamePattern.exec(pattern)) !== null) {
        extractedGroupNames.push(nameMatch[1]);
      }

      // Build a mapping of group index to name
      // We need to count all groups (named and unnamed) to get the correct indices
      const allGroupsPattern = /\((?!\?:)(?!\?=)(?!\?!)(?!\?<=)(?!\?<!)/g;
      const groupMatches = [...pattern.matchAll(allGroupsPattern)];
      const groupNames: (string | null)[] = new Array(groupMatches.length).fill(
        null,
      );

      // Map named groups to their positions
      let namedGroupIndex = 0;
      for (let i = 0; i < groupMatches.length; i++) {
        const groupStart = groupMatches[i].index!;
        // Check if this is a named group
        if (pattern.slice(groupStart, groupStart + 3) === "(?<") {
          groupNames[i] = extractedGroupNames[namedGroupIndex];
          namedGroupIndex++;
        }
      }

      if (flags.includes("g")) {
        // Global flag - find all matches
        while ((match = regex.exec(text)) !== null) {
          matchResults.push({
            fullMatch: match[0],
            groups: match.slice(1),
            namedGroups: match.groups || {},
            groupNames,
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
            namedGroups: match.groups || {},
            groupNames,
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
