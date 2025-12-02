/**
 * YAML parsing utilities for Apogee transforms
 */

import * as yaml from "js-yaml";

export interface YamlParseResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Parse YAML with detailed error messages
 */
export function parseYAML(input: string): YamlParseResult {
  if (!input || input.trim() === "") {
    return {
      success: false,
      error: "Input is empty",
    };
  }

  try {
    const data = yaml.load(input);
    return {
      success: true,
      data,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown parsing error";
    return {
      success: false,
      error: `Invalid YAML: ${errorMessage}`,
    };
  }
}

/**
 * Validate YAML without parsing
 */
export function validateYAML(input: string): {
  valid: boolean;
  error?: string;
} {
  const result = parseYAML(input);
  return {
    valid: result.success,
    error: result.error,
  };
}
