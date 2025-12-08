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

import { useDocumentState } from "@/entities/document";
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

  // Document state management (delegated to entity layer)
  const documentState = useDocumentState();
  const {
    documents,
    currentDocument,
    setCurrentDocument: setCurrentDocumentInState,
    updateDocumentInState,
    updateDocumentName,
    updateInputData,
    updateInputType,
    addTransformToDocument,
    updateTransformInDocument,
    removeTransformFromDocument,
    reorderTransformInDocument,
  } = documentState;

  // Execution state
  const [isExecuting, setIsExecuting] = useState(false);

  // Debounce refs
  const executeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastModifiedStepRef = useRef<number>(0);
  const isInitialLoadRef = useRef(true);

  // ============================================================================
  // URL Sync (Apogee-specific navigation logic)
  // ============================================================================

  // Sync currentDocument with URL
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
      // Set current document based on URL
      const docExists = documents.some((d) => d.id === urlDocId);
      if (docExists) {
        setCurrentDocumentInState(urlDocId);
      } else {
        // Document ID in URL doesn't exist, redirect to base route
        navigation.replaceWithHome();
      }
    } else if (
      navigation.pathname === "/apogee" ||
      navigation.pathname === "/apogee/"
    ) {
      // Clear current document when on base route
      setCurrentDocumentInState(null);
    }
  }, [navigation, documents, setCurrentDocumentInState]);

  // ============================================================================
  // Document Operations (delegated to entity layer)
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

      // Delegate to entity layer and handle navigation intent
      const intent = documentState.createDocument(
        inputData,
        inputType,
        initialTransforms,
      );

      // Handle intent: navigate to new document
      queueMicrotask(() => {
        navigation.navigateToDocument(intent.document.id);
      });
    },
    [documentState, navigation],
  );

  const deleteDocument = useCallback(
    (documentId: string) => {
      const isCurrentDoc = currentDocument?.id === documentId;

      // Delegate to entity layer and handle navigation intent
      const intent = documentState.deleteDocument(documentId);
      if (!intent) return;

      // Handle intent: navigate appropriately if we deleted current doc
      if (isCurrentDoc) {
        queueMicrotask(() => {
          if (intent.remainingDocuments.length > 0) {
            navigation.navigateToDocument(intent.remainingDocuments[0].id);
          } else {
            navigation.navigateToHome();
          }
        });
      }
    },
    [documentState, navigation, currentDocument],
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

        // Update state with modified document via entity layer
        updateDocumentInState(mutableDoc);
      } catch (error) {
        console.error("Pipeline execution failed:", error);
      } finally {
        setIsExecuting(false);
      }
    },
    [updateDocumentInState],
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
  // Document Operations (with Apogee-specific execution)
  // ============================================================================

  const wrappedUpdateInputData = useCallback(
    (data: string) => {
      if (!currentDocument) return;

      // Update via entity layer
      updateInputData(data);

      // Trigger pipeline re-execution (Apogee-specific)
      const updated = {
        ...currentDocument,
        inputData: data,
        updatedAt: Date.now(),
      };
      lastModifiedStepRef.current = 0;
      scheduleExecution(updated, 0);
    },
    [currentDocument, updateInputData, scheduleExecution],
  );

  const wrappedUpdateInputType = useCallback(
    (type: Document["inputType"]) => {
      if (!currentDocument) return;

      // Update via entity layer
      updateInputType(type);

      // Trigger pipeline re-execution (Apogee-specific)
      const updated = {
        ...currentDocument,
        inputType: type,
        updatedAt: Date.now(),
      };
      lastModifiedStepRef.current = 0;
      scheduleExecution(updated, 0);
    },
    [currentDocument, updateInputType, scheduleExecution],
  );

  // ============================================================================
  // Transform Operations (with Apogee-specific execution)
  // ============================================================================

  const addTransform = useCallback(
    (type: TransformType) => {
      if (!currentDocument) return;

      const transform = TRANSFORM_REGISTRY[type];
      if (!transform) {
        console.error(`Transform ${type} not found in registry`);
        return;
      }

      const newStep = createTransformStep(
        currentDocument.id,
        type,
        currentDocument.transforms.length,
        transform.defaultProperties,
      );

      // Update via entity layer
      addTransformToDocument(newStep);

      // Execute from new step (Apogee-specific)
      const updatedTransforms = [...currentDocument.transforms, newStep];
      lastModifiedStepRef.current = updatedTransforms.length - 1;
      scheduleExecution(
        {
          ...currentDocument,
          transforms: updatedTransforms,
          updatedAt: Date.now(),
        },
        updatedTransforms.length - 1,
      );
    },
    [currentDocument, addTransformToDocument, scheduleExecution],
  );

  const updateTransformProperties = useCallback(
    (stepId: string, properties: Record<string, unknown>) => {
      if (!currentDocument) return;

      const stepIndex = currentDocument.transforms.findIndex(
        (step) => step.id === stepId,
      );
      if (stepIndex === -1) return;

      // Update via entity layer
      updateTransformInDocument(stepId, (step) => ({
        ...step,
        properties: { ...step.properties, ...properties },
      }));

      // Execute from modified step (Apogee-specific)
      lastModifiedStepRef.current = stepIndex;
      const updatedTransforms = currentDocument.transforms.map((step) =>
        step.id === stepId
          ? { ...step, properties: { ...step.properties, ...properties } }
          : step,
      );
      scheduleExecution(
        {
          ...currentDocument,
          transforms: updatedTransforms,
          updatedAt: Date.now(),
        },
        stepIndex,
      );
    },
    [currentDocument, updateTransformInDocument, scheduleExecution],
  );

  const updateTransformInputSelection = useCallback(
    (stepId: string, inputSelection: TransformStep["inputSelection"]) => {
      if (!currentDocument) return;

      const stepIndex = currentDocument.transforms.findIndex(
        (step) => step.id === stepId,
      );
      if (stepIndex === -1) return;

      // Update via entity layer
      updateTransformInDocument(stepId, (step) => ({
        ...step,
        inputSelection,
      }));

      // Execute from modified step (Apogee-specific)
      lastModifiedStepRef.current = stepIndex;
      const updatedTransforms = currentDocument.transforms.map((step) =>
        step.id === stepId ? { ...step, inputSelection } : step,
      );
      scheduleExecution(
        {
          ...currentDocument,
          transforms: updatedTransforms,
          updatedAt: Date.now(),
        },
        stepIndex,
      );
    },
    [currentDocument, updateTransformInDocument, scheduleExecution],
  );

  const removeTransform = useCallback(
    (stepId: string) => {
      if (!currentDocument) return;

      const stepIndex = currentDocument.transforms.findIndex(
        (step) => step.id === stepId,
      );
      if (stepIndex === -1) return;

      // Update via entity layer
      removeTransformFromDocument(stepId);

      // Execute from the step after the removed one (Apogee-specific)
      const updatedTransforms = currentDocument.transforms
        .filter((step) => step.id !== stepId)
        .map((step, index) => ({ ...step, order: index }));

      if (updatedTransforms.length > 0) {
        lastModifiedStepRef.current = Math.min(
          stepIndex,
          updatedTransforms.length - 1,
        );
        scheduleExecution(
          {
            ...currentDocument,
            transforms: updatedTransforms,
            updatedAt: Date.now(),
          },
          lastModifiedStepRef.current,
        );
      }
    },
    [currentDocument, removeTransformFromDocument, scheduleExecution],
  );

  const reorderTransform = useCallback(
    (stepId: string, newOrder: number) => {
      if (!currentDocument) return;

      const oldIndex = currentDocument.transforms.findIndex(
        (step) => step.id === stepId,
      );
      if (oldIndex === -1) return;

      // Update via entity layer
      reorderTransformInDocument(stepId, newOrder);

      // Execute from the earlier of old/new positions (Apogee-specific)
      const transforms = [...currentDocument.transforms];
      const [movedStep] = transforms.splice(oldIndex, 1);
      transforms.splice(newOrder, 0, movedStep);
      const reordered = transforms.map((step, index) => ({
        ...step,
        order: index,
      }));

      lastModifiedStepRef.current = Math.min(oldIndex, newOrder);
      scheduleExecution(
        { ...currentDocument, transforms: reordered, updatedAt: Date.now() },
        lastModifiedStepRef.current,
      );
    },
    [currentDocument, reorderTransformInDocument, scheduleExecution],
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

      // Update state with modified document via entity layer
      updateDocumentInState(mutableDoc);
    } catch (error) {
      console.error("Pipeline execution failed:", error);
    } finally {
      setIsExecuting(false);
    }
  }, [currentDocument, updateDocumentInState]);

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
    updateDocumentName, // From entity
    updateInputData: wrappedUpdateInputData, // Wrapped with execution
    updateInputType: wrappedUpdateInputType, // Wrapped with execution
    addTransform, // Wrapped with execution
    updateTransformProperties, // Wrapped with execution
    updateTransformInputSelection, // Wrapped with execution
    removeTransform, // Wrapped with execution
    reorderTransform, // Wrapped with execution
    executeFromStep,
    executePipeline,
  };
}
