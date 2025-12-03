/**
 * Apogee Shell Component
 *
 * Frame-like layout with:
 * - Left sidebar: Document list (independently scrollable)
 * - Main area: Pipeline editor with vertical transform blocks
 */

"use client";

import { useState } from "react";

import type { TransformType, InputType } from "../model/types";
import type { DocumentManager } from "../model/useDocumentManager";

import { DataBlock } from "./DataBlock";
import { PipelineEditor } from "./PipelineEditor";
import { TransformPalette } from "./TransformPalette";

import { detectFormat } from "@/entities/transform/shared/formatDetection";

export interface ApogeeShellProps {
  documentManager: DocumentManager;
}

export function ApogeeShell({ documentManager }: ApogeeShellProps) {
  const {
    currentDocument,
    documents,
    createDocument,
    setCurrentDocument,
    addTransform,
    deleteDocument,
  } = documentManager;
  const [inputText, setInputText] = useState("");
  const [inputType, setInputType] = useState<InputType>("auto");
  const [hoveredDocId, setHoveredDocId] = useState<string | null>(null);

  // Auto-detect format from current input (derived state)
  const effectiveInputType: InputType =
    inputType === "auto" && inputText
      ? detectFormat(inputText) !== "unknown"
        ? (detectFormat(inputText) as "csv" | "json" | "yaml" | "xml" | "toml")
        : "auto"
      : inputType;

  const handleTransformSelect = (type: TransformType) => {
    if (!inputText.trim()) return;

    // Create document with input text and detected type
    createDocument(inputText, effectiveInputType);

    // Clear input for next time
    setInputText("");
    setInputType("auto");

    // Note: The document creation will trigger a re-render with currentDocument set,
    // then PipelineEditor will be shown. We need to add the transform after the document is created.
    // This is handled by the effect in the next render cycle.
    setTimeout(() => {
      addTransform(type);
    }, 0);
  };

  const handleDeleteDocument = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDocument(docId);
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Left Sidebar - Document List */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Documents</h2>

          {documents.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No documents yet
            </p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onMouseEnter={() => setHoveredDocId(doc.id)}
                  onMouseLeave={() => setHoveredDocId(null)}
                  className="relative"
                >
                  <button
                    onClick={() => setCurrentDocument(doc.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      currentDocument?.id === doc.id
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="font-medium truncate pr-6">
                      {doc.name || "Untitled"}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {doc.transforms.length} step
                      {doc.transforms.length !== 1 ? "s" : ""}
                    </div>
                  </button>

                  {/* Delete Button - Show on hover */}
                  {hoveredDocId === doc.id && (
                    <button
                      onClick={(e) => handleDeleteDocument(doc.id, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete document"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {!currentDocument ? (
            // Initial State - Input with optional transform palette
            <div className="space-y-6">
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                  Apogee
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Transform pipeline with data lenses and composable steps
                </p>
              </div>

              {/* Initial Input Block */}
              <DataBlock
                title="Input"
                value={inputText}
                onChange={setInputText}
                onClear={() => setInputText("")}
                inputType={effectiveInputType}
                onInputTypeChange={setInputType}
                stats={[
                  {
                    label: "Size",
                    value: `${inputText.length} chars`,
                  },
                ]}
              />

              {/* Transform Palette - Only show when there's input text */}
              {inputText.trim() && (
                <TransformPalette onSelect={handleTransformSelect} />
              )}
            </div>
          ) : (
            // Pipeline View
            <PipelineEditor documentManager={documentManager} />
          )}
        </div>
      </main>
    </div>
  );
}
