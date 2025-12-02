/**
 * JSON Convert Transform
 * Converts various formats (JSON, CSV, YAML, XML, TOML) to JSON with formatting options
 */

import type { TransformResult, PropertySchema } from "../../shared/types";

import { parseCSV } from "@/entities/csv";
import {
  parseJSON,
  formatJSON,
  getJSONStats,
  type JsonFormatOptions,
} from "@/entities/json";
import { parseTOML } from "@/entities/toml";
import { parseXML, xmlToJSON } from "@/entities/xml";
import { parseYAML } from "@/entities/yaml";

/**
 * Property schema for JSON conversion options
 */
export const jsonConvertPropertySchema: PropertySchema[] = [
  {
    key: "indentation",
    label: "Indentation",
    type: "toggle-group",
    options: [
      { value: "2", label: "2 spaces" },
      { value: "4", label: "4 spaces" },
      { value: "tab", label: "Tab" },
    ],
    defaultValue: "2",
  },
  {
    key: "sortKeys",
    label: "Sort Keys",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "minify",
    label: "Minify",
    type: "toggle",
    defaultValue: false,
  },
];

/**
 * Default properties for JSON conversion
 */
export const jsonConvertDefaultProperties: Record<string, unknown> = {
  indentation: "2",
  sortKeys: false,
  minify: false,
};

/**
 * Detect input format and parse accordingly
 */
function parseInput(input: string): {
  success: boolean;
  data?: unknown;
  error?: string;
} {
  // Try JSON first (most common)
  const jsonResult = parseJSON(input);
  if (jsonResult.success) {
    return { success: true, data: jsonResult.data };
  }

  // Try YAML
  const yamlResult = parseYAML(input);
  if (yamlResult.success) {
    return { success: true, data: yamlResult.data };
  }

  // Try XML
  const xmlResult = parseXML(input);
  if (xmlResult.success && xmlResult.data) {
    const jsonData = xmlToJSON(xmlResult.data);
    return { success: true, data: jsonData };
  }

  // Try TOML
  const tomlResult = parseTOML(input);
  if (tomlResult.success) {
    return { success: true, data: tomlResult.data };
  }

  // Try CSV (last resort, as it's very forgiving)
  try {
    const csvData = parseCSV(input);
    if (csvData.length > 0) {
      return { success: true, data: csvData };
    }
  } catch {
    // CSV parsing failed
  }

  // All parsers failed
  return {
    success: false,
    error:
      "Unable to parse input. Supported formats: JSON, CSV, YAML, XML, TOML",
  };
}

/**
 * Execute JSON conversion transform
 */
export function executeJsonConvert(
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

  // Parse input
  const parseResult = parseInput(input);
  if (!parseResult.success || !parseResult.data) {
    return {
      success: false,
      data: "",
      error: parseResult.error || "Failed to parse input",
      mimeType: "text/plain",
    };
  }

  // Extract formatting options
  const indentationValue = properties.indentation as string;
  const indentation =
    indentationValue === "tab" ? "tab" : Number(indentationValue);
  const sortKeys = properties.sortKeys as boolean;
  const minify = properties.minify as boolean;

  const formatOptions: JsonFormatOptions = {
    indentation,
    sortKeys,
    minify,
  };

  try {
    // Format as JSON
    const output = formatJSON(parseResult.data, formatOptions);

    // Generate stats
    const stats = getJSONStats(parseResult.data);

    return {
      success: true,
      data: output,
      mimeType: "application/json",
      stats: [
        { label: "Keys", value: stats.keyCount },
        { label: "Depth", value: stats.depth },
        { label: "Size", value: `${stats.size} bytes` },
      ],
    };
  } catch (err) {
    return {
      success: false,
      data: "",
      error: `Failed to format JSON: ${err instanceof Error ? err.message : "Unknown error"}`,
      mimeType: "text/plain",
    };
  }
}
