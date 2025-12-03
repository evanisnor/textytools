/**
 * Text Hashing Transform Definitions
 * Wraps existing hashing functions with TransformDefinition interface
 */

import { sha3_224, sha3_256, sha3_384, sha3_512 } from "js-sha3";

import type {
  TransformDefinition,
  TransformResult,
  TransformStat,
} from "../../shared/types";

import { hashText } from "./codec";

/**
 * Execute hash transform using codec
 */
async function executeHashTransform(
  input: string,
  properties: Record<string, unknown>,
  algorithm: "md5" | "sha1" | "sha256" | "sha384" | "sha512",
  algorithmLabel: string,
  outputLength: string,
  securityMessage: string,
  securityAlert: "info" | "warning" = "info",
): Promise<TransformResult> {
  if (!input) {
    return {
      success: false,
      data: "",
      error: "Input is empty",
      mimeType: "text/plain",
    };
  }

  try {
    const lineByLine = properties.lineByLine === true;
    const output = await hashText(input, algorithm, lineByLine);
    const stats: TransformStat[] = [
      { label: "Algorithm", value: algorithmLabel },
      { label: "Output Length", value: outputLength },
      {
        label: "Security",
        value: securityMessage,
        alert: securityAlert,
      },
    ];

    if (lineByLine) {
      const lineCount = input.split("\n").length;
      stats.push({ label: "Lines Processed", value: lineCount });
    }

    return {
      success: true,
      data: output,
      mimeType: "text/plain",
      stats,
    };
  } catch (err) {
    return {
      success: false,
      data: "",
      error: `Hashing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      mimeType: "text/plain",
    };
  }
}

/**
 * Execute SHA3 hash transform (uses js-sha3 directly)
 */
async function executeSha3HashTransform(
  input: string,
  properties: Record<string, unknown>,
  hashFunction: (input: string) => string,
  algorithmLabel: string,
  outputLength: string,
  securityMessage: string = "Modern cryptographic standard",
): Promise<TransformResult> {
  if (!input) {
    return {
      success: false,
      data: "",
      error: "Input is empty",
      mimeType: "text/plain",
    };
  }

  try {
    const lineByLine = properties.lineByLine === true;
    let output: string;

    if (lineByLine) {
      const lines = input.split("\n");
      const hashedLines = lines.map((line) => hashFunction(line));
      output = hashedLines.join("\n");
    } else {
      output = hashFunction(input);
    }

    const stats: TransformStat[] = [
      { label: "Algorithm", value: algorithmLabel },
      { label: "Output Length", value: outputLength },
      {
        label: "Security",
        value: securityMessage,
        alert: "info",
      },
    ];

    if (lineByLine) {
      const lineCount = input.split("\n").length;
      stats.push({ label: "Lines Processed", value: lineCount });
    }

    return {
      success: true,
      data: output,
      mimeType: "text/plain",
      stats,
    };
  } catch (err) {
    return {
      success: false,
      data: "",
      error: `Hashing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      mimeType: "text/plain",
    };
  }
}

/**
 * MD5 Hash Transform
 */
export const md5HashDefinition: TransformDefinition = {
  type: "md5-hash",
  name: "MD5 Hash",
  description: "Generate MD5 hash (128-bit)",
  category: "hash",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  supportsLineByLine: true,
  propertySchema: [
    {
      key: "lineByLine",
      label: "Line-by-Line",
      type: "toggle",
      defaultValue: false,
    },
  ],
  defaultProperties: { lineByLine: false },
  execute: (input, properties) =>
    executeHashTransform(
      input,
      properties,
      "md5",
      "MD5",
      "128 bits (32 hex chars)",
      "Deprecated - Use SHA-256 or stronger",
      "warning",
    ),
};

/**
 * SHA-1 Hash Transform
 */
export const sha1HashDefinition: TransformDefinition = {
  type: "sha1-hash",
  name: "SHA-1 Hash",
  description: "Generate SHA-1 hash (160-bit)",
  category: "hash",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  supportsLineByLine: true,
  propertySchema: [
    {
      key: "lineByLine",
      label: "Line-by-Line",
      type: "toggle",
      defaultValue: false,
    },
  ],
  defaultProperties: { lineByLine: false },
  execute: (input, properties) =>
    executeHashTransform(
      input,
      properties,
      "sha1",
      "SHA-1",
      "160 bits (40 hex chars)",
      "Deprecated - Use SHA-256 or stronger",
      "warning",
    ),
};

/**
 * SHA-256 Hash Transform
 */
export const sha256HashDefinition: TransformDefinition = {
  type: "sha256-hash",
  name: "SHA-256 Hash",
  description: "Generate SHA-256 hash (256-bit, secure)",
  category: "hash",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  supportsLineByLine: true,
  propertySchema: [
    {
      key: "lineByLine",
      label: "Line-by-Line",
      type: "toggle",
      defaultValue: false,
    },
  ],
  defaultProperties: { lineByLine: false },
  execute: (input, properties) =>
    executeHashTransform(
      input,
      properties,
      "sha256",
      "SHA-256",
      "256 bits (64 hex chars)",
      "Cryptographically secure",
    ),
};

/**
 * SHA-384 Hash Transform
 */
export const sha384HashDefinition: TransformDefinition = {
  type: "sha384-hash",
  name: "SHA-384 Hash",
  description: "Generate SHA-384 hash (384-bit, secure)",
  category: "hash",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  supportsLineByLine: true,
  propertySchema: [
    {
      key: "lineByLine",
      label: "Line-by-Line",
      type: "toggle",
      defaultValue: false,
    },
  ],
  defaultProperties: { lineByLine: false },
  execute: (input, properties) =>
    executeHashTransform(
      input,
      properties,
      "sha384",
      "SHA-384",
      "384 bits (96 hex chars)",
      "Cryptographically secure",
    ),
};

/**
 * SHA-512 Hash Transform
 */
export const sha512HashDefinition: TransformDefinition = {
  type: "sha512-hash",
  name: "SHA-512 Hash",
  description: "Generate SHA-512 hash (512-bit, maximum security)",
  category: "hash",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  supportsLineByLine: true,
  propertySchema: [
    {
      key: "lineByLine",
      label: "Line-by-Line",
      type: "toggle",
      defaultValue: false,
    },
  ],
  defaultProperties: { lineByLine: false },
  execute: (input, properties) =>
    executeHashTransform(
      input,
      properties,
      "sha512",
      "SHA-512",
      "512 bits (128 hex chars)",
      "Maximum cryptographic security",
    ),
};

/**
 * SHA3-224 Hash Transform
 */
export const sha3_224HashDefinition: TransformDefinition = {
  type: "sha3-224-hash",
  name: "SHA3-224 Hash",
  description: "Generate SHA3-224 hash (224-bit)",
  category: "hash",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  supportsLineByLine: true,
  propertySchema: [
    {
      key: "lineByLine",
      label: "Line-by-Line",
      type: "toggle",
      defaultValue: false,
    },
  ],
  defaultProperties: { lineByLine: false },
  execute: (input, properties) =>
    executeSha3HashTransform(
      input,
      properties,
      sha3_224,
      "SHA3-224",
      "224 bits (56 hex chars)",
    ),
};

/**
 * SHA3-256 Hash Transform
 */
export const sha3_256HashDefinition: TransformDefinition = {
  type: "sha3-256-hash",
  name: "SHA3-256 Hash",
  description: "Generate SHA3-256 hash (256-bit)",
  category: "hash",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  supportsLineByLine: true,
  propertySchema: [
    {
      key: "lineByLine",
      label: "Line-by-Line",
      type: "toggle",
      defaultValue: false,
    },
  ],
  defaultProperties: { lineByLine: false },
  execute: (input, properties) =>
    executeSha3HashTransform(
      input,
      properties,
      sha3_256,
      "SHA3-256",
      "256 bits (64 hex chars)",
    ),
};

/**
 * SHA3-384 Hash Transform
 */
export const sha3_384HashDefinition: TransformDefinition = {
  type: "sha3-384-hash",
  name: "SHA3-384 Hash",
  description: "Generate SHA3-384 hash (384-bit)",
  category: "hash",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  supportsLineByLine: true,
  propertySchema: [
    {
      key: "lineByLine",
      label: "Line-by-Line",
      type: "toggle",
      defaultValue: false,
    },
  ],
  defaultProperties: { lineByLine: false },
  execute: (input, properties) =>
    executeSha3HashTransform(
      input,
      properties,
      sha3_384,
      "SHA3-384",
      "384 bits (96 hex chars)",
      "High cryptographic security",
    ),
};

/**
 * SHA3-512 Hash Transform
 */
export const sha3_512HashDefinition: TransformDefinition = {
  type: "sha3-512-hash",
  name: "SHA3-512 Hash",
  description: "Generate SHA3-512 hash (512-bit)",
  category: "hash",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  supportsLineByLine: true,
  propertySchema: [
    {
      key: "lineByLine",
      label: "Line-by-Line",
      type: "toggle",
      defaultValue: false,
    },
  ],
  defaultProperties: { lineByLine: false },
  execute: (input, properties) =>
    executeSha3HashTransform(
      input,
      properties,
      sha3_512,
      "SHA3-512",
      "512 bits (128 hex chars)",
      "Maximum cryptographic security",
    ),
};
