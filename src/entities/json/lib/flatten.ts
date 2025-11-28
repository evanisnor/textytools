/**
 * Flattens nested objects with dot notation.
 * Handles arrays and nested structures for CSV conversion.
 */
export function flattenObject(
  obj: unknown,
  prefix = "",
): Record<string, string | number | boolean | null> {
  const result: Record<string, string | number | boolean | null> = {};

  if (obj === null || obj === undefined) {
    result[prefix || "value"] = null;
    return result;
  }

  if (typeof obj !== "object") {
    result[prefix || "value"] = obj as string | number | boolean;
    return result;
  }

  if (Array.isArray(obj)) {
    // Check if array contains only primitives
    const allPrimitives = obj.every(
      (item) =>
        item === null ||
        item === undefined ||
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean",
    );

    if (allPrimitives && obj.length <= 10) {
      // Flatten small arrays of primitives with indexed keys
      obj.forEach((item, index) => {
        const key = prefix ? `${prefix}.${index}` : `${index}`;
        result[key] = item as string | number | boolean | null;
      });
    } else if (
      obj.length > 0 &&
      obj.every(
        (item) =>
          typeof item === "object" && item !== null && !Array.isArray(item),
      )
    ) {
      // Array of objects - flatten each with index
      obj.forEach((item, index) => {
        const indexedPrefix = prefix ? `${prefix}.${index}` : `${index}`;
        Object.assign(result, flattenObject(item, indexedPrefix));
      });
    } else {
      // Complex or large arrays - convert to JSON string
      result[prefix || "value"] = JSON.stringify(obj);
    }
    return result;
  }

  // Regular object - recursively flatten
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      result[newKey] = null;
    } else if (Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else if (typeof value === "object") {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value as string | number | boolean;
    }
  }

  return result;
}
