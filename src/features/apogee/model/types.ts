/**
 * Core type definitions for the Apogee transformation pipeline
 *
 * Most types are imported from entities for consistency.
 * Apogee-specific extensions are defined here.
 */

// Import types needed for local definitions
import type {
  TransformType,
  TransformCategory,
  PropertyType as SharedPropertyType,
  PropertySchema as SharedPropertySchema,
  TransformStat as SharedTransformStat,
  TransformResult as SharedTransformResult,
  TransformDefinition as SharedTransformDefinition,
} from "@/entities/transform/shared";

// Re-export all base types from entities
export type {
  ConvertTransform,
  EncodeTransform,
  DecodeTransform,
  HashTransform,
  ModifyTransform,
  CompressTransform,
  DecompressTransform,
  AnalyzeTransform,
  TestTransform,
  TransformType,
  TransformCategory,
  LensMode,
  ParseAsFormat,
  InputSelection,
  TransformStep,
} from "@/entities/transform/shared";

export type {
  Document,
  InputType,
  DetectableInputType,
} from "@/entities/document";

// ============================================================================
// Transform Definition Schema
// ============================================================================

// Re-export shared types
export type PropertyType = SharedPropertyType;
export type PropertySchema = SharedPropertySchema;
export type TransformStat = SharedTransformStat;
export type TransformResult = SharedTransformResult;

/**
 * Complete transform definition with Apogee-specific types
 */
export interface TransformDefinition extends SharedTransformDefinition {
  type: TransformType;
  category: TransformCategory;

  // Optional features
  supportsInputSelection?: boolean; // Default: true
  supportsLineByLine?: boolean; // Default: false
  hideSyntaxSelector?: boolean;
}

// ============================================================================
// Export Actions
// ============================================================================

/**
 * Export action types (not transforms)
 */
export type ExportType = "text-download" | "pdf-download" | "clipboard-copy";

/**
 * Result from export action execution
 */
export interface ExportResult {
  success: boolean;
  error?: string;
  stats?: TransformStat[];
}

/**
 * Export action definition
 */
export interface ExportDefinition {
  type: ExportType;
  name: string;
  description: string;
  acceptsInput: string[];
  propertySchema: PropertySchema[];
  defaultProperties: Record<string, unknown>;
  execute: (input: string, properties: Record<string, unknown>) => ExportResult;
}

// ============================================================================
// Lens Execution
// ============================================================================

/**
 * Result from lens pass execution
 */
export interface LensResult {
  success: boolean;
  data: string;
  error?: string;
  metadata?: {
    mode: string;
    matchCount?: number;
    extractedPath?: string;
    parseAs?: string;
  };
}
