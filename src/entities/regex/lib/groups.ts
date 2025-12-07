/**
 * Utilities for extracting and working with regex capture groups
 */

/**
 * Pattern to match named capture groups in regex patterns
 * Matches: (?<groupName>...)
 */
const NAMED_GROUP_PATTERN = /\(\?<(\w+)>/g;

/**
 * Extract all named group names from a regex pattern
 *
 * @param pattern - The regex pattern string
 * @returns Array of named group names in order of appearance
 *
 * @example
 * extractNamedGroups("(?<name>\\w+): (?<email>\\S+)")
 * // Returns: ["name", "email"]
 */
export function extractNamedGroups(pattern: string): string[] {
  const namedGroups: string[] = [];
  const matches = pattern.matchAll(NAMED_GROUP_PATTERN);

  for (const match of matches) {
    namedGroups.push(match[1]);
  }

  return namedGroups;
}

/**
 * Check if a regex pattern contains named groups
 */
export function hasNamedGroups(pattern: string): boolean {
  return NAMED_GROUP_PATTERN.test(pattern);
}

/**
 * Extract named group values from a RegExpExecArray result
 *
 * @param execMatch - The result from regex.exec()
 * @param groupNames - Array of group names to extract
 * @returns Record mapping group names to their values
 */
export function extractNamedGroupValues(
  execMatch: RegExpExecArray,
  groupNames: string[],
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const groupName of groupNames) {
    result[groupName] = execMatch.groups?.[groupName] || "";
  }

  return result;
}
