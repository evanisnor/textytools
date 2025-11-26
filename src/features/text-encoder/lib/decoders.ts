import bs58 from "bs58";
import { MORSE_DECODE, BASE91_ALPHABET, Z85_ALPHABET } from "./constants";
import { toRot13 } from "./encoders";

// Base64
export function fromBase64(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str.trim())));
  } catch {
    return "Error: Invalid Base64 string";
  }
}

// URL Encoding
export function fromUrlEncoding(str: string): string {
  try {
    return decodeURIComponent(str.replace(/\+/g, " "));
  } catch {
    return "Error: Invalid URL encoding";
  }
}

// HTML Entities
export function fromHtmlEntities(str: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
}

// Hexadecimal
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

// Binary
export function fromBinary(str: string): string {
  try {
    return str
      .split(/\s+/)
      .filter((bin) => bin.length > 0)
      .map((bin) => String.fromCharCode(parseInt(bin, 2)))
      .join("");
  } catch {
    return "Error: Invalid binary string";
  }
}

// Unicode Escape
export function fromUnicodeEscape(str: string): string {
  try {
    return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
  } catch {
    return "Error: Invalid Unicode escape sequence";
  }
}

// ROT13 is its own inverse
export const fromRot13 = toRot13;

// Morse Code
export function fromMorse(str: string): string {
  return str
    .split(/\s+/)
    .filter((code) => code.length > 0)
    .map((code) => MORSE_DECODE[code] || "")
    .join("");
}

// Base58
export function fromBase58(str: string): string {
  try {
    const bytes = bs58.decode(str);
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Base58 decode error:", e);
    return "Error: Invalid Base58 string";
  }
}

// Base91
export function fromBase91(str: string): string {
  try {
    const bytes: number[] = [];
    let dbq = 0;
    let dn = 0;
    let dv = -1;

    for (let i = 0; i < str.length; i++) {
      const c = BASE91_ALPHABET.indexOf(str[i]);
      if (c < 0) {
        return "Error: Invalid Base91 character";
      }
      if (dv < 0) {
        dv = c;
      } else {
        dv += c * 91;
        dbq |= dv << dn;
        dn += (dv & 8191) > 88 ? 13 : 14;
        do {
          bytes.push(dbq & 0xff);
          dbq >>>= 8;
          dn -= 8;
        } while (dn > 7);
        dv = -1;
      }
    }

    if (dv >= 0) {
      bytes.push((dbq | (dv << dn)) & 0xff);
    }

    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return "Error: Invalid Base91 string";
  }
}

// ASCII85
export function fromAscii85(str: string): string {
  try {
    str = str.trim();
    if (!str.startsWith("<~") || !str.endsWith("~>")) {
      return "Error: Invalid ASCII85 format (missing delimiters)";
    }

    str = str.slice(2, -2);
    const bytes: number[] = [];
    let tuple = 0;
    let count = 0;

    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (c === "z") {
        if (count !== 0) {
          return "Error: Invalid ASCII85 (z in wrong position)";
        }
        bytes.push(0, 0, 0, 0);
        continue;
      }

      if (c < "!" || c > "u") {
        if (!/\s/.test(c)) {
          return "Error: Invalid ASCII85 character";
        }
        continue;
      }

      tuple = tuple * 85 + (c.charCodeAt(0) - 33);
      count++;

      if (count === 5) {
        for (let j = 3; j >= 0; j--) {
          bytes.push((tuple >> (j * 8)) & 0xff);
        }
        tuple = 0;
        count = 0;
      }
    }

    if (count > 0) {
      for (let i = count; i < 5; i++) {
        tuple = tuple * 85 + 84;
      }
      for (let j = 3; j >= 5 - count; j--) {
        bytes.push((tuple >> (j * 8)) & 0xff);
      }
    }

    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return "Error: Invalid ASCII85 string";
  }
}

// Z85
export function fromZ85(str: string): string {
  try {
    if (str.length % 5 !== 0) {
      return "Error: Invalid Z85 length (must be multiple of 5)";
    }

    const bytes: number[] = [];
    for (let i = 0; i < str.length; i += 5) {
      let value = 0;
      for (let j = 0; j < 5; j++) {
        const idx = Z85_ALPHABET.indexOf(str[i + j]);
        if (idx < 0) {
          return "Error: Invalid Z85 character";
        }
        value = value * 85 + idx;
      }
      bytes.push((value >>> 24) & 0xff);
      bytes.push((value >>> 16) & 0xff);
      bytes.push((value >>> 8) & 0xff);
      bytes.push(value & 0xff);
    }

    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return "Error: Invalid Z85 string";
  }
}

// Quoted-Printable
export function fromQuotedPrintable(str: string): string {
  try {
    return str
      .replace(/=\r\n/g, "")
      .replace(/=\n/g, "")
      .replace(/=([0-9A-F]{2})/gi, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      );
  } catch {
    return "Error: Invalid Quoted-Printable string";
  }
}
