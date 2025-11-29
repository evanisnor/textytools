// Counting functions
export {
  countCharacters,
  countLines,
  countWords,
  countParagraphs,
} from "./lib/counters";

// Token estimation
export { estimateTokenCount } from "./lib/tokenizer";

// Convenience function for sync token counting (uses simple approximation)
export function countTokens(text: string): number {
  if (text.trim() === "") return 0;
  // Simple approximation: ~4 chars per token
  return Math.ceil(text.length / 4);
}

// Hooks
export { useCounter } from "./model/useCounter";
export type { TextCounts } from "./model/useCounter";
