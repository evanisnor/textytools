// Counting functions
export {
  countCharacters,
  countLines,
  countWords,
  countParagraphs,
} from "./lib/counters";

// Token estimation
export { estimateTokenCount } from "./lib/tokenizer";

// Hooks
export { useCounter } from "./model/useCounter";
export type { TextCounts } from "./model/useCounter";
