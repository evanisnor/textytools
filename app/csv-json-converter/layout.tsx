import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV / JSON Converter - textytools.dev",
  description:
    "Bidirectional converter between CSV and JSON formats with proper data type parsing and nested object support. Features auto-detect types, configurable delimiters, and proper CSV escaping. Free browser-based CSV JSON converter.",
  openGraph: {
    title: "CSV / JSON Converter - textytools.dev",
    description: "Convert between CSV and JSON formats with proper parsing.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
