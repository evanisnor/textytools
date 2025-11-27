/**
 * Pure counting functions for text analysis
 */

export function countCharacters(text: string): number {
  return text.length;
}

export function countLines(text: string): number {
  return text === "" ? 0 : text.split("\n").length;
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

export function countParagraphs(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;

  return trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
}
