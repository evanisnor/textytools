/**
 * Type definitions for datetime entity
 */

/**
 * Supported date/time format types
 */
export type DateTimeFormat =
  | "iso8601"
  | "iso8601-time"
  | "iso8601-datetime"
  | "rfc3339"
  | "unix-seconds"
  | "unix-milliseconds"
  | "apache-log"
  | "custom-strftime"
  | "custom-iso8601";

/**
 * Options for parsing dates
 */
export interface ParseDateOptions {
  format: DateTimeFormat;
  customFormat?: string; // For custom-strftime or custom-iso8601
}

/**
 * Options for formatting dates
 */
export interface FormatDateOptions {
  format: DateTimeFormat;
  customFormat?: string; // For custom-strftime or custom-iso8601
}

/**
 * Result of date parsing operation
 */
export interface ParseDateResult {
  success: boolean;
  date?: Date;
  error?: string;
}

/**
 * Result of date formatting operation
 */
export interface FormatDateResult {
  success: boolean;
  formatted?: string;
  error?: string;
}
