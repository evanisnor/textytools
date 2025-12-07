/**
 * Modify Field Transform
 * Modifies specific fields in structured data (JSON/YAML/TOML/XML/CSV)
 */

import { JSONPath } from "jsonpath-plus";

import { detectFormat, parseToIntermediate } from "../../shared";
import type { PropertySchema, TransformResult } from "../../shared/types";
import type { ModifyFieldProperties } from "../model/types";
import { createIso8601ModalProperty } from "../ui/Iso8601Modal";
import { createStrftimeModalProperty } from "../ui/StrftimeModal";

import {
  convertDateFormat,
  type DateTimeFormat,
  type FormatDateOptions,
  type ParseDateOptions,
} from "@/entities/datetime";
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
      { value: "iso8601", label: "ISO 8601 Date (YYYY-MM-DD)" },
      { value: "iso8601-time", label: "ISO 8601 Time (HH:mm:ss)" },
      {
        value: "iso8601-datetime",
        label: "ISO 8601 DateTime (allows T or space, optional Z)",
      },
      { value: "rfc3339", label: "RFC 3339 (strict YYYY-MM-DDTHH:mm:ssZ)" },
      { value: "unix-seconds", label: "Unix Timestamp (seconds)" },
      { value: "unix-milliseconds", label: "Unix Timestamp (milliseconds)" },
      { value: "apache-log", label: "Apache Log (12/Jan/2025:14:23:54 +0000)" },
      { value: "custom", label: "Custom (strftime)" },
      { value: "iso8601-custom", label: "Custom (ISO8601 pattern)" },
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
    key: "iso8601CustomInputFormat",
    label: "ISO8601 Pattern",
    type: "text",
    defaultValue: "YYYY-MM-DD",
    placeholder: "YYYY-MM-DDTHH:mm:ssZ",
    showWhen: { operation: "date-format", inputDateFormat: "iso8601-custom" },
    width: "flex",
  },
  {
    key: "outputDateFormat",
    label: "Output Format",
    type: "select",
    options: [
      { value: "iso8601", label: "ISO 8601 Date (YYYY-MM-DD)" },
      { value: "iso8601-time", label: "ISO 8601 Time (HH:mm:ss)" },
      { value: "iso8601-datetime", label: "ISO 8601 DateTime (UTC with Z)" },
      { value: "rfc3339", label: "RFC 3339 (UTC with Z, strict)" },
      { value: "unix-seconds", label: "Unix Timestamp (seconds)" },
      { value: "unix-milliseconds", label: "Unix Timestamp (milliseconds)" },
      { value: "custom", label: "Custom (strftime)" },
      { value: "iso8601-custom", label: "Custom (ISO8601 pattern)" },
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
  {
    key: "iso8601CustomOutputFormat",
    label: "ISO8601 Pattern",
    type: "text",
    defaultValue: "YYYY-MM-DD",
    placeholder: "YYYY-MM-DDTHH:mm:ssZ",
    showWhen: { operation: "date-format", outputDateFormat: "iso8601-custom" },
    width: "flex",
  },
  createStrftimeModalProperty(),
  createIso8601ModalProperty(),
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
  iso8601CustomInputFormat: "YYYY-MM-DD",
  outputDateFormat: "rfc3339",
  customOutputDateFormat: "%Y-%m-%d",
  iso8601CustomOutputFormat: "YYYY-MM-DD",
  dateFormatHelp: "",
  iso8601PatternHelp: "",
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

      // Map legacy format names to datetime entity format names
      const mapFormat = (
        format: string,
        customFormat?: string,
      ): ParseDateOptions | FormatDateOptions => {
        if (format === "custom") {
          return { format: "custom-strftime" as DateTimeFormat, customFormat };
        }
        if (format === "iso8601-custom") {
          return { format: "custom-iso8601" as DateTimeFormat, customFormat };
        }
        return { format: format as DateTimeFormat };
      };

      const inputOptions = mapFormat(
        props.inputDateFormat || "iso8601",
        props.inputDateFormat === "custom"
          ? props.customInputDateFormat
          : props.iso8601CustomInputFormat,
      ) as ParseDateOptions;

      const outputOptions = mapFormat(
        props.outputDateFormat,
        props.outputDateFormat === "custom"
          ? props.customOutputDateFormat
          : props.iso8601CustomOutputFormat,
      ) as FormatDateOptions;

      const result = convertDateFormat(
        stringValue,
        inputOptions,
        outputOptions,
      );

      if (!result.success) {
        throw new Error(result.error || "Date formatting failed");
      }

      return result.formatted || value;
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
