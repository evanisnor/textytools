/**
 * CSV formatting utilities for Apogee transforms
 */

import { escapeCsvValue } from "./parser";

export interface CsvFormatOptions {
  delimiter?: string;
  quoteChar?: string;
}

/**
 * Format 2D array into CSV string
 */
export function formatCSV(
  data: string[][],
  options: CsvFormatOptions = {},
): string {
  const { delimiter = ",", quoteChar = '"' } = options;

  if (!data || data.length === 0) {
    return "";
  }

  const rows = data.map((row) =>
    row
      .map((value) => {
        // Replace quote char with custom if specified
        if (quoteChar !== '"') {
          return escapeCsvValue(value, delimiter).replace(/"/g, quoteChar);
        }
        return escapeCsvValue(value, delimiter);
      })
      .join(delimiter),
  );

  return rows.join("\n");
}
