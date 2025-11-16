import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Converter - textytools.dev",
  description:
    "Transform text between 11 different case formats instantly: UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, and path/case. Free browser-based case conversion tool.",
  openGraph: {
    title: "Case Converter - textytools.dev",
    description: "Transform text between 11 different case formats instantly.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
