import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Sanitizer - textytools.dev",
  description:
    "Clean and transform text with 12 customizable sanitization options. Trim lines, remove empty/duplicate lines, strip emoji/punctuation/numbers, normalize whitespace, sort/reverse lines. Free browser-based text cleaning tool.",
  openGraph: {
    title: "Text Sanitizer - textytools.dev",
    description:
      "Clean and transform text with customizable sanitization options.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
