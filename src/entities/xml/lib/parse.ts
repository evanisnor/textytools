/**
 * XML parsing utilities for Apogee transforms
 */

export interface XmlParseResult {
  success: boolean;
  data?: Document;
  error?: string;
}

/**
 * Parse XML string using browser's DOMParser
 */
export function parseXML(input: string): XmlParseResult {
  if (!input || input.trim() === "") {
    return {
      success: false,
      error: "Input is empty",
    };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/xml");

    // Check for parsing errors
    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      return {
        success: false,
        error: `Invalid XML: ${parserError.textContent || "Parse error"}`,
      };
    }

    return {
      success: true,
      data: doc,
    };
  } catch (err) {
    return {
      success: false,
      error: `XML parsing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

/**
 * Validate XML without parsing to Document
 */
export function validateXML(input: string): {
  valid: boolean;
  error?: string;
} {
  const result = parseXML(input);
  return {
    valid: result.success,
    error: result.error,
  };
}
