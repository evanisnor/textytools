/**
 * Document Factory Module
 *
 * Factory functions for creating Apogee documents
 */

import type { Document } from "./types";

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate document name from current date/time
 * Format: "Jan 18, 2025 11:34pm"
 */
export function generateDocumentName(): string {
  const now = new Date();

  // Format: "Jan 18, 2025"
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const datePart = now.toLocaleDateString("en-US", dateOptions);

  // Format: "11:34pm"
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const timePart = now.toLocaleTimeString("en-US", timeOptions).toLowerCase();

  return `${datePart} ${timePart}`;
}

/**
 * Create new document
 */
export function createDocument(
  inputData: string,
  inputType: Document["inputType"],
): Document {
  return {
    id: generateId(),
    name: generateDocumentName(),
    inputType,
    inputData,
    transforms: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
