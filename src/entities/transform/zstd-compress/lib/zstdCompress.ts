/**
 * Zstd Compression Transforms
 * Uses simple-zstd library for pure JavaScript Zstandard implementation
 */

import { compress, decompress } from "simple-zstd";

import type { TransformDefinition, TransformResult } from "../../shared/types";

/**
 * Zstd Compress Transform
 */
export const zstdCompressDefinition: TransformDefinition = {
  type: "zstd-compress",
  name: "Zstd Compress",
  description: "Compress text using Zstandard algorithm",
  category: "compress",
  acceptsInput: ["*"],
  producesOutput: "application/zstd",
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
      key: "level",
      label: "Compression Level",
      type: "select",
      options: [
        { value: "1", label: "1 - Fastest" },
        { value: "3", label: "3 - Fast" },
        { value: "10", label: "10 - Default" },
        { value: "19", label: "19 - Best" },
      ],
      defaultValue: "10",
    },
  ],
  defaultProperties: {
    outputFormat: "base64",
    level: 10,
  },
  execute: async (
    input: string,
    properties: Record<string, unknown>,
  ): Promise<TransformResult> => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    const outputFormat = properties.outputFormat as string;
    const level = parseInt(properties.level as string, 10);

    try {
      // Convert input to Uint8Array
      const encoder = new TextEncoder();
      const inputBytes = encoder.encode(input);

      // Compress
      const compressed = await compress(inputBytes, level);

      // Format output
      let output: string;
      if (outputFormat === "hex") {
        output = Array.from(compressed)
          .map((byte) => (byte as number).toString(16).padStart(2, "0"))
          .join("");
      } else {
        // base64
        output = btoa(String.fromCharCode(...compressed));
      }

      const originalSize = inputBytes.length;
      const compressedSize = compressed.length;
      const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      return {
        success: true,
        data: output,
        mimeType: "application/zstd",
        stats: [
          { label: "Algorithm", value: "Zstandard" },
          { label: "Compression Level", value: `${level}` },
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
 * Zstd Decompress Transform
 */
export const zstdDecompressDefinition: TransformDefinition = {
  type: "zstd-decompress",
  name: "Zstd Decompress",
  description: "Decompress Zstandard-compressed data",
  category: "decompress",
  acceptsInput: ["application/zstd", "text/plain"],
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
  execute: async (
    input: string,
    properties: Record<string, unknown>,
  ): Promise<TransformResult> => {
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
      let compressedBytes: Uint8Array;
      if (inputFormat === "hex") {
        const hexPairs = input.match(/.{1,2}/g) || [];
        compressedBytes = new Uint8Array(
          hexPairs.map((byte) => parseInt(byte, 16)),
        );
      } else {
        // base64
        const binaryString = atob(input.trim());
        compressedBytes = new Uint8Array(
          Array.from(binaryString).map((char) => char.charCodeAt(0)),
        );
      }

      // Decompress
      const decompressed = await decompress(compressedBytes);

      // Convert back to string
      const decoder = new TextDecoder();
      const output = decoder.decode(decompressed);

      const compressedSize = compressedBytes.length;
      const decompressedSize = decompressed.length;

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "Zstandard" },
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
