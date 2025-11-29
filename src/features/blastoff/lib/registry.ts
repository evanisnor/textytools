/**
 * Transform Registry
 * Defines all available transforms for the pipeline
 */

import { TransformDefinition, TransformType } from "../model/types";

import { countTokens } from "@/entities/counter";
import {
  sanitizeText,
  convertCase,
  csvToJson,
  jsonToCsv,
  decodeJWT,
  encodeText,
  decodeText,
  type SanitizationOptionId,
} from "@/entities/transform";

export const TRANSFORM_REGISTRY: Record<TransformType, TransformDefinition> = {
  "text-sanitize": {
    type: "text-sanitize",
    name: "Sanitize Text",
    description: "Remove empty lines, trim whitespace, normalize",
    category: "text",
    acceptsInput: ["text"],
    producesOutput: "text",
    defaultProperties: {
      filters: ["trimLines", "removeEmpty"],
    },
    propertySchema: [
      {
        key: "filters",
        type: "multi-select",
        label: "Filters",
        options: [
          "trimLines",
          "removeEmpty",
          "removeDuplicates",
          "normalizeWhitespace",
          "lowercase",
          "uppercase",
        ],
      },
    ],
    execute: (input, props) => {
      const filters = props.filters as SanitizationOptionId[];
      const options = filters.map((id) => ({
        id,
        label: id,
        description: "",
        enabled: true,
      }));
      return sanitizeText(input, options);
    },
  },

  "case-convert": {
    type: "case-convert",
    name: "Convert Case",
    description: "Transform text case (camelCase, snake_case, etc.)",
    category: "text",
    acceptsInput: ["text"],
    producesOutput: "text",
    defaultProperties: {
      format: "kebab",
    },
    propertySchema: [
      {
        key: "format",
        type: "select",
        label: "Format",
        options: [
          "upper",
          "lower",
          "title",
          "camel",
          "pascal",
          "snake",
          "kebab",
          "constant",
        ],
      },
    ],
    execute: (input, props) => {
      const format = props.format as string;
      return convertCase(
        input,
        format as "camel" | "pascal" | "snake" | "kebab" | "constant" | "title",
      );
    },
  },

  "text-count": {
    type: "text-count",
    name: "Text Statistics",
    description: "Count characters, words, lines, tokens",
    category: "text",
    acceptsInput: ["text"],
    producesOutput: "text",
    defaultProperties: {},
    propertySchema: [],
    execute: (input) => {
      const lines = input.split("\n").length;
      const words = input
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
      const chars = input.length;
      const tokens = countTokens(input);

      return `Statistics:
Characters: ${chars}
Words: ${words}
Lines: ${lines}
Tokens (GPT-4): ${tokens}`;
    },
  },

  "csv-to-json": {
    type: "csv-to-json",
    name: "CSV to JSON",
    description: "Parse CSV and convert to JSON array",
    category: "data",
    acceptsInput: ["text", "csv"],
    producesOutput: "json",
    defaultProperties: {
      delimiter: ",",
      hasHeader: true,
    },
    propertySchema: [
      {
        key: "delimiter",
        type: "select",
        label: "Delimiter",
        options: [
          { value: ",", label: "Comma" },
          { value: ";", label: "Semicolon" },
          { value: "\t", label: "Tab" },
          { value: "|", label: "Pipe" },
        ],
      },
      {
        key: "hasHeader",
        type: "boolean",
        label: "Has header row",
      },
    ],
    execute: (input, props) => {
      const delimiter = props.delimiter as string;
      const hasHeader = props.hasHeader as boolean;

      const result = csvToJson(input, delimiter, hasHeader);

      if (!result.success) {
        return `Error: ${result.error}`;
      }

      return result.output;
    },
  },

  "json-to-csv": {
    type: "json-to-csv",
    name: "JSON to CSV",
    description: "Convert JSON array to CSV format",
    category: "data",
    acceptsInput: ["json"],
    producesOutput: "csv",
    defaultProperties: {
      delimiter: ",",
    },
    propertySchema: [
      {
        key: "delimiter",
        type: "select",
        label: "Delimiter",
        options: [
          { value: ",", label: "Comma" },
          { value: ";", label: "Semicolon" },
          { value: "\t", label: "Tab" },
          { value: "|", label: "Pipe" },
        ],
      },
    ],
    execute: (input, props) => {
      const delimiter = props.delimiter as string;

      const result = jsonToCsv(input, delimiter, true);

      if (!result.success) {
        return `Error: ${result.error}`;
      }

      return result.output;
    },
  },

  "json-format": {
    type: "json-format",
    name: "Format JSON",
    description: "Pretty print or minify JSON",
    category: "data",
    acceptsInput: ["json", "text"],
    producesOutput: "json",
    defaultProperties: {
      indent: 2,
      sortKeys: false,
    },
    propertySchema: [
      {
        key: "indent",
        type: "select",
        label: "Indentation",
        options: ["2", "4", "0"],
      },
      {
        key: "sortKeys",
        type: "boolean",
        label: "Sort keys alphabetically",
      },
    ],
    execute: (input, props) => {
      try {
        const data = JSON.parse(input);
        const indent = Number(props.indent);
        const sortKeys = props.sortKeys as boolean;

        if (sortKeys) {
          const sortObject = (obj: unknown): unknown => {
            if (Array.isArray(obj)) {
              return obj.map(sortObject);
            }
            if (obj !== null && typeof obj === "object") {
              const sorted: Record<string, unknown> = {};
              Object.keys(obj)
                .sort()
                .forEach((key) => {
                  sorted[key] = sortObject(
                    (obj as Record<string, unknown>)[key],
                  );
                });
              return sorted;
            }
            return obj;
          };
          return JSON.stringify(sortObject(data), null, indent || undefined);
        }

        return JSON.stringify(data, null, indent || undefined);
      } catch {
        return "Error: Invalid JSON";
      }
    },
  },

  "json-validate": {
    type: "json-validate",
    name: "Validate JSON",
    description: "Check JSON syntax and display errors",
    category: "data",
    acceptsInput: ["text", "json"],
    producesOutput: "text",
    defaultProperties: {},
    propertySchema: [],
    execute: (input) => {
      try {
        JSON.parse(input);
        return "✓ Valid JSON";
      } catch (error) {
        return `✗ Invalid JSON:\n${error instanceof Error ? error.message : String(error)}`;
      }
    },
  },

  "regex-extract": {
    type: "regex-extract",
    name: "Regex Extract",
    description: "Extract matches using regular expression",
    category: "analysis",
    acceptsInput: ["text"],
    producesOutput: "csv",
    defaultProperties: {
      pattern: "",
      flags: "g",
    },
    propertySchema: [
      {
        key: "pattern",
        type: "text",
        label: "Pattern",
        placeholder: "(?<name>\\w+)",
      },
      {
        key: "flags",
        type: "text",
        label: "Flags",
        placeholder: "g, gi, gm",
      },
    ],
    execute: (input, props) => {
      try {
        const pattern = props.pattern as string;
        const flags = props.flags as string;

        // Return empty if no pattern
        if (!pattern || pattern.trim() === "") {
          return "";
        }

        const regex = new RegExp(pattern, flags);
        const matches = [...input.matchAll(regex)];

        if (matches.length === 0) return "";

        const firstMatch = matches[0];
        const hasNamedGroups =
          firstMatch.groups && Object.keys(firstMatch.groups).length > 0;

        const escapeCSV = (value: string): string => {
          if (
            value.includes(",") ||
            value.includes('"') ||
            value.includes("\n")
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        };

        if (hasNamedGroups) {
          const headers = Object.keys(firstMatch.groups!);
          const rows = matches.map((m) =>
            headers.map((h) => m.groups![h] || ""),
          );

          return [
            headers.join(","),
            ...rows.map((row) => row.map(escapeCSV).join(",")),
          ].join("\n");
        } else {
          return matches.map((m) => escapeCSV(m[0])).join("\n");
        }
      } catch (error) {
        return `Error: Invalid regex pattern - ${error instanceof Error ? error.message : String(error)}`;
      }
    },
  },

  "regex-replace": {
    type: "regex-replace",
    name: "Regex Replace",
    description: "Find and replace using regular expressions",
    category: "text",
    acceptsInput: ["text"],
    producesOutput: "text",
    defaultProperties: {
      pattern: "",
      replacement: "",
      flags: "g",
    },
    propertySchema: [
      {
        key: "pattern",
        type: "text",
        label: "Pattern",
        placeholder: "\\d+",
      },
      {
        key: "replacement",
        type: "text",
        label: "Replace with",
        placeholder: "X",
      },
      {
        key: "flags",
        type: "text",
        label: "Flags",
        placeholder: "g, gi, gm",
      },
    ],
    execute: (input, props) => {
      try {
        const pattern = props.pattern as string;
        const replacement = props.replacement as string;
        const flags = props.flags as string;

        // Return unchanged if no pattern
        if (!pattern || pattern.trim() === "") {
          return input;
        }

        const regex = new RegExp(pattern, flags);
        return input.replace(regex, replacement);
      } catch (error) {
        return `Error: Invalid regex pattern - ${error instanceof Error ? error.message : String(error)}`;
      }
    },
  },

  "jwt-decode": {
    type: "jwt-decode",
    name: "JWT Decode",
    description: "Decode JSON Web Token",
    category: "analysis",
    acceptsInput: ["text"],
    producesOutput: "json",
    defaultProperties: {},
    propertySchema: [],
    execute: (input) => {
      try {
        const decoded = decodeJWT(input);
        return JSON.stringify(
          { header: decoded.header, payload: decoded.payload },
          null,
          2,
        );
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : "Invalid JWT token"}`;
      }
    },
  },

  "base64-encode": {
    type: "base64-encode",
    name: "Base64 Encode",
    description: "Encode text to Base64",
    category: "encoding",
    acceptsInput: ["text"],
    producesOutput: "text",
    defaultProperties: {},
    propertySchema: [],
    execute: (input) => {
      try {
        return encodeText(input, "base64");
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : "Cannot encode text"}`;
      }
    },
  },

  "base64-decode": {
    type: "base64-decode",
    name: "Base64 Decode",
    description: "Decode Base64 to text",
    category: "encoding",
    acceptsInput: ["text"],
    producesOutput: "text",
    defaultProperties: {},
    propertySchema: [],
    execute: (input) => {
      try {
        return decodeText(input.trim(), "base64");
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : "Invalid Base64 string"}`;
      }
    },
  },

  "url-encode": {
    type: "url-encode",
    name: "URL Encode",
    description: "Encode text for URL usage",
    category: "encoding",
    acceptsInput: ["text"],
    producesOutput: "text",
    defaultProperties: {},
    propertySchema: [],
    execute: (input) => {
      return encodeText(input, "url");
    },
  },

  "url-decode": {
    type: "url-decode",
    name: "URL Decode",
    description: "Decode URL-encoded text",
    category: "encoding",
    acceptsInput: ["text"],
    producesOutput: "text",
    defaultProperties: {},
    propertySchema: [],
    execute: (input) => {
      try {
        return decodeText(input, "url");
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : "Invalid URL-encoded string"}`;
      }
    },
  },
};
