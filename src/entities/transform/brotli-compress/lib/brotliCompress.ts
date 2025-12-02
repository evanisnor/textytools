/**
 * Brotli Compression Transforms
 * Uses brotli library for pure JavaScript Brotli implementation
 */

import brotli from "brotli";

import type { TransformDefinition, TransformResult } from "../../shared/types";

/**
 * Brotli Compress Transform
 */
export const brotliCompressDefinition: TransformDefinition = {
  type: "brotli-compress",
  name: "Brotli Compress",
  description: "Compress text using Brotli algorithm",
  category: "compress",
  acceptsInput: ["*"],
  producesOutput: "application/brotli",
  propertySchema: [
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
      key: "quality",
      label: "Compression Quality",
      type: "select",
      options: [
        { value: "1", label: "1 - Fastest" },
        { value: "4", label: "4 - Fast" },
        { value: "6", label: "6 - Default" },
        { value: "11", label: "11 - Best" },
      ],
      defaultValue: "6",
    },
  ],
  defaultProperties: {
    outputFormat: "base64",
    quality: 6,
  },
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

    const outputFormat = properties.outputFormat as string;
    const quality = parseInt(properties.quality as string, 10);

    try {
      // Convert input to Buffer
      const inputBuffer = Buffer.from(input, "utf-8");

      // Compress
      const compressed = brotli.compress(inputBuffer, {
        mode: 0, // Generic mode
        quality: quality as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11,
      });

      if (!compressed) {
        throw new Error("Compression failed");
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

      const originalSize = inputBuffer.length;
      const compressedSize = compressed.length;
      const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      return {
        success: true,
        data: output,
        mimeType: "application/brotli",
        stats: [
          { label: "Algorithm", value: "Brotli" },
          { label: "Quality Level", value: `${quality}` },
          { label: "Original Size", value: `${originalSize} bytes` },
          { label: "Compressed Size", value: `${compressedSize} bytes` },
          {
            label: "Savings",
            value: `${savings}%`,
            alert: parseFloat(savings) > 0 ? "info" : "warning",
          },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Compression failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};

/**
 * Brotli Decompress Transform
 */
export const brotliDecompressDefinition: TransformDefinition = {
  type: "brotli-decompress",
  name: "Brotli Decompress",
  description: "Decompress Brotli-compressed data",
  category: "decompress",
  acceptsInput: ["application/brotli", "text/plain"],
  producesOutput: "text/plain",
  propertySchema: [
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
  ],
  defaultProperties: {
    inputFormat: "base64",
  },
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

    const inputFormat = properties.inputFormat as string;

    try {
      // Parse input based on format
      let compressedBuffer: Buffer;
      if (inputFormat === "hex") {
        compressedBuffer = Buffer.from(input, "hex");
      } else {
        // base64
        compressedBuffer = Buffer.from(input.trim(), "base64");
      }

      // Decompress
      const decompressed = brotli.decompress(compressedBuffer);

      if (!decompressed) {
        throw new Error("Decompression failed");
      }

      // Convert back to string
      const output = decompressed.toString();

      const compressedSize = compressedBuffer.length;
      const decompressedSize = decompressed.length;

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "Brotli" },
          { label: "Compressed Size", value: `${compressedSize} bytes` },
          {
            label: "Decompressed Size",
            value: `${decompressedSize} bytes`,
          },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Decompression failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};
