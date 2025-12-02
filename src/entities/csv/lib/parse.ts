/**
 * CSV parsing utilities for Apogee transforms
 */

import { parseCsvLine } from "./parser";

export interface CsvParseOptions {
  delimiter?: string;
  hasHeaders?: boolean;
}

/**
 * Parse CSV string into 2D array
 */
export function parseCSV(
  input: string,
  options: CsvParseOptions = {},
): string[][] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { delimiter = ",", hasHeaders = true } = options;

  if (!input || input.trim() === "") {
    return [];
  }

  const lines = input.split(/\r?\n/).filter((line) => line.trim() !== "");
  const rows: string[][] = [];

  for (const line of lines) {
    const row = parseCsvLine(line, delimiter);
    rows.push(row);
  }

  return rows;
}

/**
 * Detect the most likely delimiter in CSV data
 */
export function detectDelimiter(input: string): string {
  const delimiters = [",", "\t", ";", "|"];
  const sample = input.split("\n").slice(0, 5).join("\n"); // Sample first 5 lines

  let maxScore = 0;
  let detectedDelimiter = ",";

  for (const delimiter of delimiters) {
    const lines = sample.split("\n");
    const columnCounts = lines.map(
      (line) => parseCsvLine(line, delimiter).length,
    );

    // Check consistency: all lines should have same column count
    const uniqueCounts = new Set(columnCounts);
    if (uniqueCounts.size === 1) {
      const count = columnCounts[0];
      if (count > maxScore) {
        maxScore = count;
        detectedDelimiter = delimiter;
      }
    }
  }

  return detectedDelimiter;
}

/**
 * Detect if input is likely CSV
 * Checks for consistent column structure across multiple lines
 */
export function isCSV(input: string): boolean {
  if (!input || input.trim() === "") {
    return false;
  }

  const lines = input.split(/\r?\n/).filter((line) => line.trim() !== "");

  // Need at least 2 lines (header + data)
  if (lines.length < 2) {
    return false;
  }

  const delimiters = [",", "\t", ";", "|"];

  for (const delimiter of delimiters) {
    const columnCounts = lines
      .slice(0, Math.min(10, lines.length)) // Check first 10 lines
      .map((line) => parseCsvLine(line, delimiter).length);

    // Check if all lines have the same number of columns and > 1 column
    const uniqueCounts = new Set(columnCounts);
    if (uniqueCounts.size === 1 && columnCounts[0] > 1) {
      return true;
    }
  }

  return false;
}
