/**
 * Core type definitions for the Apogee transformation pipeline
 */

// ============================================================================
// Transform Types Catalog
// ============================================================================

/**
 * Convert: Parse input and convert to target format
 */
export type ConvertTransform =
  | "json-convert"
  | "csv-convert"
  | "yaml-convert"
  | "toml-convert"
  | "xml-convert"
  | "protobuf-convert";

/**
 * Encode: Represent data in transport formats
 */
export type EncodeTransform =
  | "base64-encode"
  | "base58-encode"
  | "base91-encode"
  | "ascii85-encode"
  | "z85-encode"
  | "url-encode"
  | "html-entity-encode"
  | "hex-encode"
  | "quoted-printable-encode"
  | "rot13-encode"
  | "morse-encode"
  | "unicode-encode";

/**
 * Decode: Inspect and revert encodings
 */
export type DecodeTransform =
  | "jwt-decode"
  | "base64-decode"
  | "base58-decode"
  | "base91-decode"
  | "ascii85-decode"
  | "z85-decode"
  | "hex-decode"
  | "quoted-printable-decode"
  | "morse-decode"
  | "unicode-decode";

/**
 * Hash: Generate cryptographic signatures
 */
export type HashTransform =
  | "md5-hash"
  | "sha1-hash"
  | "sha256-hash"
  | "sha384-hash"
  | "sha512-hash"
  | "sha3-224-hash"
  | "sha3-256-hash"
  | "sha3-384-hash"
  | "sha3-512-hash"
  | "sha3-hash"
  | "blake3-hash"
  | "murmur3-hash";

/**
 * Modify: String-level text operations
 */
export type ModifyTransform =
  | "text-sanitize"
  | "case-convert"
  | "regex-replace"
  | "sort-lines"
  | "extract-lines"
  | "modify-field";

/**
 * Compress: Size reduction algorithms
 */
export type CompressTransform =
  | "gzip-compress"
  | "bzip2-compress"
  // | "brotli-compress"
  // | "zstd-compress"
  | "lzma2-compress"
  | "xz-compress";

/**
 * Decompress: Restore compressed data
 */
export type DecompressTransform =
  | "gzip-decompress"
  | "bzip2-decompress"
  | "brotli-decompress"
  | "zstd-decompress"
  | "lzma2-decompress"
  | "xz-decompress";

/**
 * Analyze: Visualization and insights
 */
export type AnalyzeTransform =
  | "chart-generator"
  | "frequency-distribution"
  | "time-series-plot"
  | "data-validator"
  | "pattern-heatmap";

/**
 * Test-only transforms
 * These should never be used in production code
 */
export type TestTransform = "dummy-transform" | "nonexistent-transform";

/**
 * All available transform types
 */
export type TransformType =
  | ConvertTransform
  | EncodeTransform
  | DecodeTransform
  | HashTransform
  | ModifyTransform
  | CompressTransform
  | DecompressTransform
  | AnalyzeTransform
  | TestTransform;

/**
 * Transform categories (verbs)
 */
export type TransformCategory =
  | "convert"
  | "encode"
  | "decode"
  | "hash"
  | "manipulate"
  | "compress"
  | "decompress"
  | "analyze";

// ============================================================================
// Transform Step Model
// ============================================================================

/**
 * Input lens selection modes
 */
export type LensMode =
  | "all"
  | "regex"
  | "jsonpath"
  | "csv-column"
  | "xml-xpath";

/**
 * Format parsing hints
 */
export type ParseAsFormat =
  | "auto"
  | "text"
  | "json"
  | "csv"
  | "yaml"
  | "toml"
  | "xml";

/**
 * Input selection and parsing configuration
 * Phase 1: Determines WHAT data to extract and HOW to parse it
 */
export interface InputSelection {
  // Selection mode: how to extract data from previous output
  mode: LensMode;

  // Mode-specific extraction parameters
  regexPattern?: string; // e.g., "(?<=Data: ).*" for regex mode
  regexFlags?: string; // e.g., "gm" for regex mode
  jsonPath?: string; // e.g., "$.users[*].name" for jsonpath mode
  csvColumn?: number | string; // e.g., 0 or "email" for csv-column mode
  xpathQuery?: string; // e.g., "//user/@id" for xml-xpath mode

  // Parsing hint: how to interpret the extracted data
  parseAs?: ParseAsFormat;
}

/**
 * A single transform step in the pipeline
 */
export interface TransformStep {
  id: string;
  documentId: string;
  order: number;
  transformType: TransformType;

  // Phase 1: Input Lens (Selection + Parsing)
  inputSelection: InputSelection;

  // Phase 2: Transformation Configuration
  properties: Record<string, unknown>;

  // Phase 3: Cached Output
  output: string;
  mimeType?: string; // MIME type of the output (e.g., "application/json", "text/csv")
  stats?: TransformStat[];
  createdAt: number;
}

/**
 * Input type for documents
 */
export type InputType =
  | "auto"
  | "text"
  | "csv"
  | "json"
  | "yaml"
  | "xml"
  | "toml"
  | "jwt"
  | "file";

/**
 * Detectable input types (subset of InputType that can be auto-detected)
 * Excludes "auto", "text", "file", and "unknown"
 */
export type DetectableInputType =
  | "csv"
  | "json"
  | "yaml"
  | "xml"
  | "toml"
  | "jwt";

/**
 * Document containing input data and transform pipeline
 */
export interface Document {
  id: string;
  name: string;
  inputType: InputType;
  inputData: string;
  transforms: TransformStep[];
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Transform Definition Schema
// ============================================================================

import type {
  PropertyType as SharedPropertyType,
  PropertySchema as SharedPropertySchema,
  TransformStat as SharedTransformStat,
  TransformResult as SharedTransformResult,
  TransformDefinition as SharedTransformDefinition,
} from "@/entities/transform/shared/types";

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
