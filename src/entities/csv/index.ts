// CSV parsing and escaping (line-level)
export { parseCsvLine, escapeCsvValue } from "./lib/parser";

// CSV parsing (full document - Apogee support)
export { parseCSV, detectDelimiter } from "./lib/parse";
export type { CsvParseOptions } from "./lib/parse";

// CSV formatting (Apogee support)
export { formatCSV } from "./lib/format";
export type { CsvFormatOptions } from "./lib/format";

// CSV statistics (Apogee support)
export { getCSVStats } from "./lib/stats";
export type { CsvStats } from "./lib/stats";

// Column generation
export { generateColumnLetter } from "./lib/column-generator";

// UI components
export { highlightCsvLine } from "./ui/CsvHighlighter";

// Hooks
export { useCsvSyntaxHighlighter } from "./model/useCsvSyntaxHighlighter";
export type { CsvSyntaxRenderer } from "./model/useCsvSyntaxHighlighter";
