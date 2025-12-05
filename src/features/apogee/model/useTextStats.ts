/**
 * Hook for calculating text statistics with async token counting
 */

"use client";

import { debounce } from "lodash";
import { useState, useEffect, useMemo } from "react";

import { calculateTextStats } from "../lib/textStats";

import type { TransformStat } from "./types";

import { estimateTokenCount } from "@/entities/counter";

/**
 * Hook that provides text statistics with debounced async token counting
 *
 * @param text - The text to analyze
 * @returns Array of TransformStat objects, or undefined if text is empty
 */
export function useTextStats(text: string): TransformStat[] | undefined {
  const [tokenCount, setTokenCount] = useState<string>("0");
  const [isTokenizing, setIsTokenizing] = useState(false);

  // Token counting (debounced for performance)
  useEffect(() => {
    const trimmedText = text.trim();

    if (trimmedText === "") {
      // Don't set state here - let useMemo handle empty text case
      return;
    }

    const debouncedTokenize = debounce(async () => {
      setIsTokenizing(true);
      try {
        const count = await estimateTokenCount(trimmedText);
        setTokenCount(count.toLocaleString());
      } catch {
        setTokenCount("ERR");
      }
      setIsTokenizing(false);
    }, 300);

    debouncedTokenize();

    return () => {
      debouncedTokenize.cancel();
    };
  }, [text]);

  // Calculate all stats (memoized)
  return useMemo(() => {
    if (text.length === 0) return undefined;
    return calculateTextStats(text, tokenCount, isTokenizing);
  }, [text, tokenCount, isTokenizing]);
}
