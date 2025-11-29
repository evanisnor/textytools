import {
  findTextMatches,
  createSearchRegex,
  type SearchMatch,
} from "@/entities/search";

/**
 * Finds JSON paths for matches by traversing the JSON structure
 */
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

/**
 * Finds matches with JSON path metadata attached
 */
export function findJSONMatches(
  text: string,
  searchTerm: string,
  caseSensitive: boolean,
  jsonPaths: string[],
): SearchMatch[] {
  const matches = findTextMatches(text, searchTerm, caseSensitive);

  // Attach JSON path metadata to each match
  return matches.map((match, index) => ({
    ...match,
    metadata: jsonPaths[index],
  }));
}

/**
 * Maps input matches to output matches using JSON paths
 */
export function mapInputToOutputMatches(
  inputMatches: SearchMatch[],
  outputMatches: SearchMatch[],
): Map<number, number> {
  const map = new Map<number, number>();

  // Build a queue of output match indices for each path
  const pathToOutputIndices = new Map<string, number[]>();
  outputMatches.forEach((outputMatch) => {
    const jsonPath = outputMatch.metadata as string | undefined;
    if (jsonPath !== undefined) {
      if (!pathToOutputIndices.has(jsonPath)) {
        pathToOutputIndices.set(jsonPath, []);
      }
      pathToOutputIndices.get(jsonPath)!.push(outputMatch.matchIndex);
    }
  });

  // Track how many times we've used each path from input side
  const pathUsageCount = new Map<string, number>();

  // Map each input match to the corresponding output match via structural path
  inputMatches.forEach((inputMatch) => {
    const jsonPath = inputMatch.metadata as string | undefined;
    if (jsonPath !== undefined) {
      const outputIndices = pathToOutputIndices.get(jsonPath);
      if (outputIndices && outputIndices.length > 0) {
        const usageCount = pathUsageCount.get(jsonPath) || 0;
        const outputIndex =
          outputIndices[Math.min(usageCount, outputIndices.length - 1)];
        map.set(inputMatch.matchIndex, outputIndex);
        pathUsageCount.set(jsonPath, usageCount + 1);
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
