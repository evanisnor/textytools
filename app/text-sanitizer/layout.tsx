import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Sanitizer - Clean, trim, and normalize text quickly",
  description:
    "Clean and transform text with 12 customizable sanitization options. Trim lines, remove empty/duplicate lines, strip emoji/punctuation/numbers, normalize whitespace, sort/reverse lines. Free browser-based text cleaning tool.",
  keywords: [
    "text sanitizer",
    "clean text",
    "remove emojis",
    "remove punctuation",
    "strip numbers",
    "remove duplicates",
    "normalize whitespace",
    "trim lines",
    "sort lines",
    "text cleaning",
    "textytools",
  ],
  openGraph: {
    title: "Text Sanitizer - Clean, trim, and normalize text quickly",
    description:
      "Clean and transform text with customizable sanitization options.",
  },
  alternates: {
    canonical: "https://textytools.dev/text-sanitizer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
