import { parseCsvLine, generateColumnLetter } from "@/entities/csv";
import { setNestedValue, parseValue, type JsonObject } from "@/entities/json";

/**
 * Converts CSV string to JSON array of objects.
 */
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
