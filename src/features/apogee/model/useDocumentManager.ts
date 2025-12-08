/**
 * Document State Management Hook
 *
 * Manages Apogee document state with:
 * - Document CRUD operations
 * - Transform step management
 * - Pipeline execution orchestration
 * - LocalStorage persistence
 * - Debounced auto-execution
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { ApogeeEngine } from "../lib/engine";
import { TRANSFORM_REGISTRY } from "../lib/registry";

import type { Document, TransformStep, TransformType } from "./types";

import {
  addDocument,
  createDocument as createDocumentFactory,
  findDocumentById,
  loadDocuments,
  removeDocumentById,
  saveDocuments,
  updateDocument,
} from "@/entities/document";
import { useApogeeNavigation } from "@/entities/navigation";
import { createTransformStep } from "@/entities/transform/shared";

// ============================================================================
// Constants
// ============================================================================

const AUTO_EXECUTE_DEBOUNCE_MS = 500;

// ============================================================================
// Types
// ============================================================================

export interface DocumentManagerState {
  currentDocument: Document | null;
  documents: Document[];
  isExecuting: boolean;
}

export interface DocumentManagerActions {
  createDocument: (
    inputData: string,
    inputType: Document["inputType"],
    initialTransform?: TransformType,
  ) => void;
  deleteDocument: (documentId: string) => void;
  setCurrentDocument: (documentId: string | null) => void;
  updateDocumentName: (name: string) => void;
  updateInputData: (data: string) => void;
  updateInputType: (type: Document["inputType"]) => void;
  addTransform: (type: TransformType) => void;
  updateTransformProperties: (
    stepId: string,
    properties: Record<string, unknown>,
  ) => void;
  updateTransformInputSelection: (
    stepId: string,
    inputSelection: TransformStep["inputSelection"],
  ) => void;
  removeTransform: (stepId: string) => void;
  reorderTransform: (stepId: string, newOrder: number) => void;
  executeFromStep: (stepIndex: number) => Promise<void>;
  executePipeline: () => Promise<void>;
}

export type DocumentManager = DocumentManagerState & DocumentManagerActions;

// ============================================================================
// Hook Implementation
// ============================================================================

export function useDocumentManager(): DocumentManager {
  // Navigation
  const navigation = useApogeeNavigation();

  // State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocumentState] = useState<Document | null>(
    null,
  );
  const [isExecuting, setIsExecuting] = useState(false);

  // Debounce refs
  const executeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastModifiedStepRef = useRef<number>(0);
  const isInitialLoadRef = useRef(true);

  // ============================================================================
  // Persistence
  // ============================================================================

  // Load documents on mount only
  useEffect(() => {
    const loadedDocs = loadDocuments();
    setDocuments(loadedDocs);
  }, []);

  // Handle URL-based navigation separately
  useEffect(() => {
    // Skip during initial mount - wait for documents to load
    if (isInitialLoadRef.current && documents.length === 0) {
      return;
    }

    // Mark as initialized after first run
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
    }

    const urlDocId = navigation.documentId;

    if (urlDocId) {
      // Find document by ID from URL
      const docToLoad = findDocumentById(documents, urlDocId);
      if (docToLoad) {
        // Only update if it's different from current
        setCurrentDocumentState((current) => {
          if (current?.id !== urlDocId) {
            return docToLoad;
          }
          return current;
        });
      } else {
        // Document ID in URL doesn't exist, redirect to base route
        navigation.replaceWithHome();
      }
    } else if (
      navigation.pathname === "/apogee" ||
      navigation.pathname === "/apogee/"
    ) {
      // Clear current document when on base route
      setCurrentDocumentState((current) => {
        if (current !== null) {
          return null;
        }
        return current;
      });
    }
  }, [navigation, documents]);

  // Save documents whenever they change
  useEffect(() => {
    if (documents.length > 0) {
      saveDocuments(documents);
    }
  }, [documents]);

  // ============================================================================
  // Document Operations
  // ============================================================================

  const createDocument = useCallback(
    (
      inputData: string,
      inputType: Document["inputType"],
      initialTransform?: TransformType,
    ) => {
      // Create initial transform step if provided
      const initialTransforms = initialTransform
        ? [
            createTransformStep(
              "", // Document ID will be set below
              initialTransform,
              0,
              TRANSFORM_REGISTRY[initialTransform]?.defaultProperties || {},
            ),
          ]
        : [];

      const newDoc = createDocumentFactory(
        inputData,
        inputType,
        initialTransforms,
      );

      // Update document ID in transform steps
      if (initialTransforms.length > 0) {
        initialTransforms[0].documentId = newDoc.id;
      }

      setDocuments((prev) => addDocument(prev, newDoc));

      // Navigate to the new document's route after state update completes
      // Use queueMicrotask to defer navigation until after React finishes rendering
      queueMicrotask(() => {
        navigation.navigateToDocument(newDoc.id);
      });
    },
    [navigation],
  );

  const deleteDocument = useCallback(
    (documentId: string) => {
      // Check if we're deleting the current document
      const isCurrentDoc = currentDocument?.id === documentId;

      setDocuments((prev) => {
        const updated = removeDocumentById(prev, documentId);

        // If we deleted the current document, navigate appropriately after state update
        if (isCurrentDoc) {
          queueMicrotask(() => {
            if (updated.length > 0) {
              // Switch to the first available document
              navigation.navigateToDocument(updated[0].id);
            } else {
              // No documents left, go to base route
              navigation.navigateToHome();
            }
          });
        }

        return updated;
      });
    },
    [navigation, currentDocument],
  );

  const setCurrentDocument = useCallback(
    (documentId: string | null) => {
      // This function now ONLY handles navigation
      // State updates happen in the URL sync effect
      if (!documentId) {
        navigation.navigateToHome();
        return;
      }

      navigation.navigateToDocument(documentId);
    },
    [navigation],
  );

  const updateDocumentName = useCallback((name: string) => {
    setCurrentDocumentState((current) => {
      if (!current) return null;

      const updated = {
        ...current,
        name,
        updatedAt: Date.now(),
      };

      // Update in documents array
      setDocuments((prev) => updateDocument(prev, updated));

      return updated;
    });
  }, []);

  // ============================================================================
  // Execution Helpers (declared early for use in callbacks)
  // ============================================================================

  /**
   * Execute pipeline from specific step (immediate, no debounce)
   */
  const executeFromStepImmediate = useCallback(
    async (document: Document, fromStepIndex: number) => {
      setIsExecuting(true);

      try {
        // Create mutable copy for engine to modify
        const mutableDoc = { ...document };
        await ApogeeEngine.executeFromStep(mutableDoc, fromStepIndex);

        // Update state with modified document
        setCurrentDocumentState(mutableDoc);
        setDocuments((prev) => updateDocument(prev, mutableDoc));
      } catch (error) {
        console.error("Pipeline execution failed:", error);
      } finally {
        setIsExecuting(false);
      }
    },
    [],
  );

  /**
   * Schedule debounced execution from a specific step
   */
  const scheduleExecution = useCallback(
    (document: Document, fromStepIndex: number) => {
      // Clear existing timeout
      if (executeTimeoutRef.current) {
        clearTimeout(executeTimeoutRef.current);
      }

      // Schedule new execution
      executeTimeoutRef.current = setTimeout(() => {
        executeFromStepImmediate(document, fromStepIndex);
      }, AUTO_EXECUTE_DEBOUNCE_MS);
    },
    [executeFromStepImmediate],
  );

  // ============================================================================
  // Document Operations
  // ============================================================================

  const updateInputData = useCallback(
    (data: string) => {
      setCurrentDocumentState((current) => {
        if (!current) return null;

        const updated = {
          ...current,
          inputData: data,
          updatedAt: Date.now(),
        };

        // Update in documents array
        setDocuments((prev) => updateDocument(prev, updated));

        // Trigger pipeline re-execution
        lastModifiedStepRef.current = 0;
        scheduleExecution(updated, 0);

        return updated;
      });
    },
    [scheduleExecution],
  );

  const updateInputType = useCallback(
    (type: Document["inputType"]) => {
      setCurrentDocumentState((current) => {
        if (!current) return null;

        const updated = {
          ...current,
          inputType: type,
          updatedAt: Date.now(),
        };

        // Update in documents array
        setDocuments((prev) => updateDocument(prev, updated));

        // Trigger pipeline re-execution if needed
        lastModifiedStepRef.current = 0;
        scheduleExecution(updated, 0);

        return updated;
      });
    },
    [scheduleExecution],
  );

  // ============================================================================
  // Transform Operations
  // ============================================================================

  const addTransform = useCallback(
    (type: TransformType) => {
      setCurrentDocumentState((current) => {
        if (!current) return null;

        const transform = TRANSFORM_REGISTRY[type];
        if (!transform) {
          console.error(`Transform ${type} not found in registry`);
          return current;
        }

        const newStep = createTransformStep(
          current.id,
          type,
          current.transforms.length,
          transform.defaultProperties,
        );

        const updated = {
          ...current,
          transforms: [...current.transforms, newStep],
          updatedAt: Date.now(),
        };

        // Update in documents array
        setDocuments((prev) => updateDocument(prev, updated));

        // Execute from new step
        lastModifiedStepRef.current = updated.transforms.length - 1;
        scheduleExecution(updated, updated.transforms.length - 1);

        return updated;
      });
    },
    [scheduleExecution],
  );

  const updateTransformProperties = useCallback(
    (stepId: string, properties: Record<string, unknown>) => {
      setCurrentDocumentState((current) => {
        if (!current) return null;

        const stepIndex = current.transforms.findIndex(
          (step) => step.id === stepId,
        );
        if (stepIndex === -1) return current;

        const updated = {
          ...current,
          transforms: current.transforms.map((step) =>
            step.id === stepId
              ? { ...step, properties: { ...step.properties, ...properties } }
              : step,
          ),
          updatedAt: Date.now(),
        };

        // Update in documents array
        setDocuments((prev) => updateDocument(prev, updated));

        // Execute from modified step
        lastModifiedStepRef.current = stepIndex;
        scheduleExecution(updated, stepIndex);

        return updated;
      });
    },
    [scheduleExecution],
  );

  const updateTransformInputSelection = useCallback(
    (stepId: string, inputSelection: TransformStep["inputSelection"]) => {
      setCurrentDocumentState((current) => {
        if (!current) return null;

        const stepIndex = current.transforms.findIndex(
          (step) => step.id === stepId,
        );
        if (stepIndex === -1) return current;

        const updated = {
          ...current,
          transforms: current.transforms.map((step) =>
            step.id === stepId ? { ...step, inputSelection } : step,
          ),
          updatedAt: Date.now(),
        };

        // Update in documents array
        setDocuments((prev) => updateDocument(prev, updated));

        // Execute from modified step
        lastModifiedStepRef.current = stepIndex;
        scheduleExecution(updated, stepIndex);

        return updated;
      });
    },
    [scheduleExecution],
  );

  const removeTransform = useCallback(
    (stepId: string) => {
      setCurrentDocumentState((current) => {
        if (!current) return null;

        const stepIndex = current.transforms.findIndex(
          (step) => step.id === stepId,
        );
        if (stepIndex === -1) return current;

        const updated = {
          ...current,
          transforms: current.transforms
            .filter((step) => step.id !== stepId)
            .map((step, index) => ({ ...step, order: index })),
          updatedAt: Date.now(),
        };

        // Update in documents array
        setDocuments((prev) => updateDocument(prev, updated));

        // Execute from the step after the removed one
        if (updated.transforms.length > 0) {
          lastModifiedStepRef.current = Math.min(
            stepIndex,
            updated.transforms.length - 1,
          );
          scheduleExecution(updated, lastModifiedStepRef.current);
        }

        return updated;
      });
    },
    [scheduleExecution],
  );

  const reorderTransform = useCallback(
    (stepId: string, newOrder: number) => {
      setCurrentDocumentState((current) => {
        if (!current) return null;

        const oldIndex = current.transforms.findIndex(
          (step) => step.id === stepId,
        );
        if (oldIndex === -1) return current;

        // Reorder transforms
        const transforms = [...current.transforms];
        const [movedStep] = transforms.splice(oldIndex, 1);
        transforms.splice(newOrder, 0, movedStep);

        // Update order property
        const reordered = transforms.map((step, index) => ({
          ...step,
          order: index,
        }));

        const updated = {
          ...current,
          transforms: reordered,
          updatedAt: Date.now(),
        };

        // Update in documents array
        setDocuments((prev) => updateDocument(prev, updated));

        // Execute from the earlier of old/new positions
        lastModifiedStepRef.current = Math.min(oldIndex, newOrder);
        scheduleExecution(updated, lastModifiedStepRef.current);

        return updated;
      });
    },
    [scheduleExecution],
  );

  // ============================================================================
  // Public Execution Methods
  // ============================================================================

  const executeFromStep = useCallback(
    async (stepIndex: number) => {
      if (!currentDocument) return;
      await executeFromStepImmediate(currentDocument, stepIndex);
    },
    [currentDocument, executeFromStepImmediate],
  );

  const executePipeline = useCallback(async () => {
    if (!currentDocument) return;

    setIsExecuting(true);

    try {
      // Create mutable copy for engine to modify
      const mutableDoc = { ...currentDocument };
      await ApogeeEngine.executePipeline(mutableDoc);

      // Update state with modified document
      setCurrentDocumentState(mutableDoc);
      setDocuments((prev) => updateDocument(prev, mutableDoc));
    } catch (error) {
      console.error("Pipeline execution failed:", error);
    } finally {
      setIsExecuting(false);
    }
  }, [currentDocument]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (executeTimeoutRef.current) {
        clearTimeout(executeTimeoutRef.current);
      }
    };
  }, []);

  // ============================================================================
  // Return API
  // ============================================================================

  return {
    // State
    currentDocument,
    documents,
    isExecuting,

    // Actions
    createDocument,
    deleteDocument,
    setCurrentDocument,
    updateDocumentName,
    updateInputData,
    updateInputType,
    addTransform,
    updateTransformProperties,
    updateTransformInputSelection,
    removeTransform,
    reorderTransform,
    executeFromStep,
    executePipeline,
  };
}
