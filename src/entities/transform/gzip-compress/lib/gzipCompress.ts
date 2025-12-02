/**
 * Gzip Compression Transforms
 * Uses pako library for pure JavaScript gzip implementation
 */

import * as pako from "pako";

import type { TransformDefinition, TransformResult } from "../../shared/types";

/**
 * Gzip Compress Transform
 */
export const gzipCompressDefinition: TransformDefinition = {
  type: "gzip-compress",
  name: "Gzip Compress",
  description: "Compress text using Gzip algorithm",
  category: "compress",
  acceptsInput: ["*"],
  producesOutput: "application/gzip",
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
        { value: "6", label: "6 - Default" },
        { value: "9", label: "9 - Best" },
      ],
      defaultValue: "6",
    },
  ],
  defaultProperties: {
    outputFormat: "base64",
    level: 6,
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
      // Compress
      const compressed = pako.gzip(input, { level });

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
          { label: "Algorithm", value: "Gzip" },
          { label: "Compression Level", value: `${level}` },
          { label: "Original Size", value: `${originalSize} bytes` },
          { label: "Compressed Size", value: `${compressedSize} bytes` },
          {
            label: "Savings",
            value: `${savings}%`,
            alert: parseFloat(savings) > 0 ? "info" : undefined,
          },
          { label: "Output Format", value: outputFormat },
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
 * Gzip Decompress Transform
 */
export const gzipDecompressDefinition: TransformDefinition = {
  type: "gzip-decompress",
  name: "Gzip Decompress",
  description: "Decompress Gzip compressed data",
  category: "decompress",
  acceptsInput: ["application/gzip", "text/plain"],
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

      // Decompress
      const decompressed = pako.ungzip(compressed, { to: "string" });

      const compressedSize = compressed.length;
      const decompressedSize = new Blob([decompressed]).size;

      return {
        success: true,
        data: decompressed,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "Gzip" },
          { label: "Compressed Size", value: `${compressedSize} bytes` },
          { label: "Decompressed Size", value: `${decompressedSize} bytes` },
          { label: "Input Format", value: inputFormat },
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
