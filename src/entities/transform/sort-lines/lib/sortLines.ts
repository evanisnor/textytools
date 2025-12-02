/**
 * Sort Lines Transform
 * Sort text lines in various orders
 */

import type { TransformDefinition, TransformResult } from "../../shared/types";

export const sortLinesDefinition: TransformDefinition = {
  type: "sort-lines",
  name: "Sort Lines",
  description: "Sort text lines alphabetically, numerically, or by length",
  category: "manipulate",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  propertySchema: [
    {
      key: "sortType",
      label: "Sort Type",
      type: "select",
      options: [
        { value: "alphabetical", label: "Alphabetical" },
        { value: "numerical", label: "Numerical" },
        { value: "length", label: "By Length" },
      ],
      defaultValue: "alphabetical",
    },
    {
      key: "order",
      label: "Order",
      type: "select",
      options: [
        { value: "ascending", label: "Ascending" },
        { value: "descending", label: "Descending" },
      ],
      defaultValue: "ascending",
    },
    {
      key: "caseSensitive",
      label: "Case Sensitive",
      type: "toggle",
      defaultValue: false,
    },
  ],
  defaultProperties: {
    sortType: "alphabetical",
    order: "ascending",
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

    const sortType = properties.sortType as string;
    const order = properties.order as string;
    const caseSensitive = properties.caseSensitive as boolean;

    try {
      const lines = input.split("\n");
      const originalCount = lines.length;

      let sortedLines: string[];

      switch (sortType) {
        case "numerical":
          sortedLines = lines.sort((a, b) => {
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            if (isNaN(numA) && isNaN(numB)) return 0;
            if (isNaN(numA)) return 1;
            if (isNaN(numB)) return -1;
            return numA - numB;
          });
          break;

        case "length":
          sortedLines = lines.sort((a, b) => a.length - b.length);
          break;

        case "alphabetical":
        default:
          sortedLines = lines.sort((a, b) => {
            const strA = caseSensitive ? a : a.toLowerCase();
            const strB = caseSensitive ? b : b.toLowerCase();
            return strA.localeCompare(strB);
          });
          break;
      }

      if (order === "descending") {
        sortedLines.reverse();
      }

      const output = sortedLines.join("\n");

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Sort Type", value: sortType },
          { label: "Order", value: order },
          { label: "Lines Sorted", value: `${originalCount}` },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: input,
        error: `Sort failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};
