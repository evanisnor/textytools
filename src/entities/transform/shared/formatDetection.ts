/**
 * Format detection utilities for Convert transforms
 * Provides reliable format identification using entity-specific detectors
 */

import { isCSV } from "@/entities/csv";
import { isJSON } from "@/entities/json";
import { isTOML } from "@/entities/toml";
import { isXML } from "@/entities/xml";
import { isYAML } from "@/entities/yaml";

/**
 * Known data formats that can be detected
 */
export type DataFormat = "json" | "csv" | "yaml" | "xml" | "toml" | "unknown";

/**
 * Detect the format of input data
 * Order matters! Checks most specific formats first to avoid false positives
 *
 * Detection order:
 * 1. JSON - Must start with { or [ and parse to object/array
 * 2. XML - Must start with < and have valid XML structure
 * 3. TOML - Must have TOML-specific syntax ([section], key = value)
 * 4. CSV - Must have consistent column structure (checked before YAML!)
 * 5. YAML - Must have YAML syntax AND parse to object/array (not plain strings)
 *
 * @param input - The input string to analyze
 * @returns The detected format or "unknown"
 */
export function detectFormat(input: string): DataFormat {
  if (!input || input.trim() === "") {
    return "unknown";
  }

  // JSON - very specific (must start with { or [)
  if (isJSON(input)) {
    return "json";
  }

  // XML - very specific (must start with <)
  if (isXML(input)) {
    return "xml";
  }

  // TOML - specific syntax patterns
  if (isTOML(input)) {
    return "toml";
  }

  // CSV - check BEFORE YAML to avoid false positives
  // CSV requires consistent column structure
  if (isCSV(input)) {
    return "csv";
  }

  // YAML - checked last because it's most permissive
  // Only returns true if parses to object/array (not plain strings)
  if (isYAML(input)) {
    return "yaml";
  }

  return "unknown";
}

/**
 * Check if input matches a specific format
 * Useful for validation in convert transforms
 *
 * @param input - The input string to check
 * @param expectedFormat - The format to check against
 * @returns true if input matches the expected format
 */
export function isFormat(input: string, expectedFormat: DataFormat): boolean {
  if (expectedFormat === "unknown") {
    return detectFormat(input) === "unknown";
  }

  switch (expectedFormat) {
    case "json":
      return isJSON(input);
    case "csv":
      return isCSV(input);
    case "yaml":
      return isYAML(input);
    case "xml":
      return isXML(input);
    case "toml":
      return isTOML(input);
    default:
      return false;
  }
}
