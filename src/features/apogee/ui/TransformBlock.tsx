"use client";

import { useCallback, useState } from "react";

import type { TransformStep, TransformDefinition } from "../model/types";

import { ConfigurationPanel } from "./ConfigurationPanel";

import { TextEditor } from "@/entities/editor";

interface TransformBlockProps {
  step: TransformStep;
  stepNumber: number;
  transform: TransformDefinition;
  onUpdateProperties: (properties: Record<string, unknown>) => void;
  onRemove: () => void;
}

/**
 * TransformBlock - Individual pipeline step component
 *
 * Displays:
 * - Step header with number, transform name, and controls
 * - Configuration panel (schema-driven form)
 * - Output data block (read-only)
 * - Collapsible/expandable sections
 *
 * @example
 * ```tsx
 * <TransformBlock
 *   step={transformStep}
 *   stepNumber={1}
 *   transform={transformDefinition}
 *   onUpdateProperties={(props) => updateTransform(stepId, props)}
 *   onRemove={() => removeTransform(stepId)}
 * />
 * ```
 */
export function TransformBlock({
  step,
  stepNumber,
  transform,
  onUpdateProperties,
  onRemove,
}: TransformBlockProps) {
  const [configExpanded, setConfigExpanded] = useState(true);
  const [outputExpanded, setOutputExpanded] = useState(true);
  const [wrap, setWrap] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePropertyChange = useCallback(
    (key: string, value: unknown) => {
      onUpdateProperties({
        ...step.properties,
        [key]: value,
      });
    },
    [step.properties, onUpdateProperties],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(step.output || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [step.output]);

  const handleWrapToggle = useCallback(() => {
    setWrap((prev) => !prev);
  }, []);

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-b border-blue-200 dark:border-blue-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-sm font-bold">
            {stepNumber}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              {transform.name}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {transform.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-950 transition-colors font-medium border border-red-200 dark:border-red-800"
            title="Remove this step"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Configuration Section */}
      {transform.propertySchema.length > 0 && (
        <div className="border-b border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setConfigExpanded(!configExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left"
          >
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Configuration
            </span>
            <svg
              className={`w-5 h-5 text-zinc-500 dark:text-zinc-400 transition-transform ${
                configExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {configExpanded && (
            <ConfigurationPanel
              schema={transform.propertySchema}
              values={step.properties}
              onChange={handlePropertyChange}
            />
          )}
        </div>
      )}

      {/* Output Section */}
      <div>
        <div className="w-full flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Output
          </span>
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

            {/* Collapse/Expand Button */}
            <button
              type="button"
              onClick={() => setOutputExpanded(!outputExpanded)}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
              title={outputExpanded ? "Collapse output" : "Expand output"}
            >
              <svg
                className={`w-5 h-5 text-zinc-500 dark:text-zinc-400 transition-transform ${
                  outputExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
        {outputExpanded && (
          <div className="bg-white dark:bg-zinc-900">
            <TextEditor
              value={step.output || ""}
              readOnly
              wrap={wrap}
              showLineNumbers={!wrap}
              height="h-64"
              placeholder="No output"
            />
          </div>
        )}
      </div>
    </div>
  );
}
