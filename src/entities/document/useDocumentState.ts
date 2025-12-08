/**
 * Document State Management Hook
 *
 * Manages document collection state with:
 * - Document CRUD operations
 * - LocalStorage persistence
 * - URL-based navigation synchronization
 */

import { useCallback, useEffect, useState } from "react";

import type { Document } from "./types";

import {
  addDocument,
  createDocument as createDocumentFactory,
  loadDocuments,
  removeDocumentById,
  saveDocuments,
  updateDocument,
} from "./index";

// ============================================================================
// Types
// ============================================================================

export interface DocumentCreatedIntent {
  type: "DOCUMENT_CREATED";
  document: Document;
}

export interface DocumentDeletedIntent {
  type: "DOCUMENT_DELETED";
  documentId: string;
  remainingDocuments: Document[];
}

export type DocumentIntent = DocumentCreatedIntent | DocumentDeletedIntent;

export interface DocumentStateManager {
  // State
  documents: Document[];
  currentDocument: Document | null;
  setCurrentDocument: (docId: string | null) => void;

  // Document CRUD (returns intents for navigation)
  createDocument: (
    inputData: string,
    inputType: Document["inputType"],
    initialTransforms?: Document["transforms"],
  ) => DocumentCreatedIntent;
  deleteDocument: (documentId: string) => DocumentDeletedIntent | null;
  updateDocumentInState: (doc: Document) => void;

  // Document metadata updates
  updateDocumentName: (name: string) => void;
  updateInputData: (data: string) => void;
  updateInputType: (type: Document["inputType"]) => void;

  // Transform management
  addTransformToDocument: (transform: Document["transforms"][0]) => void;
  updateTransformInDocument: (
    stepId: string,
    updater: (step: Document["transforms"][0]) => Document["transforms"][0],
  ) => void;
  removeTransformFromDocument: (stepId: string) => void;
  reorderTransformInDocument: (stepId: string, newOrder: number) => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useDocumentState(): DocumentStateManager {
  // State - Initialize with data from localStorage
  const [documents, setDocuments] = useState<Document[]>(loadDocuments);
  const [currentDocument, setCurrentDocumentState] = useState<Document | null>(
    null,
  );

  // ============================================================================
  // Persistence
  // ============================================================================

  // Save documents whenever they change
  useEffect(() => {
    if (documents.length > 0) {
      saveDocuments(documents);
    }
  }, [documents]);

  // ============================================================================
  // Current Document Management
  // ============================================================================

  const setCurrentDocument = useCallback(
    (docId: string | null) => {
      if (docId === null) {
        setCurrentDocumentState(null);
        return;
      }

      const doc = documents.find((d) => d.id === docId);
      if (doc) {
        setCurrentDocumentState(doc);
      }
    },
    [documents],
  );

  // ============================================================================
  // Document Operations
  // ============================================================================

  const createDocument = useCallback(
    (
      inputData: string,
      inputType: Document["inputType"],
      initialTransforms: Document["transforms"] = [],
    ): DocumentCreatedIntent => {
      const newDoc = createDocumentFactory(
        inputData,
        inputType,
        initialTransforms,
      );

      // Update document ID in transform steps
      if (initialTransforms.length > 0) {
        initialTransforms.forEach((transform) => {
          transform.documentId = newDoc.id;
        });
      }

      setDocuments((prev) => addDocument(prev, newDoc));

      // Return intent for caller to handle navigation
      return {
        type: "DOCUMENT_CREATED",
        document: newDoc,
      };
    },
    [],
  );

  const deleteDocument = useCallback(
    (documentId: string): DocumentDeletedIntent | null => {
      const docToDelete = documents.find((d) => d.id === documentId);
      if (!docToDelete) return null;

      const updated = removeDocumentById(documents, documentId);
      setDocuments(updated);

      // Return intent for caller to handle navigation
      return {
        type: "DOCUMENT_DELETED",
        documentId,
        remainingDocuments: updated,
      };
    },
    [documents],
  );

  const updateDocumentInState = useCallback((doc: Document) => {
    setCurrentDocumentState(doc);
    setDocuments((prev) => updateDocument(prev, doc));
  }, []);

  // ============================================================================
  // Document Metadata Updates
  // ============================================================================

  const updateDocumentName = useCallback(
    (name: string) => {
      if (!currentDocument) return;

      const updated = {
        ...currentDocument,
        name,
        updatedAt: Date.now(),
      };

      updateDocumentInState(updated);
    },
    [currentDocument, updateDocumentInState],
  );

  const updateInputData = useCallback(
    (data: string) => {
      if (!currentDocument) return;

      const updated = {
        ...currentDocument,
        inputData: data,
        updatedAt: Date.now(),
      };

      updateDocumentInState(updated);
    },
    [currentDocument, updateDocumentInState],
  );

  const updateInputType = useCallback(
    (type: Document["inputType"]) => {
      if (!currentDocument) return;

      const updated = {
        ...currentDocument,
        inputType: type,
        updatedAt: Date.now(),
      };

      updateDocumentInState(updated);
    },
    [currentDocument, updateDocumentInState],
  );

  // ============================================================================
  // Transform Management
  // ============================================================================

  const addTransformToDocument = useCallback(
    (transform: Document["transforms"][0]) => {
      if (!currentDocument) return;

      const updated = {
        ...currentDocument,
        transforms: [...currentDocument.transforms, transform],
        updatedAt: Date.now(),
      };

      updateDocumentInState(updated);
    },
    [currentDocument, updateDocumentInState],
  );

  const updateTransformInDocument = useCallback(
    (
      stepId: string,
      updater: (step: Document["transforms"][0]) => Document["transforms"][0],
    ) => {
      if (!currentDocument) return;

      const updated = {
        ...currentDocument,
        transforms: currentDocument.transforms.map((step) =>
          step.id === stepId ? updater(step) : step,
        ),
        updatedAt: Date.now(),
      };

      updateDocumentInState(updated);
    },
    [currentDocument, updateDocumentInState],
  );

  const removeTransformFromDocument = useCallback(
    (stepId: string) => {
      if (!currentDocument) return;

      const updated = {
        ...currentDocument,
        transforms: currentDocument.transforms
          .filter((step) => step.id !== stepId)
          .map((step, index) => ({ ...step, order: index })),
        updatedAt: Date.now(),
      };

      updateDocumentInState(updated);
    },
    [currentDocument, updateDocumentInState],
  );

  const reorderTransformInDocument = useCallback(
    (stepId: string, newOrder: number) => {
      if (!currentDocument) return;

      const oldIndex = currentDocument.transforms.findIndex(
        (step) => step.id === stepId,
      );
      if (oldIndex === -1) return;

      // Reorder transforms
      const transforms = [...currentDocument.transforms];
      const [movedStep] = transforms.splice(oldIndex, 1);
      transforms.splice(newOrder, 0, movedStep);

      // Update order property
      const reordered = transforms.map((step, index) => ({
        ...step,
        order: index,
      }));

      const updated = {
        ...currentDocument,
        transforms: reordered,
        updatedAt: Date.now(),
      };

      updateDocumentInState(updated);
    },
    [currentDocument, updateDocumentInState],
  );

  // ============================================================================
  // Return API
  // ============================================================================

  return {
    // State
    documents,
    currentDocument,
    setCurrentDocument,

    // Document CRUD
    createDocument,
    deleteDocument,
    updateDocumentInState,

    // Document metadata updates
    updateDocumentName,
    updateInputData,
    updateInputType,

    // Transform management
    addTransformToDocument,
    updateTransformInDocument,
    removeTransformFromDocument,
    reorderTransformInDocument,
  };
}
