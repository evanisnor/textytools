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

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "apogee-documents";
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
  createDocument: (inputData: string, inputType: Document["inputType"]) => void;
  deleteDocument: (documentId: string) => void;
  setCurrentDocument: (documentId: string | null) => void;
  updateInputData: (data: string) => void;
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
// Helper Functions
// ============================================================================

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Load documents from localStorage
 */
function loadDocuments(): Document[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load documents from localStorage:", error);
    return [];
  }
}

/**
 * Save documents to localStorage
 */
function saveDocuments(documents: Document[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch (error) {
    console.error("Failed to save documents to localStorage:", error);
  }
}

/**
 * Create default input selection for a transform
 */
function createDefaultInputSelection(): TransformStep["inputSelection"] {
  return {
    mode: "all",
  };
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useDocumentManager(): DocumentManager {
  // State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocumentState] = useState<Document | null>(
    null,
  );
  const [isExecuting, setIsExecuting] = useState(false);

  // Debounce refs
  const executeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastModifiedStepRef = useRef<number>(0);

  // ============================================================================
  // Persistence
  // ============================================================================

  // Load documents on mount
  useEffect(() => {
    const loadedDocs = loadDocuments();
    setDocuments(loadedDocs);

    // Don't auto-select any document - let user choose or create new
  }, []);

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
    (inputData: string, inputType: Document["inputType"]) => {
      const newDoc: Document = {
        id: generateId(),
        name: `Document ${documents.length + 1}`,
        inputType,
        inputData,
        transforms: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setDocuments((prev) => [...prev, newDoc]);
      setCurrentDocumentState(newDoc);
    },
    [documents.length],
  );

  const deleteDocument = useCallback((documentId: string) => {
    setDocuments((prev) => {
      const updated = prev.filter((doc) => doc.id !== documentId);

      // If we deleted the current document, switch to another
      setCurrentDocumentState((current) => {
        if (current?.id === documentId) {
          return updated.length > 0 ? updated[0] : null;
        }
        return current;
      });

      return updated;
    });
  }, []);

  const setCurrentDocument = useCallback((documentId: string | null) => {
    if (!documentId) {
      setCurrentDocumentState(null);
      return;
    }

    setDocuments((prev) => {
      const doc = prev.find((d) => d.id === documentId);
      if (doc) {
        setCurrentDocumentState(doc);
      }
      return prev;
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
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === mutableDoc.id ? mutableDoc : doc)),
        );
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
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === current.id ? updated : doc)),
        );

        // Trigger pipeline re-execution
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

        const newStep: TransformStep = {
          id: generateId(),
          documentId: current.id,
          order: current.transforms.length,
          transformType: type,
          inputSelection: createDefaultInputSelection(),
          properties: { ...transform.defaultProperties },
          output: "",
          createdAt: Date.now(),
        };

        const updated = {
          ...current,
          transforms: [...current.transforms, newStep],
          updatedAt: Date.now(),
        };

        // Update in documents array
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === current.id ? updated : doc)),
        );

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
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === current.id ? updated : doc)),
        );

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
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === current.id ? updated : doc)),
        );

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
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === current.id ? updated : doc)),
        );

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
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === current.id ? updated : doc)),
        );

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
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === mutableDoc.id ? mutableDoc : doc)),
      );
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
    updateInputData,
    addTransform,
    updateTransformProperties,
    updateTransformInputSelection,
    removeTransform,
    reorderTransform,
    executeFromStep,
    executePipeline,
  };
}
