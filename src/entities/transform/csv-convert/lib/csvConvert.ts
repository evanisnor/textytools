/**
 * CSV Convert Transform
 * Converts JSON and CSV to CSV format with delimiter options
 */

import type { TransformResult, PropertySchema } from "../../shared/types";

import {
  parseCSV,
  formatCSV,
  detectDelimiter,
  getCSVStats,
  type CsvFormatOptions,
} from "@/entities/csv";
import { parseJSON, flattenObject } from "@/entities/json";

/**
 * Property schema for CSV conversion options
 */
export const csvConvertPropertySchema: PropertySchema[] = [
  {
    key: "delimiter",
    label: "Delimiter",
    type: "toggle-group",
    options: [
      { value: ",", label: "Comma" },
      { value: "\t", label: "Tab" },
      { value: ";", label: "Semicolon" },
      { value: "|", label: "Pipe" },
    ],
    defaultValue: ",",
  },
  {
    key: "quoteChar",
    label: "Quote Character",
    type: "select",
    options: [
      { value: '"', label: 'Double quote (")' },
      { value: "'", label: "Single quote (')" },
    ],
    defaultValue: '"',
  },
];

/**
 * Default properties for CSV conversion
 */
export const csvConvertDefaultProperties: Record<string, unknown> = {
  delimiter: ",",
  quoteChar: '"',
};

/**
 * Convert JSON to CSV
 */
function jsonToCsv(data: unknown): string[][] {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return [];
    }

    // Check if it's an array of objects
    if (typeof data[0] === "object" && data[0] !== null) {
      // Flatten all objects first to handle nested structures
      const flattenedRows = data.map((item) => flattenObject(item));

      // Collect all unique keys from flattened objects
      const allKeys = Array.from(
        new Set(flattenedRows.flatMap((row) => Object.keys(row))),
      ).sort();

      const rows: string[][] = [allKeys];

      // Convert each flattened object to row
      for (const flatRow of flattenedRows) {
        const row = allKeys.map((key) => {
          const value = flatRow[key];
          if (value === null || value === undefined) {
            return "";
          }
          return String(value);
        });
        rows.push(row);
      }

      return rows;
    }

    // Array of primitives - single column
    return data.map((item) => [String(item)]);
  }

  if (typeof data === "object" && data !== null) {
    // Single object - flatten and convert to key-value pairs
    const flattened = flattenObject(data);
    const entries = Object.entries(flattened);
    return [
      ["Key", "Value"],
      ...entries.map(([key, value]) => [key, String(value ?? "")]),
    ];
  }

  // Primitive value
  return [[String(data)]];
}

/**
 * Execute CSV conversion transform
 */
export function executeCsvConvert(
  input: string,
  properties: Record<string, unknown>,
): TransformResult {
  if (!input || input.trim() === "") {
    return {
      success: false,
      data: "",
      error: "Input is empty",
      mimeType: "text/plain",
    };
  }

  let csvData: string[][];

  // Try to parse as JSON first
  const jsonResult = parseJSON(input);
  if (jsonResult.success && jsonResult.data) {
    csvData = jsonToCsv(jsonResult.data);
  } else {
    // Try to parse as CSV
    const detectedDelimiter = detectDelimiter(input);
    try {
      csvData = parseCSV(input, { delimiter: detectedDelimiter });
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Failed to parse input: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  }

  // Format as CSV with specified options
  const delimiter = properties.delimiter as string;
  const quoteChar = properties.quoteChar as string;

  const formatOptions: CsvFormatOptions = {
    delimiter,
    quoteChar,
  };

  try {
    const output = formatCSV(csvData, formatOptions);
    const stats = getCSVStats(csvData);

    return {
      success: true,
      data: output,
      mimeType: "text/csv",
      stats: [
        { label: "Rows", value: stats.rowCount },
        { label: "Columns", value: stats.columnCount },
      ],
    };
  } catch (err) {
    return {
      success: false,
      data: "",
      error: `Failed to format CSV: ${err instanceof Error ? err.message : "Unknown error"}`,
      mimeType: "text/plain",
    };
  }
}
