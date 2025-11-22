import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV / JSON Converter - Convert between CSV and JSON",
  description:
    "Bidirectional converter between CSV and JSON formats with proper data type parsing and nested object support. Features auto-detect types, configurable delimiters, and proper CSV escaping. Free browser-based CSV JSON converter.",
  keywords: [
    "csv to json",
    "json to csv",
    "csv converter",
    "csv parser",
    "json parser",
    "data conversion",
    "csv import",
    "csv escape",
    "csv to json converter",
    "csv json tool",
    "spreadsheet to json",
    "textytools",
  ],
  openGraph: {
    title: "CSV / JSON Converter - Convert between CSV and JSON",
    description: "Convert between CSV and JSON formats with proper parsing.",
  },
  alternates: {
    canonical: "https://textytools.dev/csv-json-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
