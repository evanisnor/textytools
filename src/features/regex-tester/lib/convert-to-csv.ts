import type { RegexMatch } from "../model/types";

import { trackToolConversion } from "@/shared/lib/analytics";

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

export function navigateToCsvConverter(
  matches: RegexMatch[],
  csvOutput: string,
) {
  const hasNamedGroups = matches[0]?.groupNames.some((name) => name !== null);

  // Save CSV for csv-json-converter
  sessionStorage.setItem("cross-tool-input-csv-json-converter", csvOutput);

  // Track the conversion
  trackToolConversion({
    sourceTool: "regex-tester",
    destinationTool: "csv-json-converter",
    matchCount: matches.length,
    hasNamedGroups,
  });

  // Navigate to csv-json-converter
  window.location.href = "/csv-json-converter";
}
