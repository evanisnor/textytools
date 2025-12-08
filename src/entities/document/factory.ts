/**
 * Document Factory Module
 *
 * Factory functions for creating Apogee documents
 */

import { createId } from "@paralleldrive/cuid2";

import type { Document } from "./types";

/**
 * Generate unique ID using CUID2
 */
export function generateId(): string {
  return createId();
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
  initialTransforms: Document["transforms"] = [],
): Document {
  return {
    id: generateId(),
    name: generateDocumentName(),
    inputType,
    inputData,
    transforms: initialTransforms,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
