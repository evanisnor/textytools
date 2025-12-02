/**
 * TOML entity - Parsing and formatting for TOML documents
 */

// Parsing and validation
export { parseTOML, validateTOML } from "./lib/parse";
export type { TomlParseResult } from "./lib/parse";

// Formatting
export { formatTOML } from "./lib/format";
export type { TomlFormatOptions } from "./lib/format";

// Statistics
export { getTOMLStats } from "./lib/stats";
export type { TomlStats } from "./lib/stats";
