/**
 * Transform Block
 * Displays a single transform step with its output and inline configuration
 */

"use client";

import { useState, useRef } from "react";

import { TRANSFORM_REGISTRY } from "../lib/registry";
import { useBlastoffContext } from "../model/BlastoffProvider";
import { TransformStep } from "../model/types";

import { DataBlock } from "./DataBlock";

interface TransformBlockProps {
  step: TransformStep;
  stepNumber: number;
}

export function TransformBlock({ step, stepNumber }: TransformBlockProps) {
  const { handleRemoveTransform, updateTransformStep } = useBlastoffContext();

  const transform = TRANSFORM_REGISTRY[step.transformType];

  // Determine syntax highlighting based on output type
  const getSyntaxForOutputType = (
    outputType: string,
  ): "none" | "csv" | "json" | "jwt" => {
    switch (outputType) {
      case "csv":
        return "csv";
      case "json":
        return "json";
      case "jwt":
        return "jwt";
      default:
        return "none";
    }
  };

  const defaultSyntax = getSyntaxForOutputType(transform.producesOutput);
  const lockSyntax = transform.producesOutput !== "text"; // Lock if not plain text

  // Local state for text inputs to prevent cursor jumping
  const [localProperties, setLocalProperties] = useState<
    Record<string, unknown>
  >(step.properties);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Update local state when step ID changes (new step loaded)
  const [prevStepId, setPrevStepId] = useState(step.id);
  if (prevStepId !== step.id) {
    setLocalProperties(step.properties);
    setPrevStepId(step.id);
  }

  const handlePropertyChange = (
    key: string,
    value: unknown,
    debounce = false,
  ) => {
    // Update local state immediately for responsive UI
    setLocalProperties((prev) => ({ ...prev, [key]: value }));

    if (debounce) {
      // Clear existing timer for this property
      if (debounceTimers.current[key]) {
        clearTimeout(debounceTimers.current[key]);
      }

      // Set new timer to update after user stops typing
      debounceTimers.current[key] = setTimeout(() => {
        const newProperties = { ...step.properties, [key]: value };
        updateTransformStep?.(step.id, newProperties);
      }, 500);
    } else {
      // Update immediately for non-text inputs
      const newProperties = { ...step.properties, [key]: value };
      updateTransformStep?.(step.id, newProperties);
    }
  };

  // Render transform-specific options
  const renderOptions = () => {
    if (transform.propertySchema.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-3">
        {transform.propertySchema.map((schema) => (
          <div key={schema.key} className="flex items-center gap-1.5">
            {schema.type !== "toggle" && schema.type !== "toggle-group" && (
              <label className="text-xs text-zinc-600 dark:text-zinc-400">
                {schema.label}:
              </label>
            )}

            {schema.type === "text" && (
              <input
                type="text"
                value={(localProperties[schema.key] as string) || ""}
                onChange={(e) =>
                  handlePropertyChange(schema.key, e.target.value, true)
                }
                placeholder={schema.placeholder}
                className="text-xs px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-zinc-400 w-32"
              />
            )}

            {schema.type === "select" && (
              <select
                value={(localProperties[schema.key] as string) || ""}
                onChange={(e) =>
                  handlePropertyChange(schema.key, e.target.value)
                }
                className="text-xs px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                {(
                  schema.options as (
                    | string
                    | { value: string; label: string }
                  )[]
                )?.map((opt) => {
                  const value = typeof opt === "string" ? opt : opt.value;
                  const label = typeof opt === "string" ? opt : opt.label;
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
            )}

            {schema.type === "boolean" && (
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={(localProperties[schema.key] as boolean) || false}
                  onChange={(e) =>
                    handlePropertyChange(schema.key, e.target.checked)
                  }
                  className="w-3 h-3"
                />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  Enable
                </span>
              </label>
            )}

            {schema.type === "toggle" && (
              <button
                type="button"
                onClick={() =>
                  handlePropertyChange(
                    schema.key,
                    !(localProperties[schema.key] as boolean),
                  )
                }
                aria-pressed={(localProperties[schema.key] as boolean) || false}
                className={`inline-flex items-center justify-center rounded border px-2 py-0.5 text-xs font-medium transition-colors ${
                  (localProperties[schema.key] as boolean)
                    ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-zinc-900 dark:border-zinc-50"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700"
                } cursor-pointer`}
              >
                <span className="font-semibold tracking-wide">
                  {schema.label}
                </span>
              </button>
            )}

            {schema.type === "toggle-group" && (
              <div className="flex items-center gap-0 rounded border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                {(schema.options as { value: string; label: string }[])?.map(
                  (opt, index) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        handlePropertyChange(schema.key, opt.value)
                      }
                      aria-pressed={
                        (localProperties[schema.key] as string) === opt.value
                      }
                      className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium transition-colors ${
                        (localProperties[schema.key] as string) === opt.value
                          ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                          : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      } ${index > 0 ? "border-l border-zinc-200 dark:border-zinc-700" : ""} cursor-pointer`}
                    >
                      <span className="font-semibold tracking-wide">
                        {opt.label}
                      </span>
                    </button>
                  ),
                )}
              </div>
            )}

            {schema.type === "multi-select" && (
              <div className="flex gap-1.5">
                {(schema.options as string[])?.map((opt) => (
                  <label key={opt} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={(
                        (localProperties[schema.key] as string[]) || []
                      ).includes(opt)}
                      onChange={(e) => {
                        const current =
                          (localProperties[schema.key] as string[]) || [];
                        const updated = e.target.checked
                          ? [...current, opt]
                          : current.filter((v) => v !== opt);
                        handlePropertyChange(schema.key, updated);
                      }}
                      className="w-3 h-3"
                    />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Arrow Connector */}
      <div className="flex items-center justify-center mb-2">
        <div className="text-zinc-400 dark:text-zinc-600">↓</div>
      </div>

      <DataBlock
        title={`Step ${stepNumber}: ${transform.name}`}
        subtitle={transform.category}
        value={step.output}
        readOnly
        onRemove={() => handleRemoveTransform(step.id)}
        defaultSyntax={defaultSyntax}
        lockSyntax={lockSyntax}
      >
        {renderOptions()}
      </DataBlock>
    </div>
  );
}
