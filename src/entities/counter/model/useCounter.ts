"use client";

import { debounce } from "lodash";
import { useState, useEffect } from "react";

import {
  countCharacters,
  countLines,
  countWords,
  countParagraphs,
} from "../lib/counters";
import { estimateTokenCount } from "../lib/tokenizer";

export interface TextCounts {
  characterCount: number;
  lineCount: number;
  wordCount: string;
  paragraphCount: string;
  tokenCount: string;
}

/**
 * React hook for counting various text metrics.
 * Provides character, line, word, paragraph, and token counts for a given text input.
 * Token counting is debounced for performance.
 */
export function useCounter(text: string): TextCounts {
  const [textTrimmed, setTextTrimmed] = useState("");
  const [wordCount, setWordCount] = useState("0");
  const [paragraphCount, setParagraphCount] = useState("0");
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [tokenCount, setTokenCount] = useState("0");

  // Update trimmed text
  useEffect(() => {
    setTextTrimmed(text.trim());
  }, [text]);

  // Compute simple counts (synchronous, no state needed)
  const characterCount = countCharacters(text);
  const lineCount = countLines(text);

  // Word counting
  useEffect(() => {
    const count = countWords(textTrimmed);
    setWordCount(count.toLocaleString());
  }, [textTrimmed]);

  // Paragraph counting
  useEffect(() => {
    const count = countParagraphs(textTrimmed);
    setParagraphCount(count.toLocaleString());
  }, [textTrimmed]);

  // Token counting (debounced for performance)
  useEffect(() => {
    if (!isTokenizing) {
      debounce(tokenize, 100)();
    }
    return;

    async function tokenize() {
      if (isTokenizing) {
        setTokenCount("...");
        return;
      } else if (textTrimmed === "") {
        setTokenCount("0");
        setIsTokenizing(false);
      } else {
        setIsTokenizing(true);
        try {
          const count = await estimateTokenCount(textTrimmed);
          setTokenCount(count.toLocaleString());
        } catch {
          setTokenCount("ERR");
        }
        setIsTokenizing(false);
      }
    }
  }, [textTrimmed, isTokenizing]);

  return {
    characterCount,
    lineCount,
    wordCount,
    paragraphCount,
    tokenCount,
  };
}
