/**
 * Unicode escape sequence encoding and decoding transformations
 */

export function toUnicodeEscape(str: string): string {
  return Array.from(str)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code > 127) {
        return "\\u" + code.toString(16).padStart(4, "0");
      }
      return char;
    })
    .join("");
}

export function fromUnicodeEscape(str: string): string {
  try {
    return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
  } catch {
    return "Error: Invalid Unicode escape sequence";
  }
}
