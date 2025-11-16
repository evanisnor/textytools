"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import bs58 from "bs58";

type EncodingType =
  | "base64"
  | "base58"
  | "base91"
  | "ascii85"
  | "z85"
  | "url"
  | "html"
  | "hex"
  | "binary"
  | "unicode"
  | "rot13"
  | "morse"
  | "quotedPrintable"
  | "md5"
  | "sha1"
  | "sha256"
  | "sha512";

interface EncodingOption {
  id: EncodingType;
  label: string;
  description: string;
}

const encodingOptions: EncodingOption[] = [
  { id: "base64", label: "Base64", description: "Standard Base64 encoding" },
  {
    id: "base58",
    label: "Base58",
    description: "Bitcoin-style Base58 encoding",
  },
  { id: "base91", label: "Base91", description: "Efficient Base91 encoding" },
  {
    id: "ascii85",
    label: "ASCII85",
    description: "Adobe ASCII85 (Base85) encoding",
  },
  { id: "z85", label: "Z85", description: "ZeroMQ Base85 variant" },
  {
    id: "url",
    label: "URL Encoding",
    description: "Percent-encoded URL-safe format",
  },
  {
    id: "html",
    label: "HTML Entities",
    description: "HTML character entity encoding",
  },
  {
    id: "hex",
    label: "Hexadecimal",
    description: "Hex representation of bytes",
  },
  {
    id: "binary",
    label: "Binary",
    description: "8-bit binary representation",
  },
  {
    id: "unicode",
    label: "Unicode Escape",
    description: "\\uXXXX escape sequences",
  },
  {
    id: "quotedPrintable",
    label: "Quoted-Printable",
    description: "MIME quoted-printable encoding",
  },
  {
    id: "rot13",
    label: "ROT13",
    description: "Caesar cipher with 13-character shift",
  },
  {
    id: "morse",
    label: "Morse Code",
    description: "International Morse code",
  },
  {
    id: "md5",
    label: "MD5 Hash",
    description: "MD5 cryptographic hash (one-way)",
  },
  {
    id: "sha1",
    label: "SHA-1 Hash",
    description: "SHA-1 cryptographic hash (one-way)",
  },
  {
    id: "sha256",
    label: "SHA-256 Hash",
    description: "SHA-256 cryptographic hash (one-way)",
  },
  {
    id: "sha512",
    label: "SHA-512 Hash",
    description: "SHA-512 cryptographic hash (one-way)",
  },
];

// Encoding functions
function toBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return "Error: Invalid input for Base64 encoding";
  }
}

function fromBase64(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str.trim())));
  } catch {
    return "Error: Invalid Base64 string";
  }
}

function toUrlEncoding(str: string): string {
  return encodeURIComponent(str);
}

function fromUrlEncoding(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return "Error: Invalid URL encoding";
  }
}

function toHtmlEntities(str: string): string {
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

function fromHtmlEntities(str: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
}

function toHex(str: string): string {
  return Array.from(str)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");
}

function fromHex(str: string): string {
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

function toBinary(str: string): string {
  return Array.from(str)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function fromBinary(str: string): string {
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

function toUnicodeEscape(str: string): string {
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

function fromUnicodeEscape(str: string): string {
  try {
    return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
  } catch {
    return "Error: Invalid Unicode escape sequence";
  }
}

function toRot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const start = char <= "Z" ? 65 : 97;
    return String.fromCharCode(
      ((char.charCodeAt(0) - start + 13) % 26) + start,
    );
  });
}

// ROT13 is its own inverse
const fromRot13 = toRot13;

const MORSE_CODE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
  " ": "/",
};

const MORSE_DECODE = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k]),
);

function toMorse(str: string): string {
  return str
    .toUpperCase()
    .split("")
    .map((char) => MORSE_CODE[char] || "")
    .filter((code) => code.length > 0)
    .join(" ");
}

function fromMorse(str: string): string {
  return str
    .split(/\s+/)
    .filter((code) => code.length > 0)
    .map((code) => MORSE_DECODE[code] || "")
    .join("");
}

// Base58 (Bitcoin alphabet)
function toBase58(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    return bs58.encode(bytes);
  } catch (e) {
    console.error("Base58 encode error:", e);
    return "Error: Invalid input for Base58 encoding";
  }
}

function fromBase58(str: string): string {
  try {
    const bytes = bs58.decode(str);
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Base58 decode error:", e);
    return "Error: Invalid Base58 string";
  }
}

// Base91
const BASE91_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';

function toBase91(str: string): string {
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

function fromBase91(str: string): string {
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

// ASCII85 (Adobe)
function toAscii85(str: string): string {
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

function fromAscii85(str: string): string {
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

// Z85 (ZeroMQ variant)
const Z85_ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#";

function toZ85(str: string): string {
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

function fromZ85(str: string): string {
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

// Quoted-Printable (MIME)
function toQuotedPrintable(str: string): string {
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

function fromQuotedPrintable(str: string): string {
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

// Hashing functions (one-way only)
function toMd5(str: string): string {
  // MD5 implementation (pure JavaScript)
  function md5cycle(x: number[], k: number[]) {
    let a = x[0],
      b = x[1],
      c = x[2],
      d = x[3];
    a += (((b & c) | (~b & d)) + k[0] - 680876936) | 0;
    a = (((a << 7) | (a >>> 25)) + b) | 0;
    d += (((a & b) | (~a & c)) + k[1] - 389564586) | 0;
    d = (((d << 12) | (d >>> 20)) + a) | 0;
    c += (((d & a) | (~d & b)) + k[2] + 606105819) | 0;
    c = (((c << 17) | (c >>> 15)) + d) | 0;
    b += (((c & d) | (~c & a)) + k[3] - 1044525330) | 0;
    b = (((b << 22) | (b >>> 10)) + c) | 0;
    a += (((b & c) | (~b & d)) + k[4] - 176418897) | 0;
    a = (((a << 7) | (a >>> 25)) + b) | 0;
    d += (((a & b) | (~a & c)) + k[5] + 1200080426) | 0;
    d = (((d << 12) | (d >>> 20)) + a) | 0;
    c += (((d & a) | (~d & b)) + k[6] - 1473231341) | 0;
    c = (((c << 17) | (c >>> 15)) + d) | 0;
    b += (((c & d) | (~c & a)) + k[7] - 45705983) | 0;
    b = (((b << 22) | (b >>> 10)) + c) | 0;
    a += (((b & c) | (~b & d)) + k[8] + 1770035416) | 0;
    a = (((a << 7) | (a >>> 25)) + b) | 0;
    d += (((a & b) | (~a & c)) + k[9] - 1958414417) | 0;
    d = (((d << 12) | (d >>> 20)) + a) | 0;
    c += (((d & a) | (~d & b)) + k[10] - 42063) | 0;
    c = (((c << 17) | (c >>> 15)) + d) | 0;
    b += (((c & d) | (~c & a)) + k[11] - 1990404162) | 0;
    b = (((b << 22) | (b >>> 10)) + c) | 0;
    a += (((b & c) | (~b & d)) + k[12] + 1804603682) | 0;
    a = (((a << 7) | (a >>> 25)) + b) | 0;
    d += (((a & b) | (~a & c)) + k[13] - 40341101) | 0;
    d = (((d << 12) | (d >>> 20)) + a) | 0;
    c += (((d & a) | (~d & b)) + k[14] - 1502002290) | 0;
    c = (((c << 17) | (c >>> 15)) + d) | 0;
    b += (((c & d) | (~c & a)) + k[15] + 1236535329) | 0;
    b = (((b << 22) | (b >>> 10)) + c) | 0;
    a += (((b & d) | (c & ~d)) + k[1] - 165796510) | 0;
    a = (((a << 5) | (a >>> 27)) + b) | 0;
    d += (((a & c) | (b & ~c)) + k[6] - 1069501632) | 0;
    d = (((d << 9) | (d >>> 23)) + a) | 0;
    c += (((d & b) | (a & ~b)) + k[11] + 643717713) | 0;
    c = (((c << 14) | (c >>> 18)) + d) | 0;
    b += (((c & a) | (d & ~a)) + k[0] - 373897302) | 0;
    b = (((b << 20) | (b >>> 12)) + c) | 0;
    a += (((b & d) | (c & ~d)) + k[5] - 701558691) | 0;
    a = (((a << 5) | (a >>> 27)) + b) | 0;
    d += (((a & c) | (b & ~c)) + k[10] + 38016083) | 0;
    d = (((d << 9) | (d >>> 23)) + a) | 0;
    c += (((d & b) | (a & ~b)) + k[15] - 660478335) | 0;
    c = (((c << 14) | (c >>> 18)) + d) | 0;
    b += (((c & a) | (d & ~a)) + k[4] - 405537848) | 0;
    b = (((b << 20) | (b >>> 12)) + c) | 0;
    a += (((b & d) | (c & ~d)) + k[9] + 568446438) | 0;
    a = (((a << 5) | (a >>> 27)) + b) | 0;
    d += (((a & c) | (b & ~c)) + k[14] - 1019803690) | 0;
    d = (((d << 9) | (d >>> 23)) + a) | 0;
    c += (((d & b) | (a & ~b)) + k[3] - 187363961) | 0;
    c = (((c << 14) | (c >>> 18)) + d) | 0;
    b += (((c & a) | (d & ~a)) + k[8] + 1163531501) | 0;
    b = (((b << 20) | (b >>> 12)) + c) | 0;
    a += (((b & d) | (c & ~d)) + k[13] - 1444681467) | 0;
    a = (((a << 5) | (a >>> 27)) + b) | 0;
    d += (((a & c) | (b & ~c)) + k[2] - 51403784) | 0;
    d = (((d << 9) | (d >>> 23)) + a) | 0;
    c += (((d & b) | (a & ~b)) + k[7] + 1735328473) | 0;
    c = (((c << 14) | (c >>> 18)) + d) | 0;
    b += (((c & a) | (d & ~a)) + k[12] - 1926607734) | 0;
    b = (((b << 20) | (b >>> 12)) + c) | 0;
    a += ((b ^ c ^ d) + k[5] - 378558) | 0;
    a = (((a << 4) | (a >>> 28)) + b) | 0;
    d += ((a ^ b ^ c) + k[8] - 2022574463) | 0;
    d = (((d << 11) | (d >>> 21)) + a) | 0;
    c += ((d ^ a ^ b) + k[11] + 1839030562) | 0;
    c = (((c << 16) | (c >>> 16)) + d) | 0;
    b += ((c ^ d ^ a) + k[14] - 35309556) | 0;
    b = (((b << 23) | (b >>> 9)) + c) | 0;
    a += ((b ^ c ^ d) + k[1] - 1530992060) | 0;
    a = (((a << 4) | (a >>> 28)) + b) | 0;
    d += ((a ^ b ^ c) + k[4] + 1272893353) | 0;
    d = (((d << 11) | (d >>> 21)) + a) | 0;
    c += ((d ^ a ^ b) + k[7] - 155497632) | 0;
    c = (((c << 16) | (c >>> 16)) + d) | 0;
    b += ((c ^ d ^ a) + k[10] - 1094730640) | 0;
    b = (((b << 23) | (b >>> 9)) + c) | 0;
    a += ((b ^ c ^ d) + k[13] + 681279174) | 0;
    a = (((a << 4) | (a >>> 28)) + b) | 0;
    d += ((a ^ b ^ c) + k[0] - 358537222) | 0;
    d = (((d << 11) | (d >>> 21)) + a) | 0;
    c += ((d ^ a ^ b) + k[3] - 722521979) | 0;
    c = (((c << 16) | (c >>> 16)) + d) | 0;
    b += ((c ^ d ^ a) + k[6] + 76029189) | 0;
    b = (((b << 23) | (b >>> 9)) + c) | 0;
    a += ((b ^ c ^ d) + k[9] - 640364487) | 0;
    a = (((a << 4) | (a >>> 28)) + b) | 0;
    d += ((a ^ b ^ c) + k[12] - 421815835) | 0;
    d = (((d << 11) | (d >>> 21)) + a) | 0;
    c += ((d ^ a ^ b) + k[15] + 530742520) | 0;
    c = (((c << 16) | (c >>> 16)) + d) | 0;
    b += ((c ^ d ^ a) + k[2] - 995338651) | 0;
    b = (((b << 23) | (b >>> 9)) + c) | 0;
    a += ((c ^ (b | ~d)) + k[0] - 198630844) | 0;
    a = (((a << 6) | (a >>> 26)) + b) | 0;
    d += ((b ^ (a | ~c)) + k[7] + 1126891415) | 0;
    d = (((d << 10) | (d >>> 22)) + a) | 0;
    c += ((a ^ (d | ~b)) + k[14] - 1416354905) | 0;
    c = (((c << 15) | (c >>> 17)) + d) | 0;
    b += ((d ^ (c | ~a)) + k[5] - 57434055) | 0;
    b = (((b << 21) | (b >>> 11)) + c) | 0;
    a += ((c ^ (b | ~d)) + k[12] + 1700485571) | 0;
    a = (((a << 6) | (a >>> 26)) + b) | 0;
    d += ((b ^ (a | ~c)) + k[3] - 1894986606) | 0;
    d = (((d << 10) | (d >>> 22)) + a) | 0;
    c += ((a ^ (d | ~b)) + k[10] - 1051523) | 0;
    c = (((c << 15) | (c >>> 17)) + d) | 0;
    b += ((d ^ (c | ~a)) + k[1] - 2054922799) | 0;
    b = (((b << 21) | (b >>> 11)) + c) | 0;
    a += ((c ^ (b | ~d)) + k[8] + 1873313359) | 0;
    a = (((a << 6) | (a >>> 26)) + b) | 0;
    d += ((b ^ (a | ~c)) + k[15] - 30611744) | 0;
    d = (((d << 10) | (d >>> 22)) + a) | 0;
    c += ((a ^ (d | ~b)) + k[6] - 1560198380) | 0;
    c = (((c << 15) | (c >>> 17)) + d) | 0;
    b += ((d ^ (c | ~a)) + k[13] + 1309151649) | 0;
    b = (((b << 21) | (b >>> 11)) + c) | 0;
    a += ((c ^ (b | ~d)) + k[4] - 145523070) | 0;
    a = (((a << 6) | (a >>> 26)) + b) | 0;
    d += ((b ^ (a | ~c)) + k[11] - 1120210379) | 0;
    d = (((d << 10) | (d >>> 22)) + a) | 0;
    c += ((a ^ (d | ~b)) + k[2] + 718787259) | 0;
    c = (((c << 15) | (c >>> 17)) + d) | 0;
    b += ((d ^ (c | ~a)) + k[9] - 343485551) | 0;
    b = (((b << 21) | (b >>> 11)) + c) | 0;
    x[0] = (a + x[0]) | 0;
    x[1] = (b + x[1]) | 0;
    x[2] = (c + x[2]) | 0;
    x[3] = (d + x[3]) | 0;
  }

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

  function md5blk(s: string) {
    const md5blks = [];
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] =
        s.charCodeAt(i) +
        (s.charCodeAt(i + 1) << 8) +
        (s.charCodeAt(i + 2) << 16) +
        (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  function rhex(n: number) {
    let s = "";
    for (let j = 0; j < 4; j++) {
      s +=
        "0" +
        ((n >> (j * 8 + 4)) & 0x0f).toString(16) +
        ("0" + ((n >> (j * 8)) & 0x0f).toString(16));
    }
    return s.substring(1);
  }

  try {
    const h = md51(str);
    return rhex(h[0]) + rhex(h[1]) + rhex(h[2]) + rhex(h[3]);
  } catch {
    return "Error: MD5 encoding failed";
  }
}

async function toSha1(str: string): Promise<string> {
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

async function toSha256(str: string): Promise<string> {
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

async function toSha512(str: string): Promise<string> {
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

async function encode(text: string, type: EncodingType): Promise<string> {
  if (!text) return "";

  switch (type) {
    case "base64":
      return toBase64(text);
    case "base58":
      return toBase58(text);
    case "base91":
      return toBase91(text);
    case "ascii85":
      return toAscii85(text);
    case "z85":
      return toZ85(text);
    case "url":
      return toUrlEncoding(text);
    case "html":
      return toHtmlEntities(text);
    case "hex":
      return toHex(text);
    case "binary":
      return toBinary(text);
    case "unicode":
      return toUnicodeEscape(text);
    case "quotedPrintable":
      return toQuotedPrintable(text);
    case "rot13":
      return toRot13(text);
    case "morse":
      return toMorse(text);
    case "md5":
      return toMd5(text);
    case "sha1":
      return await toSha1(text);
    case "sha256":
      return await toSha256(text);
    case "sha512":
      return await toSha512(text);
    default:
      return text;
  }
}

function decode(text: string, type: EncodingType): string {
  if (!text) return "";

  // Hash functions are one-way only
  if (["md5", "sha1", "sha256", "sha512"].includes(type)) {
    return "Error: Hash functions are one-way only (cannot be decoded)";
  }

  switch (type) {
    case "base64":
      return fromBase64(text);
    case "base58":
      return fromBase58(text);
    case "base91":
      return fromBase91(text);
    case "ascii85":
      return fromAscii85(text);
    case "z85":
      return fromZ85(text);
    case "url":
      return fromUrlEncoding(text);
    case "html":
      return fromHtmlEntities(text);
    case "hex":
      return fromHex(text);
    case "binary":
      return fromBinary(text);
    case "unicode":
      return fromUnicodeEscape(text);
    case "quotedPrintable":
      return fromQuotedPrintable(text);
    case "rot13":
      return fromRot13(text);
    case "morse":
      return fromMorse(text);
    default:
      return text;
  }
}

export default function TextEncoderPage() {
  const [text, setText] = useState("");
  const [selectedEncoding, setSelectedEncoding] =
    useState<EncodingType>("base64");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [outputText, setOutputText] = useState("");

  const handleModeChange = (newMode: "encode" | "decode") => {
    setMode(newMode);
    // Switch to base64 if switching to decode mode with a hash function selected
    const hashFunctions: EncodingType[] = ["md5", "sha1", "sha256", "sha512"];
    if (newMode === "decode" && hashFunctions.includes(selectedEncoding)) {
      setSelectedEncoding("base64");
    }
  };

  // Update output when inputs change
  useEffect(() => {
    const updateOutput = async () => {
      if (mode === "encode") {
        const result = await encode(text, selectedEncoding);
        setOutputText(result);
      } else {
        const result = decode(text, selectedEncoding);
        setOutputText(result);
      }
    };
    updateOutput();
  }, [text, selectedEncoding, mode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Text Encoder
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Encode and decode text using various formats including Base64, URL,
            Hex, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleModeChange("encode")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === "encode"
                    ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                    : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => handleModeChange("decode")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === "decode"
                    ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                    : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                Decode
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {mode === "encode" ? "Plain Text" : "Encoded Text"}
                </label>
                {text.trim() && (
                  <button
                    onClick={() => setText("")}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    mode === "encode"
                      ? "Enter text to encode..."
                      : "Enter encoded text to decode..."
                  }
                  className="w-full h-48 p-4 bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none focus:outline-none font-mono text-sm"
                  spellCheck={false}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {mode === "encode" ? "Encoded Output" : "Decoded Output"}
                </label>
                {outputText && !outputText.startsWith("Error:") && (
                  <button
                    onClick={copyToClipboard}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                  >
                    Copy to clipboard
                  </button>
                )}
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
                <div
                  className={`w-full h-48 p-4 overflow-auto font-mono text-sm whitespace-pre-wrap wrap-break-word ${
                    outputText.startsWith("Error:")
                      ? "text-red-600 dark:text-red-400"
                      : "text-zinc-900 dark:text-zinc-50"
                  }`}
                >
                  {outputText || (
                    <span className="text-zinc-400 dark:text-zinc-600">
                      {mode === "encode"
                        ? "Encoded output will appear here..."
                        : "Decoded output will appear here..."}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
              Select Encoding Format
            </label>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {encodingOptions.map((option) => {
                const isHashFunction = [
                  "md5",
                  "sha1",
                  "sha256",
                  "sha512",
                ].includes(option.id);
                const isDisabled = mode === "decode" && isHashFunction;

                return (
                  <button
                    key={option.id}
                    onClick={() =>
                      !isDisabled && setSelectedEncoding(option.id)
                    }
                    disabled={isDisabled}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                        : selectedEncoding === option.id
                          ? "border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-800"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                      {option.label}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      {option.description}
                      {isDisabled && " (encode only)"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
