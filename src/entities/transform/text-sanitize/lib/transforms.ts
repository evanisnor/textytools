/**
 * Text Sanitize Transform Definitions
 *
 * Wraps the text-sanitize entity with Apogee TransformDefinition interface
 */

import type {
  PropertySchema,
  TransformDefinition,
  TransformResult,
} from "../../../transform/shared/types";
import type { SanitizationOption, SanitizationOptionId } from "../model/types";

import { sanitizeText } from "./sanitizer";

// ============================================================================
// Property Schema
// ============================================================================

const DEFAULT_OPTIONS: Record<SanitizationOptionId, boolean> = {
  trimLines: false,
  removeEmptyLines: false,
  removeDuplicateLines: false,
  removeExtraSpaces: false,
  removeNonAscii: false,
  removeEmoji: false,
  removeNumbers: false,
  removePunctuation: false,
  removeSpecialChars: false,
  normalizeWhitespace: false,
  sortLines: false,
  reverseLines: false,
};

const SANITIZATION_SCHEMA: PropertySchema[] = [
  {
    key: "trimLines",
    label: "Trim Lines",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "removeEmptyLines",
    label: "Remove Empty Lines",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "removeDuplicateLines",
    label: "Remove Duplicate Lines",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "removeExtraSpaces",
    label: "Remove Extra Spaces",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "removeNonAscii",
    label: "Remove Non-ASCII",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "removeEmoji",
    label: "Remove Emoji",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "removeNumbers",
    label: "Remove Numbers",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "removePunctuation",
    label: "Remove Punctuation",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "removeSpecialChars",
    label: "Remove Special Characters",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "normalizeWhitespace",
    label: "Normalize Whitespace",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "sortLines",
    label: "Sort Lines",
    type: "toggle",
    defaultValue: false,
  },
  {
    key: "reverseLines",
    label: "Reverse Lines",
    type: "toggle",
    defaultValue: false,
  },
];

// ============================================================================
// Transform Definition
// ============================================================================

export const textSanitizeTransform: TransformDefinition = {
  type: "text-sanitize",
  name: "Text Sanitize",
  description:
    "Clean and normalize text with multiple sanitization options. Apply trimming, remove empty lines, filter characters, and more.",
  category: "manipulate",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  propertySchema: SANITIZATION_SCHEMA,
  defaultProperties: DEFAULT_OPTIONS,

  execute: (
    input: string,
    properties: Record<string, unknown>,
  ): TransformResult => {
    if (!input || input.trim().length === 0) {
      return {
        success: true,
        data: "",
        mimeType: "text/plain",
        stats: [
          { label: "Input Length", value: 0 },
          { label: "Output Length", value: 0 },
          { label: "Options Enabled", value: 0 },
        ],
      };
    }

    // Convert properties to SanitizationOption format
    const options: SanitizationOption[] = SANITIZATION_SCHEMA.map((schema) => ({
      id: schema.key as SanitizationOptionId,
      label: schema.label,
      description: `${schema.label} operation`,
      enabled: Boolean(properties[schema.key]),
    }));

    const enabledCount = options.filter((opt) => opt.enabled).length;

    try {
      const output = sanitizeText(input, options);

      const inputLines = input.split("\n").length;
      const outputLines = output.split("\n").length;
      const removedLines = inputLines - outputLines;

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Input Length", value: input.length },
          { label: "Output Length", value: output.length },
          { label: "Options Enabled", value: enabledCount },
          ...(removedLines > 0
            ? [{ label: "Lines Removed", value: removedLines }]
            : []),
        ],
      };
    } catch (error) {
      return {
        success: false,
        data: "",
        error: `Sanitization failed: ${error instanceof Error ? error.message : String(error)}`,
        mimeType: "text/plain",
        stats: [],
      };
    }
  },
};
