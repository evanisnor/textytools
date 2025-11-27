import type { RegexMatch } from "../model/types";

import { trackToolConversion } from "@/shared/lib/analytics";

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/\s+/g, "_");
}

export function convertMatchesToJson(matches: RegexMatch[]): string {
  if (matches.length === 0 || matches[0].groups.length === 0) {
    return "";
  }

  // Build array of objects from matches
  const jsonArray = matches.map((match) => {
    const obj: Record<string, string> = {};

    match.groups.forEach((group, idx) => {
      const groupName = match.groupNames[idx];
      const key = groupName ? toSnakeCase(groupName) : `group_${idx + 1}`;
      obj[key] = group || "";
    });

    return obj;
  });

  return JSON.stringify(jsonArray, null, 2);
}

export function navigateToJsonWizard(
  matches: RegexMatch[],
  jsonOutput: string,
) {
  const hasNamedGroups = matches[0]?.groupNames.some((name) => name !== null);

  // Save JSON for json-wizard
  sessionStorage.setItem("cross-tool-input-json-wizard", jsonOutput);

  // Track the conversion
  trackToolConversion({
    sourceTool: "regex-tester",
    destinationTool: "json-wizard",
    matchCount: matches.length,
    hasNamedGroups,
  });

  // Navigate to json-wizard
  window.location.href = "/json-wizard";
}
