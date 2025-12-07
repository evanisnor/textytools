/**
 * Type definitions for Modify Field transform
 */

import type { CaseType } from "@/entities/transform/text-case";
import type { SanitizationOptionId } from "@/entities/transform/text-sanitize";

export type FieldSelector = "jsonpath" | "xpath" | "csv-column";

export type ModifyOperation =
  | "regex-replace"
  | "case-convert"
  | "date-format"
  | "sanitize";

export type DateFormat =
  | "iso8601"
  | "iso8601-time"
  | "iso8601-datetime"
  | "rfc3339"
  | "unix-seconds"
  | "unix-milliseconds"
  | "apache-log"
  | "custom"
  | "iso8601-custom";

export interface ModifyFieldProperties {
  // Field selector (shown in Lens)
  fieldSelector: FieldSelector;
  fieldPath: string; // JSONPath, XPath, or column name/index

  // Operation (shown in Lens)
  operation: ModifyOperation;

  // Operation-specific config (shown in Options)
  // Regex Replace
  regexPattern?: string;
  regexFlags?: string;
  regexReplacement?: string;

  // Case Convert (reuses existing CaseType from text-case entity)
  caseFormat?: CaseType;

  // Date Format
  inputDateFormat?: DateFormat;
  customInputDateFormat?: string; // strftime format when inputDateFormat is "custom"
  iso8601CustomInputFormat?: string; // ISO8601 pattern when inputDateFormat is "iso8601-custom"
  outputDateFormat?: DateFormat;
  customOutputDateFormat?: string; // strftime format when outputDateFormat is "custom"
  iso8601CustomOutputFormat?: string; // ISO8601 pattern when outputDateFormat is "iso8601-custom"

  // Sanitize (reuses existing SanitizationOptionId from text-sanitize entity)
  sanitizeOptions?: SanitizationOptionId[]; // Array of enabled sanitization option IDs
}
