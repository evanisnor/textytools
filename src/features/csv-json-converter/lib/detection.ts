import type { FormatType } from "../model/types";

export function detectInputFormat(input: string): FormatType {
  const trimmed = input.trim();
  if (!trimmed) return "csv";

  // Check if it starts with JSON markers
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    return "json";
  }

  // Try to parse as JSON
  try {
    JSON.parse(trimmed);
    return "json";
  } catch {
    // Not valid JSON, assume CSV
    return "csv";
  }
}
