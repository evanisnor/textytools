/**
 * Morse code encoding and decoding transformations
 */

import { MORSE_CODE, MORSE_DECODE } from "../constants";

export function toMorse(str: string): string {
  return str
    .toUpperCase()
    .split("")
    .map((char) => MORSE_CODE[char] || "")
    .filter((code) => code.length > 0)
    .join(" ");
}

export function fromMorse(str: string): string {
  return str
    .split(/\s+/)
    .filter((code) => code.length > 0)
    .map((code) => MORSE_DECODE[code] || "")
    .join("");
}
