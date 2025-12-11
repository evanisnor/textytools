/**
 * Transform Palette Component
 *
 * Flat list of all available transforms
 */

"use client";

import { getAllTransforms } from "../lib/registry";
import type { TransformType } from "../model/types";

export interface TransformPaletteProps {
  onSelect: (type: TransformType) => void;
}

export function TransformPalette({ onSelect }: TransformPaletteProps) {
  const allTransforms = getAllTransforms();

  return (
    <div className="flex flex-col items-center gap-3 py-4 mb-32">
      {/* Welcoming Prompt */}
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
          What&apos;s next?
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Choose a transformation to continue
        </p>
      </div>

      {/* All Transforms - Flat Row */}
      <div className="flex flex-wrap justify-center gap-1.5 px-4">
        {allTransforms.map((transform) => (
          <button
            key={transform.type}
            onClick={() => onSelect(transform.type)}
            className="px-3 py-1.5 text-sm rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all"
            title={transform.description}
          >
            {transform.name}
          </button>
        ))}
      </div>
    </div>
  );
}
