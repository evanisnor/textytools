/**
 * Base58 encoding and decoding transformations (Bitcoin alphabet)
 */

import bs58 from "bs58";

export function toBase58(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    return bs58.encode(bytes);
  } catch (e) {
    console.error("Base58 encode error:", e);
    return "Error: Invalid input for Base58 encoding";
  }
}

export function fromBase58(str: string): string {
  try {
    const bytes = bs58.decode(str);
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Base58 decode error:", e);
    return "Error: Invalid Base58 string";
  }
}
