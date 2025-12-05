/**
 * Modify Field Transform
 * Modifies specific fields in structured data (JSON/YAML/TOML/XML/CSV)
 */

import { parse as parseDate, format as formatDateFns } from "date-fns";
import { JSONPath } from "jsonpath-plus";

import { detectFormat, parseToIntermediate } from "../../shared";
import type { PropertySchema, TransformResult } from "../../shared/types";
import type { ModifyFieldProperties } from "../model/types";

import { CASE_TYPE_OPTIONS, convertCase } from "@/entities/transform/text-case";

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
    helpText: "JSONPath, XPath, or CSV column based on input format",
    showInLens: true,
  },
  {
    key: "operation",
    label: "Operation",
    type: "select",
    options: [
      { value: "regex-replace", label: "Regex Replace" },
      { value: "case-convert", label: "Case Convert" },
      { value: "date-format", label: "Date Format" },
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
  },
  {
    key: "regexFlags",
    label: "Flags",
    type: "text",
    defaultValue: "g",
    placeholder: "g",
    showWhen: { operation: "regex-replace" },
  },
  {
    key: "regexReplacement",
    label: "Replacement",
    type: "text",
    defaultValue: "",
    placeholder: "e.g., $1",
    showWhen: { operation: "regex-replace" },
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
  // Date Format options
  {
    key: "inputDateFormat",
    label: "Input Format",
    type: "text",
    defaultValue: "%d/%b/%Y:%H:%M:%S %z",
    placeholder: "%d/%b/%Y:%H:%M:%S %z",
    helpText:
      "strftime format of the input date - Examples: %d/%b/%Y:%H:%M:%S %z (12/Jan/2025:14:23:54 +0000)",
    showWhen: { operation: "date-format" },
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
    defaultValue: "iso8601",
    showWhen: { operation: "date-format" },
  },
  {
    key: "customOutputDateFormat",
    label: "Custom Output Format",
    type: "text",
    defaultValue: "%Y-%m-%d",
    placeholder: "%Y-%m-%d",
    helpText:
      "strftime format - Examples: %Y-%m-%d (2025-01-12), %d/%m/%Y (12/01/2025), %B %d, %Y (January 12, 2025)",
    showWhen: { operation: "date-format", outputDateFormat: "custom" },
  },
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
  inputDateFormat: "%d/%b/%Y:%H:%M:%S %z",
  outputDateFormat: "iso8601",
  customOutputDateFormat: "%Y-%m-%d",
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
    const output = JSON.stringify(data, null, 2);
    const mimeType = formatToMimeType(format);

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

        // Use JSONPath callback to modify values in place
        JSONPath({
          path: props.fieldPath,
          json: data,
          resultType: "value",
          callback: (_payload, _type, fullPayload) => {
            const currentValue = fullPayload.parent[fullPayload.parentProperty];
            const modifiedValue = applyOperation(currentValue, props);
            fullPayload.parent[fullPayload.parentProperty] = modifiedValue;
            modifiedCount++;
          },
        });

        return modifiedCount;
      } catch (err) {
        throw new Error(
          `JSONPath operation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }
    }

    case "xpath":
      throw new Error("XPath selection is not yet implemented");

    case "csv-column":
      throw new Error("CSV column selection is not yet implemented");

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
        props.outputDateFormat,
        props.customOutputDateFormat,
      );
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
  outputFormat: string,
  customOutputFormat?: string,
): string {
  try {
    // Parse the input date using the input format
    let date: Date;

    if (inputFormat) {
      // Convert strftime to date-fns format
      const dateFnsInputFormat = strftimeToDateFns(inputFormat);
      date = parseDate(value, dateFnsInputFormat, new Date());
    } else {
      // Try to parse as ISO date if no input format specified
      date = new Date(value);
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
    .replace(/%d/g, "dd") // Day of month (01-31)
    .replace(/%H/g, "HH") // Hour (00-23)
    .replace(/%M/g, "mm") // Minute (00-59)
    .replace(/%S/g, "ss") // Second (00-59)
    .replace(/%B/g, "MMMM") // Full month name
    .replace(/%b/g, "MMM") // Abbreviated month name
    .replace(/%A/g, "EEEE") // Full weekday name
    .replace(/%a/g, "EEE") // Abbreviated weekday name
    .replace(/%z/g, "xx"); // Timezone offset (+0000)
}
