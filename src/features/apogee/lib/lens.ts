/**
 * Input Lens Pass: Data Selection and Parsing
 *
 * The lens pass extracts and parses data before transformation.
 * This allows precise targeting of specific data within the previous output.
 */

import type { InputSelection, LensResult } from "../model/types";

/**
 * Preview result for regex patterns
 */
export interface RegexPreviewResult {
  type: "success" | "error" | "info";
  message: string;
  count?: number;
}

/**
 * Get a preview of the first match for a regex pattern
 * Used for live feedback in the UI
 */
export function getRegexPreview(
  pattern: string,
  flags: string,
  input: string,
): RegexPreviewResult {
  if (!pattern) {
    return { type: "info", message: "Enter a pattern to preview" };
  }

  if (!input) {
    return { type: "info", message: "No input data to preview" };
  }

  try {
    // Validate regex pattern first
    const regex = new RegExp(pattern, flags);

    // Check for empty matches
    if (regex.test("")) {
      return {
        type: "error",
        message: "Pattern matches empty strings",
      };
    }

    // Extract named groups
    const namedGroupPattern = /\(\?<(\w+)>/g;
    const namedGroups: string[] = [];
    let match;
    while ((match = namedGroupPattern.exec(pattern)) !== null) {
      namedGroups.push(match[1]);
    }

    if (namedGroups.length > 0) {
      // Named groups extraction
      const globalRegex = new RegExp(
        pattern,
        flags.includes("g") ? flags : flags + "g",
      );

      const execMatch = globalRegex.exec(input);
      if (!execMatch) {
        return { type: "info", message: "No matches found" };
      }

      const obj: Record<string, string> = {};
      for (const groupName of namedGroups) {
        obj[groupName] = execMatch.groups?.[groupName] || "";
      }

      return {
        type: "success",
        message: `${JSON.stringify(obj)}`,
      };
    } else {
      // Simple extraction
      const matches = input.match(regex);
      if (!matches || matches.length === 0) {
        return { type: "info", message: "No matches found" };
      }

      return {
        type: "success",
        message: `${matches[0]}`,
        count: matches.length,
      };
    }
  } catch (err) {
    return {
      type: "error",
      message: `Invalid regex: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Execute the lens pass to extract and parse data
 */
export async function executeLensPass(
  input: string,
  selection: InputSelection,
): Promise<LensResult> {
  const { mode, parseAs } = selection;

  // Step 1: Extract data based on mode
  let extracted: string;
  let metadata: LensResult["metadata"] = { mode };

  switch (mode) {
    case "all":
      // Pass through entire input unchanged
      extracted = input;
      break;

    case "regex": {
      // Extract using regular expression
      if (!selection.regexPattern) {
        return {
          success: false,
          data: "",
          error:
            "Your data is unstructured. Please provide a regex pattern to extract the relevant information. You can use named capture groups to extract structured data. Example:\n\n(?<name>\\w+): (?<email>\\S+@\\S+)",
        };
      }

      try {
        const regex = new RegExp(
          selection.regexPattern,
          selection.regexFlags || "",
        );

        // Check if pattern has named groups
        const namedGroupPattern = /\(\?<(\w+)>/g;
        const namedGroups: string[] = [];
        let match;
        while (
          (match = namedGroupPattern.exec(selection.regexPattern)) !== null
        ) {
          namedGroups.push(match[1]);
        }

        // Test if pattern can match empty strings
        if (regex.test("")) {
          return {
            success: false,
            data: "",
            error:
              "Pattern matches empty strings. Please use a pattern that matches actual content.",
          };
        }

        if (namedGroups.length > 0) {
          // Extract with named groups - create structured data
          const results: Record<string, string>[] = [];
          const globalRegex = new RegExp(
            selection.regexPattern,
            (selection.regexFlags || "").includes("g")
              ? selection.regexFlags
              : (selection.regexFlags || "") + "g",
          );

          let execMatch;
          while ((execMatch = globalRegex.exec(input)) !== null) {
            const obj: Record<string, string> = {};
            for (const groupName of namedGroups) {
              obj[groupName] = execMatch.groups?.[groupName] || "";
            }
            results.push(obj);

            // Prevent infinite loop on zero-length matches
            if (execMatch[0].length === 0) {
              globalRegex.lastIndex++;
            }
          }

          if (results.length === 0) {
            return {
              success: false,
              data: "",
              error: `Pattern not found: ${selection.regexPattern}`,
              metadata: { mode: "regex", matchCount: 0 },
            };
          }

          // Return as JSON array
          extracted = JSON.stringify(results, null, 2);
          metadata = { mode: "regex", matchCount: results.length };
        } else {
          // No named groups - return simple matches
          const matches = input.match(regex);

          if (!matches || matches.length === 0) {
            return {
              success: false,
              data: "",
              error: `Pattern not found: ${selection.regexPattern}`,
              metadata: { mode: "regex", matchCount: 0 },
            };
          }

          // Join all matches with newlines
          extracted = matches.join("\n");
          metadata = { mode: "regex", matchCount: matches.length };
        }
      } catch (err) {
        return {
          success: false,
          data: "",
          error: `Invalid regex: ${err instanceof Error ? err.message : String(err)}`,
        };
      }
      break;
    }

    case "jsonpath": {
      // Extract using JSONPath query
      // Note: Full JSONPath support requires a library - this is a placeholder
      if (!selection.jsonPath) {
        return {
          success: false,
          data: "",
          error: "JSONPath mode requires a query",
        };
      }

      // Placeholder: In Phase 6, integrate jsonpath library
      return {
        success: false,
        data: "",
        error: "JSONPath mode not yet implemented (Phase 6)",
      };
    }

    case "csv-column": {
      // Extract specific CSV column(s)
      if (selection.csvColumn === undefined) {
        return {
          success: false,
          data: "",
          error: "CSV mode requires column index/name",
        };
      }

      try {
        const rows = input.split("\n").map((line) => line.split(","));
        const columnIndex =
          typeof selection.csvColumn === "number"
            ? selection.csvColumn
            : rows[0].indexOf(selection.csvColumn);

        if (columnIndex === -1) {
          return {
            success: false,
            data: "",
            error: `Column not found: ${selection.csvColumn}`,
          };
        }

        const columnData = rows.map((row) => row[columnIndex]).join("\n");
        extracted = columnData;
      } catch (err) {
        return {
          success: false,
          data: "",
          error: `CSV parse error: ${err instanceof Error ? err.message : String(err)}`,
        };
      }
      break;
    }

    case "xml-xpath": {
      // Extract using XPath query
      // Note: Full XPath support requires browser APIs - this is a placeholder
      if (!selection.xpathQuery) {
        return {
          success: false,
          data: "",
          error: "XPath mode requires a query",
        };
      }

      // Placeholder: In Phase 6, integrate XPath support
      return {
        success: false,
        data: "",
        error: "XPath mode not yet implemented (Phase 6)",
      };
    }

    default:
      return {
        success: false,
        data: "",
        error: `Unknown lens mode: ${mode}`,
      };
  }

  // Step 2: Parse extracted data (if parseAs hint provided)
  if (parseAs && parseAs !== "auto" && parseAs !== "text") {
    try {
      const parsed = parseData(extracted, parseAs);
      return {
        success: true,
        data: parsed,
        metadata: { ...metadata, parseAs },
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Parse error (${parseAs}): ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  return { success: true, data: extracted, metadata };
}

/**
 * Parse data according to format hint
 */
function parseData(data: string, format: string): string {
  switch (format) {
    case "json":
      // Validate and normalize JSON
      return JSON.stringify(JSON.parse(data), null, 2);

    case "csv":
      // Normalize CSV (validate structure)
      const rows = data.split("\n").map((line) => line.split(","));
      return rows.map((row) => row.join(",")).join("\n");

    case "yaml":
      // Placeholder: In Phase 2, integrate yaml library
      throw new Error("YAML parsing not yet implemented (Phase 2)");

    case "xml":
      // Placeholder: In Phase 2, integrate XML parsing
      throw new Error("XML parsing not yet implemented (Phase 2)");

    case "toml":
      // Placeholder: In Phase 2, integrate TOML library
      throw new Error("TOML parsing not yet implemented (Phase 2)");

    default:
      return data;
  }
}
