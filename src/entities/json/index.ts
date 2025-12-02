// Domain types
export type { JsonObject } from "./model/types";

// Object flattening and unflattening
export { flattenObject } from "./lib/flatten";
export { setNestedValue } from "./lib/unflatten";

// Type parsing
export { parseValue } from "./lib/type-parser";

// Parsing and validation (Apogee support)
export { parseJSON, validateJSON } from "./lib/parse";
export type { JsonParseResult } from "./lib/parse";

// Formatting (Apogee support)
export { formatJSON } from "./lib/format";
export type { JsonFormatOptions } from "./lib/format";

// Statistics (Apogee support)
export { getJSONStats, countKeys, getDepth } from "./lib/stats";
export type { JsonStats } from "./lib/stats";

// UI components
export {
  highlightJson,
  tokenizeJson,
  type JsonSyntaxToken,
  type JsonSyntaxTokenType,
  type JsonSyntaxTheme,
} from "./ui/JsonHighlighter";

// Hooks
export { useJsonSyntaxHighlighter } from "./model/useJsonSyntaxHighlighter";
export type { JsonSyntaxRenderer } from "./model/useJsonSyntaxHighlighter";
