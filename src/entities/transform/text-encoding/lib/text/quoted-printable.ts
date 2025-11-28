/**
 * Quoted-Printable (MIME) encoding and decoding transformations
 */

export function toQuotedPrintable(str: string): string {
  let result = "";
  let lineLength = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const code = char.charCodeAt(0);

    // Handle line breaks - preserve them but reset line length
    if (char === "\r" || char === "\n") {
      result += char;
      lineLength = 0;
    }
    // Safe printable characters (excluding = which is the escape char)
    else if (
      (code >= 33 && code <= 60) || // ! to <
      (code >= 62 && code <= 126) // > to ~
    ) {
      if (lineLength >= 75) {
        result += "=\r\n";
        lineLength = 0;
      }
      result += char;
      lineLength++;
    }
    // Space and tab need special handling (encode if at end of line)
    else if (char === " " || char === "\t") {
      // Check if this is the last char or followed by newline
      const nextChar = i + 1 < str.length ? str[i + 1] : null;
      if (nextChar === "\r" || nextChar === "\n" || nextChar === null) {
        // Encode trailing whitespace
        const hex = code.toString(16).toUpperCase().padStart(2, "0");
        if (lineLength + 3 > 76) {
          result += "=\r\n";
          lineLength = 0;
        }
        result += "=" + hex;
        lineLength += 3;
      } else {
        if (lineLength >= 75) {
          result += "=\r\n";
          lineLength = 0;
        }
        result += char;
        lineLength++;
      }
    }
    // Everything else must be encoded
    else {
      const hex = code.toString(16).toUpperCase().padStart(2, "0");
      if (lineLength + 3 > 76) {
        result += "=\r\n";
        lineLength = 0;
      }
      result += "=" + hex;
      lineLength += 3;
    }
  }

  return result;
}

export function fromQuotedPrintable(str: string): string {
  try {
    return str
      .replace(/=\r\n/g, "") // Remove soft line breaks
      .replace(/=([0-9A-F]{2})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      );
  } catch {
    return "Error: Invalid Quoted-Printable string";
  }
}
