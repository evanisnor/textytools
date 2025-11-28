/**
 * Types for text encoding transformations
 */

export type EncodingType =
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
  | "quotedPrintable";

export type TransformDirection = "encode" | "decode";

export interface EncodingOption {
  id: EncodingType;
  label: string;
  description: string;
}
