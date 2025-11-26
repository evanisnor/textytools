import type { JSONStats } from "../model/types";

export function getJSONStats(text: string): JSONStats {
  try {
    const parsed = JSON.parse(text);

    const countKeys = (obj: unknown): number => {
      if (typeof obj !== "object" || obj === null) return 0;

      let count = 0;
      for (const key in obj) {
        count++;
        count += countKeys((obj as Record<string, unknown>)[key]);
      }
      return count;
    };

    const getDepth = (obj: unknown, current = 1): number => {
      if (typeof obj !== "object" || obj === null) return current;

      let maxDepth = current;
      for (const key in obj) {
        const depth = getDepth(
          (obj as Record<string, unknown>)[key],
          current + 1,
        );
        maxDepth = Math.max(maxDepth, depth);
      }
      return maxDepth;
    };

    return {
      keys: countKeys(parsed),
      depth: getDepth(parsed),
      size: new Blob([text]).size,
    };
  } catch {
    return { keys: 0, depth: 0, size: new Blob([text]).size };
  }
}
