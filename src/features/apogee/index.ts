/**
 * Apogee Feature Public API
 *
 * Phase 1: Core Infrastructure
 */

// Types
export type {
  TransformType,
  TransformCategory,
  ConvertTransform,
  EncodeTransform,
  DecodeTransform,
  HashTransform,
  ManipulateTransform,
  CompressTransform,
  DecompressTransform,
  AnalyzeTransform,
  LensMode,
  ParseAsFormat,
  InputSelection,
  TransformStep,
  Document,
  PropertyType,
  PropertySchema,
  TransformStat,
  TransformResult,
  TransformDefinition,
  ExportType,
  ExportResult,
  ExportDefinition,
  LensResult,
} from "./model/types";

// Registry
export {
  TRANSFORM_REGISTRY,
  getTransform,
  getAllTransforms,
  getTransformsByCategory,
  getTransformsByInputType,
  hasTransform,
  registerTransform,
  unregisterTransform,
} from "./lib/registry";

// Engine
export { ApogeeEngine } from "./lib/engine";

// Lens
export { executeLensPass } from "./lib/lens";
