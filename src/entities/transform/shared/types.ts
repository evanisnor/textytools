/**
 * Shared transform type definitions
 * Used by both entities/transform and features/apogee
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
export type EncodeTransform = "text-encode";

/**
 * Decode: Inspect and revert encodings
 */
export type DecodeTransform = "text-decode" | "jwt-decode";

/**
 * Hash: Generate cryptographic signatures
 */
export type HashTransform = "text-hash";

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
export type CompressTransform = "compress";

/**
 * Decompress: Restore compressed data
 */
export type DecompressTransform = "decompress";

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
 */
export interface InputSelection {
  mode: LensMode;
  regexPattern?: string;
  regexFlags?: string;
  jsonPath?: string;
  csvColumn?: number | string;
  xpathQuery?: string;
  parseAs?: ParseAsFormat;
}

/**
 * A single transform step in the pipeline
 */
export interface TransformStep {
  id: string;
  documentId: string;
  order: number;
  transformType: string;
  inputSelection: InputSelection;
  properties: Record<string, unknown>;
  output: string;
  mimeType?: string;
  stats?: TransformStat[];
  createdAt: number;
}

/**
 * Property schema types for UI generation
 */
export type PropertyType =
  | "text"
  | "number"
  | "select"
  | "toggle"
  | "toggle-group"
  | "multi-select"
  | "help" // Read-only help text display
  | "modal-link"; // Clickable link that opens a modal with documentation

/**
 * Schema for a single property/option
 */
export interface PropertySchema {
  key: string;
  label?: string; // Optional label (e.g., for multi-select without header)
  type: PropertyType;
  placeholder?: string;
  options?: string[] | { value: string; label: string }[];
  defaultValue: unknown;
  validation?: (value: unknown) => string | null;
  helpText?: string;
  modalContent?: React.ReactNode; // Content to display in modal (for modal-link type)
  showWhen?: Record<string, unknown>;
  showInLens?: boolean; // Show this property in Lens section instead of Configuration
  width?: "auto" | "full" | "flex" | "flex-start"; // Width: "auto" (compact), "full" (entire row), "flex" (grow to fill available space), "flex-start" (start new flex row)
}

/**
 * Statistical metadata about transform result
 */
export interface TransformStat {
  label: string;
  value: string | number | boolean;
  alert?: "info" | "warning" | "error";
}

/**
 * Result from transform execution
 */
export interface TransformResult {
  success: boolean;
  data: string;
  error?: string;
  mimeType: string;
  stats?: TransformStat[];
}

/**
 * Complete transform definition
 * Note: type and category use strings to avoid circular dependencies
 * features/apogee will narrow these to specific union types
 */
export interface TransformDefinition {
  type: string;
  name: string;
  description: string;
  category: string;

  // Input/Output Type Compatibility
  acceptsInput: string[];
  producesOutput: string;

  // UI Configuration Schema
  propertySchema: PropertySchema[];
  defaultProperties: Record<string, unknown>;

  // Execution
  execute: (
    input: string,
    properties: Record<string, unknown>,
  ) => TransformResult | Promise<TransformResult>;

  // Optional features
  supportsInputSelection?: boolean; // Default: true
  supportsLineByLine?: boolean; // Default: false
  supportsStreaming?: boolean; // Default: false (future)
  defaultWordWrap?: boolean; // Default word wrap for output display (default: false)
}
