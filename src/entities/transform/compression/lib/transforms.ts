/**
 * Compression Transforms
 * Consolidated compress and decompress transforms with algorithm selection
 */

import * as pako from "pako";

import type {
  PropertySchema,
  TransformDefinition,
  TransformResult,
} from "../../shared/types";

// ============================================================================
// Compression Algorithm Configuration
// ============================================================================

type CompressionAlgorithm = "gzip";
type DecompressionAlgorithm = "gzip";

interface CompressionConfig {
  value: CompressionAlgorithm;
  label: string;
  description: string;
}

interface DecompressionConfig {
  value: DecompressionAlgorithm;
  label: string;
  description: string;
}

const COMPRESSION_ALGORITHMS: CompressionConfig[] = [
  { value: "gzip", label: "Gzip", description: "Gzip compression algorithm" },
];

const DECOMPRESSION_ALGORITHMS: DecompressionConfig[] = [
  { value: "gzip", label: "Gzip", description: "Gzip decompression algorithm" },
];

const COMPRESSION_ALGORITHM_OPTIONS = COMPRESSION_ALGORITHMS.map((alg) => ({
  value: alg.value,
  label: alg.label,
}));

const DECOMPRESSION_ALGORITHM_OPTIONS = DECOMPRESSION_ALGORITHMS.map((alg) => ({
  value: alg.value,
  label: alg.label,
}));

// ============================================================================
// Consolidated Compress Transform
// ============================================================================

const COMPRESS_SCHEMA: PropertySchema[] = [
  {
    key: "algorithm",
    label: "Algorithm",
    type: "select",
    options: COMPRESSION_ALGORITHM_OPTIONS,
    defaultValue: "gzip",
  },
  {
    key: "outputFormat",
    label: "Output Format",
    type: "select",
    options: [
      { value: "base64", label: "Base64" },
      { value: "hex", label: "Hexadecimal" },
    ],
    defaultValue: "base64",
  },
  {
    key: "level",
    label: "Compression Level",
    type: "select",
    options: [
      { value: "1", label: "1 - Fastest" },
      { value: "3", label: "3 - Fast" },
      { value: "6", label: "6 - Default" },
      { value: "9", label: "9 - Best" },
    ],
    defaultValue: "6",
  },
];

export const compressTransform: TransformDefinition = {
  type: "compress",
  name: "Compress",
  description: "Compress text using various compression algorithms",
  category: "compress",
  acceptsInput: ["*"],
  producesOutput: "application/gzip",
  propertySchema: COMPRESS_SCHEMA,
  defaultProperties: {
    algorithm: "gzip",
    outputFormat: "base64",
    level: "6",
  },
  defaultWordWrap: true,
  execute: (
    input: string,
    properties: Record<string, unknown>,
  ): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    const algorithm = (properties.algorithm as CompressionAlgorithm) || "gzip";
    const outputFormat = properties.outputFormat as string;
    const level = parseInt(properties.level as string, 10) as
      | 0
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | 9;

    try {
      let compressed: Uint8Array;

      // Route to appropriate compression algorithm
      switch (algorithm) {
        case "gzip":
          compressed = pako.gzip(input, { level });
          break;
        default:
          return {
            success: false,
            data: "",
            error: `Unsupported compression algorithm: ${algorithm}`,
            mimeType: "text/plain",
          };
      }

      // Format output
      let output: string;
      if (outputFormat === "hex") {
        output = Array.from(compressed)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");
      } else {
        // base64
        output = btoa(String.fromCharCode(...compressed));
      }

      const originalSize = new Blob([input]).size;
      const compressedSize = compressed.length;
      const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      return {
        success: true,
        data: output,
        mimeType: "application/gzip",
        stats: [
          { label: "Compression Level", value: `${level}` },
          { label: "Original Size", value: `${originalSize} bytes` },
          { label: "Compressed Size", value: `${compressedSize} bytes` },
          {
            label: "Savings",
            value: `${savings}%`,
            alert: parseFloat(savings) > 0 ? "info" : undefined,
          },
        ],
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      const algorithmConfig = COMPRESSION_ALGORITHMS.find(
        (a) => a.value === algorithm,
      );
      const algorithmLabel = algorithmConfig?.label || algorithm;
      return {
        success: false,
        data: "",
        error: `${algorithmLabel} compression failed: ${errorMessage}`,
        mimeType: "text/plain",
      };
    }
  },
};

// ============================================================================
// Consolidated Decompress Transform
// ============================================================================

const DECOMPRESS_SCHEMA: PropertySchema[] = [
  {
    key: "algorithm",
    label: "Algorithm",
    type: "select",
    options: DECOMPRESSION_ALGORITHM_OPTIONS,
    defaultValue: "gzip",
  },
  {
    key: "inputFormat",
    label: "Input Format",
    type: "select",
    options: [
      { value: "base64", label: "Base64" },
      { value: "hex", label: "Hexadecimal" },
    ],
    defaultValue: "base64",
  },
];

export const decompressTransform: TransformDefinition = {
  type: "decompress",
  name: "Decompress",
  description: "Decompress data using various decompression algorithms",
  category: "decompress",
  acceptsInput: ["application/gzip", "text/plain"],
  producesOutput: "text/plain",
  propertySchema: DECOMPRESS_SCHEMA,
  defaultProperties: {
    algorithm: "gzip",
    inputFormat: "base64",
  },
  defaultWordWrap: false,
  execute: (
    input: string,
    properties: Record<string, unknown>,
  ): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    const algorithm =
      (properties.algorithm as DecompressionAlgorithm) || "gzip";
    const inputFormat = properties.inputFormat as string;

    try {
      // Parse input
      let compressed: Uint8Array;
      if (inputFormat === "hex") {
        const bytes =
          input.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [];
        compressed = new Uint8Array(bytes);
      } else {
        // base64
        const binaryString = atob(input.trim());
        compressed = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          compressed[i] = binaryString.charCodeAt(i);
        }
      }

      let decompressed: string;
      let algorithmLabel = "Gzip";

      // Route to appropriate decompression algorithm
      switch (algorithm) {
        case "gzip":
          decompressed = pako.ungzip(compressed, { to: "string" });
          algorithmLabel = "Gzip";
          break;
        default:
          return {
            success: false,
            data: "",
            error: `Unsupported decompression algorithm: ${algorithm}`,
            mimeType: "text/plain",
          };
      }

      const compressedSize = compressed.length;
      const decompressedSize = new Blob([decompressed]).size;

      return {
        success: true,
        data: decompressed,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: algorithmLabel },
          { label: "Compressed Size", value: `${compressedSize} bytes` },
          { label: "Decompressed Size", value: `${decompressedSize} bytes` },
          { label: "Input Format", value: inputFormat },
        ],
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      const algorithmConfig = DECOMPRESSION_ALGORITHMS.find(
        (a) => a.value === algorithm,
      );
      const algorithmLabel = algorithmConfig?.label || algorithm;
      return {
        success: false,
        data: "",
        error: `${algorithmLabel} decompression failed: ${errorMessage}. Ensure the input is valid ${algorithmLabel}-compressed data.`,
        mimeType: "text/plain",
      };
    }
  },
};
