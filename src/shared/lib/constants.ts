/**
 * Tool name constants for analytics tracking and consistency
 * These should match the tool names used across the application
 */
export const TOOL_NAMES = {
  CASE_CONVERTER: "case-converter",
  DIFF_VIEWER: "diff-viewer",
  CSV_JSON_CONVERTER: "csv-json-converter",
  JSON_WIZARD: "json-wizard",
  JWT_DECODER: "jwt-decoder",
  REGEX_TESTER: "regex-tester",
  TEXT_COUNTER: "text-counter",
  TEXT_ENCODER: "text-encoder",
  TEXT_SANITIZER: "text-sanitizer",
} as const;

// Type for tool names
export type ToolName = (typeof TOOL_NAMES)[keyof typeof TOOL_NAMES];
