import type { RegexMatch } from "../model/types";

import { validateNoNestedQuantifiers } from "./validation";

export interface MatchHighlighterResult {
  matches: RegexMatch[];
  error: string | null;
  highlightRanges: Array<{
    start: number;
    end: number;
    matchIndex: number;
  }>;
}

/**
 * Core regex matching and highlighting logic
 *
 * @param pattern - The regex pattern to match
 * @param flags - Regex flags (e.g., "gi")
 * @param text - The text to search in
 * @returns Match information and highlight ranges
 */
export function highlightMatches(
  pattern: string,
  flags: string,
  text: string,
): MatchHighlighterResult {
  if (!pattern) {
    return {
      matches: [],
      error: null,
      highlightRanges: [],
    };
  }

  try {
    // Validate pattern for catastrophic backtracking
    const validation = validateNoNestedQuantifiers(pattern);
    if (!validation.isValid) {
      return {
        matches: [],
        error: `${validation.error}. Simplify the pattern to avoid performance issues.`,
        highlightRanges: [],
      };
    }

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
    const highlightRanges = matchResults.map((m, idx) => ({
      start: m.index,
      end: m.index + m.length,
      matchIndex: idx,
    }));

    return {
      matches: matchResults,
      error: null,
      highlightRanges,
    };
  } catch (err) {
    return {
      matches: [],
      error: err instanceof Error ? err.message : "Invalid regex pattern",
      highlightRanges: [],
    };
  }
}

/**
 * Check if a character position should be highlighted
 * @param index - The character index in the text
 * @param ranges - The highlight ranges
 * @returns true if the character is part of a match
 */
export function isPositionHighlighted(
  index: number,
  ranges: Array<{ start: number; end: number }>,
): boolean {
  return ranges.some((range) => index >= range.start && index < range.end);
}

/**
 * Get the match index for a character position (0-based)
 * @param index - The character index in the text
 * @param ranges - The highlight ranges
 * @returns The match index (0-based) or -1 if not in a match
 */
export function getMatchIndexAtPosition(
  index: number,
  ranges: Array<{ start: number; end: number; matchIndex: number }>,
): number {
  const range = ranges.find(
    (range) => index >= range.start && index < range.end,
  );
  return range ? range.matchIndex : -1;
}
