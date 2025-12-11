/**
 * Extract Lines Transform
 * Extract lines that match specific criteria
 */

import type { TransformDefinition, TransformResult } from "../../shared/types";

export const extractLinesDefinition: TransformDefinition = {
  type: "extract-lines",
  name: "Extract Lines",
  description: "Extract lines that match specific patterns or conditions",
  category: "manipulate",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  propertySchema: [
    {
      key: "mode",
      label: "Mode",
      type: "select",
      options: [
        { value: "contains", label: "Contains" },
        { value: "startsWith", label: "Starts With" },
        { value: "endsWith", label: "Ends With" },
        { value: "regex", label: "Regex Match" },
        { value: "notContains", label: "Does Not Contain" },
      ],
      defaultValue: "contains",
      width: "flex-start",
    },
    {
      key: "pattern",
      label: "Pattern",
      type: "text",
      defaultValue: "",
      width: "flex",
    },
    {
      key: "caseSensitive",
      label: "Case Sensitive",
      type: "toggle",
      defaultValue: false,
    },
  ],
  defaultProperties: {
    mode: "contains",
    pattern: "",
    caseSensitive: false,
  },
  execute: (
    input: string,
    properties: Record<string, unknown>,
  ): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    const mode = properties.mode as string;
    const pattern = properties.pattern as string;
    const caseSensitive = properties.caseSensitive as boolean;

    if (!pattern) {
      return {
        success: false,
        data: "",
        error: "Pattern is required",
        mimeType: "text/plain",
      };
    }

    try {
      const lines = input.split("\n");
      const totalLines = lines.length;
      let extractedLines: string[];

      switch (mode) {
        case "contains":
          extractedLines = lines.filter((line) => {
            const l = caseSensitive ? line : line.toLowerCase();
            const p = caseSensitive ? pattern : pattern.toLowerCase();
            return l.includes(p);
          });
          break;

        case "notContains":
          extractedLines = lines.filter((line) => {
            const l = caseSensitive ? line : line.toLowerCase();
            const p = caseSensitive ? pattern : pattern.toLowerCase();
            return !l.includes(p);
          });
          break;

        case "startsWith":
          extractedLines = lines.filter((line) => {
            const l = caseSensitive ? line : line.toLowerCase();
            const p = caseSensitive ? pattern : pattern.toLowerCase();
            return l.startsWith(p);
          });
          break;

        case "endsWith":
          extractedLines = lines.filter((line) => {
            const l = caseSensitive ? line : line.toLowerCase();
            const p = caseSensitive ? pattern : pattern.toLowerCase();
            return l.endsWith(p);
          });
          break;

        case "regex":
          try {
            const flags = caseSensitive ? "" : "i";
            const regex = new RegExp(pattern, flags);
            extractedLines = lines.filter((line) => regex.test(line));
          } catch (err) {
            return {
              success: false,
              data: "",
              error: `Invalid regex: ${err instanceof Error ? err.message : "Unknown error"}`,
              mimeType: "text/plain",
            };
          }
          break;

        default:
          extractedLines = [];
      }

      const output = extractedLines.join("\n");
      const matchedLines = extractedLines.length;
      const percentage = ((matchedLines / totalLines) * 100).toFixed(1);

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Mode", value: mode },
          { label: "Pattern", value: pattern },
          { label: "Total Lines", value: `${totalLines}` },
          { label: "Matched Lines", value: `${matchedLines} (${percentage}%)` },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Extraction failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};
