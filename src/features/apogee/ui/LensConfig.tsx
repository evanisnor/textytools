"use client";

import { useCallback } from "react";

import type { InputSelection, InputType } from "../model/types";
import { useRegexPreview } from "../model/useRegexPreview";

interface LensConfigProps {
  inputSelection: InputSelection;
  onUpdate: (selection: InputSelection) => void;
  previousOutput?: string;
  inputType?: InputType;
}

/**
 * LensConfig - Input lens configuration panel
 *
 * Displays configuration options for extracting and parsing data
 * before transformation. Shows different controls based on selected mode.
 *
 * @example
 * ```tsx
 * <LensConfig
 *   inputSelection={step.inputSelection}
 *   onUpdate={(selection) => updateInputSelection(stepId, selection)}
 *   previousOutput={previousStepOutput}
 * />
 * ```
 */
export function LensConfig({
  inputSelection,
  onUpdate,
  previousOutput = "",
  inputType = "text",
}: LensConfigProps) {
  const handlePropertyChange = useCallback(
    (key: keyof InputSelection, value: unknown) => {
      onUpdate({
        ...inputSelection,
        [key]: value,
      });
    },
    [inputSelection, onUpdate],
  );

  // Preview first match for regex mode
  const regexPreview = useRegexPreview(
    inputType === "text" || inputType === "auto"
      ? inputSelection.regexPattern || ""
      : "",
    inputSelection.regexFlags ?? "g",
    previousOutput,
  );

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700 bg-amber-50 dark:bg-amber-950/20">
      <div className="px-4 py-3 space-y-3">
        {/* Regex Mode - for text input */}
        {(inputType === "text" || inputType === "auto") && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-10">
                Pattern:
              </label>
              <input
                type="text"
                value={inputSelection.regexPattern || ""}
                onChange={(e) =>
                  handlePropertyChange("regexPattern", e.target.value)
                }
                placeholder="e.g., (?&lt;host>[a-z]+)"
                className="flex-1 px-2 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-5">
                Flags:
              </label>
              <input
                type="text"
                value={inputSelection.regexFlags ?? "g"}
                onChange={(e) =>
                  handlePropertyChange("regexFlags", e.target.value)
                }
                placeholder="g"
                className="w-20 px-2 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
            {regexPreview && (
              <div
                className={`px-2 py-1.5 text-xs rounded font-mono ${
                  regexPreview.type === "error"
                    ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                    : regexPreview.type === "success"
                      ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                      : "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {regexPreview.message}
                {regexPreview.count !== undefined &&
                  regexPreview.count > 1 &&
                  ` (${regexPreview.count} total matches)`}
              </div>
            )}
          </>
        )}

        {/* JSONPath Mode - for JSON input */}
        {inputType === "json" && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-20">
              Query:
            </label>
            <input
              type="text"
              value={inputSelection.jsonPath || ""}
              onChange={(e) => handlePropertyChange("jsonPath", e.target.value)}
              placeholder="e.g., $.users[*].name"
              className="flex-1 px-2 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>
        )}

        {/* CSV Column Mode - for CSV input */}
        {inputType === "csv" && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-20">
              Column:
            </label>
            <input
              type="text"
              value={inputSelection.csvColumn?.toString() || ""}
              onChange={(e) => {
                const val = e.target.value;
                const parsed = parseInt(val, 10);
                handlePropertyChange("csvColumn", isNaN(parsed) ? val : parsed);
              }}
              placeholder="e.g., 0 or email"
              className="flex-1 px-2 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        )}

        {/* XPath Mode - for XML input */}
        {inputType === "xml" && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-20">
              XPath:
            </label>
            <input
              type="text"
              value={inputSelection.xpathQuery || ""}
              onChange={(e) =>
                handlePropertyChange("xpathQuery", e.target.value)
              }
              placeholder="e.g., //user/@id"
              className="flex-1 px-2 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
}
