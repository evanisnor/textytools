import bs58 from "bs58";
import { MORSE_CODE, BASE91_ALPHABET, Z85_ALPHABET } from "./constants";
import { md5cycle, md5blk, rhex } from "./hash-utils";

// Base64
export function toBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return "Error: Invalid input for Base64 encoding";
  }
}

// URL Encoding
export function toUrlEncoding(str: string): string {
  return encodeURIComponent(str);
}

// HTML Entities
export function toHtmlEntities(str: string): string {
  return str.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char] || char;
  });
}

// Hexadecimal
export function toHex(str: string): string {
  return Array.from(str)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");
}

// Binary
export function toBinary(str: string): string {
  return Array.from(str)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

// Unicode Escape
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

// ROT13
export function toRot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const start = char <= "Z" ? 65 : 97;
    return String.fromCharCode(
      ((char.charCodeAt(0) - start + 13) % 26) + start,
    );
  });
}

// Morse Code
export function toMorse(str: string): string {
  return str
    .toUpperCase()
    .split("")
    .map((char) => MORSE_CODE[char] || "")
    .filter((code) => code.length > 0)
    .join(" ");
}

// Base58 (Bitcoin alphabet)
export function toBase58(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    return bs58.encode(bytes);
  } catch (e) {
    console.error("Base58 encode error:", e);
    return "Error: Invalid input for Base58 encoding";
  }
}

// Base91
export function toBase91(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let result = "";
    let ebq = 0;
    let en = 0;

    for (let i = 0; i < bytes.length; i++) {
      ebq |= bytes[i] << en;
      en += 8;
      if (en > 13) {
        let ev = ebq & 8191;
        if (ev > 88) {
          ebq >>>= 13;
          en -= 13;
        } else {
          ev = ebq & 16383;
          ebq >>>= 14;
          en -= 14;
        }
        result +=
          BASE91_ALPHABET[ev % 91] + BASE91_ALPHABET[Math.floor(ev / 91)];
      }
    }

    if (en > 0) {
      result += BASE91_ALPHABET[ebq % 91];
      if (en > 7 || ebq > 90) {
        result += BASE91_ALPHABET[Math.floor(ebq / 91)];
      }
    }

    return result;
  } catch {
    return "Error: Invalid input for Base91 encoding";
  }
}

// ASCII85 (Adobe)
export function toAscii85(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let result = "<~";

    for (let i = 0; i < bytes.length; i += 4) {
      let tuple = 0;
      const count = Math.min(4, bytes.length - i);

      for (let j = 0; j < count; j++) {
        tuple = (tuple << 8) | bytes[i + j];
      }

      // Pad with zeros if needed
      for (let j = count; j < 4; j++) {
        tuple = tuple << 8;
      }

      if (count === 4 && tuple === 0) {
        result += "z";
      } else {
        const encoded: string[] = [];
        let tempTuple = tuple;
        for (let j = 0; j < 5; j++) {
          encoded.push(String.fromCharCode(33 + (tempTuple % 85)));
          tempTuple = Math.floor(tempTuple / 85);
        }
        // Only include count + 1 characters for partial groups
        result += encoded
          .reverse()
          .slice(0, count === 4 ? 5 : count + 1)
          .join("");
      }
    }

    result += "~>";
    return result;
  } catch {
    return "Error: Invalid input for ASCII85 encoding";
  }
}

// Z85 (ZeroMQ variant)
export function toZ85(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);

    // Pad to multiple of 4 bytes
    const paddingNeeded = (4 - (bytes.length % 4)) % 4;
    const paddedBytes = new Uint8Array(bytes.length + paddingNeeded);
    paddedBytes.set(bytes);

    let result = "";
    for (let i = 0; i < paddedBytes.length; i += 4) {
      // Use unsigned right shift to prevent negative numbers
      const value =
        paddedBytes[i] * 16777216 +
        paddedBytes[i + 1] * 65536 +
        paddedBytes[i + 2] * 256 +
        paddedBytes[i + 3];

      const encoded: string[] = [];
      let tempValue = value;
      for (let j = 0; j < 5; j++) {
        encoded.push(Z85_ALPHABET[tempValue % 85]);
        tempValue = Math.floor(tempValue / 85);
      }
      result += encoded.reverse().join("");
    }

    return result;
  } catch {
    return "Error: Invalid input for Z85 encoding";
  }
}

// Quoted-Printable (MIME)
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

// MD5 Hash
export function toMd5(str: string): string {
  function md51(s: string) {
    const n = s.length;
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= n; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) {
      tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
    }
    tail[i >> 2] |= 0x80 << (i % 4 << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  try {
    const h = md51(str);
    return rhex(h[0]) + rhex(h[1]) + rhex(h[2]) + rhex(h[3]);
  } catch {
    return "Error: MD5 encoding failed";
  }
}

// SHA Hashes
export async function toSha1(str: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "Error: SHA-1 hashing failed";
  }
}

export async function toSha256(str: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "Error: SHA-256 hashing failed";
  }
}

export async function toSha512(str: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-512", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "Error: SHA-512 hashing failed";
  }
}
