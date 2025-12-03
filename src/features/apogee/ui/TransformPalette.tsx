/**
 * Transform Palette Component
 *
 * Expandable category rows for selecting transforms
 */

"use client";

import { useState, useRef, useEffect } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (category: TransformCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Scroll to show expanded options when category is selected
  useEffect(() => {
    if (expandedCategory && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
    }
  }, [expandedCategory]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-3 py-4 mb-32"
    >
      {/* Welcoming Prompt */}
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
          What&apos;s next?
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Choose a transformation to continue
        </p>
      </div>

      {/* Category Buttons - Compact Row */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {CATEGORIES.map((category) => {
          const isExpanded = expandedCategory === category.key;
          return (
            <button
              key={category.key}
              onClick={() => toggleCategory(category.key)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                isExpanded
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Expanded Category Transforms - Compact and Centered */}
      {expandedCategory && (
        <div className="flex flex-wrap justify-center gap-1.5 px-4">
          {getTransformsByCategory(expandedCategory).map((transform) => (
            <button
              key={transform.type}
              onClick={() => {
                onSelect(transform.type);
                setExpandedCategory(null); // Collapse after selection
              }}
              className="px-3 py-1.5 text-sm rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all"
              title={transform.description}
            >
              {transform.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
