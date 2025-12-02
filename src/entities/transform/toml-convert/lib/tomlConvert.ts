/**
 * TOML Convert Transform
 * Converts various formats to TOML with formatting options
 */

import { detectFormat, parseToIntermediate } from "../../shared";
import type { TransformResult, PropertySchema } from "../../shared/types";

import {
  formatTOML,
  getTOMLStats,
  type TomlFormatOptions,
} from "@/entities/toml";

/**
 * Property schema for TOML conversion options
 */
export const tomlConvertPropertySchema: PropertySchema[] = [
  {
    key: "formatting",
    label: "Formatting",
    type: "toggle-group",
    options: [
      { value: "expanded", label: "Expanded" },
      { value: "compact", label: "Compact" },
    ],
    defaultValue: "expanded",
  },
];

/**
 * Default properties for TOML conversion
 */
export const tomlConvertDefaultProperties: Record<string, unknown> = {
  formatting: "expanded",
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
        "Unable to detect input format. Supported: TOML, JSON, YAML, XML, CSV",
    };
  }

  return parseToIntermediate(input, format);
}

/**
 * Execute TOML conversion transform
 */
export function executeTomlConvert(
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

  const parseResult = parseInput(input);
  if (!parseResult.success || !parseResult.data) {
    return {
      success: false,
      data: "",
      error: parseResult.error || "Failed to parse input",
      mimeType: "text/plain",
    };
  }

  const formatting = properties.formatting as "compact" | "expanded";

  const formatOptions: TomlFormatOptions = {
    formatting,
  };

  try {
    const output = formatTOML(parseResult.data, formatOptions);
    const stats = getTOMLStats(parseResult.data);

    return {
      success: true,
      data: output,
      mimeType: "application/toml",
      stats: [
        { label: "Tables", value: stats.tableCount },
        { label: "Valid", value: stats.valid },
      ],
    };
  } catch (err) {
    return {
      success: false,
      data: "",
      error: `Failed to format TOML: ${err instanceof Error ? err.message : "Unknown error"}`,
      mimeType: "text/plain",
    };
  }
}
