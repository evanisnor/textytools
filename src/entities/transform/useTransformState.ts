/**
 * Transform State Management Hook
 *
 * Manages transform operations on documents with:
 * - Adding transforms to documents
 * - Updating transform properties and input selection
 * - Removing and reordering transforms
 * - Returns updated document for caller to persist
 */

import { useCallback } from "react";

import type { TransformStep } from "./shared/types";

import type { Document } from "@/entities/document";

// ============================================================================
// Types
// ============================================================================

export interface TransformStateManager {
  // Transform CRUD (returns updated document)
  addTransform: (document: Document, transform: TransformStep) => Document;

  updateTransformProperties: (
    document: Document,
    stepId: string,
    properties: Record<string, unknown>,
  ) => Document;

  updateTransformInputSelection: (
    document: Document,
    stepId: string,
    inputSelection: TransformStep["inputSelection"],
  ) => Document;

  removeTransform: (document: Document, stepId: string) => Document | null;

  reorderTransform: (
    document: Document,
    stepId: string,
    newOrder: number,
  ) => Document | null;

  findTransformIndex: (document: Document, stepId: string) => number;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useTransformState(): TransformStateManager {
  const addTransform = useCallback(
    (document: Document, transform: TransformStep): Document => {
      return {
        ...document,
        transforms: [...document.transforms, transform],
        updatedAt: Date.now(),
      };
    },
    [],
  );

  const updateTransformProperties = useCallback(
    (
      document: Document,
      stepId: string,
      properties: Record<string, unknown>,
    ): Document => {
      return {
        ...document,
        transforms: document.transforms.map((step) =>
          step.id === stepId
            ? { ...step, properties: { ...step.properties, ...properties } }
            : step,
        ),
        updatedAt: Date.now(),
      };
    },
    [],
  );

  const updateTransformInputSelection = useCallback(
    (
      document: Document,
      stepId: string,
      inputSelection: TransformStep["inputSelection"],
    ): Document => {
      return {
        ...document,
        transforms: document.transforms.map((step) =>
          step.id === stepId ? { ...step, inputSelection } : step,
        ),
        updatedAt: Date.now(),
      };
    },
    [],
  );

  const removeTransform = useCallback(
    (document: Document, stepId: string): Document | null => {
      const stepIndex = document.transforms.findIndex(
        (step) => step.id === stepId,
      );
      if (stepIndex === -1) return null;

      return {
        ...document,
        transforms: document.transforms
          .filter((step) => step.id !== stepId)
          .map((step, index) => ({ ...step, order: index })),
        updatedAt: Date.now(),
      };
    },
    [],
  );

  const reorderTransform = useCallback(
    (document: Document, stepId: string, newOrder: number): Document | null => {
      const oldIndex = document.transforms.findIndex(
        (step) => step.id === stepId,
      );
      if (oldIndex === -1) return null;

      // Reorder transforms
      const transforms = [...document.transforms];
      const [movedStep] = transforms.splice(oldIndex, 1);
      transforms.splice(newOrder, 0, movedStep);

      // Update order property
      const reordered = transforms.map((step, index) => ({
        ...step,
        order: index,
      }));

      return {
        ...document,
        transforms: reordered,
        updatedAt: Date.now(),
      };
    },
    [],
  );

  const findTransformIndex = useCallback(
    (document: Document, stepId: string): number => {
      return document.transforms.findIndex((step) => step.id === stepId);
    },
    [],
  );

  return {
    addTransform,
    updateTransformProperties,
    updateTransformInputSelection,
    removeTransform,
    reorderTransform,
    findTransformIndex,
  };
}
