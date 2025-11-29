/**
 * Export Selector
 * Modal for selecting and configuring an export
 */

"use client";

import { useState } from "react";

import { EXPORT_REGISTRY } from "../lib/exports";
import { useBlastoffContext } from "../model/BlastoffProvider";
import { ExportType } from "../model/types";

interface ExportSelectorProps {
  onClose: () => void;
}

export function ExportSelector({ onClose }: ExportSelectorProps) {
  const { availableExports, handleExport } = useBlastoffContext();
  const [selectedType, setSelectedType] = useState<ExportType | null>(null);
  const [properties, setProperties] = useState<Record<string, unknown>>({});
  const [exported, setExported] = useState(false);

  const selectedExport = selectedType ? EXPORT_REGISTRY[selectedType] : null;

  const handleSelect = (type: ExportType) => {
    setSelectedType(type);
    setProperties(EXPORT_REGISTRY[type].defaultProperties);
  };

  const handleExecuteExport = () => {
    if (!selectedType) return;

    handleExport(selectedType, properties);
    setExported(true);

    // Auto-close after success
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handlePropertyChange = (key: string, value: unknown) => {
    setProperties((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 w-full max-w-xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Export Output</h2>
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
            // Export List
            <div className="grid gap-3">
              {availableExports.map((exp) => (
                <button
                  key={exp.type}
                  onClick={() => handleSelect(exp.type)}
                  className="text-left p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{exp.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold mb-1">{exp.name}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {exp.description}
                      </div>
                    </div>
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

              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selectedExport?.icon}</span>
                <h3 className="text-lg font-bold">{selectedExport?.name}</h3>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                {selectedExport?.description}
              </p>

              {selectedExport?.propertySchema.map((schema) => (
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
                </div>
              ))}

              {exported && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400">
                  ✓ Export successful!
                </div>
              )}
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
              onClick={handleExecuteExport}
              disabled={exported}
              className="px-4 py-2 text-sm bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {exported ? "Exported" : "Export"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
