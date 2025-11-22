"use client";

import { Fragment, useMemo, type ReactNode } from "react";
import { parseCsvLine } from "@/app/lib/csv";

const DEFAULT_COLUMN_COLORS = [
  "bg-blue-200/60 dark:bg-blue-800/40",
  "bg-green-200/60 dark:bg-green-800/40",
  "bg-yellow-200/60 dark:bg-yellow-800/40",
  "bg-purple-200/60 dark:bg-purple-800/40",
  "bg-pink-200/60 dark:bg-pink-800/40",
  "bg-indigo-200/60 dark:bg-indigo-800/40",
  "bg-red-200/60 dark:bg-red-800/40",
  "bg-orange-200/60 dark:bg-orange-800/40",
  "bg-teal-200/60 dark:bg-teal-800/40",
  "bg-cyan-200/60 dark:bg-cyan-800/40",
  "bg-lime-200/60 dark:bg-lime-800/40",
  "bg-emerald-200/60 dark:bg-emerald-800/40",
  "bg-violet-200/60 dark:bg-violet-800/40",
  "bg-fuchsia-200/60 dark:bg-fuchsia-800/40",
  "bg-rose-200/60 dark:bg-rose-800/40",
  "bg-sky-200/60 dark:bg-sky-800/40",
  "bg-amber-200/60 dark:bg-amber-800/40",
  "bg-slate-200/60 dark:bg-slate-800/40",
  "bg-gray-200/60 dark:bg-gray-800/40",
  "bg-zinc-200/60 dark:bg-zinc-700/40",
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
