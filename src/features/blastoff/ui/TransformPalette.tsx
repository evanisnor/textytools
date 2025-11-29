/**
 * Transform Palette
 * Right panel showing available transforms as tiles
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { EXPORT_REGISTRY } from "../lib/exports";
import { TRANSFORM_REGISTRY } from "../lib/registry";
import { useBlastoffContext } from "../model/BlastoffProvider";
import { TransformType, ExportType } from "../model/types";

export function TransformPalette() {
  const router = useRouter();
  const {
    currentDocument,
    inputText,
    finalOutput,
    handleAddTransform,
    handleSubmitInput,
  } = useBlastoffContext();

  const hasTransforms =
    currentDocument && currentDocument.transforms.length > 0;

  const [selectedType, setSelectedType] = useState<TransformType | null>(null);
  const [properties, setProperties] = useState<Record<string, unknown>>({});

  // Hide palette if no input text
  if (!inputText.trim() && !currentDocument) {
    return null;
  }

  const selectedTransform = selectedType
    ? TRANSFORM_REGISTRY[selectedType]
    : null;

  const handleApplyTransform = async () => {
    if (!selectedType) return;

    // If no current document, create one first
    if (!currentDocument && inputText.trim()) {
      const newId = handleSubmitInput();
      if (newId) {
        await handleAddTransform(selectedType, properties, newId);
        setSelectedType(null);
        router.push(`/blastoff/${newId}`);
      }
    } else if (currentDocument) {
      await handleAddTransform(selectedType, properties);
      setSelectedType(null);
    }
  };

  const handlePropertyChange = (key: string, value: unknown) => {
    setProperties((prev) => ({ ...prev, [key]: value }));
  };

  // If a transform is selected, show its configuration
  if (selectedType && selectedTransform) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setSelectedType(null)}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-3"
          >
            ← Back
          </button>
          <h3 className="font-bold text-lg mb-1">{selectedTransform.name}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {selectedTransform.description}
          </p>
        </div>

        {/* Configuration Form */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedTransform.propertySchema.length === 0 ? (
            <div className="text-sm text-zinc-500 dark:text-zinc-500">
              No configuration needed
            </div>
          ) : (
            <div className="space-y-4">
              {selectedTransform.propertySchema.map((schema) => (
                <div key={schema.key}>
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
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm"
                    />
                  )}

                  {schema.type === "select" && (
                    <select
                      value={(properties[schema.key] as string) || ""}
                      onChange={(e) =>
                        handlePropertyChange(schema.key, e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm"
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

        {/* Apply Button */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleApplyTransform}
            disabled={!currentDocument && !inputText.trim()}
            className="w-full px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Transform
          </button>
        </div>
      </div>
    );
  }

  // Show transform tiles - always show all transforms
  const transforms = Object.values(TRANSFORM_REGISTRY);

  // Group by category
  const categories = {
    text: transforms.filter((t) => t.category === "text"),
    data: transforms.filter((t) => t.category === "data"),
    analysis: transforms.filter((t) => t.category === "analysis"),
    encoding: transforms.filter((t) => t.category === "encoding"),
  };

  const handleQuickApply = async (type: TransformType) => {
    const transform = TRANSFORM_REGISTRY[type];

    // If no current document, create one first
    if (!currentDocument && inputText.trim()) {
      const newId = handleSubmitInput();
      if (newId) {
        await handleAddTransform(type, transform.defaultProperties, newId);
        router.push(`/blastoff/${newId}`);
      }
    } else if (currentDocument) {
      await handleAddTransform(type, transform.defaultProperties);
    }
  };

  const handleExport = (type: ExportType) => {
    const exportDef = EXPORT_REGISTRY[type];
    if (currentDocument && finalOutput) {
      exportDef.execute(
        finalOutput,
        exportDef.defaultProperties,
        currentDocument,
      );
    }
  };

  const buttonClasses =
    "px-4 py-2 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors cursor-pointer";

  // Compact collection of center-aligned buttons in a flex row
  return (
    <div className="flex flex-row flex-wrap justify-center gap-2 py-4">
      {Object.entries(categories).map(([, items]) => {
        if (items.length === 0) return null;

        return items.map((transform) => (
          <button
            key={transform.type}
            onClick={() => handleQuickApply(transform.type)}
            className={buttonClasses}
            title={transform.description}
          >
            {transform.name}
          </button>
        ));
      })}

      {hasTransforms && (
        <>
          <button
            onClick={() => handleExport("smart-download")}
            className={buttonClasses}
            title="Download as .txt, .json, or .csv based on content"
          >
            Download
          </button>
          <button
            onClick={() => handleExport("copy-clipboard")}
            className={buttonClasses}
            title="Copy final output to clipboard"
          >
            Copy
          </button>
        </>
      )}
    </div>
  );
}
