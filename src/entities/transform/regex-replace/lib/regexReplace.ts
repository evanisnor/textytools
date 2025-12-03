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

      // Extract named groups from the pattern in order
      const namedGroupPattern = /\(\?<(\w+)>/g;
      const namedGroups: string[] = [];
      let match;
      while ((match = namedGroupPattern.exec(pattern)) !== null) {
        namedGroups.push(match[1]);
      }

      // Check if replacement contains commas
      const hasCommaDelimitedReplacement = replacement.includes(",");
      const hasNamedGroups = namedGroups.length > 0;
      const shouldGenerateHeader =
        hasCommaDelimitedReplacement && hasNamedGroups;

      let output = input.replace(regex, replacement);

      // Count matches
      const matchCount = (input.match(regex) || []).length;

      // Generate CSV header if conditions are met
      if (shouldGenerateHeader) {
        const orderedGroups: string[] = [];

        // Check if replacement uses named placeholders ($<name> or ${name})
        const namedPlaceholderPattern = /\$(?:<(\w+)>|\{(\w+)\})/g;
        let placeholderMatch;
        let hasNamedPlaceholders = false;

        while (
          (placeholderMatch = namedPlaceholderPattern.exec(replacement)) !==
          null
        ) {
          hasNamedPlaceholders = true;
          const namedGroup = placeholderMatch[1] || placeholderMatch[2];
          if (namedGroup && namedGroups.includes(namedGroup)) {
            if (!orderedGroups.includes(namedGroup)) {
              orderedGroups.push(namedGroup);
            }
          }
        }

        // If using numbered placeholders ($1, $2, etc.), use named groups in order
        if (!hasNamedPlaceholders) {
          // Extract numbered placeholders to determine which groups are used
          const numberedPlaceholderPattern = /\$(\d+)/g;
          const usedGroupNumbers: number[] = [];

          while (
            (placeholderMatch =
              numberedPlaceholderPattern.exec(replacement)) !== null
          ) {
            const groupNum = parseInt(placeholderMatch[1], 10);
            if (!usedGroupNumbers.includes(groupNum)) {
              usedGroupNumbers.push(groupNum);
            }
          }

          // Map numbered groups to named groups (1-indexed)
          usedGroupNumbers.sort((a, b) => a - b);
          for (const groupNum of usedGroupNumbers) {
            const groupIndex = groupNum - 1; // Convert to 0-indexed
            if (groupIndex >= 0 && groupIndex < namedGroups.length) {
              orderedGroups.push(namedGroups[groupIndex]);
            }
          }
        }

        // If we found ordered groups, prepend them as a header
        if (orderedGroups.length > 0) {
          const header = orderedGroups.join(",");
          output = header + "\n" + output;
        }
      }

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Pattern", value: `/${pattern}/${flags}` },
          { label: "Matches", value: `${matchCount}` },
          { label: "Replacement", value: replacement || "(empty)" },
          ...(shouldGenerateHeader
            ? [{ label: "CSV Header", value: "Generated" }]
            : []),
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
