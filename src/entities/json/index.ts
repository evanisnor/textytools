// Domain types
export type { JsonObject } from "./model/types";

// Object flattening and unflattening
export { flattenObject } from "./lib/flatten";
export { setNestedValue } from "./lib/unflatten";

// Type parsing
export { parseValue } from "./lib/type-parser";

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
