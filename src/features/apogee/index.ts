/**
 * Apogee Feature Public API
 *
 * Phase 1: Core Infrastructure
 * Phase 4: State Management (Complete)
 * Phase 5: UI Components (Complete)
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
  DocumentManagerState,
  DocumentManagerActions,
  DocumentManager,
  ApogeeProviderProps,
} from "./model";

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

// State Management
export { useDocumentManager, ApogeeProvider, useApogeeContext } from "./model";

// UI Components
export {
  ConfigurationPanel,
  DataBlock,
  InputForm,
  TransformBlock,
  TransformPipeline,
  TransformPalette,
  ApogeeShell,
  ApogeeProvider as ApogeeProviderUI,
} from "./ui";
