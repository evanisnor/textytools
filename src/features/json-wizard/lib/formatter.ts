import type { ViewMode } from "../model/types";

export function processJSON(
  input: string,
  viewMode: ViewMode,
  indentSize: number,
  sortKeys: boolean,
  isValid: boolean,
  isEscapedString: boolean,
): string {
  if (!input.trim()) return input;
  if (!isValid) return input;

  try {
    let parsed = JSON.parse(input);

    // Auto-unescape: If the parsed result is an escaped JSON string, unescape it
    if (isEscapedString && typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }

    if (sortKeys) {
      parsed = sortObject(parsed);
    }

    let result: string;
    switch (viewMode) {
      case "pretty":
        result = JSON.stringify(parsed, null, indentSize);
        break;
      case "minified":
        result = JSON.stringify(parsed);
        break;
      case "escaped":
        result = JSON.stringify(JSON.stringify(parsed));
        break;
    }

    return result;
  } catch {
    return input;
  }
}

function sortObject(obj: unknown): unknown {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sortObject);

  const sorted: Record<string, unknown> = {};
  Object.keys(obj as Record<string, unknown>)
    .sort()
    .forEach((key) => {
      sorted[key] = sortObject((obj as Record<string, unknown>)[key]);
    });
  return sorted;
}

export function checkIsEscapedString(input: string, isValid: boolean): boolean {
  if (!isValid || !input.trim()) return false;
  try {
    const parsed = JSON.parse(input);
    if (typeof parsed === "string") {
      // Check if the string itself is valid JSON
      try {
        JSON.parse(parsed);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  } catch {
    return false;
  }
}
