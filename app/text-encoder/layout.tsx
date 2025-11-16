import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Encoder - textytools.dev",
  description:
    "Encode and decode text using 17 different formats: Base64, Base58, Base91, ASCII85, Z85, URL encoding, HTML entities, hexadecimal, binary, Unicode, ROT13, Morse code, MD5, SHA-1, SHA-256, SHA-512. Free browser-based text encoder.",
  openGraph: {
    title: "Text Encoder - textytools.dev",
    description: "Encode and decode text using 17 different encoding formats.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
