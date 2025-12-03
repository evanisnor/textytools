/**
 * Apogee Model Layer Exports
 *
 * Core data model, types, and state management
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
  InputType,
  DetectableInputType,
  PropertyType,
  PropertySchema,
  TransformStat,
  TransformResult,
  TransformDefinition,
  ExportType,
  ExportResult,
  ExportDefinition,
  LensResult,
} from "./types";

// State Management
export type {
  DocumentManagerState,
  DocumentManagerActions,
  DocumentManager,
} from "./useDocumentManager";

export { useDocumentManager } from "./useDocumentManager";

// Context Provider
export type { ApogeeProviderProps } from "./ApogeeProvider";

export { ApogeeProvider, useApogeeContext } from "./ApogeeProvider";
