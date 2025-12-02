/**
 * JSON Convert Transform
 * Converts various formats (JSON, CSV, YAML, XML, TOML) to JSON with formatting options
 */

import { detectFormat, parseToIntermediate } from "../../shared";
import type { TransformResult, PropertySchema } from "../../shared/types";

import {
  formatJSON,
  getJSONStats,
  type JsonFormatOptions,
} from "@/entities/json";

/**
 * Property schema for JSON conversion options
 */
export const jsonConvertPropertySchema: PropertySchema[] = [
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
 * Detect input format and parse to intermediate representation
 */
function parseInput(input: string): {
  success: boolean;
  data?: unknown;
  error?: string;
} {
  const format = detectFormat(input);

  if (format === "unknown") {
    return {
      success: false,
      error:
        "Unable to detect input format. Supported: JSON, CSV, YAML, XML, TOML",
    };
  }

  return parseToIntermediate(input, format);
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
