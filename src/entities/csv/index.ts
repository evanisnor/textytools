// CSV parsing and escaping
export { parseCsvLine, escapeCsvValue } from "./lib/parser";

// Column generation
export { generateColumnLetter } from "./lib/column-generator";

// UI components
export { highlightCsvLine } from "./ui/CsvHighlighter";

// Hooks
export { useCsvSyntaxHighlighter } from "./model/useCsvSyntaxHighlighter";
export type { CsvSyntaxRenderer } from "./model/useCsvSyntaxHighlighter";
