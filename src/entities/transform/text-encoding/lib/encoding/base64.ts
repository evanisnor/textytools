/**
 * Base64 encoding and decoding transformations
 */

export function toBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return "Error: Invalid input for Base64 encoding";
  }
}

export function fromBase64(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str.trim())));
  } catch {
    return "Error: Invalid Base64 string";
  }
}
