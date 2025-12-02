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
