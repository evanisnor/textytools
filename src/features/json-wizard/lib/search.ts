import type { SearchMatch } from "../model/types";

import { createSearchRegex } from "@/entities/search";

export function findJSONMatchPaths(
  json: string,
  searchTerm: string,
  caseSensitive: boolean,
): string[] {
  if (!searchTerm || !json.trim()) return [];

  try {
    const parsed = JSON.parse(json);
    const paths: string[] = [];
    const regex = createSearchRegex(searchTerm, caseSensitive);

    const traverse = (obj: unknown, path: string[] = []): void => {
      if (typeof obj === "object" && obj !== null) {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            traverse(item, [...path, `[${index}]`]);
          });
        } else {
          Object.keys(obj).forEach((key) => {
            traverse((obj as Record<string, unknown>)[key], [...path, key]);
          });
        }
      } else {
        // Check if this value contains matches
        const valueStr = String(obj);
        const matches = valueStr.match(regex);
        if (matches) {
          // Add the path once for each match in this value
          for (let i = 0; i < matches.length; i++) {
            paths.push(path.join("."));
          }
        }
      }
    };

    traverse(parsed);
    return paths;
  } catch {
    return [];
  }
}

export function findSearchMatches(
  text: string,
  searchTerm: string,
  caseSensitive: boolean,
  jsonPaths: string[],
): SearchMatch[] {
  if (!searchTerm || !text) return [];

  const matches: SearchMatch[] = [];
  const lines = text.split("\n");
  const regex = createSearchRegex(searchTerm, caseSensitive);

  lines.forEach((line, lineIndex) => {
    const lineRegex = new RegExp(regex.source, regex.flags);
    let match;

    while ((match = lineRegex.exec(line)) !== null) {
      const jsonPath = jsonPaths[matches.length];
      matches.push({
        lineIndex,
        matchIndex: matches.length,
        columnStart: match.index,
        jsonPath,
      });
    }
  });

  return matches;
}

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

export function mapInputToOutputMatches(
  inputMatches: SearchMatch[],
  outputMatches: SearchMatch[],
): Map<number, number> {
  const map = new Map<number, number>();

  // Build a queue of output match indices for each path
  const pathToOutputIndices = new Map<string, number[]>();
  outputMatches.forEach((outputMatch) => {
    if (outputMatch.jsonPath !== undefined) {
      if (!pathToOutputIndices.has(outputMatch.jsonPath)) {
        pathToOutputIndices.set(outputMatch.jsonPath, []);
      }
      pathToOutputIndices
        .get(outputMatch.jsonPath)!
        .push(outputMatch.matchIndex);
    }
  });

  // Track how many times we've used each path from input side
  const pathUsageCount = new Map<string, number>();

  // Map each input match to the corresponding output match via structural path
  inputMatches.forEach((inputMatch) => {
    if (inputMatch.jsonPath !== undefined) {
      const outputIndices = pathToOutputIndices.get(inputMatch.jsonPath);
      if (outputIndices && outputIndices.length > 0) {
        const usageCount = pathUsageCount.get(inputMatch.jsonPath) || 0;
        const outputIndex =
          outputIndices[Math.min(usageCount, outputIndices.length - 1)];
        map.set(inputMatch.matchIndex, outputIndex);
        pathUsageCount.set(inputMatch.jsonPath, usageCount + 1);
      }
    } else {
      // Fallback to sequential for invalid JSON
      if (inputMatch.matchIndex < outputMatches.length) {
        map.set(inputMatch.matchIndex, inputMatch.matchIndex);
      }
    }
  });

  return map;
}
