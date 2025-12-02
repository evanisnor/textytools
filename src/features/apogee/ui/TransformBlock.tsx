"use client";

import { useCallback, useState } from "react";

import type { TransformStep, TransformDefinition } from "../model/types";

import { ConfigurationPanel } from "./ConfigurationPanel";
import { DataBlock } from "./DataBlock";

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

  const handlePropertyChange = useCallback(
    (key: string, value: unknown) => {
      onUpdateProperties({
        ...step.properties,
        [key]: value,
      });
    },
    [step.properties, onUpdateProperties],
  );

  return (
    <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
            {stepNumber}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-800">
              {transform.name}
            </h3>
            <p className="text-xs text-zinc-600">{transform.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-1.5 text-xs bg-white text-red-600 rounded hover:bg-red-50 transition-colors font-medium border border-red-200"
            title="Remove this step"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Configuration Section */}
      {transform.propertySchema.length > 0 && (
        <div className="border-b border-zinc-200">
          <button
            type="button"
            onClick={() => setConfigExpanded(!configExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
          >
            <span className="text-sm font-medium text-zinc-700">
              Configuration
            </span>
            <svg
              className={`w-5 h-5 text-zinc-500 transition-transform ${
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
        <button
          type="button"
          onClick={() => setOutputExpanded(!outputExpanded)}
          className="w-full flex items-center justify-between px-4 py-2 bg-zinc-50 hover:bg-zinc-100 transition-colors text-left border-b border-zinc-200"
        >
          <span className="text-sm font-medium text-zinc-700">Output</span>
          <svg
            className={`w-5 h-5 text-zinc-500 transition-transform ${
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
        {outputExpanded && (
          <div className="p-4">
            <DataBlock
              title={`Output: ${transform.name}`}
              value={step.output || ""}
              readOnly
              mimeType={transform.producesOutput}
            />
          </div>
        )}
      </div>
    </div>
  );
}
