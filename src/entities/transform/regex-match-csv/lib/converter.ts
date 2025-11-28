import type { RegexMatch } from "@/entities/regex";

/**
 * Convert regex matches to CSV format
 * @param matches - Array of regex matches with capture groups
 * @returns CSV string representation of the matches
 */
export function convertMatchesToCsv(matches: RegexMatch[]): string {
  if (matches.length === 0 || matches[0].groups.length === 0) {
    return "";
  }

  // Check if we have named groups
  const hasNamedGroups = matches[0].groupNames.some((name) => name !== null);
  const lines: string[] = [];

  // Add header row if we have named groups
  if (hasNamedGroups) {
    const headers = matches[0].groupNames
      .map((name, idx) => name || `Group ${idx + 1}`)
      .filter((_, idx) => matches[0].groupNames[idx] !== null);
    lines.push(headers.join(","));
  }

  // Add data rows
  for (const match of matches) {
    const values = match.groups.map((group) => {
      const value = group || "";
      // Escape CSV values - quote if contains comma, newline, or quotes
      if (value.includes(",") || value.includes("\n") || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    lines.push(values.join(","));
  }

  return lines.join("\n");
}
