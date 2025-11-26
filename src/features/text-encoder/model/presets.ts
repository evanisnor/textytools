import type { EncodingOption } from "./types";

export const encodingOptions: EncodingOption[] = [
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
