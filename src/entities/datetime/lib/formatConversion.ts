/**
 * Format Conversion Utilities
 * Converts between different date format pattern syntaxes
 */

/**
 * Convert strftime format to date-fns format
 *
 * @param strftimeFormat - strftime pattern string (e.g., "%Y-%m-%d")
 * @returns date-fns format string (e.g., "yyyy-MM-dd")
 */
export function strftimeToDateFns(strftimeFormat: string): string {
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

/**
 * Convert ISO8601 pattern to date-fns format
 * Supports patterns like: YYYY-MM-DD, YYYY-MM-DDTHH:mm:ss, YYYY-MM-DDTHH:mm:ssZ
 * Also supports non-standard AM/PM patterns: hh:mm:ss a, MM/DD/YYYY hh:mm:ss a
 *
 * @param iso8601Pattern - ISO8601-style pattern string (e.g., "YYYY-MM-DD")
 * @returns date-fns format string (e.g., "yyyy-MM-dd")
 */
export function iso8601ToDateFns(iso8601Pattern: string): string {
  return iso8601Pattern
    .replace(/YYYY/g, "yyyy") // 4-digit year
    .replace(/YY/g, "yy") // 2-digit year
    .replace(/MM/g, "MM") // Month (01-12)
    .replace(/DD/g, "dd") // Day of month (01-31)
    .replace(/HH/g, "HH") // Hour (00-23), 24-hour format
    .replace(/hh/g, "hh") // Hour (01-12), 12-hour format for AM/PM
    .replace(/h/g, "h") // Hour (1-12), 12-hour format for AM/PM (single digit)
    .replace(/K/g, "K") // Hour (0-11), 12-hour format for AM/PM
    .replace(/mm/g, "mm") // Minute (00-59)
    .replace(/ss/g, "ss") // Second (00-59)
    .replace(/SSS/g, "SSS") // Milliseconds (000-999)
    .replace(/\ba\b/g, "a") // AM/PM marker (uppercase)
    .replace(/\bp\b/g, "a") // AM/PM marker (alternate notation, maps to 'a' in date-fns)
    .replace(/Z/g, "'Z'") // Literal 'Z' for UTC timezone
    .replace(/([+-]\d{2}:\d{2})/g, "xxx"); // Timezone offset with colon (+00:00)
}
