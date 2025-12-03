/**
 * Detects if a string is a valid JWT token
 */

/**
 * Check if a string is a valid JWT token
 *
 * A JWT consists of three base64url-encoded parts separated by dots:
 * header.payload.signature
 *
 * @param input - String to check
 * @returns true if the input appears to be a JWT
 */
export function isJWT(input: string): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  const trimmed = input.trim();

  // JWT must have exactly 2 dots (3 parts)
  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return false;
  }

  // Each part should be non-empty and contain only base64url characters
  // Base64url uses: A-Z, a-z, 0-9, -, _
  const base64urlPattern = /^[A-Za-z0-9_-]+$/;

  for (const part of parts) {
    if (!part || !base64urlPattern.test(part)) {
      return false;
    }
  }

  // Try to decode the header to verify it's valid JSON with typical JWT fields
  try {
    const header = JSON.parse(
      atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")),
    );

    // Header should be an object with at least a "typ" or "alg" field
    if (typeof header !== "object" || header === null) {
      return false;
    }

    // Check for typical JWT header fields
    const hasTyp = "typ" in header;
    const hasAlg = "alg" in header;

    return hasTyp || hasAlg;
  } catch {
    // If we can't decode the header, it's not a valid JWT
    return false;
  }
}
