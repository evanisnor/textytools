/**
 * Z85 (ZeroMQ variant) encoding and decoding transformations
 */

import { Z85_ALPHABET } from "../constants";

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

      bytes.push((value >> 24) & 0xff);
      bytes.push((value >> 16) & 0xff);
      bytes.push((value >> 8) & 0xff);
      bytes.push(value & 0xff);
    }

    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return "Error: Invalid Z85 string";
  }
}
