/**
 * JSON statistics utilities for Apogee transforms
 */

export interface JsonStats {
  keyCount: number;
  depth: number;
  size: number; // in bytes
}

/**
 * Calculate comprehensive stats for JSON data
 */
export function getJSONStats(data: unknown): JsonStats {
  const stringified = JSON.stringify(data);

  return {
    keyCount: countKeys(data),
    depth: getDepth(data),
    size: new Blob([stringified]).size, // Accurate byte count
  };
}

/**
 * Count total number of keys in JSON object (recursive)
 */
export function countKeys(obj: unknown): number {
  if (obj === null || obj === undefined) {
    return 0;
  }

  if (Array.isArray(obj)) {
    return obj.reduce((sum, item) => sum + countKeys(item), 0);
  }

  if (typeof obj === "object") {
    let count = Object.keys(obj).length;
    for (const value of Object.values(obj)) {
      count += countKeys(value);
    }
    return count;
  }

  return 0;
}

/**
 * Calculate maximum nesting depth of JSON structure
 */
export function getDepth(obj: unknown): number {
  if (obj === null || obj === undefined) {
    return 0;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return 1;
    return 1 + Math.max(...obj.map((item) => getDepth(item)));
  }

  if (typeof obj === "object") {
    const keys = Object.keys(obj);
    if (keys.length === 0) return 1;
    return 1 + Math.max(...Object.values(obj).map((value) => getDepth(value)));
  }

  return 0;
}
