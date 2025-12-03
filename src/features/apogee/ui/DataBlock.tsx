"use client";

import { useCallback, useState } from "react";

import type { TransformStat, InputType } from "../model/types";
import { useSyntaxHighlighter } from "../model/useSyntaxHighlighter";

import { TextEditor } from "@/entities/editor";

interface DataBlockProps {
  title: string;
  value: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onRemove?: () => void;
  onClear?: () => void;
  stats?: TransformStat[];
  mimeType?: string; // For future syntax highlighting support
  inputType?: InputType; // Current input type selection
  onInputTypeChange?: (type: InputType) => void; // Handler for input type changes
}

/**
 * DataBlock - Output display component with controls
 *
 * Displays transform step output with:
 * - Syntax highlighting (via TextEditor)
 * - Copy to clipboard button
 * - Word wrap toggle
 * - Remove/Clear buttons (when applicable)
 * - Stats bar (when stats provided)
 *
 * @example
 * ```tsx
 * <DataBlock
 *   title="Step 1: JSON Convert"
 *   value={step.output}
 *   readOnly
 *   stats={transformResult.stats}
 * />
 * ```
 */
export function DataBlock({
  title,
  value,
  readOnly = false,
  onChange,
  onRemove,
  onClear,
  stats,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mimeType, // Not used yet, reserved for Phase 6 syntax highlighting
  inputType,
  onInputTypeChange,
}: DataBlockProps) {
  const [wrap, setWrap] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get syntax highlighting based on input type
  const syntaxHighlighter = useSyntaxHighlighter(inputType, true);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [value]);

  const handleWrapToggle = useCallback(() => {
    setWrap((prev) => !prev);
  }, []);

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 py-2">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {title}
          </h3>
          {inputType && onInputTypeChange && (
            <>
              <span className="text-zinc-400">|</span>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="data-type"
                  className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Type:
                </label>
                <select
                  id="data-type"
                  value={inputType}
                  onChange={(e) =>
                    onInputTypeChange(e.target.value as InputType)
                  }
                  className="px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="auto">Auto-detect</option>
                  <option value="text">Plain Text</option>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="xml">XML</option>
                  <option value="yaml">YAML</option>
                  <option value="toml">TOML</option>
                  <option value="jwt">JWT</option>
                </select>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Wrap Toggle */}
          <button
            type="button"
            onClick={handleWrapToggle}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              wrap
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600"
            }`}
            title={wrap ? "Disable word wrap" : "Enable word wrap"}
          >
            Wrap
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-2 py-1 text-xs bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          {/* Clear Button */}
          {onClear && !readOnly && (
            <button
              type="button"
              onClick={onClear}
              className="px-2 py-1 text-xs bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors"
              title="Clear content"
            >
              Clear
            </button>
          )}

          {/* Remove Button */}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="px-2 py-1 text-xs bg-white dark:bg-zinc-700 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              title="Remove this block"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      {stats && stats.length > 0 && (
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 py-2 overflow-x-auto">
          {stats.map((stat, index) => (
            <StatPill key={index} stat={stat} />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="bg-white dark:bg-zinc-900">
        <TextEditor
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          wrap={wrap}
          showLineNumbers={true}
          height="h-64"
          placeholder={readOnly ? "No output" : "Enter data..."}
          renderContent={syntaxHighlighter.renderContent}
          renderLineContent={syntaxHighlighter.renderLineContent}
        />
      </div>
    </div>
  );
}

interface StatPillProps {
  stat: TransformStat;
}

function StatPill({ stat }: StatPillProps) {
  const alertColors = {
    info: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
    warning:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700",
    error:
      "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
    default:
      "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
  };

  const colorClass = stat.alert ? alertColors[stat.alert] : alertColors.default;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs whitespace-nowrap ${colorClass}`}
      title={
        stat.alert ? `${stat.alert.toUpperCase()}: ${stat.label}` : undefined
      }
    >
      <span className="font-medium">{stat.label}:</span>
      <span>{stat.value}</span>
    </div>
  );
}
