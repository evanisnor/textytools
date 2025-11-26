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
  | "quotedPrintable"
  | "md5"
  | "sha1"
  | "sha256"
  | "sha512";

export interface EncodingOption {
  id: EncodingType;
  label: string;
  description: string;
}

export type EncodingMode = "encode" | "decode";
