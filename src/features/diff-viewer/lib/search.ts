import type { SearchMatch } from "../model/types";

export function findSearchMatches(
  searchTerm: string,
  caseSensitive: boolean,
  input: string,
  output: string,
): SearchMatch[] {
  if (!searchTerm) return [];

  const regex = new RegExp(
    searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    caseSensitive ? "g" : "gi",
  );

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

export function createInputMatchMap(
  searchMatches: SearchMatch[],
  currentMatchIndex: number,
): Map<number, Set<number>> {
  const map = new Map<number, Set<number>>();
  if (searchMatches.length === 0) return map;

  const currentMatch = searchMatches[currentMatchIndex];
  if (!currentMatch) return map;

  searchMatches.forEach((match) => {
    if (match.inputMatches.length > 0) {
      const isCurrentMatch = match.matchIndex === currentMatch.matchIndex;
      map.set(
        match.lineIndex,
        new Set(isCurrentMatch ? match.inputMatches : []),
      );
    }
  });

  return map;
}

export function createOutputMatchMap(
  searchMatches: SearchMatch[],
  currentMatchIndex: number,
): Map<number, Set<number>> {
  const map = new Map<number, Set<number>>();
  if (searchMatches.length === 0) return map;

  const currentMatch = searchMatches[currentMatchIndex];
  if (!currentMatch) return map;

  searchMatches.forEach((match) => {
    if (match.outputMatches.length > 0) {
      const isCurrentMatch = match.matchIndex === currentMatch.matchIndex;
      map.set(
        match.lineIndex,
        new Set(isCurrentMatch ? match.outputMatches : []),
      );
    }
  });

  return map;
}
