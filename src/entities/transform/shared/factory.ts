/**
 * Transform Factory Functions
 *
 * Factory functions for creating transform steps
 */

import { createId } from "@paralleldrive/cuid2";

import type { TransformStep } from "./types";

/**
 * Generate unique ID using CUID2
 */
export function generateId(): string {
  return createId();
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
