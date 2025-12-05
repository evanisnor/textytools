/**
 * Type definitions for Modify Field transform
 */

import type { CaseType } from "@/entities/transform/text-case";

export type FieldSelector = "jsonpath" | "xpath" | "csv-column";

export type ModifyOperation = "regex-replace" | "case-convert" | "date-format";

export type DateFormat =
  | "iso8601"
  | "rfc3339"
  | "unix-seconds"
  | "unix-milliseconds"
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
  inputDateFormat?: string; // strftime format for parsing input
  outputDateFormat?: DateFormat;
  customOutputDateFormat?: string; // strftime format when outputDateFormat is "custom"
}
