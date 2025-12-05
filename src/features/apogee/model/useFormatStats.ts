/**
 * Hook for calculating format-specific statistics
 * Detects the format and returns appropriate stats for that format
 */

"use client";

import { debounce } from "lodash";
import { useState, useEffect, useMemo } from "react";

import { calculateTextStats } from "../lib/textStats";

import type { TransformStat, InputType } from "./types";

import { estimateTokenCount } from "@/entities/counter";
import { getCSVStats } from "@/entities/csv";
import { getJSONStats } from "@/entities/json";
import { getTOMLStats } from "@/entities/toml";
import { parseToIntermediate } from "@/entities/transform/shared/formatConversion";
import { detectFormat } from "@/entities/transform/shared/formatDetection";
import { getXMLStats } from "@/entities/xml";
import { getYAMLStats } from "@/entities/yaml";

/**
 * Hook that provides format-specific statistics based on detected or selected input type
 *
 * @param text - The text to analyze
 * @param inputType - The current input type (can be "auto" or specific format)
 * @returns Array of TransformStat objects appropriate for the format, or undefined if text is empty
 */
export function useFormatStats(
  text: string,
  inputType: InputType | "auto",
): TransformStat[] | undefined {
  const [tokenCount, setTokenCount] = useState<string>("0");
  const [isTokenizing, setIsTokenizing] = useState(false);

  // Token counting (debounced for performance) - always calculated for text stats fallback
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

  // Calculate format-specific stats (memoized)
  return useMemo(() => {
    if (text.length === 0) return undefined;

    // Determine effective format
    const effectiveFormat =
      inputType === "auto" ? detectFormat(text) : inputType;

    // Calculate stats based on format
    try {
      switch (effectiveFormat) {
        case "json": {
          const parsed = parseToIntermediate(text, "json");
          if (parsed.success && parsed.data) {
            const stats = getJSONStats(parsed.data);
            return [
              { label: "Keys", value: stats.keyCount },
              { label: "Depth", value: stats.depth },
              { label: "Size", value: `${stats.size} bytes` },
            ];
          }
          break;
        }

        case "csv": {
          const parsed = parseToIntermediate(text, "csv");
          if (parsed.success && parsed.data) {
            const stats = getCSVStats(parsed.data as string[][]);
            return [
              { label: "Rows", value: stats.rowCount },
              { label: "Columns", value: stats.columnCount },
            ];
          }
          break;
        }

        case "xml": {
          const parsed = parseToIntermediate(text, "xml");
          if (parsed.success && parsed.data) {
            const stats = getXMLStats(parsed.data as Document);
            return [
              { label: "Nodes", value: stats.nodeCount },
              { label: "Namespaces", value: stats.namespaceCount },
            ];
          }
          break;
        }

        case "yaml": {
          const parsed = parseToIntermediate(text, "yaml");
          if (parsed.success && parsed.data) {
            const stats = getYAMLStats(parsed.data);
            return [
              { label: "Documents", value: stats.documentCount },
              { label: "Valid", value: stats.valid ? "Yes" : "No" },
            ];
          }
          break;
        }

        case "toml": {
          const parsed = parseToIntermediate(text, "toml");
          if (parsed.success && parsed.data) {
            const stats = getTOMLStats(parsed.data);
            return [
              { label: "Tables", value: stats.tableCount },
              { label: "Valid", value: stats.valid ? "Yes" : "No" },
            ];
          }
          break;
        }

        case "jwt":
        case "text":
        case "unknown":
        default:
          // Fall through to text stats
          break;
      }
    } catch {
      // If parsing fails, fall back to text stats
    }

    // Fallback to text stats for JWT, plain text, unknown, or if parsing failed
    return calculateTextStats(text, tokenCount, isTokenizing);
  }, [text, inputType, tokenCount, isTokenizing]);
}
