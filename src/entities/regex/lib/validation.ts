/**
 * Regex validation utilities
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Pattern that detects nested quantifiers which can cause catastrophic backtracking
 * Examples: .+)+ or .*)* or [a-z]*}*
 */
const NESTED_QUANTIFIER_PATTERN = /[+*][)}\]]{0,2}[+*?]/;

/**
 * Validate that a regex pattern doesn't contain nested quantifiers
 * that may cause catastrophic backtracking
 */
export function validateNoNestedQuantifiers(pattern: string): ValidationResult {
  if (NESTED_QUANTIFIER_PATTERN.test(pattern)) {
    return {
      isValid: false,
      error:
        "Pattern contains nested quantifiers that may cause catastrophic backtracking",
    };
  }
  return { isValid: true };
}

/**
 * Validate that a regex pattern doesn't match empty strings
 */
export function validateNoEmptyMatches(
  pattern: string,
  flags: string,
): ValidationResult {
  try {
    const regex = new RegExp(pattern, flags);
    if (regex.test("")) {
      return {
        isValid: false,
        error: "Pattern matches empty strings",
      };
    }
    return { isValid: true };
  } catch (err) {
    return {
      isValid: false,
      error: `Invalid regex: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Validate a regex pattern with all standard checks
 */
export function validatePattern(
  pattern: string,
  flags: string,
): ValidationResult {
  // Check for nested quantifiers
  const quantifierCheck = validateNoNestedQuantifiers(pattern);
  if (!quantifierCheck.isValid) {
    return quantifierCheck;
  }

  // Check for empty matches
  const emptyCheck = validateNoEmptyMatches(pattern, flags);
  if (!emptyCheck.isValid) {
    return emptyCheck;
  }

  return { isValid: true };
}
