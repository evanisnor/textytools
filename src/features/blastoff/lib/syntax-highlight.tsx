/**
 * Syntax Highlighting Utilities
 * Wraps existing entity highlighters for use in DataBlock
 */

import React from "react";

import { highlightCsvLine } from "@/entities/csv";
import { highlightJson as jsonHighlighter } from "@/entities/json";
import { highlightJWT } from "@/entities/jwt";

/**
 * Highlight CSV content line-by-line
 */
function highlightCsv(content: string): React.ReactNode {
  const lines = content.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <div key={i}>{highlightCsvLine(line)}</div>
      ))}
    </>
  );
}

/**
 * Get the appropriate highlighter based on syntax type
 */
export function getSyntaxHighlighter(
  syntax: "none" | "csv" | "json" | "jwt",
): ((content: string) => React.ReactNode) | undefined {
  switch (syntax) {
    case "csv":
      return highlightCsv;
    case "json":
      return jsonHighlighter;
    case "jwt":
      return highlightJWT;
    case "none":
    default:
      return undefined;
  }
}
