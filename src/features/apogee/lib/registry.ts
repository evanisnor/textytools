/**
 * Transform Registry
 *
 * Centralized registry for all transform definitions.
 * Provides access functions for querying transforms by type, category, or compatibility.
 */

import type {
  TransformDefinition,
  TransformType,
  TransformCategory,
} from "../model/types";

/**
 * Global transform registry
 * Transforms will be registered as they are implemented
 */
export const TRANSFORM_REGISTRY: Record<string, TransformDefinition> = {};

/**
 * Get a transform definition by type
 */
export function getTransform(
  type: TransformType,
): TransformDefinition | undefined {
  return TRANSFORM_REGISTRY[type];
}

/**
 * Get all transform definitions
 */
export function getAllTransforms(): TransformDefinition[] {
  return Object.values(TRANSFORM_REGISTRY);
}

/**
 * Get all transforms in a specific category
 */
export function getTransformsByCategory(
  category: TransformCategory,
): TransformDefinition[] {
  return Object.values(TRANSFORM_REGISTRY).filter(
    (transform) => transform.category === category,
  );
}

/**
 * Get transforms that accept a specific input type
 */
export function getTransformsByInputType(
  inputType: string,
): TransformDefinition[] {
  return Object.values(TRANSFORM_REGISTRY).filter((transform) =>
    transform.acceptsInput.includes(inputType),
  );
}

/**
 * Check if a transform exists in the registry
 */
export function hasTransform(type: TransformType): boolean {
  return type in TRANSFORM_REGISTRY;
}

/**
 * Register a new transform definition
 * (Used by transform implementations to register themselves)
 */
export function registerTransform(definition: TransformDefinition): void {
  TRANSFORM_REGISTRY[definition.type] = definition;
}

/**
 * Unregister a transform (primarily for testing)
 */
export function unregisterTransform(type: TransformType): void {
  delete TRANSFORM_REGISTRY[type];
}
