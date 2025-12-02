"use client";

import { useCallback, useState } from "react";

import type { TransformStat } from "../model/types";

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
}: DataBlockProps) {
  const [wrap, setWrap] = useState(false);
  const [copied, setCopied] = useState(false);

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
    <div className="border border-zinc-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-50 border-b border-zinc-200 px-4 py-2">
        <h3 className="text-sm font-medium text-zinc-700">{title}</h3>
        <div className="flex items-center gap-2">
          {/* Wrap Toggle */}
          <button
            type="button"
            onClick={handleWrapToggle}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              wrap
                ? "bg-blue-100 text-blue-700"
                : "bg-white text-zinc-600 hover:bg-zinc-100"
            }`}
            title={wrap ? "Disable word wrap" : "Enable word wrap"}
          >
            Wrap
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-2 py-1 text-xs bg-white text-zinc-600 rounded hover:bg-zinc-100 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          {/* Clear Button */}
          {onClear && !readOnly && (
            <button
              type="button"
              onClick={onClear}
              className="px-2 py-1 text-xs bg-white text-zinc-600 rounded hover:bg-zinc-100 transition-colors"
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
              className="px-2 py-1 text-xs bg-white text-red-600 rounded hover:bg-red-50 transition-colors"
              title="Remove this block"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      {stats && stats.length > 0 && (
        <div className="flex items-center gap-3 bg-zinc-50 border-b border-zinc-200 px-4 py-2 overflow-x-auto">
          {stats.map((stat, index) => (
            <StatPill key={index} stat={stat} />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="bg-white">
        <TextEditor
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          wrap={wrap}
          showLineNumbers={!wrap}
          height="h-64"
          placeholder={readOnly ? "No output" : "Enter data..."}
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
    info: "bg-blue-100 text-blue-700 border-blue-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
    default: "bg-zinc-100 text-zinc-700 border-zinc-200",
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
