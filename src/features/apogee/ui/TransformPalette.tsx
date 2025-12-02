/**
 * Transform Palette Component
 *
 * Expandable category rows for selecting transforms
 */

"use client";

import { useState } from "react";

import { getTransformsByCategory } from "../lib/registry";
import type { TransformCategory, TransformType } from "../model/types";

export interface TransformPaletteProps {
  onSelect: (type: TransformType) => void;
}

const CATEGORIES: { key: TransformCategory; label: string }[] = [
  { key: "convert", label: "Convert" },
  { key: "encode", label: "Encode" },
  { key: "decode", label: "Decode" },
  { key: "hash", label: "Hash" },
  { key: "manipulate", label: "Manipulate" },
  { key: "compress", label: "Compress" },
  { key: "decompress", label: "Decompress" },
];

export function TransformPalette({ onSelect }: TransformPaletteProps) {
  const [expandedCategory, setExpandedCategory] =
    useState<TransformCategory | null>(null);

  const toggleCategory = (category: TransformCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="space-y-3">
      {/* Category Buttons Row */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isExpanded = expandedCategory === category.key;
          return (
            <button
              key={category.key}
              onClick={() => toggleCategory(category.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isExpanded
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {category.label} {isExpanded ? "▲" : "▼"}
            </button>
          );
        })}
      </div>

      {/* Expanded Category Transforms */}
      {expandedCategory && (
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-3">
            {CATEGORIES.find((c) => c.key === expandedCategory)?.label}:
          </h3>
          <div className="flex flex-wrap gap-2">
            {getTransformsByCategory(expandedCategory).map((transform) => (
              <button
                key={transform.type}
                onClick={() => onSelect(transform.type)}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors text-sm font-medium"
                title={transform.description}
              >
                {transform.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
