"use client";

import { useCallback } from "react";

import type { InputSelection, LensMode, ParseAsFormat } from "../model/types";

interface LensConfigProps {
  inputSelection: InputSelection;
  onUpdate: (selection: InputSelection) => void;
  previousOutput?: string;
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
export function LensConfig({ inputSelection, onUpdate }: LensConfigProps) {
  const handleModeChange = useCallback(
    (mode: LensMode) => {
      onUpdate({
        ...inputSelection,
        mode,
      });
    },
    [inputSelection, onUpdate],
  );

  const handlePropertyChange = useCallback(
    (key: keyof InputSelection, value: unknown) => {
      onUpdate({
        ...inputSelection,
        [key]: value,
      });
    },
    [inputSelection, onUpdate],
  );

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700 bg-amber-50 dark:bg-amber-950/20">
      <div className="px-4 py-2 border-b border-amber-200 dark:border-amber-800">
        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Input Lens
        </h4>
        <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
          Extract and parse data before transformation
        </p>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Parse As */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-20">
            Parse As:
          </label>
          <select
            value={inputSelection.parseAs || "text"}
            onChange={(e) =>
              handlePropertyChange("parseAs", e.target.value as ParseAsFormat)
            }
            className="flex-1 px-2 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="text">Plain Text</option>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="yaml">YAML</option>
            <option value="xml">XML</option>
            <option value="toml">TOML</option>
          </select>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-20">
            Mode:
          </label>
          <select
            value={inputSelection.mode}
            onChange={(e) => handleModeChange(e.target.value as LensMode)}
            className="flex-1 px-2 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All (pass-through)</option>
            <option value="regex">Regex Extract</option>
            <option value="jsonpath">JSONPath Query</option>
            <option value="csv-column">CSV Column</option>
            <option value="xml-xpath">XML XPath</option>
          </select>
        </div>

        {/* Regex Mode */}
        {inputSelection.mode === "regex" && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-20">
                Pattern:
              </label>
              <input
                type="text"
                value={inputSelection.regexPattern || ""}
                onChange={(e) =>
                  handlePropertyChange("regexPattern", e.target.value)
                }
                placeholder="e.g., (?&lt;={).*(?=})"
                className="flex-1 px-2 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-20">
                Flags:
              </label>
              <input
                type="text"
                value={inputSelection.regexFlags || ""}
                onChange={(e) =>
                  handlePropertyChange("regexFlags", e.target.value)
                }
                placeholder="e.g., gm"
                className="w-24 px-2 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </>
        )}

        {/* JSONPath Mode */}
        {inputSelection.mode === "jsonpath" && (
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

        {/* CSV Column Mode */}
        {inputSelection.mode === "csv-column" && (
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

        {/* XPath Mode */}
        {inputSelection.mode === "xml-xpath" && (
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
