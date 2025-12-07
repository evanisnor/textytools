/**
 * Utilities for executing regex patterns and collecting matches
 */

/**
 * Execute a regex globally and collect all matches with named groups
 * Handles zero-length matches to prevent infinite loops
 *
 * @param pattern - The regex pattern
 * @param flags - Regex flags (will ensure 'g' flag is present)
 * @param input - The text to search
 * @param namedGroups - Array of named group names to extract
 * @returns Array of objects with named group values
 */
export function executeWithNamedGroups(
  pattern: string,
  flags: string,
  input: string,
  namedGroups: string[],
): Record<string, string>[] {
  const results: Record<string, string>[] = [];

  // Ensure global flag is present
  const globalFlags = flags.includes("g") ? flags : flags + "g";
  const regex = new RegExp(pattern, globalFlags);

  let execMatch;
  while ((execMatch = regex.exec(input)) !== null) {
    const obj: Record<string, string> = {};
    for (const groupName of namedGroups) {
      obj[groupName] = execMatch.groups?.[groupName] || "";
    }
    results.push(obj);

    // Prevent infinite loop on zero-length matches
    if (execMatch[0].length === 0) {
      regex.lastIndex++;
    }
  }

  return results;
}

/**
 * Execute a simple regex match (with or without global flag)
 *
 * @param pattern - The regex pattern
 * @param flags - Regex flags
 * @param input - The text to search
 * @returns Array of match strings, or null if no matches
 */
export function executeSimpleMatch(
  pattern: string,
  flags: string,
  input: string,
): string[] | null {
  const regex = new RegExp(pattern, flags);
  return input.match(regex);
}
