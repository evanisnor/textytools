/**
 * Blastoff Hook
 * Main state management for the blastoff feature
 */

"use client";

import { useState, useCallback, useMemo } from "react";

import { PipelineEngine } from "../lib/engine";
import { EXPORT_REGISTRY } from "../lib/exports";

import { Document, TransformType, ExportType } from "./types";
import { useDocumentManager } from "./useDocumentManager";

export function useBlastoff(documentId?: string) {
  const documentManager = useDocumentManager();
  const [inputText, setInputText] = useState("");
  const [selectedTransformType, setSelectedTransformType] =
    useState<TransformType | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Load document when ID changes - using useMemo to avoid setState in effect
  const currentDocument = useMemo(() => {
    if (!documentId || !documentManager.mounted) {
      return null;
    }
    return documentManager.getDocument(documentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    documentId,
    documentManager.mounted,
    documentManager.getDocument,
    refreshCounter,
  ]);

  // Create new document from input
  const handleSubmitInput = useCallback(() => {
    if (!inputText.trim()) return;

    const newId = documentManager.createDocument(inputText);
    setInputText("");

    // Return the new ID so the UI can navigate
    return newId;
  }, [inputText, documentManager]);

  // Add transform to current document
  const handleAddTransform = useCallback(
    async (
      transformType: TransformType,
      properties: Record<string, unknown>,
      targetDocumentId?: string,
    ) => {
      const docId = targetDocumentId || currentDocument?.id;
      if (!docId) return;

      documentManager.addTransformStep(docId, transformType, properties);

      // Reload document
      const updated = documentManager.getDocument(docId);
      if (updated) {
        // Execute pipeline to get outputs
        await PipelineEngine.executePipeline(updated);
        documentManager.updateDocument(updated.id, updated);
        setRefreshCounter((c) => c + 1);
      }
    },
    [currentDocument, documentManager, setRefreshCounter],
  );

  // Remove transform from current document
  const handleRemoveTransform = useCallback(
    (stepId: string) => {
      if (!currentDocument) return;

      documentManager.removeTransformStep(currentDocument.id, stepId);

      // Reload document
      setRefreshCounter((c) => c + 1);
    },
    [currentDocument, documentManager, setRefreshCounter],
  );

  // Update transform step properties
  const updateTransformStep = useCallback(
    async (stepId: string, properties: Record<string, unknown>) => {
      if (!currentDocument) return;

      documentManager.updateTransformStep(currentDocument.id, stepId, {
        properties,
      });

      // Reload and re-execute pipeline
      const updated = documentManager.getDocument(currentDocument.id);
      if (updated) {
        await PipelineEngine.executePipeline(updated);
        documentManager.updateDocument(updated.id, updated);
        setRefreshCounter((c) => c + 1);
      }
    },
    [currentDocument, documentManager, setRefreshCounter],
  );

  // Update document name
  const handleUpdateName = useCallback(
    (name: string) => {
      if (!currentDocument) return;

      documentManager.updateDocument(currentDocument.id, { name });
    },
    [currentDocument, documentManager],
  );

  // Update input data and re-execute pipeline
  const handleUpdateInput = useCallback(
    async (inputData: string) => {
      if (!currentDocument) return;

      const updates: Partial<Document> = { inputData };

      // Auto-update name if it's still "New Document" and we have input
      if (currentDocument.name === "New Document" && inputData.trim()) {
        const firstLine = inputData.split("\n")[0].trim();
        if (firstLine) {
          let name = firstLine.substring(0, 30);
          if (firstLine.length > 30) {
            name += "...";
          }
          updates.name = name;
        }
      }

      documentManager.updateDocument(currentDocument.id, updates);

      // Reload and re-execute pipeline
      const updated = documentManager.getDocument(currentDocument.id);
      if (updated) {
        await PipelineEngine.executePipeline(updated);
        documentManager.updateDocument(updated.id, updated);
        setRefreshCounter((c) => c + 1);
      }
    },
    [currentDocument, documentManager, setRefreshCounter],
  );

  // Get current output type
  const currentOutputType = useMemo(() => {
    if (!currentDocument) return "text";
    return PipelineEngine.getCurrentOutputType(currentDocument);
  }, [currentDocument]);

  // Get available transforms
  const availableTransforms = useMemo(() => {
    return PipelineEngine.getAvailableTransforms(currentOutputType);
  }, [currentOutputType]);

  // Get available exports
  const availableExports = useMemo(() => {
    return PipelineEngine.getAvailableExports(currentOutputType);
  }, [currentOutputType]);

  // Get final output
  const finalOutput = useMemo(() => {
    if (!currentDocument) return "";

    if (currentDocument.transforms.length === 0) {
      return currentDocument.inputData;
    }

    return (
      currentDocument.transforms[currentDocument.transforms.length - 1]
        ?.output || ""
    );
  }, [currentDocument]);

  // Execute export
  const handleExport = useCallback(
    (exportType: string, properties: Record<string, unknown>) => {
      if (!currentDocument) return;

      const exportDef = EXPORT_REGISTRY[exportType as ExportType];

      if (exportDef) {
        exportDef.execute(finalOutput, properties, currentDocument);
      }
    },
    [currentDocument, finalOutput],
  );

  return {
    // Document management
    documents: documentManager.documents,
    currentDocument,
    mounted: documentManager.mounted,
    createDocument: documentManager.createDocument,
    deleteDocument: documentManager.deleteDocument,

    // Input state
    inputText,
    setInputText,
    handleSubmitInput,
    handleUpdateInput,

    // Transform management
    selectedTransformType,
    setSelectedTransformType,
    handleAddTransform,
    handleRemoveTransform,
    updateTransformStep,
    availableTransforms,

    // Output & exports
    currentOutputType,
    finalOutput,
    availableExports,
    handleExport,

    // Document metadata
    handleUpdateName,
  };
}

export type BlastoffContextValue = ReturnType<typeof useBlastoff>;
