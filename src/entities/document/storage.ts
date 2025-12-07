/**
 * Document Storage Module
 *
 * Handles localStorage persistence for Apogee documents
 */

import type { Document } from "./types";

const STORAGE_KEY = "apogee-documents";

/**
 * Load documents from localStorage
 */
export function loadDocuments(): Document[] {
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
export function saveDocuments(documents: Document[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch (error) {
    console.error("Failed to save documents to localStorage:", error);
  }
}

/**
 * Find document by ID
 */
export function findDocumentById(
  documents: Document[],
  id: string,
): Document | undefined {
  return documents.find((doc) => doc.id === id);
}

/**
 * Remove document by ID
 */
export function removeDocumentById(
  documents: Document[],
  id: string,
): Document[] {
  return documents.filter((doc) => doc.id !== id);
}

/**
 * Update document in array
 */
export function updateDocument(
  documents: Document[],
  updated: Document,
): Document[] {
  return documents.map((doc) => (doc.id === updated.id ? updated : doc));
}

/**
 * Add document to array
 */
export function addDocument(
  documents: Document[],
  newDoc: Document,
): Document[] {
  return [...documents, newDoc];
}
