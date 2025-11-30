/**
 * Data Block
 * Reusable component showing a header with controls over a TextEditor
 */

"use client";

import { useState, useEffect, useRef } from "react";

import { getSyntaxHighlighter } from "../lib/syntax-highlight";

import { TextEditor } from "@/entities/editor";

interface DataBlockProps {
  title: string;
  subtitle?: string;
  value: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onRemove?: () => void;
  onClear?: () => void;
  children?: React.ReactNode; // For subheader content (e.g., transform options)
  stats?: React.ReactNode; // For read-only stats/validation info
  defaultSyntax?: "none" | "csv" | "json" | "jwt"; // Default syntax highlighting
  lockSyntax?: boolean; // If true, disable syntax selector
}

export function DataBlock({
  title,
  subtitle,
  value,
  readOnly = false,
  onChange,
  onRemove,
  onClear,
  children,
  stats,
  defaultSyntax = "none",
  lockSyntax = false,
}: DataBlockProps) {
  const [wordWrap, setWordWrap] = useState(true);
  const [syntaxHighlight, setSyntaxHighlight] = useState<
    "none" | "csv" | "json" | "jwt"
  >(defaultSyntax);

  // Local state for text input to prevent cursor jumping
  const [localValue, setLocalValue] = useState(value);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Update local value when external value changes
  useEffect(() => {
    // Clear any pending debounce timer when value changes externally
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    if (!onChange || readOnly) return;

    // Update local state immediately for responsive UI
    setLocalValue(newValue);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer to update after user stops typing
    debounceTimer.current = setTimeout(() => {
      onChange(newValue);
      debounceTimer.current = null;
    }, 500);
  };

  return (
    <div className="relative">
      {/* Header Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-t-lg border border-zinc-200 dark:border-zinc-800 border-b-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <h3 className="font-bold">{title}</h3>
            {subtitle && (
              <span className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded">
                {subtitle}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Syntax Highlighting */}
            {!lockSyntax && (
              <select
                value={syntaxHighlight}
                onChange={(e) =>
                  setSyntaxHighlight(e.target.value as "none" | "csv" | "json")
                }
                className="text-xs px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                <option value="none">Plain Text</option>
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="jwt">JWT</option>
              </select>
            )}

            {/* Word Wrap Toggle */}
            <button
              type="button"
              onClick={() => setWordWrap(!wordWrap)}
              aria-pressed={wordWrap}
              className={`inline-flex items-center justify-center rounded border px-2 py-0.5 text-xs font-medium transition-colors ${
                wordWrap
                  ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-zinc-900 dark:border-zinc-50"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700"
              } cursor-pointer`}
            >
              <span className="font-semibold tracking-wide">Wrap</span>
            </button>

            {/* Clear Button */}
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center justify-center rounded border px-2 py-0.5 text-xs font-medium transition-colors bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
              >
                <span className="font-semibold tracking-wide">Clear</span>
              </button>
            )}

            {/* Remove Button */}
            {onRemove && (
              <button
                onClick={onRemove}
                className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                title="Remove"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Stats/Validation row */}
        {stats && (
          <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            {stats}
          </div>
        )}

        {/* Subheader for transform options */}
        {children && (
          <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            {children}
          </div>
        )}
      </div>

      {/* TextEditor */}
      <div className="bg-white dark:bg-zinc-900 rounded-b-lg border border-zinc-200 dark:border-zinc-800">
        <TextEditor
          value={localValue}
          onChange={handleChange}
          readOnly={readOnly}
          height="h-64"
          showLineNumbers={true}
          wrap={wordWrap}
          renderContent={getSyntaxHighlighter(syntaxHighlight)}
        />
      </div>
    </div>
  );
}
