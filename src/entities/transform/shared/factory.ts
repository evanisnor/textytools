/**
 * Transform Factory Functions
 *
 * Factory functions for creating transform steps
 */

import type { TransformStep } from "./types";

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create new transform step
 */
export function createTransformStep(
  documentId: string,
  transformType: string,
  order: number,
  defaultProperties: Record<string, unknown>,
): TransformStep {
  return {
    id: generateId(),
    documentId,
    order,
    transformType,
    inputSelection: {
      mode: "all",
      regexFlags: "g",
    },
    properties: { ...defaultProperties },
    output: "",
    createdAt: Date.now(),
  };
}
