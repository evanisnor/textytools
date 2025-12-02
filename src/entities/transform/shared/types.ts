/**
 * Shared transform type definitions
 * Used by both entities/transform and features/apogee
 */

/**
 * Property schema types for UI generation
 */
export type PropertyType =
  | "text"
  | "number"
  | "select"
  | "toggle"
  | "toggle-group"
  | "multi-select";

/**
 * Schema for a single property/option
 */
export interface PropertySchema {
  key: string;
  label: string;
  type: PropertyType;
  placeholder?: string;
  options?: string[] | { value: string; label: string }[];
  defaultValue: unknown;
  validation?: (value: unknown) => string | null;
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
  supportsStreaming?: boolean; // Default: false (future)
}
