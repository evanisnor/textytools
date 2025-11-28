import { escapeCsvValue } from "@/entities/csv";
import { flattenObject } from "@/entities/json";

/**
 * Converts JSON array to CSV string.
 */
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
