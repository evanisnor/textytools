/**
 * Splits a string into words by detecting word boundaries.
 * Handles camelCase, PascalCase, snake_case, kebab-case, and other formats.
 */
export function toWords(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase -> camel Case
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // ABCWord -> ABC Word
    .replace(/[_\-./\\]/g, " ") // Replace separators with spaces
    .split(/\s+/)
    .filter((word) => word.length > 0);
}
