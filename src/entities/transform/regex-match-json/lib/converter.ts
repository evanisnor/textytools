import type { RegexMatch } from "@/entities/regex";

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/\s+/g, "_");
}

/**
 * Convert regex matches to JSON format
 * @param matches - Array of regex matches with capture groups
 * @returns JSON string representation of the matches
 */
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
