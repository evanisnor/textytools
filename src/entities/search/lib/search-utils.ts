import type { BaseSearchMatch } from "../model/types";

/**
 * Escapes special regex characters in a search term for literal matching
 */
export function escapeRegex(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Creates a regex from a search term with optional case sensitivity
 */
export function createSearchRegex(
  searchTerm: string,
  caseSensitive: boolean,
): RegExp {
  return new RegExp(escapeRegex(searchTerm), caseSensitive ? "g" : "gi");
}

/**
 * Finds all text matches in a single text string, line by line
 */
export function findTextMatches(
  text: string,
  searchTerm: string,
  caseSensitive: boolean,
): BaseSearchMatch[] {
  if (!searchTerm || !text) return [];

  const matches: BaseSearchMatch[] = [];
  const lines = text.split("\n");
  const regex = createSearchRegex(searchTerm, caseSensitive);

  lines.forEach((line, lineIndex) => {
    const lineRegex = new RegExp(regex.source, regex.flags);
    let match;

    while ((match = lineRegex.exec(line)) !== null) {
      matches.push({
        lineIndex,
        matchIndex: matches.length,
        columnStart: match.index,
      });
    }
  });

  return matches;
}

/**
 * Creates a map of line index to column positions for quick lookup
 */
export function createMatchPositionMap(
  matches: BaseSearchMatch[],
): Map<number, Map<number, number>> {
  const map = new Map<number, Map<number, number>>();

  matches.forEach((match) => {
    if (!map.has(match.lineIndex)) {
      map.set(match.lineIndex, new Map());
    }
    map.get(match.lineIndex)!.set(match.columnStart, match.matchIndex);
  });

  return map;
}

/**
 * Navigation helpers
 */
export function getNextMatchIndex(
  currentIndex: number,
  totalMatches: number,
): number {
  if (totalMatches === 0) return 0;
  return (currentIndex + 1) % totalMatches;
}

export function getPreviousMatchIndex(
  currentIndex: number,
  totalMatches: number,
): number {
  if (totalMatches === 0) return 0;
  return (currentIndex - 1 + totalMatches) % totalMatches;
}
