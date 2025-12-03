/**
 * Pipeline Editor Component
 *
 * Manages the transform pipeline with dynamic loading of transform definitions
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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
  const lastTransformRef = useRef<HTMLDivElement>(null);
  const previousTransformCount = useRef<number>(0);

  // Document name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const nameUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastDocumentIdRef = useRef<string | undefined>(undefined);

  // Initialize local name with current document name
  // Reset when switching documents
  const [localName, setLocalName] = useState(currentDocument?.name || "");

  // Sync local name when document ID changes (switching documents)
  // This runs during render phase, not in an effect
  if (currentDocument?.id !== lastDocumentIdRef.current) {
    lastDocumentIdRef.current = currentDocument?.id;
    if (currentDocument) {
      setLocalName(currentDocument.name);
    }
  }

  // Debounced name update
  const handleNameChange = useCallback(
    (newName: string) => {
      setLocalName(newName);

      // Clear existing timeout
      if (nameUpdateTimeoutRef.current) {
        clearTimeout(nameUpdateTimeoutRef.current);
      }

      // Schedule update after 500ms of no typing
      nameUpdateTimeoutRef.current = setTimeout(() => {
        documentManager.updateDocumentName(newName);
      }, 500);
    },
    [documentManager],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (nameUpdateTimeoutRef.current) {
        clearTimeout(nameUpdateTimeoutRef.current);
      }
    };
  }, []);

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

  // Scroll to new transform when added
  useEffect(() => {
    if (!currentDocument) return;

    const currentCount = currentDocument.transforms.length;
    if (currentCount > previousTransformCount.current) {
      // Wait for transform definition to load and DOM to render
      setTimeout(() => {
        if (lastTransformRef.current) {
          lastTransformRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    }
    previousTransformCount.current = currentCount;
  }, [
    currentDocument,
    currentDocument?.transforms.length,
    transformDefinitions.size,
  ]);

  if (!currentDocument) {
    return null;
  }

  return (
    <div className="space-y-6 pb-96 pt-8">
      {/* Document Name Header - Editable */}
      <div className="mb-8">
        <input
          ref={nameInputRef}
          type="text"
          value={localName}
          onChange={(e) => handleNameChange(e.target.value)}
          onFocus={() => setIsEditingName(true)}
          onBlur={() => setIsEditingName(false)}
          className={`text-3xl font-bold tracking-tight bg-transparent outline-none w-full max-w-2xl transition-colors ${
            isEditingName
              ? "border-b-2 border-blue-500 dark:border-blue-400"
              : "border-b-2 border-transparent cursor-text hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          placeholder="Document name"
        />
      </div>

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

        const isLastTransform = index === currentDocument.transforms.length - 1;

        return (
          <div key={step.id} ref={isLastTransform ? lastTransformRef : null}>
            <TransformBlock
              step={step}
              stepNumber={index + 1}
              transform={transform}
              previousOutput={previousOutput}
              onUpdateProperties={(props) =>
                documentManager.updateTransformProperties(step.id, props)
              }
              onUpdateInputSelection={(selection) =>
                documentManager.updateTransformInputSelection(
                  step.id,
                  selection,
                )
              }
              onRemove={() => documentManager.removeTransform(step.id)}
            />
          </div>
        );
      })}

      {/* Transform Palette - Always visible inline */}
      <TransformPalette onSelect={handleAddTransform} />
    </div>
  );
}
