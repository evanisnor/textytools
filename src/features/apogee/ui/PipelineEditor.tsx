/**
 * Pipeline Editor Component
 *
 * Manages the transform pipeline with dynamic loading of transform definitions
 */

"use client";

import { useState, useEffect } from "react";

import { getTransformAsync } from "../lib/registry";
import type { TransformDefinition, TransformType } from "../model/types";
import type { DocumentManager } from "../model/useDocumentManager";

import { DataBlock } from "./DataBlock";
import { TransformBlock } from "./TransformBlock";
import { TransformPalette } from "./TransformPalette";

export interface PipelineEditorProps {
  documentManager: DocumentManager;
}

export function PipelineEditor({ documentManager }: PipelineEditorProps) {
  const { currentDocument } = documentManager;
  const [transformDefinitions, setTransformDefinitions] = useState<
    Map<string, TransformDefinition>
  >(new Map());

  // Load transform definitions for current document
  useEffect(() => {
    if (!currentDocument) return;

    let cancelled = false;

    const loadTransforms = async () => {
      const newDefs = new Map<string, TransformDefinition>();

      for (const step of currentDocument.transforms) {
        const def = await getTransformAsync(step.transformType);
        if (def) {
          newDefs.set(step.transformType, def);
        }
      }

      if (!cancelled) {
        setTransformDefinitions(newDefs);
      }
    };

    loadTransforms();

    return () => {
      cancelled = true;
    };
  }, [currentDocument]);

  const handleAddTransform = (type: TransformType) => {
    documentManager.addTransform(type);
  };

  if (!currentDocument) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Input Data Block */}
      <DataBlock
        title="Input"
        value={currentDocument.inputData}
        mimeType={currentDocument.inputType}
        onChange={(value) => documentManager.updateInputData(value)}
        inputType={currentDocument.inputType}
        onInputTypeChange={(type) => documentManager.updateInputType(type)}
        stats={[
          {
            label: "Size",
            value: `${currentDocument.inputData.length} chars`,
          },
        ]}
      />

      {/* Transform Pipeline */}
      {currentDocument.transforms.map((step, index) => {
        const transform = transformDefinitions.get(step.transformType);
        if (!transform) return null;

        // Get previous output for lens visibility detection
        const previousOutput =
          index === 0
            ? currentDocument.inputData
            : currentDocument.transforms[index - 1].output;

        return (
          <TransformBlock
            key={step.id}
            step={step}
            stepNumber={index + 1}
            transform={transform}
            previousOutput={previousOutput}
            onUpdateProperties={(props) =>
              documentManager.updateTransformProperties(step.id, props)
            }
            onUpdateInputSelection={(selection) =>
              documentManager.updateTransformInputSelection(step.id, selection)
            }
            onRemove={() => documentManager.removeTransform(step.id)}
          />
        );
      })}

      {/* Transform Palette - Always visible inline */}
      <TransformPalette onSelect={handleAddTransform} />
    </div>
  );
}
