/**
 * Hexadecimal encoding and decoding transformations
 */

export function toHex(str: string): string {
  return Array.from(str)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");
}

export function fromHex(str: string): string {
  try {
    return str
      .split(/\s+/)
      .filter((hex) => hex.length > 0)
      .map((hex) => String.fromCharCode(parseInt(hex, 16)))
      .join("");
  } catch {
    return "Error: Invalid hexadecimal string";
  }
}
