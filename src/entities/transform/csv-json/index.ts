// Domain types
export type { FormatType, ConversionResult } from "./model/types";

// Format detection
export { detectInputFormat } from "./lib/detection";

// Conversion functions
export { csvToJson } from "./lib/csv-to-json";
export { jsonToCsv } from "./lib/json-to-csv";
