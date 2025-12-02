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

import { csvConvertDefinition } from "@/entities/transform/csv-convert";
import { jsonConvertDefinition } from "@/entities/transform/json-convert";
import {
  base64DecodeDefinition,
  base64EncodeDefinition,
  base58DecodeDefinition,
  base58EncodeDefinition,
  hexDecodeDefinition,
  hexEncodeDefinition,
  htmlEntityEncodeDefinition,
  urlEncodeDefinition,
} from "@/entities/transform/text-encoding";
import {
  md5HashDefinition,
  sha1HashDefinition,
  sha256HashDefinition,
  sha512HashDefinition,
} from "@/entities/transform/text-hash";
import { tomlConvertDefinition } from "@/entities/transform/toml-convert";
import { xmlConvertDefinition } from "@/entities/transform/xml-convert";
import { yamlConvertDefinition } from "@/entities/transform/yaml-convert";

/**
 * Global transform registry
 * Populated with all implemented transforms
 */
export const TRANSFORM_REGISTRY: Record<string, TransformDefinition> = {
  // Convert transforms
  "json-convert": jsonConvertDefinition as TransformDefinition,
  "csv-convert": csvConvertDefinition as TransformDefinition,
  "yaml-convert": yamlConvertDefinition as TransformDefinition,
  "xml-convert": xmlConvertDefinition as TransformDefinition,
  "toml-convert": tomlConvertDefinition as TransformDefinition,

  // Encode transforms
  "base64-encode": base64EncodeDefinition as TransformDefinition,
  "base58-encode": base58EncodeDefinition as TransformDefinition,
  "hex-encode": hexEncodeDefinition as TransformDefinition,
  "url-encode": urlEncodeDefinition as TransformDefinition,
  "html-entity-encode": htmlEntityEncodeDefinition as TransformDefinition,

  // Decode transforms
  "base64-decode": base64DecodeDefinition as TransformDefinition,
  "base58-decode": base58DecodeDefinition as TransformDefinition,
  "hex-decode": hexDecodeDefinition as TransformDefinition,

  // Hash transforms
  "md5-hash": md5HashDefinition as TransformDefinition,
  "sha1-hash": sha1HashDefinition as TransformDefinition,
  "sha256-hash": sha256HashDefinition as TransformDefinition,
  "sha512-hash": sha512HashDefinition as TransformDefinition,
};

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
