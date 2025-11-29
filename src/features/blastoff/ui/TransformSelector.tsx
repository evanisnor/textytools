/**
 * Transform Selector
 * Modal for selecting and configuring a new transform
 */

"use client";

import { useState } from "react";

import { TRANSFORM_REGISTRY } from "../lib/registry";
import { useBlastoffContext } from "../model/BlastoffProvider";
import { TransformType } from "../model/types";

interface TransformSelectorProps {
  onClose: () => void;
}

export function TransformSelector({ onClose }: TransformSelectorProps) {
  const { availableTransforms, handleAddTransform } = useBlastoffContext();
  const [selectedType, setSelectedType] = useState<TransformType | null>(null);
  const [properties, setProperties] = useState<Record<string, unknown>>({});

  const selectedTransform = selectedType
    ? TRANSFORM_REGISTRY[selectedType]
    : null;

  const handleSelect = (type: TransformType) => {
    setSelectedType(type);
    setProperties(TRANSFORM_REGISTRY[type].defaultProperties);
  };

  const handleAdd = async () => {
    if (!selectedType) return;

    await handleAddTransform(selectedType, properties);
    onClose();
  };

  const handlePropertyChange = (key: string, value: unknown) => {
    setProperties((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Add Transform</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedType ? (
            // Transform List
            <div className="grid gap-3">
              {availableTransforms.map((transform) => (
                <button
                  key={transform.type}
                  onClick={() => handleSelect(transform.type)}
                  className="text-left p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-bold mb-1">{transform.name}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {transform.description}
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 rounded">
                      {transform.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // Configuration Form
            <div>
              <button
                onClick={() => setSelectedType(null)}
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4"
              >
                ← Back to list
              </button>

              <h3 className="text-lg font-bold mb-2">
                {selectedTransform?.name}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                {selectedTransform?.description}
              </p>

              {selectedTransform?.propertySchema.map((schema) => (
                <div key={schema.key} className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {schema.label}
                  </label>

                  {schema.type === "text" && (
                    <input
                      type="text"
                      value={(properties[schema.key] as string) || ""}
                      onChange={(e) =>
                        handlePropertyChange(schema.key, e.target.value)
                      }
                      placeholder={schema.placeholder}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    />
                  )}

                  {schema.type === "select" && (
                    <select
                      value={(properties[schema.key] as string) || ""}
                      onChange={(e) =>
                        handlePropertyChange(schema.key, e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
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
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={(properties[schema.key] as boolean) || false}
                        onChange={(e) =>
                          handlePropertyChange(schema.key, e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Enable</span>
                    </label>
                  )}

                  {schema.type === "multi-select" && (
                    <div className="space-y-2">
                      {(schema.options as string[])?.map((opt) => (
                        <label key={opt} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={(
                              (properties[schema.key] as string[]) || []
                            ).includes(opt)}
                            onChange={(e) => {
                              const current =
                                (properties[schema.key] as string[]) || [];
                              const updated = e.target.checked
                                ? [...current, opt]
                                : current.filter((v) => v !== opt);
                              handlePropertyChange(schema.key, updated);
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedType && (
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 text-sm bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Add Transform
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
