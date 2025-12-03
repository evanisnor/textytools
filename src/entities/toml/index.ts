/**
 * TOML entity - Parsing and formatting for TOML documents
 */

// Parsing and validation
export { parseTOML, validateTOML, isTOML } from "./lib/parse";
export type { TomlParseResult } from "./lib/parse";

// Formatting
export { formatTOML } from "./lib/format";
export type { TomlFormatOptions } from "./lib/format";

// Statistics
export { getTOMLStats } from "./lib/stats";
export type { TomlStats } from "./lib/stats";

// UI components
export { highlightToml, DEFAULT_TOML_THEME } from "./ui/TomlHighlighter";
export type { TomlSyntaxTheme } from "./ui/TomlHighlighter";

// Hooks
export { useTomlSyntaxHighlighter } from "./model/useTomlSyntaxHighlighter";
export type { TomlSyntaxRenderer } from "./model/useTomlSyntaxHighlighter";
