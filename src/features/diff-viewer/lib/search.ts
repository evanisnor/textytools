import type { SearchMatch } from "../model/types";

import { createSearchRegex } from "@/entities/search";

export function findSearchMatches(
  searchTerm: string,
  caseSensitive: boolean,
  input: string,
  output: string,
): SearchMatch[] {
  if (!searchTerm) return [];

  const regex = createSearchRegex(searchTerm, caseSensitive);

  // Collect matches per line for both panes
  const inputLines = input.split("\n");
  const outputLines = output.split("\n");

  // Map of line index to matches in that line
  const lineMatchMap = new Map<
    number,
    { inputMatches: number[]; outputMatches: number[] }
  >();

  // Search in input
  inputLines.forEach((line, lineIndex) => {
    let match;
    const lineRegex = new RegExp(regex.source, regex.flags);
    const matches: number[] = [];
    while ((match = lineRegex.exec(line)) !== null) {
      matches.push(match.index);
    }
    if (matches.length > 0) {
      if (!lineMatchMap.has(lineIndex)) {
        lineMatchMap.set(lineIndex, { inputMatches: [], outputMatches: [] });
      }
      lineMatchMap.get(lineIndex)!.inputMatches = matches;
    }
  });

  // Search in output
  outputLines.forEach((line, lineIndex) => {
    let match;
    const lineRegex = new RegExp(regex.source, regex.flags);
    const matches: number[] = [];
    while ((match = lineRegex.exec(line)) !== null) {
      matches.push(match.index);
    }
    if (matches.length > 0) {
      if (!lineMatchMap.has(lineIndex)) {
        lineMatchMap.set(lineIndex, { inputMatches: [], outputMatches: [] });
      }
      lineMatchMap.get(lineIndex)!.outputMatches = matches;
    }
  });

  // Convert to array and sort by line index
  const sortedMatches: SearchMatch[] = Array.from(lineMatchMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([lineIndex, { inputMatches, outputMatches }], index) => ({
      lineIndex,
      matchIndex: index,
      inputMatches,
      outputMatches,
    }));

  return sortedMatches;
}

/**
 * Creates a map of all match positions (for highlighting all matches)
 */
export function createInputMatchMap(
  searchMatches: SearchMatch[],
): Map<number, Set<number>> {
  const map = new Map<number, Set<number>>();
  if (searchMatches.length === 0) return map;

  searchMatches.forEach((match) => {
    if (match.inputMatches.length > 0) {
      if (!map.has(match.lineIndex)) {
        map.set(match.lineIndex, new Set());
      }
      match.inputMatches.forEach((pos) => {
        map.get(match.lineIndex)!.add(pos);
      });
    }
  });

  return map;
}

/**
 * Creates a map of all match positions (for highlighting all matches)
 */
export function createOutputMatchMap(
  searchMatches: SearchMatch[],
): Map<number, Set<number>> {
  const map = new Map<number, Set<number>>();
  if (searchMatches.length === 0) return map;

  searchMatches.forEach((match) => {
    if (match.outputMatches.length > 0) {
      if (!map.has(match.lineIndex)) {
        map.set(match.lineIndex, new Set());
      }
      match.outputMatches.forEach((pos) => {
        map.get(match.lineIndex)!.add(pos);
      });
    }
  });

  return map;
}

/**
 * Creates a map of current match positions only (for highlighting the active match)
 */
export function createCurrentInputMatchMap(
  searchMatches: SearchMatch[],
  currentMatchIndex: number,
): Map<number, Set<number>> {
  const map = new Map<number, Set<number>>();
  if (searchMatches.length === 0) return map;

  const currentMatch = searchMatches[currentMatchIndex];
  if (!currentMatch || currentMatch.inputMatches.length === 0) return map;

  map.set(currentMatch.lineIndex, new Set(currentMatch.inputMatches));
  return map;
}

/**
 * Creates a map of current match positions only (for highlighting the active match)
 */
export function createCurrentOutputMatchMap(
  searchMatches: SearchMatch[],
  currentMatchIndex: number,
): Map<number, Set<number>> {
  const map = new Map<number, Set<number>>();
  if (searchMatches.length === 0) return map;

  const currentMatch = searchMatches[currentMatchIndex];
  if (!currentMatch || currentMatch.outputMatches.length === 0) return map;

  map.set(currentMatch.lineIndex, new Set(currentMatch.outputMatches));
  return map;
}
