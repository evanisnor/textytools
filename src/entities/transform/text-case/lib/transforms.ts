/**
 * Text Case Transform Definition
 *
 * Wraps the text-case entity with Apogee TransformDefinition interface
 */

import type {
  PropertySchema,
  TransformDefinition,
  TransformResult,
} from "../../../transform/shared/types";
import type { CaseType } from "../model/types";

import { convertCase } from "./case-converters";

// ============================================================================
// Property Schema
// ============================================================================

/**
 * Case type options - shared with other transforms
 */
export const CASE_TYPE_OPTIONS = [
  { value: "upper", label: "UPPER CASE" },
  { value: "lower", label: "lower case" },
  { value: "title", label: "Title Case" },
  { value: "sentence", label: "Sentence case" },
  { value: "camel", label: "camelCase" },
  { value: "pascal", label: "PascalCase" },
  { value: "snake", label: "snake_case" },
  { value: "kebab", label: "kebab-case" },
  { value: "constant", label: "CONSTANT_CASE" },
  { value: "dot", label: "dot.case" },
  { value: "path", label: "path/case" },
];

const CASE_SCHEMA: PropertySchema[] = [
  {
    key: "caseType",
    label: "Case Type",
    type: "select",
    options: CASE_TYPE_OPTIONS,
    defaultValue: "lower",
  },
];

// ============================================================================
// Transform Definition
// ============================================================================

export const caseConvertTransform: TransformDefinition = {
  type: "case-convert",
  name: "Change Case",
  description:
    "Convert text between different case styles: UPPER, lower, Title, camelCase, snake_case, kebab-case, and more.",
  category: "manipulate",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  propertySchema: CASE_SCHEMA,
  defaultProperties: {
    caseType: "lower",
  },

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
          { label: "Case Type", value: String(properties.caseType || "lower") },
        ],
      };
    }

    const caseType = (properties.caseType as CaseType) || "lower";

    try {
      const output = convertCase(input, caseType);

      // Calculate case statistics
      const upperCount = (output.match(/[A-Z]/g) || []).length;
      const lowerCount = (output.match(/[a-z]/g) || []).length;

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Case Type", value: caseType },
          { label: "Length", value: output.length },
          ...(upperCount > 0
            ? [{ label: "Uppercase", value: upperCount }]
            : []),
          ...(lowerCount > 0
            ? [{ label: "Lowercase", value: lowerCount }]
            : []),
        ],
      };
    } catch (error) {
      return {
        success: false,
        data: "",
        error: `Case conversion failed: ${error instanceof Error ? error.message : String(error)}`,
        mimeType: "text/plain",
        stats: [],
      };
    }
  },
};
