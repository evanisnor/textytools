/**
 * Date Parsing and Formatting
 * Core functions for converting between date strings and Date objects
 */

import { parse as parseDate, format as formatDateFns } from "date-fns";

import type {
  FormatDateOptions,
  FormatDateResult,
  ParseDateOptions,
  ParseDateResult,
} from "../types";

import { iso8601ToDateFns, strftimeToDateFns } from "./formatConversion";

/**
 * Parse a date string into a Date object
 *
 * @param value - The date string to parse
 * @param options - Parsing options including format type and custom format
 * @returns ParseDateResult with success status and parsed date or error
 */
export function parseDateString(
  value: string,
  options: ParseDateOptions,
): ParseDateResult {
  try {
    let date: Date;

    switch (options.format) {
      case "iso8601": {
        // Parse ISO 8601 date (YYYY-MM-DD)
        date = new Date(value);
        break;
      }

      case "iso8601-time": {
        // Parse ISO 8601 time (HH:mm:ss or HH:mm:ss.SSS)
        // Since it's time-only, use today's date as the base
        const today = new Date().toISOString().split("T")[0];
        date = new Date(`${today}T${value}`);
        break;
      }

      case "iso8601-datetime": {
        // Parse ISO 8601 datetime - more permissive than RFC 3339
        // Allows space instead of T: "2025-01-15 14:30:45" or "2025-01-15T14:30:45"
        // Timezone optional: can be Z, +00:00, or omitted (treated as local)
        const normalizedValue = value.replace(" ", "T"); // Normalize space to T
        date = new Date(normalizedValue);
        break;
      }

      case "rfc3339": {
        // Parse RFC 3339 - strict subset of ISO 8601
        // Must use T separator and must include timezone (Z or offset)
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

      case "custom-strftime": {
        if (!options.customFormat) {
          date = new Date(value);
        } else {
          // Convert strftime to date-fns format
          const dateFnsInputFormat = strftimeToDateFns(options.customFormat);
          date = parseDate(value, dateFnsInputFormat, new Date());
        }
        break;
      }

      case "custom-iso8601": {
        if (!options.customFormat) {
          date = new Date(value);
        } else {
          // Convert ISO8601 pattern to date-fns format
          const dateFnsInputFormat = iso8601ToDateFns(options.customFormat);
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
      return {
        success: false,
        error: "Invalid date",
      };
    }

    return {
      success: true,
      date,
    };
  } catch (err) {
    return {
      success: false,
      error: `Date parsing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

/**
 * Format a Date object into a string
 *
 * @param date - The Date object to format
 * @param options - Formatting options including format type and custom format
 * @returns FormatDateResult with success status and formatted string or error
 */
export function formatDateToString(
  date: Date,
  options: FormatDateOptions,
): FormatDateResult {
  try {
    if (isNaN(date.getTime())) {
      return {
        success: false,
        error: "Invalid date object",
      };
    }

    let formatted: string;

    switch (options.format) {
      case "iso8601":
        formatted = date.toISOString().split("T")[0];
        break;

      case "iso8601-time": {
        // Extract time portion from ISO string (HH:mm:ss.SSSZ)
        const isoString = date.toISOString();
        const timePart = isoString.split("T")[1].split("Z")[0];
        // Return time without milliseconds for cleaner output
        formatted = timePart.split(".")[0];
        break;
      }

      case "iso8601-datetime":
        formatted = date.toISOString();
        break;

      case "rfc3339":
        formatted = date.toISOString();
        break;

      case "unix-seconds":
        formatted = String(Math.floor(date.getTime() / 1000));
        break;

      case "unix-milliseconds":
        formatted = String(date.getTime());
        break;

      case "custom-strftime": {
        if (!options.customFormat) {
          return {
            success: false,
            error: "Custom format string required for custom-strftime",
          };
        }
        const dateFnsOutputFormat = strftimeToDateFns(options.customFormat);
        formatted = formatDateFns(date, dateFnsOutputFormat);
        break;
      }

      case "custom-iso8601": {
        if (!options.customFormat) {
          return {
            success: false,
            error: "Custom format string required for custom-iso8601",
          };
        }
        const dateFnsIso8601OutputFormat = iso8601ToDateFns(
          options.customFormat,
        );
        formatted = formatDateFns(date, dateFnsIso8601OutputFormat);
        break;
      }

      default:
        return {
          success: false,
          error: `Unknown format: ${options.format}`,
        };
    }

    return {
      success: true,
      formatted,
    };
  } catch (err) {
    return {
      success: false,
      error: `Date formatting failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

/**
 * Convert a date string from one format to another
 *
 * @param value - The date string to convert
 * @param inputOptions - Options for parsing the input
 * @param outputOptions - Options for formatting the output
 * @returns FormatDateResult with success status and converted string or error
 */
export function convertDateFormat(
  value: string,
  inputOptions: ParseDateOptions,
  outputOptions: FormatDateOptions,
): FormatDateResult {
  const parseResult = parseDateString(value, inputOptions);

  if (!parseResult.success || !parseResult.date) {
    return {
      success: false,
      error: parseResult.error,
    };
  }

  return formatDateToString(parseResult.date, outputOptions);
}
