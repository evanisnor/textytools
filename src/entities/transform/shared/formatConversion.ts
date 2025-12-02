/**
 * Format conversion utilities
 * Converts between different data formats using a common intermediate representation
 *
 * All formats convert through JavaScript objects/arrays as the intermediate format:
 * Source Format → Parse → JS Object → Convert → Target Format
 */

import type { DataFormat } from "./formatDetection";

import { detectDelimiter } from "@/entities/csv";
import { parseJSON } from "@/entities/json";
import { parseTOML } from "@/entities/toml";
import { csvToJson } from "@/entities/transform/csv-json/lib/csv-to-json";
import { parseXML, xmlToJSON } from "@/entities/xml";
import { parseYAML } from "@/entities/yaml";

/**
 * Parse result with intermediate representation
 */
export interface ParsedData {
  success: boolean;
  data?: unknown; // JavaScript object/array representation
  error?: string;
}

/**
 * Parse input in any format to intermediate JavaScript object representation
 *
 * @param input - The input string
 * @param format - The detected or known format
 * @returns Parsed data as JavaScript objects/arrays
 */
export function parseToIntermediate(
  input: string,
  format: DataFormat,
): ParsedData {
  switch (format) {
    case "json": {
      const result = parseJSON(input);
      return {
        success: result.success,
        data: result.data,
        error: result.error,
      };
    }

    case "csv": {
      try {
        const delimiter = detectDelimiter(input);
        const csvResult = csvToJson(input, delimiter, true);
        if (csvResult.success && csvResult.output) {
          const parsedData = JSON.parse(csvResult.output);
          return { success: true, data: parsedData };
        }
        return {
          success: false,
          error: csvResult.error || "Failed to parse CSV",
        };
      } catch (err) {
        return {
          success: false,
          error: `CSV parsing error: ${err instanceof Error ? err.message : "Unknown error"}`,
        };
      }
    }

    case "yaml": {
      const result = parseYAML(input);
      return {
        success: result.success,
        data: result.data,
        error: result.error,
      };
    }

    case "xml": {
      const result = parseXML(input);
      if (result.success && result.data) {
        const jsonData = xmlToJSON(result.data);
        return { success: true, data: jsonData };
      }
      return {
        success: false,
        error: result.error || "Failed to parse XML",
      };
    }

    case "toml": {
      const result = parseTOML(input);
      return {
        success: result.success,
        data: result.data,
        error: result.error,
      };
    }

    case "unknown":
    default:
      return {
        success: false,
        error: `Unknown or unsupported format: ${format}`,
      };
  }
}

/**
 * Convert input from one format to intermediate representation
 * This is the primary function for convert transforms
 *
 * Usage:
 * ```typescript
 * const format = detectFormat(input);
 * const result = parseToIntermediate(input, format);
 * if (result.success) {
 *   const output = formatJSON(result.data, options);
 * }
 * ```
 */
export function convertToIntermediate(
  input: string,
  sourceFormat: DataFormat,
): ParsedData {
  return parseToIntermediate(input, sourceFormat);
}
