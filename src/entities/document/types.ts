/**
 * Document Model Types
 *
 * Core types for Apogee documents
 */

import type { TransformStep } from "@/entities/transform/shared";

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
