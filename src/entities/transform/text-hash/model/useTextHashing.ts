"use client";

import { useState, useEffect } from "react";

import { hashText } from "../lib/codec";
import type { HashType } from "../model/types";

export interface UseTextHashingOptions {
  text: string;
  type: HashType;
}

export interface UseTextHashingResult {
  hash: string;
  isHashing: boolean;
}

/**
 * React hook for text hashing transformations
 * Automatically updates the hash when inputs change
 */
export function useTextHashing({
  text,
  type,
}: UseTextHashingOptions): UseTextHashingResult {
  const [hash, setHash] = useState("");
  const [isHashing, setIsHashing] = useState(false);

  useEffect(() => {
    const computeHash = async () => {
      setIsHashing(true);

      try {
        const result = await hashText(text, type);
        setHash(result);
      } catch (error) {
        console.error("Hashing error:", error);
        setHash("Error: Hashing failed");
      } finally {
        setIsHashing(false);
      }
    };

    computeHash();
  }, [text, type]);

  return {
    hash,
    isHashing,
  };
}
