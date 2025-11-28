/**
 * URL encoding and decoding transformations
 */

export function toUrlEncoding(str: string): string {
  return encodeURIComponent(str);
}

export function fromUrlEncoding(str: string): string {
  try {
    return decodeURIComponent(str.replace(/\+/g, " "));
  } catch {
    return "Error: Invalid URL encoding";
  }
}
