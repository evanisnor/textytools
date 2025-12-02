/**
 * JSON parsing utilities for Apogee transforms
 */

export interface JsonParseResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Parse JSON with detailed error messages
 */
export function parseJSON(input: string): JsonParseResult {
  if (!input || input.trim() === "") {
    return {
      success: false,
      error: "Input is empty",
    };
  }

  try {
    const data = JSON.parse(input);
    return {
      success: true,
      data,
    };
  } catch (err) {
    // Extract error details for better UX
    const errorMessage =
      err instanceof Error ? err.message : "Unknown parsing error";

    // Try to extract line/column info from error message
    const match = errorMessage.match(/position (\d+)/);
    const position = match ? match[1] : null;

    return {
      success: false,
      error: position
        ? `Invalid JSON at position ${position}: ${errorMessage}`
        : `Invalid JSON: ${errorMessage}`,
    };
  }
}

/**
 * Validate JSON without parsing
 * Returns validation result with error details
 */
export function validateJSON(input: string): {
  valid: boolean;
  error?: string;
} {
  const result = parseJSON(input);
  return {
    valid: result.success,
    error: result.error,
  };
}
