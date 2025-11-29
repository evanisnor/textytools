/**
 * Document Manager Hook
 * Manages CRUD operations for documents in localStorage
 */

"use client";

import { useState, useCallback, useEffect } from "react";

import { Document, TransformStep, TransformType } from "./types";

const STORAGE_PREFIX = "blastoff-doc-";

export function useDocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load all documents from localStorage
  const loadDocuments = useCallback(() => {
    if (typeof window === "undefined") return;

    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(STORAGE_PREFIX),
    );
    const docs = keys
      .map((key) => {
        const data = localStorage.getItem(key);
        return data ? (JSON.parse(data) as Document) : null;
      })
      .filter((doc): doc is Document => doc !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt);

    setDocuments(docs);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    loadDocuments();
  }, [loadDocuments]);

  // Create new document
  const createDocument = useCallback(
    (inputData: string): string => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // Generate name from first 30 characters of first line
      let name = "New Document";
      if (inputData.trim()) {
        const firstLine = inputData.split("\n")[0].trim();
        if (firstLine) {
          name = firstLine.substring(0, 30);
          if (firstLine.length > 30) {
            name += "...";
          }
        }
      }

      const doc: Document = {
        id,
        name,
        inputType: "text",
        inputData,
        transforms: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(doc));
      loadDocuments();

      return id;
    },
    [loadDocuments],
  );

  // Get document by ID
  const getDocument = useCallback((id: string): Document | null => {
    if (typeof window === "undefined") return null;

    const data = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!data) return null;

    return JSON.parse(data) as Document;
  }, []);

  // Update document
  const updateDocument = useCallback(
    (id: string, updates: Partial<Document>) => {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
      if (!data) return;

      const doc: Document = JSON.parse(data);
      const updated = { ...doc, ...updates, updatedAt: Date.now() };

      localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(updated));
      loadDocuments();
    },
    [loadDocuments],
  );

  // Add transform step
  const addTransformStep = useCallback(
    (
      documentId: string,
      transformType: TransformType,
      properties: Record<string, unknown>,
    ) => {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${documentId}`);
      if (!data) return;

      const doc: Document = JSON.parse(data);

      const step: TransformStep = {
        id: `step-${Date.now()}`,
        documentId,
        order: doc.transforms.length,
        transformType,
        properties,
        output: "",
        createdAt: Date.now(),
      };

      doc.transforms.push(step);
      doc.updatedAt = Date.now();

      localStorage.setItem(
        `${STORAGE_PREFIX}${documentId}`,
        JSON.stringify(doc),
      );
      loadDocuments();
    },
    [loadDocuments],
  );

  // Update transform step
  const updateTransformStep = useCallback(
    (documentId: string, stepId: string, updates: Partial<TransformStep>) => {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${documentId}`);
      if (!data) return;

      const doc: Document = JSON.parse(data);
      const stepIndex = doc.transforms.findIndex((s) => s.id === stepId);

      if (stepIndex === -1) return;

      doc.transforms[stepIndex] = {
        ...doc.transforms[stepIndex],
        ...updates,
      };
      doc.updatedAt = Date.now();

      localStorage.setItem(
        `${STORAGE_PREFIX}${documentId}`,
        JSON.stringify(doc),
      );
      loadDocuments();
    },
    [loadDocuments],
  );

  // Remove transform step
  const removeTransformStep = useCallback(
    (documentId: string, stepId: string) => {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${documentId}`);
      if (!data) return;

      const doc: Document = JSON.parse(data);
      doc.transforms = doc.transforms
        .filter((s) => s.id !== stepId)
        .map((s, index) => ({ ...s, order: index }));
      doc.updatedAt = Date.now();

      localStorage.setItem(
        `${STORAGE_PREFIX}${documentId}`,
        JSON.stringify(doc),
      );
      loadDocuments();
    },
    [loadDocuments],
  );

  // Delete document
  const deleteDocument = useCallback(
    (id: string) => {
      localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
      loadDocuments();
    },
    [loadDocuments],
  );

  return {
    documents,
    mounted,
    loadDocuments,
    createDocument,
    getDocument,
    updateDocument,
    addTransformStep,
    updateTransformStep,
    removeTransformStep,
    deleteDocument,
  };
}
