/**
 * Regex Replace Transform
 * Find and replace text using regular expressions
 */

import type { TransformDefinition, TransformResult } from "../../shared/types";

export const regexReplaceDefinition: TransformDefinition = {
  type: "regex-replace",
  name: "Regex Replace",
  description: "Find and replace text using regular expressions",
  category: "manipulate",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  propertySchema: [
    {
      key: "pattern",
      label: "Pattern",
      type: "text",
      defaultValue: "",
    },
    {
      key: "replacement",
      label: "Replacement",
      type: "text",
      defaultValue: "",
    },
    {
      key: "flags",
      label: "Flags",
      type: "text",
      defaultValue: "g",
    },
  ],
  defaultProperties: {
    pattern: "",
    replacement: "",
    flags: "g",
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

    const pattern = properties.pattern as string;
    const replacement = properties.replacement as string;
    const flags = properties.flags as string;

    if (!pattern) {
      return {
        success: false,
        data: input,
        error: "Pattern is required",
        mimeType: "text/plain",
      };
    }

    try {
      const regex = new RegExp(pattern, flags);
      const output = input.replace(regex, replacement);

      // Count matches
      const matchCount = (input.match(regex) || []).length;

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Pattern", value: `/${pattern}/${flags}` },
          { label: "Matches", value: `${matchCount}` },
          { label: "Replacement", value: replacement || "(empty)" },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: input,
        error: `Invalid regex: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};
