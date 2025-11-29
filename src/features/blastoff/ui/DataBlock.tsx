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
  children?: React.ReactNode; // For subheader content (e.g., transform options)
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
  children,
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

  // Update local value when external value changes (but not during typing)
  useEffect(() => {
    // Only update if not currently typing (no pending debounce)
    if (!debounceTimer.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalValue(value);
    }
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
            {/* Word Wrap Toggle */}
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
                className="w-3 h-3"
              />
              <span className="text-zinc-600 dark:text-zinc-400">Wrap</span>
            </label>

            {/* Syntax Highlighting */}
            <select
              value={syntaxHighlight}
              onChange={(e) =>
                setSyntaxHighlight(e.target.value as "none" | "csv" | "json")
              }
              disabled={lockSyntax}
              className="text-xs px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="none">Plain Text</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="jwt">JWT</option>
            </select>

            {/* Remove Button */}
            {onRemove && (
              <button
                onClick={onRemove}
                className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-lg"
                title="Remove"
              >
                ×
              </button>
            )}
          </div>
        </div>

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
