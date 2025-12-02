"use client";

import { useEffect, useCallback } from "react";
import React from "react";

import { TRANSFORM_REGISTRY } from "../lib/registry";
import { useApogeeContext } from "../model/ApogeeProvider";
import type { TransformType } from "../model/types";

import { DataBlock } from "./DataBlock";
import { InputForm } from "./InputForm";
import { TransformBlock } from "./TransformBlock";

/**
 * TransformPipeline - Main pipeline display component
 *
 * Orchestrates the entire Apogee pipeline UI:
 * - Shows InputForm when no document exists
 * - Shows input data + transform steps when document exists
 * - Manages document lifecycle and transform execution
 * - Provides "Add Transform" functionality
 *
 * @example
 * ```tsx
 * <ApogeeProvider>
 *   <TransformPipeline />
 * </ApogeeProvider>
 * ```
 */
export function TransformPipeline() {
  const {
    currentDocument,
    createDocument,
    updateInputData,
    addTransform,
    updateTransformProperties,
    removeTransform,
    executePipeline,
  } = useApogeeContext();

  // Auto-execute pipeline when document or transforms change
  useEffect(() => {
    if (currentDocument) {
      executePipeline();
    }
  }, [currentDocument, executePipeline]);

  const handleCreateDocument = useCallback(
    (inputData: string, inputType: string) => {
      createDocument(inputData, inputType as "text" | "csv" | "json" | "file");
    },
    [createDocument],
  );

  const handleAddTransform = useCallback(
    (transformType: string) => {
      addTransform(transformType as TransformType);
    },
    [addTransform],
  );

  // Show input form when no document
  if (!currentDocument) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-800 mb-2">
            Apogee Pipeline
          </h1>
          <p className="text-zinc-600">
            Create a linear transformation pipeline to process your data.
          </p>
        </div>
        <InputForm onCreateDocument={handleCreateDocument} />
      </div>
    );
  }

  // Show pipeline with transforms
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-800 mb-2">
          Apogee Pipeline
        </h1>
        <p className="text-zinc-600">
          {currentDocument.name || "Untitled Pipeline"}
        </p>
      </div>

      {/* Input Data Block */}
      <div className="mb-6">
        <DataBlock
          title="Input Data"
          value={currentDocument.inputData}
          onChange={updateInputData}
          mimeType={currentDocument.inputType}
        />
      </div>

      {/* Visual Connector */}
      {currentDocument.transforms.length > 0 && (
        <div className="flex justify-center my-4">
          <div className="w-0.5 h-8 bg-zinc-300" />
        </div>
      )}

      {/* Transform Steps */}
      <div className="space-y-6">
        {currentDocument.transforms.map((step, index) => {
          const transform = TRANSFORM_REGISTRY[step.transformType];
          if (!transform) {
            return (
              <div
                key={step.id}
                className="border border-red-200 rounded-lg p-4 bg-red-50"
              >
                <p className="text-red-600 text-sm">
                  Transform &quot;{step.transformType}&quot; not found
                </p>
              </div>
            );
          }

          return (
            <div key={step.id}>
              <TransformBlock
                step={step}
                stepNumber={index + 1}
                transform={transform}
                onUpdateProperties={(properties) =>
                  updateTransformProperties(step.id, properties)
                }
                onRemove={() => removeTransform(step.id)}
              />

              {/* Connector to next step */}
              {index < currentDocument.transforms.length - 1 && (
                <div className="flex justify-center my-4">
                  <div className="w-0.5 h-8 bg-zinc-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Transform Button */}
      <div className="mt-8">
        {currentDocument.transforms.length > 0 && (
          <div className="flex justify-center mb-4">
            <div className="w-0.5 h-8 bg-zinc-300" />
          </div>
        )}
        <TransformPalette onAddTransform={handleAddTransform} />
      </div>
    </div>
  );
}

interface TransformPaletteProps {
  onAddTransform: (transformType: string) => void;
}

/**
 * TransformPalette - Transform selection UI
 *
 * Simple button-based palette for adding transforms to pipeline.
 * Groups transforms by category for easier discovery.
 */
function TransformPalette({ onAddTransform }: TransformPaletteProps) {
  const [expanded, setExpanded] = React.useState(false);

  const transformsByCategory = Object.values(TRANSFORM_REGISTRY).reduce(
    (acc, transform) => {
      if (!acc[transform.category]) {
        acc[transform.category] = [];
      }
      acc[transform.category].push(transform);
      return acc;
    },
    {} as Record<string, (typeof TRANSFORM_REGISTRY)[string][]>,
  );

  return (
    <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Transform
      </button>

      {expanded && (
        <div className="p-4 space-y-6">
          {Object.entries(transformsByCategory).map(
            ([category, transforms]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-zinc-700 mb-2 uppercase">
                  {category}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {transforms.map((transform) => (
                    <button
                      key={transform.type}
                      type="button"
                      onClick={() => {
                        onAddTransform(transform.type);
                        setExpanded(false);
                      }}
                      className="px-3 py-2 text-sm border border-zinc-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                      title={transform.description}
                    >
                      {transform.name}
                    </button>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

// Add React import for useState hook used in TransformPalette
