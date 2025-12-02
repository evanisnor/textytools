/**
 * Text Encoding Transform Definitions
 * Wraps existing encoding functions with TransformDefinition interface
 */

import type { TransformDefinition, TransformResult } from "../../shared/types";

import { encodeText, decodeText } from "./codec";

/**
 * Base64 Encode Transform
 */
export const base64EncodeDefinition: TransformDefinition = {
  type: "base64-encode",
  name: "Base64 Encode",
  description: "Encode text to Base64 format",
  category: "encode",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  propertySchema: [],
  defaultProperties: {},
  execute: (input: string): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = encodeText(input, "base64");
      const inputSize = new Blob([input]).size;
      const outputSize = new Blob([output]).size;
      const expansionRatio = ((outputSize / inputSize - 1) * 100).toFixed(1);

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Input Size", value: `${inputSize} bytes` },
          { label: "Output Size", value: `${outputSize} bytes` },
          { label: "Expansion", value: `+${expansionRatio}%` },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Encoding failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};

/**
 * Base64 Decode Transform
 */
export const base64DecodeDefinition: TransformDefinition = {
  type: "base64-decode",
  name: "Base64 Decode",
  description: "Decode Base64 encoded text",
  category: "decode",
  acceptsInput: ["text/plain"],
  producesOutput: "text/plain",
  propertySchema: [],
  defaultProperties: {},
  execute: (input: string): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = decodeText(input, "base64");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Decoding failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};

/**
 * Base58 Encode Transform
 */
export const base58EncodeDefinition: TransformDefinition = {
  type: "base58-encode",
  name: "Base58 Encode",
  description: "Encode text to Base58 format (Bitcoin-style)",
  category: "encode",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  propertySchema: [],
  defaultProperties: {},
  execute: (input: string): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = encodeText(input, "base58");
      const inputSize = new Blob([input]).size;
      const outputSize = new Blob([output]).size;
      const expansionRatio = ((outputSize / inputSize - 1) * 100).toFixed(1);

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Input Size", value: `${inputSize} bytes` },
          { label: "Output Size", value: `${outputSize} bytes` },
          { label: "Expansion", value: `+${expansionRatio}%` },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Encoding failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};

/**
 * Base58 Decode Transform
 */
export const base58DecodeDefinition: TransformDefinition = {
  type: "base58-decode",
  name: "Base58 Decode",
  description: "Decode Base58 encoded text",
  category: "decode",
  acceptsInput: ["text/plain"],
  producesOutput: "text/plain",
  propertySchema: [],
  defaultProperties: {},
  execute: (input: string): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = decodeText(input, "base58");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Decoding failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};

/**
 * Hex Encode Transform
 */
export const hexEncodeDefinition: TransformDefinition = {
  type: "hex-encode",
  name: "Hex Encode",
  description: "Encode text to hexadecimal format",
  category: "encode",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  propertySchema: [],
  defaultProperties: {},
  execute: (input: string): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = encodeText(input, "hex");
      const inputSize = new Blob([input]).size;
      const outputSize = new Blob([output]).size;
      const expansionRatio = ((outputSize / inputSize - 1) * 100).toFixed(1);

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Input Size", value: `${inputSize} bytes` },
          { label: "Output Size", value: `${outputSize} bytes` },
          { label: "Expansion", value: `+${expansionRatio}%` },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Encoding failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};

/**
 * Hex Decode Transform
 */
export const hexDecodeDefinition: TransformDefinition = {
  type: "hex-decode",
  name: "Hex Decode",
  description: "Decode hexadecimal encoded text",
  category: "decode",
  acceptsInput: ["text/plain"],
  producesOutput: "text/plain",
  propertySchema: [],
  defaultProperties: {},
  execute: (input: string): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = decodeText(input, "hex");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Decoding failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};

/**
 * URL Encode Transform
 */
export const urlEncodeDefinition: TransformDefinition = {
  type: "url-encode",
  name: "URL Encode",
  description: "Encode text for use in URLs",
  category: "encode",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  propertySchema: [],
  defaultProperties: {},
  execute: (input: string): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = encodeText(input, "url");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Encoding failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};

/**
 * HTML Entity Encode Transform
 */
export const htmlEntityEncodeDefinition: TransformDefinition = {
  type: "html-entity-encode",
  name: "HTML Entity Encode",
  description: "Encode special characters as HTML entities",
  category: "encode",
  acceptsInput: ["*"],
  producesOutput: "text/html",
  propertySchema: [],
  defaultProperties: {},
  execute: (input: string): TransformResult => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = encodeText(input, "html");
      return {
        success: true,
        data: output,
        mimeType: "text/html",
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Encoding failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};
