/**
 * Input Lens Pass: Data Selection and Parsing
 *
 * The lens pass extracts and parses data before transformation.
 * This allows precise targeting of specific data within the previous output.
 */

import type { InputSelection, LensResult } from "../model/types";

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
          error: "Regex mode requires a pattern",
        };
      }

      try {
        const regex = new RegExp(
          selection.regexPattern,
          selection.regexFlags || "",
        );
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
