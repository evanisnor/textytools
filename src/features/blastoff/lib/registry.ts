/**
 * Transform Registry
 * Defines all available transforms for the pipeline
 */

import { TransformDefinition, TransformType } from "../model/types";

import { countTokens } from "@/entities/counter";
import { isExpired, isNotYetValid, formatDate } from "@/entities/jwt";
import {
  sanitizeText,
  convertCase,
  csvToJson,
  jsonToCsv,
  decodeJWT,
  encodeText,
  decodeText,
  type SanitizationOptionId,
  type EncodingType,
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
      trimLines: true,
      removeEmptyLines: true,
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
    },
    propertySchema: [
      {
        key: "trimLines",
        type: "toggle",
        label: "Trim Lines",
      },
      {
        key: "removeEmptyLines",
        type: "toggle",
        label: "Remove Empty Lines",
      },
      {
        key: "removeDuplicateLines",
        type: "toggle",
        label: "Remove Duplicates",
      },
      {
        key: "removeExtraSpaces",
        type: "toggle",
        label: "Remove Extra Spaces",
      },
      {
        key: "removeNonAscii",
        type: "toggle",
        label: "Remove Non-ASCII",
      },
      {
        key: "removeEmoji",
        type: "toggle",
        label: "Remove Emoji",
      },
      {
        key: "removeNumbers",
        type: "toggle",
        label: "Remove Numbers",
      },
      {
        key: "removePunctuation",
        type: "toggle",
        label: "Remove Punctuation",
      },
      {
        key: "removeSpecialChars",
        type: "toggle",
        label: "Remove Special Chars",
      },
      {
        key: "normalizeWhitespace",
        type: "toggle",
        label: "Normalize Whitespace",
      },
      {
        key: "sortLines",
        type: "toggle",
        label: "Sort Lines",
      },
      {
        key: "reverseLines",
        type: "toggle",
        label: "Reverse Lines",
      },
    ],
    execute: (input, props) => {
      const enabledFilters: SanitizationOptionId[] = [];

      if (props.trimLines) enabledFilters.push("trimLines");
      if (props.removeEmptyLines) enabledFilters.push("removeEmptyLines");
      if (props.removeDuplicateLines)
        enabledFilters.push("removeDuplicateLines");
      if (props.removeExtraSpaces) enabledFilters.push("removeExtraSpaces");
      if (props.removeNonAscii) enabledFilters.push("removeNonAscii");
      if (props.removeEmoji) enabledFilters.push("removeEmoji");
      if (props.removeNumbers) enabledFilters.push("removeNumbers");
      if (props.removePunctuation) enabledFilters.push("removePunctuation");
      if (props.removeSpecialChars) enabledFilters.push("removeSpecialChars");
      if (props.normalizeWhitespace) enabledFilters.push("normalizeWhitespace");
      if (props.sortLines) enabledFilters.push("sortLines");
      if (props.reverseLines) enabledFilters.push("reverseLines");

      const options = enabledFilters.map((id) => ({
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
        key: "hasHeader",
        type: "toggle",
        label: "With Header Row",
      },
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
      mode: "pretty",
      indent: 2,
      sortKeys: false,
    },
    propertySchema: [
      {
        key: "mode",
        type: "toggle-group",
        label: "Format",
        options: [
          { value: "pretty", label: "Pretty" },
          { value: "minify", label: "Minify" },
        ],
      },
      {
        key: "sortKeys",
        type: "toggle",
        label: "Sort Keys",
      },
      {
        key: "indent",
        type: "select",
        label: "Indentation",
        options: ["2", "4", "8"],
      },
    ],
    execute: (input, props) => {
      try {
        const data = JSON.parse(input);
        const mode = props.mode as string;
        const indent = Number(props.indent);
        const sortKeys = props.sortKeys as boolean;

        // Determine actual indent based on mode
        const actualIndent = mode === "minify" ? 0 : indent;

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
          return JSON.stringify(
            sortObject(data),
            null,
            actualIndent || undefined,
          );
        }

        return JSON.stringify(data, null, actualIndent || undefined);
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
    name: "JWT Verify",
    description: "Decode and verify JSON Web Token",
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
    getStats: (_output, input) => {
      try {
        const decoded = decodeJWT(input);
        const stats: Record<string, string | number | boolean> = {};

        if (decoded.algorithm) {
          stats.Algorithm = decoded.algorithm;
        }

        if (decoded.issuedAt) {
          stats["Issued At"] = formatDate(decoded.issuedAt);
        }

        if (decoded.expiresAt) {
          stats["Expires At"] = formatDate(decoded.expiresAt);
          const expired = isExpired(decoded.expiresAt);
          if (expired) {
            stats.Status = "⚠️ Expired";
          }
        }

        if (decoded.notBefore) {
          stats["Not Before"] = formatDate(decoded.notBefore);
          const notYetValid = isNotYetValid(decoded.notBefore);
          if (notYetValid) {
            stats.Status = "⚠️ Not Yet Valid";
          }
        }

        if (
          !stats.Status &&
          decoded.expiresAt &&
          !isExpired(decoded.expiresAt)
        ) {
          stats.Status = "✓ Valid";
        }

        return Object.keys(stats).length > 0 ? stats : null;
      } catch {
        return null;
      }
    },
  },

  "text-encode": {
    type: "text-encode",
    name: "Encode",
    description: "Encode text using various formats",
    category: "encoding",
    acceptsInput: ["text"],
    producesOutput: "text",
    defaultProperties: {
      encoding: "base64",
    },
    propertySchema: [
      {
        key: "encoding",
        type: "select",
        label: "Encoding",
        options: [
          { value: "base64", label: "Base64" },
          { value: "base58", label: "Base58 (Bitcoin)" },
          { value: "base91", label: "Base91" },
          { value: "ascii85", label: "ASCII85 (Adobe)" },
          { value: "z85", label: "Z85 (ZeroMQ)" },
          { value: "url", label: "URL Encoding" },
          { value: "html", label: "HTML Entities" },
          { value: "hex", label: "Hexadecimal" },
          { value: "binary", label: "Binary" },
          { value: "unicode", label: "Unicode Escape" },
          { value: "rot13", label: "ROT13" },
          { value: "morse", label: "Morse Code" },
          { value: "quotedPrintable", label: "Quoted-Printable (MIME)" },
        ],
      },
    ],
    execute: (input, props) => {
      try {
        const encoding = props.encoding as EncodingType;
        return encodeText(input, encoding);
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : "Cannot encode text"}`;
      }
    },
  },

  "text-decode": {
    type: "text-decode",
    name: "Decode",
    description: "Decode text from various formats",
    category: "encoding",
    acceptsInput: ["text"],
    producesOutput: "text",
    defaultProperties: {
      encoding: "base64",
    },
    propertySchema: [
      {
        key: "encoding",
        type: "select",
        label: "Encoding",
        options: [
          { value: "base64", label: "Base64" },
          { value: "base58", label: "Base58 (Bitcoin)" },
          { value: "base91", label: "Base91" },
          { value: "ascii85", label: "ASCII85 (Adobe)" },
          { value: "z85", label: "Z85 (ZeroMQ)" },
          { value: "url", label: "URL Encoding" },
          { value: "html", label: "HTML Entities" },
          { value: "hex", label: "Hexadecimal" },
          { value: "binary", label: "Binary" },
          { value: "unicode", label: "Unicode Escape" },
          { value: "rot13", label: "ROT13" },
          { value: "morse", label: "Morse Code" },
          { value: "quotedPrintable", label: "Quoted-Printable (MIME)" },
        ],
      },
    ],
    execute: (input, props) => {
      try {
        const encoding = props.encoding as EncodingType;
        return decodeText(input.trim(), encoding);
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : "Cannot decode text"}`;
      }
    },
  },
};
