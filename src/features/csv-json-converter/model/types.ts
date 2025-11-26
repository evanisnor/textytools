export type FormatType = "json" | "csv";

export interface ConversionResult {
  success: boolean;
  output: string;
  error: string | null;
  detectedFormat: FormatType;
}

export interface JsonObject {
  [key: string]: unknown;
}
