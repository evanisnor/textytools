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
import { extractLinesDefinition } from "@/entities/transform/extract-lines";
import {
  gzipCompressDefinition,
  gzipDecompressDefinition,
} from "@/entities/transform/gzip-compress";
import { jsonConvertDefinition } from "@/entities/transform/json-convert";
import { jwtDecodeDefinition } from "@/entities/transform/jwt";
import { modifyFieldDefinition } from "@/entities/transform/modify-field";
import { regexReplaceDefinition } from "@/entities/transform/regex-replace";
import { sortLinesDefinition } from "@/entities/transform/sort-lines";
import { caseConvertTransform } from "@/entities/transform/text-case";
import {
  base64DecodeDefinition,
  base64EncodeDefinition,
  base58DecodeDefinition,
  base58EncodeDefinition,
  hexDecodeDefinition,
  hexEncodeDefinition,
  htmlEntityEncodeDefinition,
  urlEncodeDefinition,
  rot13EncodeDefinition,
  morseEncodeDefinition,
  morseDecodeDefinition,
  quotedPrintableEncodeDefinition,
  quotedPrintableDecodeDefinition,
  base91EncodeDefinition,
  base91DecodeDefinition,
  ascii85EncodeDefinition,
  ascii85DecodeDefinition,
  z85EncodeDefinition,
  z85DecodeDefinition,
  unicodeEncodeDefinition,
  unicodeDecodeDefinition,
} from "@/entities/transform/text-encoding";
import { textHashTransform } from "@/entities/transform/text-hash";
import { textSanitizeTransform } from "@/entities/transform/text-sanitize";
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
  "rot13-encode": rot13EncodeDefinition as TransformDefinition,
  "morse-encode": morseEncodeDefinition as TransformDefinition,
  "quoted-printable-encode":
    quotedPrintableEncodeDefinition as TransformDefinition,
  "base91-encode": base91EncodeDefinition as TransformDefinition,
  "ascii85-encode": ascii85EncodeDefinition as TransformDefinition,
  "z85-encode": z85EncodeDefinition as TransformDefinition,
  "unicode-encode": unicodeEncodeDefinition as TransformDefinition,

  // Decode transforms
  "base64-decode": base64DecodeDefinition as TransformDefinition,
  "base58-decode": base58DecodeDefinition as TransformDefinition,
  "hex-decode": hexDecodeDefinition as TransformDefinition,
  "morse-decode": morseDecodeDefinition as TransformDefinition,
  "quoted-printable-decode":
    quotedPrintableDecodeDefinition as TransformDefinition,
  "base91-decode": base91DecodeDefinition as TransformDefinition,
  "ascii85-decode": ascii85DecodeDefinition as TransformDefinition,
  "z85-decode": z85DecodeDefinition as TransformDefinition,
  "jwt-decode": jwtDecodeDefinition as TransformDefinition,
  "unicode-decode": unicodeDecodeDefinition as TransformDefinition,

  // Hash transform
  "text-hash": textHashTransform as TransformDefinition,

  // Modify transforms
  "text-sanitize": textSanitizeTransform as TransformDefinition,
  "case-convert": caseConvertTransform as TransformDefinition,
  "regex-replace": regexReplaceDefinition as TransformDefinition,
  "sort-lines": sortLinesDefinition as TransformDefinition,
  "extract-lines": extractLinesDefinition as TransformDefinition,
  "modify-field": modifyFieldDefinition as TransformDefinition,

  // Compress transforms
  "gzip-compress": gzipCompressDefinition as TransformDefinition,

  // Decompress transforms
  "gzip-decompress": gzipDecompressDefinition as TransformDefinition,
};

// Lazy-loaded transforms (use dynamic imports to avoid bundling Node.js dependencies client-side)
let brotliTransformsLoaded = false;
let zstdTransformsLoaded = false;

/**
 * Dynamically load brotli transforms (DISABLED - requires Node.js fs module)
 */
async function ensureBrotliTransforms(): Promise<void> {
  if (brotliTransformsLoaded) return;

  // Brotli disabled - the library requires Node.js fs module which doesn't work client-side
  console.warn("Brotli transforms are disabled (requires Node.js fs module)");
  brotliTransformsLoaded = true;
}

/**
 * Dynamically load zstd transforms (DISABLED - requires Node.js module)
 */
async function ensureZstdTransforms(): Promise<void> {
  if (zstdTransformsLoaded) return;

  // Zstd disabled - the library requires Node.js modules which don't work client-side
  console.warn("Zstd transforms are disabled (requires Node.js modules)");
  zstdTransformsLoaded = true;
}

/**
 * Get a transform definition by type
 */
export function getTransform(
  type: TransformType,
): TransformDefinition | undefined {
  return TRANSFORM_REGISTRY[type];
}

/**
 * Get a transform definition by type (async version that loads lazy transforms)
 */
export async function getTransformAsync(
  type: TransformType,
): Promise<TransformDefinition | undefined> {
  // Try to get from registry first
  if (TRANSFORM_REGISTRY[type]) {
    return TRANSFORM_REGISTRY[type];
  }

  // Load brotli transforms if needed
  if (type.startsWith("brotli-")) {
    await ensureBrotliTransforms();
    return TRANSFORM_REGISTRY[type];
  }

  // Load zstd transforms if needed
  if (type.startsWith("zstd-")) {
    await ensureZstdTransforms();
    return TRANSFORM_REGISTRY[type];
  }

  return undefined;
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
