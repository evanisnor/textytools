import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Converter - Convert between 11 case formats quickly",
  description:
    "Transform text between 11 different case formats instantly: UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, and path/case. Free browser-based case conversion tool.",
  keywords: [
    "case converter",
    "convert case",
    "camelCase",
    "pascalCase",
    "snake_case",
    "kebab-case",
    "title case",
    "sentence case",
    "upper case",
    "lower case",
    "case conversion",
    "case converter online",
    "textytools",
  ],
  openGraph: {
    title: "Case Converter - Convert between 11 case formats quickly",
    description: "Transform text between 11 different case formats instantly.",
  },
  alternates: {
    canonical: "https://textytools.dev/case-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
