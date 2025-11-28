"use client";

import { useMemo, type ReactNode } from "react";

import { highlightCsvLine } from "../ui/CsvHighlighter";

interface CsvSyntaxHighlighterOptions {
  enabled?: boolean;
  delimiter?: string;
}

export interface CsvSyntaxRenderer {
  renderLineContent: (line: string, lineIndex: number) => ReactNode;
}

/**
 * React hook for CSV syntax highlighting.
 * Provides memoized rendering function for use in text editors.
 */
export function useCsvSyntaxHighlighter({
  enabled = true,
  delimiter = ",",
}: CsvSyntaxHighlighterOptions = {}): CsvSyntaxRenderer | undefined {
  return useMemo(() => {
    if (!enabled) return undefined;

    return {
      renderLineContent: (line: string) => highlightCsvLine(line, delimiter),
    };
  }, [delimiter, enabled]);
}
