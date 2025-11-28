"use client";

import { useState, useEffect } from "react";

import { encodeText, decodeText } from "../lib/codec";
import type { EncodingType } from "../model/types";

export interface UseTextEncodingOptions {
  text: string;
  type: EncodingType;
  direction: "encode" | "decode";
}

export interface UseTextEncodingResult {
  result: string;
  isProcessing: boolean;
}

/**
 * React hook for text encoding/decoding transformations
 * Automatically updates the result when inputs change
 */
export function useTextEncoding({
  text,
  type,
  direction,
}: UseTextEncodingOptions): UseTextEncodingResult {
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsProcessing(true);

    try {
      const transformed =
        direction === "encode"
          ? encodeText(text, type)
          : decodeText(text, type);
      setResult(transformed);
    } catch (error) {
      console.error("Encoding error:", error);
      setResult("Error: Transformation failed");
    } finally {
      setIsProcessing(false);
    }
  }, [text, type, direction]);

  return {
    result,
    isProcessing,
  };
}
