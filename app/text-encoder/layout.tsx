import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Encoder - Encode, decode, and hash text formats",
  description:
    "Encode and decode text using 17 different formats: Base64, Base58, Base91, ASCII85, Z85, URL encoding, HTML entities, hexadecimal, binary, Unicode, ROT13, Morse code, MD5, SHA-1, SHA-256, SHA-512. Free browser-based text encoder.",
  keywords: [
    "text encoder",
    "base64 encode",
    "base64 decode",
    "url encode",
    "url decode",
    "hex encode",
    "hex decode",
    "rot13",
    "morse code",
    "encode decode",
    "hash generator",
    "md5 sha1 sha256",
    "binary converter",
    "textytools",
  ],
  openGraph: {
    title: "Text Encoder - Encode, decode, and hash text formats",
    description: "Encode and decode text using 17 different encoding formats.",
  },
  alternates: {
    canonical: "https://textytools.dev/text-encoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
