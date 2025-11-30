/**
 * Transform Pipeline
 * Shows input, transforms, output, and transform palette
 */

"use client";

import { useState } from "react";

import { useBlastoffContext } from "../model/BlastoffProvider";

import { DataBlock } from "./DataBlock";
import { ExportSelector } from "./ExportSelector";
import { TransformBlock } from "./TransformBlock";
import { TransformPalette } from "./TransformPalette";

export function TransformPipeline() {
  const { currentDocument, handleUpdateInput } = useBlastoffContext();

  const [showExportSelector, setShowExportSelector] = useState(false);

  if (!currentDocument) return null;

  return (
    <div className="space-y-6">
      {/* Input Block */}
      <DataBlock
        title="Input"
        value={currentDocument.inputData}
        onChange={handleUpdateInput}
        onClear={() => handleUpdateInput("")}
      />

      {/* Transform Steps */}
      {currentDocument.transforms.map((step, index) => {
        // Get input for this step (either document input or previous step's output)
        const stepInput =
          index === 0
            ? currentDocument.inputData
            : currentDocument.transforms[index - 1].output;

        return (
          <TransformBlock
            key={step.id}
            step={step}
            stepNumber={index + 1}
            stepInput={stepInput}
          />
        );
      })}

      {/* Transform Palette at Bottom */}
      <TransformPalette />

      {/* Export Selector Modal */}
      {showExportSelector && (
        <ExportSelector onClose={() => setShowExportSelector(false)} />
      )}
    </div>
  );
}
