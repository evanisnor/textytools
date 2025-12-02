/**
 * YAML Convert Transform
 * Converts various formats to YAML with formatting options
 */

import { detectFormat, parseToIntermediate } from "../../shared";
import type { TransformResult, PropertySchema } from "../../shared/types";

import {
  formatYAML,
  getYAMLStats,
  type YamlFormatOptions,
} from "@/entities/yaml";

/**
 * Property schema for YAML conversion options
 */
export const yamlConvertPropertySchema: PropertySchema[] = [
  {
    key: "indentation",
    label: "Indentation",
    type: "select",
    options: [
      { value: "2", label: "2 spaces" },
      { value: "4", label: "4 spaces" },
    ],
    defaultValue: "2",
  },
  {
    key: "version",
    label: "YAML Version",
    type: "toggle-group",
    options: [
      { value: "1.1", label: "1.1" },
      { value: "1.2", label: "1.2" },
    ],
    defaultValue: "1.2",
  },
];

/**
 * Default properties for YAML conversion
 */
export const yamlConvertDefaultProperties: Record<string, unknown> = {
  indentation: "2",
  version: "1.2",
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
        "Unable to detect input format. Supported: YAML, JSON, XML, TOML, CSV",
    };
  }

  return parseToIntermediate(input, format);
}

/**
 * Execute YAML conversion transform
 */
export function executeYamlConvert(
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

  const indentation = Number(properties.indentation);
  const version = properties.version as "1.1" | "1.2";

  const formatOptions: YamlFormatOptions = {
    indentation,
    version,
  };

  try {
    const output = formatYAML(parseResult.data, formatOptions);
    const stats = getYAMLStats(parseResult.data);

    return {
      success: true,
      data: output,
      mimeType: "text/yaml",
      stats: [
        { label: "Documents", value: stats.documentCount },
        { label: "Valid", value: stats.valid },
      ],
    };
  } catch (err) {
    return {
      success: false,
      data: "",
      error: `Failed to format YAML: ${err instanceof Error ? err.message : "Unknown error"}`,
      mimeType: "text/plain",
    };
  }
}
