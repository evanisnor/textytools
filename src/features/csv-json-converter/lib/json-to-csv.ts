// JSON to CSV conversion
export function jsonToCsv(
  jsonString: string,
  delimiter: string,
  includeHeaders: boolean,
): { success: boolean; output: string; error: string | null } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (error) {
    return {
      success: false,
      output: "",
      error:
        error instanceof Error
          ? `Invalid JSON: ${error.message}`
          : "Invalid JSON",
    };
  }

  // Ensure we have an array of objects
  if (!Array.isArray(parsed)) {
    return {
      success: false,
      output: "",
      error: "JSON must be an array of objects",
    };
  }

  if (parsed.length === 0) {
    return { success: true, output: "", error: null };
  }

  // Flatten objects and collect all keys
  const flattenedRows = parsed.map((item) => flattenObject(item));
  const allKeys = Array.from(
    new Set(flattenedRows.flatMap((row) => Object.keys(row))),
  ).sort();

  // Build CSV
  const lines: string[] = [];

  if (includeHeaders) {
    const headerLine = allKeys
      .map((key) => escapeCsvValue(key, delimiter))
      .join(delimiter);
    lines.push(headerLine);
  }

  for (const row of flattenedRows) {
    const values = allKeys.map((key) => {
      const value = row[key];
      let stringValue: string;

      if (value === null || value === undefined) {
        stringValue = "";
      } else if (typeof value === "string") {
        stringValue = value;
      } else {
        stringValue = String(value);
      }

      return escapeCsvValue(stringValue, delimiter);
    });

    // Ensure we have the correct number of fields
    if (values.length !== allKeys.length) {
      return {
        success: false,
        output: "",
        error: `Internal error: Row has ${values.length} fields but expected ${allKeys.length}`,
      };
    }

    const csvLine = values.join(delimiter);
    lines.push(csvLine);
  }

  const output = lines.join("\n");
  return { success: true, output, error: null };
}

// Helper: Flatten nested objects with dot notation
function flattenObject(
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

// Helper: Escape CSV values according to RFC 4180
function escapeCsvValue(value: string, delimiter: string): string {
  // RFC 4180: Fields containing line breaks (CRLF), double quotes, and delimiters
  // should be enclosed in double-quotes
  const needsQuoting =
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r");

  if (needsQuoting) {
    // Escape double quotes by doubling them
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}
