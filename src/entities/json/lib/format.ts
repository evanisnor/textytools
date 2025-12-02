/**
 * JSON formatting utilities for Apogee transforms
 */

export interface JsonFormatOptions {
  indentation?: number | "tab";
  sortKeys?: boolean;
  minify?: boolean;
}

/**
 * Format JSON with customizable options
 */
export function formatJSON(
  data: unknown,
  options: JsonFormatOptions = {},
): string {
  const { indentation = 2, sortKeys = false, minify = false } = options;

  if (minify) {
    return JSON.stringify(data);
  }

  // Sort keys if requested
  const dataToStringify = sortKeys ? sortObjectKeys(data) : data;

  // Convert indentation to actual value for JSON.stringify
  const indent = indentation === "tab" ? "\t" : indentation;

  return JSON.stringify(dataToStringify, null, indent);
}

/**
 * Recursively sort object keys alphabetically
 */
function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sortObjectKeys(item));
  }

  if (typeof obj === "object") {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj).sort();

    for (const key of keys) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    }

    return sorted;
  }

  return obj;
}
