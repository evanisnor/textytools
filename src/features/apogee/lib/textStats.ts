/**
 * Text statistics utilities for Apogee
 */

import type { TransformStat } from "../model/types";

import {
  countCharacters,
  countWords,
  countParagraphs,
} from "@/entities/counter";

/**
 * Calculate text statistics for display in DataBlock stats bar
 *
 * @param text - The text to analyze
 * @param tokenCount - The current token count (from async estimation)
 * @param isTokenizing - Whether token counting is in progress
 * @returns Array of TransformStat objects for display
 */
export function calculateTextStats(
  text: string,
  tokenCount: string,
  isTokenizing: boolean,
): TransformStat[] {
  const chars = countCharacters(text);
  const words = countWords(text);
  const paragraphs = countParagraphs(text);
  const bytes = new TextEncoder().encode(text).length;

  return [
    { label: "Characters", value: chars.toLocaleString() },
    { label: "Words", value: words.toLocaleString() },
    { label: "Paragraphs", value: paragraphs.toLocaleString() },
    { label: "Bytes", value: bytes.toLocaleString() },
    {
      label: "Tokens",
      value: isTokenizing ? "..." : tokenCount,
    },
  ];
}
