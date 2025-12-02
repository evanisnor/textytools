/**
 * YAML Convert Transform
 * Converts various formats to YAML with formatting options
 */

import type { TransformResult, PropertySchema } from "../../shared/types";

import { parseJSON } from "@/entities/json";
import { parseTOML } from "@/entities/toml";
import { parseXML, xmlToJSON } from "@/entities/xml";
import {
  parseYAML,
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
 * Parse input data
 */
function parseInput(input: string): {
  success: boolean;
  data?: unknown;
  error?: string;
} {
  // Try YAML first
  const yamlResult = parseYAML(input);
  if (yamlResult.success) {
    return { success: true, data: yamlResult.data };
  }

  // Try JSON
  const jsonResult = parseJSON(input);
  if (jsonResult.success) {
    return { success: true, data: jsonResult.data };
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

  return {
    success: false,
    error: "Unable to parse input. Supported formats: YAML, JSON, XML, TOML",
  };
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
