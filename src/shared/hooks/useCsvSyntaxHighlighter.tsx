"use client";

import { Fragment, useMemo, type ReactNode } from "react";
import { parseCsvLine } from "@/entities/csv";

const DEFAULT_COLUMN_COLORS = [
  "text-blue-700 dark:text-blue-300",
  "text-green-700 dark:text-green-300",
  "text-amber-700 dark:text-amber-300",
  "text-purple-700 dark:text-purple-300",
  "text-pink-700 dark:text-pink-300",
  "text-indigo-700 dark:text-indigo-300",
  "text-red-700 dark:text-red-300",
  "text-orange-700 dark:text-orange-300",
  "text-teal-700 dark:text-teal-300",
  "text-cyan-700 dark:text-cyan-300",
  "text-lime-700 dark:text-lime-300",
  "text-emerald-700 dark:text-emerald-300",
  "text-violet-700 dark:text-violet-300",
  "text-fuchsia-700 dark:text-fuchsia-300",
  "text-rose-700 dark:text-rose-300",
  "text-sky-700 dark:text-sky-300",
  "text-amber-900 dark:text-amber-200",
  "text-slate-700 dark:text-slate-300",
  "text-gray-700 dark:text-gray-300",
  "text-zinc-700 dark:text-zinc-300",
];

interface CsvSyntaxHighlighterOptions {
  enabled?: boolean;
  delimiter?: string;
  columnColors?: string[];
}

export interface CsvSyntaxRenderer {
  renderLineContent: (line: string, lineIndex: number) => ReactNode;
  columnColors: string[];
}

export function useCsvSyntaxHighlighter({
  enabled = true,
  delimiter = ",",
  columnColors = DEFAULT_COLUMN_COLORS,
}: CsvSyntaxHighlighterOptions = {}): CsvSyntaxRenderer | undefined {
  const mergedColors = useMemo(() => {
    return columnColors.length > 0 ? columnColors : DEFAULT_COLUMN_COLORS;
  }, [columnColors]);

  return useMemo(() => {
    if (!enabled) return undefined;

    const renderCsvLine = (line: string) => {
      if (!line.trim()) {
        return line;
      }

      const values = parseCsvLine(line, delimiter);

      return (
        <Fragment>
          {values.map((value, colIndex) => (
            <span
              key={colIndex}
              className={mergedColors[colIndex % mergedColors.length]}
            >
              {value || "\u00A0"}
              {colIndex < values.length - 1 && delimiter}
            </span>
          ))}
        </Fragment>
      );
    };

    return {
      renderLineContent: renderCsvLine,
      columnColors: mergedColors,
    };
  }, [delimiter, enabled, mergedColors]);
}
