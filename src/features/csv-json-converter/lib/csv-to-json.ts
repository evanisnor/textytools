import type { JsonObject } from "../model/types";

import { parseCsvLine } from "@/shared/lib/csv";

// CSV to JSON conversion
export function csvToJson(
  csvString: string,
  delimiter: string,
  hasHeaders: boolean,
): { success: boolean; output: string; error: string | null } {
  const lines = csvString.trim().split("\n");

  if (lines.length === 0) {
    return { success: true, output: "[]", error: null };
  }

  let headers: string[];
  let dataStartIndex: number;

  if (hasHeaders) {
    // First row is headers
    headers = parseCsvLine(lines[0], delimiter);
    dataStartIndex = 1;
  } else {
    // Generate sequential letter headers (a, b, c, ..., z, aa, ab, etc.)
    const firstRow = parseCsvLine(lines[0], delimiter);
    headers = firstRow.map((_, i) => generateColumnLetter(i));
    dataStartIndex = 0;
  }

  const rows: JsonObject[] = [];

  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = parseCsvLine(line, delimiter);

    // Pad with empty strings if row has fewer columns
    while (values.length < headers.length) {
      values.push("");
    }

    // Warn if row has more columns than expected
    if (values.length > headers.length) {
      return {
        success: false,
        output: "",
        error: `Row ${i + 1} has ${values.length} columns, expected ${headers.length}. Check your delimiter setting.`,
      };
    }

    const row: JsonObject = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = values[j] || "";
      setNestedValue(row, header, parseValue(value));
    }
    rows.push(row);
  }

  return { success: true, output: JSON.stringify(rows, null, 2), error: null };
}

// Helper: Parse string values to appropriate types
function parseValue(value: string): string | number | boolean | null {
  const trimmed = value.trim();

  if (trimmed === "") return "";
  if (trimmed.toLowerCase() === "null") return null;
  if (trimmed.toLowerCase() === "true") return true;
  if (trimmed.toLowerCase() === "false") return false;

  // Try to parse as number
  const num = Number(trimmed);
  if (!isNaN(num) && trimmed !== "") {
    return num;
  }

  return value;
}

// Helper: Generate column letter (a, b, c, ..., z, aa, ab, ...)
function generateColumnLetter(index: number): string {
  let result = "";
  let num = index;

  while (num >= 0) {
    result = String.fromCharCode(97 + (num % 26)) + result;
    num = Math.floor(num / 26) - 1;
  }

  return result;
}

// Helper: Set nested value using dot notation with array support
function setNestedValue(obj: JsonObject, path: string, value: unknown): void {
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
