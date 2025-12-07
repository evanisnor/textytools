"use client";

import type { PropertySchema } from "@/entities/transform/shared/types";

/**
 * ISO8601 Pattern Documentation Modal
 * Displays comprehensive documentation about ISO8601-style pattern matching
 */

export function Iso8601ModalContent() {
  return (
    <div className="flex flex-col">
      {/* Modal Header */}
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          ISO8601 Pattern Matching
        </h2>
      </div>

      {/* Modal Body */}
      <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
          {/* Introduction */}
          <p>
            ISO8601 pattern matching uses readable patterns like{" "}
            <code className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">
              YYYY-MM-DD
            </code>{" "}
            instead of strftime codes. This format is commonly used in many
            modern programming languages and APIs.
          </p>

          {/* Examples Section */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Examples
            </h3>
            <div className="space-y-1 font-mono text-xs bg-zinc-50 dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-blue-600 dark:text-blue-400">
                  YYYY-MM-DD
                </span>
                <span className="text-zinc-400 mx-2">→</span>
                <span>2025-01-15</span>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">
                  YYYY-MM-DDTHH:mm:ssZ
                </span>
                <span className="text-zinc-400 mx-2">→</span>
                <span>2025-01-15T14:30:45Z</span>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">
                  MM/DD/YYYY hh:mm a
                </span>
                <span className="text-zinc-400 mx-2">→</span>
                <span>01/15/2025 02:30 PM</span>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">
                  DD/MM/YYYY HH:mm:ss
                </span>
                <span className="text-zinc-400 mx-2">→</span>
                <span>15/01/2025 14:30:45</span>
              </div>
            </div>
          </div>

          {/* Format Codes Table */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Supported Pattern Tokens
            </h3>
            <div className="space-y-3">
              {/* Year */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                  Year
                </h4>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <FormatRow
                      code="YYYY"
                      description="4-digit year"
                      example="2025"
                    />
                    <FormatRow
                      code="YY"
                      description="2-digit year"
                      example="25"
                    />
                  </tbody>
                </table>
              </div>

              {/* Month */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                  Month
                </h4>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <FormatRow
                      code="MM"
                      description="Month (01-12)"
                      example="01"
                    />
                  </tbody>
                </table>
              </div>

              {/* Day */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                  Day
                </h4>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <FormatRow
                      code="DD"
                      description="Day of month (01-31)"
                      example="15"
                    />
                  </tbody>
                </table>
              </div>

              {/* Hour (24-hour) */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                  Hour (24-hour format)
                </h4>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <FormatRow
                      code="HH"
                      description="Hour (00-23), zero-padded"
                      example="14"
                    />
                  </tbody>
                </table>
              </div>

              {/* Hour (12-hour) - Non-standard */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                  Hour (12-hour format) - Non-standard
                </h4>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <FormatRow
                      code="hh"
                      description="Hour (01-12), zero-padded"
                      example="02"
                    />
                    <FormatRow
                      code="h"
                      description="Hour (1-12), no padding"
                      example="2"
                    />
                    <FormatRow code="K" description="Hour (0-11)" example="1" />
                  </tbody>
                </table>
              </div>

              {/* Time */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                  Time
                </h4>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <FormatRow
                      code="mm"
                      description="Minute (00-59)"
                      example="30"
                    />
                    <FormatRow
                      code="ss"
                      description="Second (00-59)"
                      example="45"
                    />
                    <FormatRow
                      code="SSS"
                      description="Milliseconds (000-999)"
                      example="123"
                    />
                  </tbody>
                </table>
              </div>

              {/* AM/PM - Non-standard */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                  AM/PM Marker - Non-standard
                </h4>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <FormatRow
                      code="a"
                      description="AM/PM marker"
                      example="PM"
                    />
                    <FormatRow
                      code="p"
                      description="AM/PM marker (alternate)"
                      example="PM"
                    />
                  </tbody>
                </table>
              </div>

              {/* Timezone */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                  Timezone
                </h4>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <FormatRow
                      code="Z"
                      description="UTC timezone indicator"
                      example="Z"
                    />
                    <FormatRow
                      code="+00:00"
                      description="Timezone offset"
                      example="+05:30"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Non-standard support note */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded p-3">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1 text-xs">
              ⚠️ Non-standard AM/PM Support
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              ISO 8601 does not define AM/PM notation (it uses 24-hour format).
              However, this implementation supports common non-standard patterns
              like{" "}
              <code className="px-1 bg-amber-100 dark:bg-amber-900 rounded">
                hh:mm a
              </code>{" "}
              for parsing dates from systems that use 12-hour time formats.
            </p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded p-3">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-xs">
              💡 Tips
            </h3>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200 list-disc list-inside">
              <li>
                Use{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  HH
                </code>{" "}
                for 24-hour format,{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  hh
                </code>{" "}
                for 12-hour
              </li>
              <li>
                Always include{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  a
                </code>{" "}
                when using{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  hh
                </code>{" "}
                to show AM/PM
              </li>
              <li>
                The{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  T
                </code>{" "}
                in{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  YYYY-MM-DDTHH:mm:ss
                </code>{" "}
                is a literal character separator
              </li>
              <li>
                Common formats:{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  YYYY-MM-DD
                </code>
                ,{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  MM/DD/YYYY
                </code>
                ,{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  DD-MM-YYYY HH:mm:ss
                </code>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
        <a
          href="https://en.wikipedia.org/wiki/ISO_8601"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          ISO 8601 standard reference →
        </a>
      </div>
    </div>
  );
}

interface FormatRowProps {
  code: string;
  description: string;
  example: string;
}

function FormatRow({ code, description, example }: FormatRowProps) {
  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <td className="py-1.5 pr-3">
        <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-blue-600 dark:text-blue-400">
          {code}
        </code>
      </td>
      <td className="py-1.5 pr-3 text-zinc-600 dark:text-zinc-400">
        {description}
      </td>
      <td className="py-1.5 font-mono text-zinc-500 dark:text-zinc-500">
        {example}
      </td>
    </tr>
  );
}

/**
 * Helper function to create PropertySchema for ISO8601 modal link
 * This allows .ts files to reference the modal without importing React components
 */
export function createIso8601ModalProperty(): PropertySchema {
  return {
    key: "iso8601PatternHelp",
    label: "What is ISO8601 pattern matching?",
    type: "modal-link",
    defaultValue: "",
    modalContent: <Iso8601ModalContent />,
    showWhen: { operation: "date-format", inputDateFormat: "iso8601-custom" },
    width: "full",
  };
}
