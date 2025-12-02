/**
 * YAML entity - Parsing and formatting for YAML documents
 */

// Parsing and validation
export { parseYAML, validateYAML } from "./lib/parse";
export type { YamlParseResult } from "./lib/parse";

// Formatting
export { formatYAML } from "./lib/format";
export type { YamlFormatOptions } from "./lib/format";

// Statistics
export { getYAMLStats } from "./lib/stats";
export type { YamlStats } from "./lib/stats";

// Types
export type { YamlParseResult as YamlParseResultType } from "./model/types";
