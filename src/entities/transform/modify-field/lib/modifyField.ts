/**
 * Modify Field Transform
 * Modifies specific fields in structured data (JSON/YAML/TOML/XML/CSV)
 */

import { parse as parseDate, format as formatDateFns } from "date-fns";
import { JSONPath } from "jsonpath-plus";

import { detectFormat, parseToIntermediate } from "../../shared";
import type { PropertySchema, TransformResult } from "../../shared/types";
import type { ModifyFieldProperties } from "../model/types";
import { createStrftimeModalProperty } from "../ui/StrftimeModal";

import { jsonToCsv } from "@/entities/transform/csv-json/lib/json-to-csv";
import { CASE_TYPE_OPTIONS, convertCase } from "@/entities/transform/text-case";
import {
  sanitizeText,
  type SanitizationOption,
} from "@/entities/transform/text-sanitize";
import { defaultOptions as defaultSanitizeOptions } from "@/entities/transform/text-sanitize/model/presets";
import { jsonToXML } from "@/entities/xml/lib/format";
import { formatYAML } from "@/entities/yaml/lib/format";

/**
 * Property schema for Modify Field transform
 */
export const modifyFieldPropertySchema: PropertySchema[] = [
  // Field Selector (shown in Lens)
  {
    key: "fieldPath",
    label: "Field Path",
    type: "text",
    defaultValue: "",
    placeholder: "$.users[*].name",
    showInLens: true,
  },
  {
    key: "operation",
    label: "Operation",
    type: "toggle-group",
    options: [
      { value: "regex-replace", label: "Regex Replace" },
      { value: "date-format", label: "Date Format" },
      { value: "case-convert", label: "Case Convert" },
      { value: "sanitize", label: "Sanitize" },
    ],
    defaultValue: "regex-replace",
    showInLens: true,
  },
  // Regex Replace options
  {
    key: "regexPattern",
    label: "Pattern",
    type: "text",
    defaultValue: "",
    placeholder: "e.g., \\d{4}-\\d{2}-\\d{2}",
    showWhen: { operation: "regex-replace" },
    width: "flex-start",
  },
  {
    key: "regexFlags",
    label: "Flags",
    type: "text",
    defaultValue: "g",
    placeholder: "g",
    showWhen: { operation: "regex-replace" },
    width: "auto",
  },
  {
    key: "regexReplacement",
    label: "Replacement",
    type: "text",
    defaultValue: "",
    placeholder: "e.g., $1",
    showWhen: { operation: "regex-replace" },
    width: "flex-start",
  },
  // Case Convert options (reuse from text-case entity)
  {
    key: "caseFormat",
    label: "Case Format",
    type: "select",
    options: CASE_TYPE_OPTIONS,
    defaultValue: "lower",
    showWhen: { operation: "case-convert" },
  },
  // Sanitize options (reuse from text-sanitize entity)
  // Note: Order of selection is preserved - operations applied in order selected
  {
    key: "sanitizeOptions",
    type: "multi-select",
    options: defaultSanitizeOptions.map((opt) => ({
      value: opt.id,
      label: opt.label,
    })),
    defaultValue: [],
    helpText: "Select options in the order you want them applied",
    showWhen: { operation: "sanitize" },
  },
  // Date Format options
  {
    key: "inputDateFormat",
    label: "Input Format",
    type: "select",
    options: [
      { value: "iso8601", label: "ISO 8601 (YYYY-MM-DD)" },
      { value: "rfc3339", label: "RFC 3339 (YYYY-MM-DDTHH:mm:ssZ)" },
      { value: "unix-seconds", label: "Unix Timestamp (seconds)" },
      { value: "unix-milliseconds", label: "Unix Timestamp (milliseconds)" },
      { value: "apache-log", label: "Apache Log (12/Jan/2025:14:23:54 +0000)" },
      { value: "custom", label: "Custom (strftime)" },
    ],
    defaultValue: "rfc3339",
    showWhen: { operation: "date-format" },
    width: "flex-start",
  },
  {
    key: "customInputDateFormat",
    label: "Custom Input",
    type: "text",
    defaultValue: "%Y-%m-%d",
    placeholder: "%Y-%m-%d",
    showWhen: { operation: "date-format", inputDateFormat: "custom" },
    width: "flex",
  },
  {
    key: "outputDateFormat",
    label: "Output Format",
    type: "select",
    options: [
      { value: "iso8601", label: "ISO 8601 (YYYY-MM-DD)" },
      { value: "rfc3339", label: "RFC 3339 (YYYY-MM-DDTHH:mm:ssZ)" },
      { value: "unix-seconds", label: "Unix Timestamp (seconds)" },
      { value: "unix-milliseconds", label: "Unix Timestamp (milliseconds)" },
      { value: "custom", label: "Custom (strftime)" },
    ],
    defaultValue: "rfc3339",
    showWhen: { operation: "date-format" },
    width: "flex-start",
  },
  {
    key: "customOutputDateFormat",
    label: "Custom Output",
    type: "text",
    defaultValue: "%Y-%m-%d",
    placeholder: "%Y-%m-%d",
    showWhen: { operation: "date-format", outputDateFormat: "custom" },
    width: "flex",
  },
  createStrftimeModalProperty(),
];

/**
 * Default properties for Modify Field transform
 */
export const modifyFieldDefaultProperties: Record<string, unknown> = {
  fieldPath: "",
  operation: "regex-replace",
  regexPattern: "",
  regexFlags: "g",
  regexReplacement: "",
  caseFormat: "lower",
  sanitizeOptions: [],
  inputDateFormat: "rfc3339",
  customInputDateFormat: "%Y-%m-%d",
  outputDateFormat: "rfc3339",
  customOutputDateFormat: "%Y-%m-%d",
  dateFormatHelp: "",
};

/**
 * Execute Modify Field transform
 */
export function executeModifyField(
  input: string,
  properties: Record<string, unknown>,
): TransformResult {
  if (!input || input.trim() === "") {
    return {
      success: false,
      data: "",
      error: "Input is empty",
      mimeType: "text/plain",
    };
  }

  const props = properties as unknown as ModifyFieldProperties;

  // Validate field path is provided
  if (!props.fieldPath || props.fieldPath.trim() === "") {
    return {
      success: false,
      data: "",
      error: "Field path is required",
      mimeType: "text/plain",
    };
  }

  // Detect and parse input format
  const format = detectFormat(input);
  if (format === "unknown") {
    return {
      success: false,
      data: "",
      error: "Unable to detect input format. Supported: JSON, CSV, YAML, XML",
      mimeType: "text/plain",
    };
  }

  // TOML not supported
  if (format === "toml") {
    return {
      success: false,
      data: "",
      error: "TOML format is not supported by Modify Field transform",
      mimeType: "text/plain",
    };
  }

  // Determine field selector based on format
  const fieldSelector: ModifyFieldProperties["fieldSelector"] =
    format === "xml" ? "xpath" : format === "csv" ? "csv-column" : "jsonpath";

  const parseResult = parseToIntermediate(input, format);
  if (!parseResult.success || !parseResult.data) {
    return {
      success: false,
      data: "",
      error: parseResult.error || "Failed to parse input",
      mimeType: "text/plain",
    };
  }

  try {
    // Deep clone the data to avoid mutation
    const data = JSON.parse(JSON.stringify(parseResult.data));

    // Validate data is an object
    if (typeof data !== "object" || data === null) {
      return {
        success: false,
        data: "",
        error: "Data must be an object or array",
        mimeType: "text/plain",
      };
    }

    // Select and modify fields
    const propsWithSelector = { ...props, fieldSelector };
    const modifiedCount = modifyFields(data, propsWithSelector);
    if (modifiedCount === 0) {
      return {
        success: false,
        data: "",
        error: `No fields found matching path: ${props.fieldPath}`,
        mimeType: "text/plain",
      };
    }

    // Serialize back to same format as input
    let output: string;
    const mimeType = formatToMimeType(format);

    switch (format) {
      case "json":
        output = JSON.stringify(data, null, 2);
        break;

      case "csv": {
        const csvResult = jsonToCsv(JSON.stringify(data), ",", true);
        if (!csvResult.success) {
          return {
            success: false,
            data: "",
            error: `Failed to convert back to CSV: ${csvResult.error}`,
            mimeType: "text/plain",
          };
        }
        output = csvResult.output;
        break;
      }

      case "yaml":
        output = formatYAML(data);
        break;

      case "xml":
        output = jsonToXML(data);
        break;

      default:
        output = JSON.stringify(data, null, 2);
    }

    return {
      success: true,
      data: output,
      mimeType,
      stats: [
        { label: "Fields Modified", value: modifiedCount },
        { label: "Operation", value: props.operation },
        { label: "Format", value: format.toUpperCase() },
      ],
    };
  } catch (err) {
    return {
      success: false,
      data: "",
      error: `Failed to modify field: ${err instanceof Error ? err.message : "Unknown error"}`,
      mimeType: "text/plain",
    };
  }
}

/**
 * Map format to MIME type
 */
function formatToMimeType(format: string): string {
  switch (format) {
    case "json":
      return "application/json";
    case "csv":
      return "text/csv";
    case "yaml":
      return "application/yaml";
    case "xml":
      return "application/xml";
    case "toml":
      return "application/toml";
    default:
      return "application/json";
  }
}

/**
 * Select fields, apply operation, and update in place
 * Returns the number of fields modified
 */
function modifyFields(
  data: Record<string, unknown> | unknown[],
  props: ModifyFieldProperties,
): number {
  switch (props.fieldSelector) {
    case "jsonpath": {
      try {
        let modifiedCount = 0;
        const sampleValues: unknown[] = [];
        let operationError: Error | undefined;

        // Use JSONPath callback to modify values in place
        JSONPath({
          path: props.fieldPath,
          json: data,
          resultType: "value",
          callback: (_payload, _type, fullPayload) => {
            const currentValue = fullPayload.parent[fullPayload.parentProperty];

            // Collect sample values (up to 5)
            if (sampleValues.length < 5) {
              sampleValues.push(currentValue);
            }

            // Only attempt modification if we haven't encountered an error yet
            if (!operationError) {
              try {
                const modifiedValue = applyOperation(currentValue, props);
                fullPayload.parent[fullPayload.parentProperty] = modifiedValue;
                modifiedCount++;
              } catch (err) {
                operationError =
                  err instanceof Error ? err : new Error(String(err));
              }
            }
          },
        });

        // If we encountered an operation error, throw it with sample values
        if (operationError) {
          const sampleText =
            sampleValues.length > 0
              ? `\n\nSample values found (showing first ${sampleValues.length}):\n${sampleValues.map((v, i) => `  ${i + 1}. ${JSON.stringify(v)}`).join("\n")}`
              : "";
          throw new Error(`${operationError.message}${sampleText}`);
        }

        return modifiedCount;
      } catch (err) {
        throw new Error(
          `JSONPath operation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }
    }

    case "xpath":
      throw new Error("XPath selection is not yet implemented");

    case "csv-column": {
      try {
        // CSV data is an array of objects where keys are column names
        if (!Array.isArray(data)) {
          throw new Error("CSV data must be an array");
        }

        let modifiedCount = 0;
        const sampleValues: unknown[] = [];
        let operationError: Error | undefined;

        // Iterate through each row
        for (const row of data) {
          if (typeof row !== "object" || row === null) {
            continue;
          }

          const rowObj = row as Record<string, unknown>;

          // Field path can be a column name or index
          let columnKey: string | undefined;

          // Try as column name first
          if (props.fieldPath in rowObj) {
            columnKey = props.fieldPath;
          } else {
            // Try as numeric index (convert "0", "1", etc. to column names)
            const columnIndex = parseInt(props.fieldPath, 10);
            if (!isNaN(columnIndex)) {
              const keys = Object.keys(rowObj);
              if (columnIndex >= 0 && columnIndex < keys.length) {
                columnKey = keys[columnIndex];
              }
            }
          }

          if (!columnKey) {
            continue;
          }

          const currentValue = rowObj[columnKey];

          // Collect sample values (up to 5)
          if (sampleValues.length < 5) {
            sampleValues.push(currentValue);
          }

          // Only attempt modification if we haven't encountered an error yet
          if (!operationError) {
            try {
              const modifiedValue = applyOperation(currentValue, props);
              rowObj[columnKey] = modifiedValue;
              modifiedCount++;
            } catch (err) {
              operationError =
                err instanceof Error ? err : new Error(String(err));
            }
          }
        }

        // If we encountered an operation error, throw it with sample values
        if (operationError) {
          const sampleText =
            sampleValues.length > 0
              ? `\n\nSample values found (showing first ${sampleValues.length}):\n${sampleValues.map((v, i) => `  ${i + 1}. ${JSON.stringify(v)}`).join("\n")}`
              : "";
          throw new Error(`${operationError.message}${sampleText}`);
        }

        return modifiedCount;
      } catch (err) {
        throw new Error(
          `CSV column operation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }
    }

    default:
      throw new Error(`Unknown field selector: ${props.fieldSelector}`);
  }
}

/**
 * Apply the modification operation to a value
 */
function applyOperation(value: unknown, props: ModifyFieldProperties): unknown {
  const stringValue = String(value);

  switch (props.operation) {
    case "regex-replace": {
      if (!props.regexPattern) {
        return value;
      }
      try {
        const regex = new RegExp(props.regexPattern, props.regexFlags || "g");
        return stringValue.replace(regex, props.regexReplacement || "");
      } catch (err) {
        throw new Error(
          `Regex operation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }
    }

    case "case-convert": {
      if (!props.caseFormat) {
        return value;
      }
      return convertCase(stringValue, props.caseFormat);
    }

    case "date-format": {
      if (!props.outputDateFormat) {
        return value;
      }
      return formatDate(
        stringValue,
        props.inputDateFormat || "",
        props.customInputDateFormat,
        props.outputDateFormat,
        props.customOutputDateFormat,
      );
    }

    case "sanitize": {
      if (!props.sanitizeOptions || props.sanitizeOptions.length === 0) {
        return value;
      }
      // Convert the selected option IDs to SanitizationOption objects
      // preserving the order of selection
      const sanitizationOptions: SanitizationOption[] = props.sanitizeOptions
        .map((optionId) => {
          const option = defaultSanitizeOptions.find(
            (opt) => opt.id === optionId,
          );
          if (!option) return null;
          // Return enabled version of the option
          return { ...option, enabled: true };
        })
        .filter((opt): opt is SanitizationOption => opt !== null);

      return sanitizeText(stringValue, sanitizationOptions);
    }

    default:
      return value;
  }
}

/**
 * Format a date string according to the specified format
 */
function formatDate(
  value: string,
  inputFormat: string,
  customInputFormat: string | undefined,
  outputFormat: string,
  customOutputFormat?: string,
): string {
  try {
    // Parse the input date using the input format
    let date: Date;

    switch (inputFormat) {
      case "iso8601": {
        // Parse ISO 8601 date (YYYY-MM-DD)
        date = new Date(value);
        break;
      }

      case "rfc3339": {
        // Parse RFC 3339 / ISO 8601 full datetime
        date = new Date(value);
        break;
      }

      case "unix-seconds": {
        // Parse Unix timestamp in seconds
        date = new Date(Number(value) * 1000);
        break;
      }

      case "unix-milliseconds": {
        // Parse Unix timestamp in milliseconds
        date = new Date(Number(value));
        break;
      }

      case "apache-log": {
        // Parse Apache log format: 12/Jan/2025:14:23:54 +0000
        const dateFnsInputFormat = strftimeToDateFns("%d/%b/%Y:%H:%M:%S %z");
        date = parseDate(value, dateFnsInputFormat, new Date());
        break;
      }

      case "custom": {
        if (!customInputFormat) {
          date = new Date(value);
        } else {
          // Convert strftime to date-fns format
          const dateFnsInputFormat = strftimeToDateFns(customInputFormat);
          date = parseDate(value, dateFnsInputFormat, new Date());
        }
        break;
      }

      default: {
        // Try to parse as ISO date if unknown format
        date = new Date(value);
      }
    }

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    // Format the output date
    switch (outputFormat) {
      case "iso8601":
        return date.toISOString().split("T")[0];

      case "rfc3339":
        return date.toISOString();

      case "unix-seconds":
        return String(Math.floor(date.getTime() / 1000));

      case "unix-milliseconds":
        return String(date.getTime());

      case "custom":
        if (!customOutputFormat) {
          return value;
        }
        const dateFnsOutputFormat = strftimeToDateFns(customOutputFormat);
        return formatDateFns(date, dateFnsOutputFormat);

      default:
        return value;
    }
  } catch (err) {
    throw new Error(
      `Date formatting failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
  }
}

/**
 * Convert strftime format to date-fns format
 */
function strftimeToDateFns(strftimeFormat: string): string {
  return strftimeFormat
    .replace(/%Y/g, "yyyy") // 4-digit year
    .replace(/%y/g, "yy") // 2-digit year
    .replace(/%m/g, "MM") // Month (01-12)
    .replace(/%d/g, "dd") // Day of month (01-31), zero-padded
    .replace(/%e/g, "d") // Day of month (1-31), space-padded
    .replace(/%H/g, "HH") // Hour (00-23), zero-padded
    .replace(/%k/g, "H") // Hour (0-23), space-padded
    .replace(/%I/g, "hh") // Hour (01-12), zero-padded
    .replace(/%l/g, "h") // Hour (1-12), space-padded
    .replace(/%M/g, "mm") // Minute (00-59)
    .replace(/%S/g, "ss") // Second (00-59)
    .replace(/%p/g, "a") // AM/PM uppercase
    .replace(/%P/g, "aaa") // AM/PM lowercase
    .replace(/%B/g, "MMMM") // Full month name
    .replace(/%b/g, "MMM") // Abbreviated month name
    .replace(/%A/g, "EEEE") // Full weekday name
    .replace(/%a/g, "EEE") // Abbreviated weekday name
    .replace(/%w/g, "e") // Weekday as number (0-6, Sunday=0)
    .replace(/%u/g, "i") // Weekday as number (1-7, Monday=1)
    .replace(/%j/g, "D") // Day of year (001-366)
    .replace(/%Z/g, "zzz") // Timezone name (EST, PST, etc.)
    .replace(/%::z/g, "xxxxx") // Timezone offset with seconds (+00:00:00) - must come before %:z
    .replace(/%:z/g, "xxx") // Timezone offset with colon (+00:00)
    .replace(/%z/g, "xx"); // Timezone offset (+0000)
}
