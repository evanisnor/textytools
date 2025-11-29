export type ViewMode = "pretty" | "minified" | "escaped";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  lineNumber?: number;
  columnNumber?: number;
}

export interface JSONStats {
  keys: number;
  depth: number;
  size: number;
}
