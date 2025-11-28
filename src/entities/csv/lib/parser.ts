/**
 * Parses a single CSV line according to RFC 4180.
 * Handles quoted values, escaped quotes, and custom delimiters.
 */
export function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i += 1; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Escapes a CSV value according to RFC 4180.
 * Fields containing delimiters, quotes, or newlines are wrapped in quotes.
 * Quotes within values are doubled.
 */
export function escapeCsvValue(value: string, delimiter: string): string {
  const needsQuoting =
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r");

  if (needsQuoting) {
    // Escape double quotes by doubling them
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}
