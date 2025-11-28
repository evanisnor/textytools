/**
 * Base91 encoding and decoding transformations
 */

import { BASE91_ALPHABET } from "../constants";

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
