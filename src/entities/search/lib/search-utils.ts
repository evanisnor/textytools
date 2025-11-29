import type { SearchMatch, DualPaneSearchResult } from "../model/types";

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
 * Finds all matches in a single text string
 */
export function findTextMatches(
  text: string,
  searchTerm: string,
  caseSensitive: boolean,
): SearchMatch[] {
  if (!searchTerm || !text) return [];

  const matches: SearchMatch[] = [];
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
 * Finds matches in two panes simultaneously
 * Returns separate match arrays for left and right panes
 */
export function findDualPaneMatches(
  leftText: string,
  rightText: string,
  searchTerm: string,
  caseSensitive: boolean,
): DualPaneSearchResult {
  const leftMatches = findTextMatches(leftText, searchTerm, caseSensitive);
  const rightMatches = findTextMatches(rightText, searchTerm, caseSensitive);

  // Re-index right matches to continue from left matches
  const totalLeftMatches = leftMatches.length;
  rightMatches.forEach((match, index) => {
    match.matchIndex = totalLeftMatches + index;
  });

  return {
    leftMatches,
    rightMatches,
    totalMatches: leftMatches.length + rightMatches.length,
  };
}

/**
 * Creates a map for efficient match lookup by line
 * Returns: Map<lineIndex, Set<columnStart>>
 * Use this for simple highlighting where match index is not needed
 */
export function createMatchMap(
  matches: SearchMatch[],
): Map<number, Set<number>> {
  const map = new Map<number, Set<number>>();

  matches.forEach((match) => {
    if (!map.has(match.lineIndex)) {
      map.set(match.lineIndex, new Set());
    }
    map.get(match.lineIndex)!.add(match.columnStart);
  });

  return map;
}

/**
 * Creates a map that preserves match indices for complex highlighting
 * Returns: Map<lineIndex, Map<columnStart, matchIndex>>
 * Use this when you need to identify which specific match is being highlighted
 */
export function createMatchPositionMap(
  matches: SearchMatch[],
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
 * Creates a map containing only the current match for highlighting
 * Returns: Map<lineIndex, Set<columnStart>>
 */
export function createCurrentMatchMap(
  matches: SearchMatch[],
  currentIndex: number,
): Map<number, Set<number>> {
  const map = new Map<number, Set<number>>();
  if (matches.length === 0 || currentIndex >= matches.length) return map;

  const current = matches[currentIndex];
  if (!map.has(current.lineIndex)) {
    map.set(current.lineIndex, new Set());
  }
  map.get(current.lineIndex)!.add(current.columnStart);

  return map;
}

/**
 * Gets the index of the next match (wraps around)
 */
export function getNextMatchIndex(
  currentIndex: number,
  totalMatches: number,
): number {
  if (totalMatches === 0) return 0;
  return (currentIndex + 1) % totalMatches;
}

/**
 * Gets the index of the previous match (wraps around)
 */
export function getPreviousMatchIndex(
  currentIndex: number,
  totalMatches: number,
): number {
  if (totalMatches === 0) return 0;
  return (currentIndex - 1 + totalMatches) % totalMatches;
}
