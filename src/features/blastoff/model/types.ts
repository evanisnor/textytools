/**
 * Blastoff Feature Types
 * Linear transform pipeline for text/data transformations
 */

export type TransformType =
  // Text operations
  | "text-sanitize"
  | "case-convert"
  | "text-count"
  | "regex-replace"
  // Data conversion
  | "csv-to-json"
  | "json-to-csv"
  | "json-format"
  | "json-validate"
  // Analysis
  | "regex-extract"
  | "jwt-decode"
  // Encoding
  | "text-encode"
  | "text-decode";

export interface TransformStep {
  id: string;
  documentId: string;
  order: number;
  transformType: TransformType;
  properties: Record<string, unknown>;
  output: string;
  createdAt: number;
}

export interface Document {
  id: string;
  name: string;
  inputType: "text" | "csv" | "json" | "file";
  inputData: string;
  transforms: TransformStep[];
  createdAt: number;
  updatedAt: number;
}

export type ExportType = "smart-download" | "copy-clipboard";

export type PropertyType =
  | "text"
  | "select"
  | "boolean"
  | "toggle"
  | "toggle-group"
  | "multi-select";

export interface PropertySchema {
  key: string;
  type: PropertyType;
  label: string;
  placeholder?: string;
  options?: string[] | { value: string; label: string }[];
}

export interface TransformDefinition {
  type: TransformType;
  name: string;
  description: string;
  category: "text" | "data" | "analysis" | "encoding";
  acceptsInput: string[];
  producesOutput: string;
  defaultProperties: Record<string, unknown>;
  propertySchema: PropertySchema[];
  execute: (input: string, properties: Record<string, unknown>) => string;
  getStats?: (
    output: string,
    input: string,
    properties: Record<string, unknown>,
  ) => Record<string, string | number | boolean> | null;
}

export interface ExportDefinition {
  type: ExportType;
  name: string;
  description: string;
  icon: string;
  acceptsInput: string[];
  propertySchema: PropertySchema[];
  defaultProperties: Record<string, unknown>;
  execute: (
    data: string,
    properties: Record<string, unknown>,
    doc: Document,
  ) => void;
}
