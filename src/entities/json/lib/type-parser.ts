/**
 * Parses string values to appropriate types (number, boolean, null).
 * Used when converting CSV to JSON to infer data types.
 */
export function parseValue(value: string): string | number | boolean | null {
  const trimmed = value.trim();

  if (trimmed === "") return "";
  if (trimmed.toLowerCase() === "null") return null;
  if (trimmed.toLowerCase() === "true") return true;
  if (trimmed.toLowerCase() === "false") return false;

  // Try to parse as number
  const num = Number(trimmed);
  if (!isNaN(num) && trimmed !== "") {
    return num;
  }

  return value;
}
