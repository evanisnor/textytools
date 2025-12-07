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
  | "rfc3339"
  | "unix-seconds"
  | "unix-milliseconds"
  | "apache-log"
  | "custom";

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
  outputDateFormat?: DateFormat;
  customOutputDateFormat?: string; // strftime format when outputDateFormat is "custom"

  // Sanitize (reuses existing SanitizationOptionId from text-sanitize entity)
  sanitizeOptions?: SanitizationOptionId[]; // Array of enabled sanitization option IDs
}
