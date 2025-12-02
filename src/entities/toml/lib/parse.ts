/**
 * TOML parsing utilities for Apogee transforms
 */

import * as TOML from "@iarna/toml";

export interface TomlParseResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Parse TOML with detailed error messages
 */
export function parseTOML(input: string): TomlParseResult {
  if (!input || input.trim() === "") {
    return {
      success: false,
      error: "Input is empty",
    };
  }

  try {
    const data = TOML.parse(input);
    return {
      success: true,
      data,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown parsing error";
    return {
      success: false,
      error: `Invalid TOML: ${errorMessage}`,
    };
  }
}

/**
 * Validate TOML without parsing
 */
export function validateTOML(input: string): {
  valid: boolean;
  error?: string;
} {
  const result = parseTOML(input);
  return {
    valid: result.success,
    error: result.error,
  };
}

/**
 * Detect if input is likely TOML
 * Checks for TOML-specific syntax patterns
 */
export function isTOML(input: string): boolean {
  if (!input || input.trim() === "") {
    return false;
  }

  const trimmed = input.trim();

  // Common TOML indicators
  const tomlPatterns = [
    /^\[[\w.-]+\]/, // Section headers [section.name]
    /^[\w-]+\s*=\s*/, // Key-value pairs
    /^\[\[[\w.-]+\]\]/, // Array of tables
  ];

  // Check if any TOML pattern matches
  const hasTomlSyntax = tomlPatterns.some((pattern) => pattern.test(trimmed));

  if (!hasTomlSyntax) {
    return false;
  }

  // Try to parse
  const result = parseTOML(trimmed);
  return result.success;
}
