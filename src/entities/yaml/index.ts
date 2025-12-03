/**
 * YAML entity - Parsing and formatting for YAML documents
 */

// Parsing and validation
export { parseYAML, validateYAML, isYAML } from "./lib/parse";
export type { YamlParseResult } from "./lib/parse";

// Formatting
export { formatYAML } from "./lib/format";
export type { YamlFormatOptions } from "./lib/format";

// Statistics
export { getYAMLStats } from "./lib/stats";
export type { YamlStats } from "./lib/stats";

// Types
export type { YamlParseResult as YamlParseResultType } from "./model/types";

// UI components
export { highlightYaml, DEFAULT_YAML_THEME } from "./ui/YamlHighlighter";
export type { YamlSyntaxTheme } from "./ui/YamlHighlighter";

// Hooks
export { useYamlSyntaxHighlighter } from "./model/useYamlSyntaxHighlighter";
export type { YamlSyntaxRenderer } from "./model/useYamlSyntaxHighlighter";
