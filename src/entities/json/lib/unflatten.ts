import type { JsonObject } from "../model/types";

/**
 * Sets a nested value in an object using dot notation.
 * Supports array indices in the path (e.g., "items.0.name").
 */
export function setNestedValue(
  obj: JsonObject,
  path: string,
  value: unknown,
): void {
  const keys = path.split(".");
  let current: unknown = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isNextKeyArrayIndex = /^\d+$/.test(nextKey);

    if (Array.isArray(current)) {
      const index = parseInt(key, 10);
      if (!current[index]) {
        current[index] = isNextKeyArrayIndex ? [] : {};
      }
      current = current[index];
    } else {
      const currentObj = current as JsonObject;
      if (!(key in currentObj)) {
        currentObj[key] = isNextKeyArrayIndex ? [] : {};
      }
      current = currentObj[key];
    }
  }

  const lastKey = keys[keys.length - 1];
  if (Array.isArray(current)) {
    const index = parseInt(lastKey, 10);
    current[index] = value;
  } else {
    (current as JsonObject)[lastKey] = value;
  }
}
