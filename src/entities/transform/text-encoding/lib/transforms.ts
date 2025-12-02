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

/**
 * ROT13 Encode Transform
 */
export const rot13EncodeDefinition: TransformDefinition = {
  type: "rot13-encode",
  name: "ROT13 Encode",
  description: "Apply ROT13 cipher (rotate alphabet by 13 positions)",
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
      const output = encodeText(input, "rot13");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Cipher", value: "ROT13" },
          { label: "Note", value: "Apply ROT13 again to decode" },
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
 * Morse Code Encode Transform
 */
export const morseEncodeDefinition: TransformDefinition = {
  type: "morse-encode",
  name: "Morse Code Encode",
  description: "Encode text to International Morse Code",
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
      const output = encodeText(input, "morse");
      const inputChars = input.length;
      const outputChars = output.length;
      const expansionRatio = ((outputChars / inputChars - 1) * 100).toFixed(1);

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Format", value: "International Morse Code" },
          { label: "Input Length", value: `${inputChars} characters` },
          { label: "Output Length", value: `${outputChars} characters` },
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
 * Morse Code Decode Transform
 */
export const morseDecodeDefinition: TransformDefinition = {
  type: "morse-decode",
  name: "Morse Code Decode",
  description: "Decode International Morse Code to text",
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
      const output = decodeText(input, "morse");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Format", value: "International Morse Code" },
          { label: "Decoded Length", value: `${output.length} characters` },
        ],
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
 * Quoted-Printable Encode Transform
 */
export const quotedPrintableEncodeDefinition: TransformDefinition = {
  type: "quoted-printable-encode",
  name: "Quoted-Printable Encode",
  description: "Encode text using Quoted-Printable (MIME encoding)",
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
      const output = encodeText(input, "quotedPrintable");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Format", value: "Quoted-Printable (MIME)" },
          { label: "Input Size", value: `${input.length} bytes` },
          { label: "Output Size", value: `${output.length} bytes` },
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
 * Quoted-Printable Decode Transform
 */
export const quotedPrintableDecodeDefinition: TransformDefinition = {
  type: "quoted-printable-decode",
  name: "Quoted-Printable Decode",
  description: "Decode Quoted-Printable encoded text",
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
      const output = decodeText(input, "quotedPrintable");
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
 * Base91 Encode Transform
 */
export const base91EncodeDefinition: TransformDefinition = {
  type: "base91-encode",
  name: "Base91 Encode",
  description: "Encode text to Base91 format (more efficient than Base64)",
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
      const output = encodeText(input, "base91");
      const inputSize = new Blob([input]).size;
      const outputSize = new Blob([output]).size;
      const expansionRatio = ((outputSize / inputSize - 1) * 100).toFixed(1);

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Format", value: "Base91" },
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
 * Base91 Decode Transform
 */
export const base91DecodeDefinition: TransformDefinition = {
  type: "base91-decode",
  name: "Base91 Decode",
  description: "Decode Base91 encoded text",
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
      const output = decodeText(input, "base91");
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
 * ASCII85 Encode Transform
 */
export const ascii85EncodeDefinition: TransformDefinition = {
  type: "ascii85-encode",
  name: "ASCII85 Encode",
  description: "Encode text to ASCII85 format (Adobe variant)",
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
      const output = encodeText(input, "ascii85");
      const inputSize = new Blob([input]).size;
      const outputSize = new Blob([output]).size;
      const expansionRatio = ((outputSize / inputSize - 1) * 100).toFixed(1);

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Format", value: "ASCII85 (Adobe)" },
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
 * ASCII85 Decode Transform
 */
export const ascii85DecodeDefinition: TransformDefinition = {
  type: "ascii85-decode",
  name: "ASCII85 Decode",
  description: "Decode ASCII85 encoded text",
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
      const output = decodeText(input, "ascii85");
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
 * Z85 Encode Transform
 */
export const z85EncodeDefinition: TransformDefinition = {
  type: "z85-encode",
  name: "Z85 Encode",
  description: "Encode text to Z85 format (ZeroMQ variant)",
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
      const output = encodeText(input, "z85");
      const inputSize = new Blob([input]).size;
      const outputSize = new Blob([output]).size;
      const expansionRatio = ((outputSize / inputSize - 1) * 100).toFixed(1);

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Format", value: "Z85 (ZeroMQ)" },
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
 * Z85 Decode Transform
 */
export const z85DecodeDefinition: TransformDefinition = {
  type: "z85-decode",
  name: "Z85 Decode",
  description: "Decode Z85 encoded text",
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
      const output = decodeText(input, "z85");
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
 * Unicode Escape Encode Transform
 */
export const unicodeEncodeDefinition: TransformDefinition = {
  type: "unicode-encode",
  name: "Unicode Encode",
  description:
    "Encode non-ASCII characters as Unicode escape sequences (\\uXXXX)",
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
      const output = encodeText(input, "unicode");
      const nonAsciiCount = Array.from(input).filter(
        (char) => char.charCodeAt(0) > 127,
      ).length;

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Format", value: "Unicode Escape Sequences" },
          { label: "Non-ASCII Characters", value: `${nonAsciiCount}` },
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
 * Unicode Escape Decode Transform
 */
export const unicodeDecodeDefinition: TransformDefinition = {
  type: "unicode-decode",
  name: "Unicode Decode",
  description: "Decode Unicode escape sequences (\\uXXXX) to characters",
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
      const output = decodeText(input, "unicode");
      const escapeCount = (input.match(/\\u[0-9a-fA-F]{4}/g) || []).length;

      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Format", value: "Unicode Escape Sequences" },
          { label: "Sequences Decoded", value: `${escapeCount}` },
        ],
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
