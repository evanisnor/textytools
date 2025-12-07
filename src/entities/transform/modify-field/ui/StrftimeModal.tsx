"use client";

import type { PropertySchema } from "@/entities/transform/shared/types";

/**
 * Strftime Format Documentation Modal
 * Displays comprehensive documentation about strftime format tokens
 */

export function StrftimeModalContent() {
  return (
    <div className="flex flex-col">
      {/* Modal Header */}
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          What is strftime?
        </h2>
      </div>

      {/* Modal Body */}
      <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
          {/* Introduction */}
          <p>
            strftime is a standard format for representing dates and times using
            pattern codes. Each code starts with{" "}
            <code className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">
              %
            </code>{" "}
            followed by a letter that represents a specific date/time component.
          </p>

          {/* Examples Section */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Examples
            </h3>
            <div className="space-y-1 font-mono text-xs bg-zinc-50 dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-blue-600 dark:text-blue-400">
                  %Y-%m-%d
                </span>
                <span className="text-zinc-400 mx-2">→</span>
                <span>2025-01-15</span>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">
                  %I:%M %p
                </span>
                <span className="text-zinc-400 mx-2">→</span>
                <span>02:30 PM</span>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">
                  %B %d, %Y
                </span>
                <span className="text-zinc-400 mx-2">→</span>
                <span>January 15, 2025</span>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">
                  %A at %I:%M %p
                </span>
                <span className="text-zinc-400 mx-2">→</span>
                <span>Monday at 02:30 PM</span>
              </div>
            </div>
          </div>

          {/* Format Codes Table */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Supported Format Codes
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
                      code="%Y"
                      description="4-digit year"
                      example="2025"
                    />
                    <FormatRow
                      code="%y"
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
                      code="%m"
                      description="Month (01-12)"
                      example="01"
                    />
                    <FormatRow
                      code="%B"
                      description="Full month name"
                      example="January"
                    />
                    <FormatRow
                      code="%b"
                      description="Abbreviated month"
                      example="Jan"
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
                      code="%d"
                      description="Day (01-31), zero-padded"
                      example="05"
                    />
                    <FormatRow
                      code="%e"
                      description="Day (1-31), space-padded"
                      example=" 5"
                    />
                    <FormatRow
                      code="%j"
                      description="Day of year (001-366)"
                      example="015"
                    />
                  </tbody>
                </table>
              </div>

              {/* Weekday */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                  Weekday
                </h4>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <FormatRow
                      code="%A"
                      description="Full weekday name"
                      example="Monday"
                    />
                    <FormatRow
                      code="%a"
                      description="Abbreviated weekday"
                      example="Mon"
                    />
                    <FormatRow
                      code="%w"
                      description="Weekday as number (0-6, Sunday=0)"
                      example="1"
                    />
                    <FormatRow
                      code="%u"
                      description="Weekday as number (1-7, Monday=1)"
                      example="1"
                    />
                  </tbody>
                </table>
              </div>

              {/* Hour */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                  Hour
                </h4>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <FormatRow
                      code="%H"
                      description="Hour (00-23), zero-padded"
                      example="14"
                    />
                    <FormatRow
                      code="%k"
                      description="Hour (0-23), space-padded"
                      example="14"
                    />
                    <FormatRow
                      code="%I"
                      description="Hour (01-12), zero-padded"
                      example="02"
                    />
                    <FormatRow
                      code="%l"
                      description="Hour (1-12), space-padded"
                      example=" 2"
                    />
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
                      code="%M"
                      description="Minute (00-59)"
                      example="30"
                    />
                    <FormatRow
                      code="%S"
                      description="Second (00-59)"
                      example="45"
                    />
                    <FormatRow
                      code="%p"
                      description="AM/PM uppercase"
                      example="PM"
                    />
                    <FormatRow
                      code="%P"
                      description="AM/PM lowercase"
                      example="pm"
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
                      code="%z"
                      description="Timezone offset"
                      example="+0000"
                    />
                    <FormatRow
                      code="%:z"
                      description="Timezone with colon"
                      example="+00:00"
                    />
                    <FormatRow
                      code="%::z"
                      description="Timezone with seconds"
                      example="+00:00:00"
                    />
                    <FormatRow
                      code="%Z"
                      description="Timezone name"
                      example="EST"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded p-3">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-xs">
              💡 Tips
            </h3>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200 list-disc list-inside">
              <li>
                Combine codes with any literal text:{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  %Y-%m-%d at %I:%M %p
                </code>
              </li>
              <li>
                Use{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  %I
                </code>{" "}
                for 12-hour format,{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  %H
                </code>{" "}
                for 24-hour
              </li>
              <li>
                Always include{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  %p
                </code>{" "}
                when using{" "}
                <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">
                  %I
                </code>{" "}
                to show AM/PM
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
        <a
          href="https://man7.org/linux/man-pages/man3/strftime.3.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Full strftime reference →
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
 * Helper function to create PropertySchema for strftime modal link
 * This allows .ts files to reference the modal without importing React components
 */
export function createStrftimeModalProperty(): PropertySchema {
  return {
    key: "dateFormatHelp",
    label: "What is strftime?",
    type: "modal-link",
    defaultValue: "",
    modalContent: <StrftimeModalContent />,
    showWhen: { operation: "date-format", inputDateFormat: "custom" },
    width: "full",
  };
}
