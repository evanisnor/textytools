/**
 * Shared utilities for transform entities
 */

// Type definitions
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
  PropertyType,
  PropertySchema,
  TransformStat,
  TransformResult,
  TransformDefinition,
} from "./types";

// Format detection
export { detectFormat, isFormat } from "./formatDetection";
export type { DataFormat } from "./formatDetection";

// Format conversion
export { parseToIntermediate, convertToIntermediate } from "./formatConversion";
export type { ParsedData } from "./formatConversion";

// Factory functions
export { generateId, createTransformStep } from "./factory";
