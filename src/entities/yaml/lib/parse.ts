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

/**
 * Detect if input is likely YAML
 * Checks for YAML-specific syntax patterns
 */
export function isYAML(input: string): boolean {
  if (!input || input.trim() === "") {
    return false;
  }

  const trimmed = input.trim();

  // Common YAML indicators
  const yamlPatterns = [
    /^---/, // Document start
    /^[\w-]+:\s/, // Key-value pairs
    /^\s*-\s+\w/, // List items
    /^%YAML/, // YAML directive
  ];

  // Check if any YAML pattern matches
  const hasYamlSyntax = yamlPatterns.some((pattern) => pattern.test(trimmed));

  if (!hasYamlSyntax) {
    return false;
  }

  // Try to parse - YAML should parse to an object or array
  try {
    const data = yaml.load(trimmed);
    // Only accept structured YAML (objects or arrays), not plain strings
    return typeof data === "object" && data !== null;
  } catch {
    return false;
  }
}
