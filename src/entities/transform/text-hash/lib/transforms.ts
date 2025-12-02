/**
 * Text Hashing Transform Definitions
 * Wraps existing hashing functions with TransformDefinition interface
 */

import { sha3_224, sha3_256, sha3_384, sha3_512 } from "js-sha3";

import type { TransformDefinition, TransformResult } from "../../shared/types";

import { hashText } from "./codec";

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
  propertySchema: [],
  defaultProperties: {},
  execute: async (input: string): Promise<TransformResult> => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = await hashText(input, "md5");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "MD5" },
          { label: "Output Length", value: "128 bits (32 hex chars)" },
          {
            label: "Security",
            value: "Deprecated - Use SHA-256 or stronger",
            alert: "warning",
          },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Hashing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
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
  propertySchema: [],
  defaultProperties: {},
  execute: async (input: string): Promise<TransformResult> => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = await hashText(input, "sha1");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "SHA-1" },
          { label: "Output Length", value: "160 bits (40 hex chars)" },
          {
            label: "Security",
            value: "Deprecated - Use SHA-256 or stronger",
            alert: "warning",
          },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Hashing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
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
  propertySchema: [],
  defaultProperties: {},
  execute: async (input: string): Promise<TransformResult> => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = await hashText(input, "sha256");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "SHA-256" },
          { label: "Output Length", value: "256 bits (64 hex chars)" },
          {
            label: "Security",
            value: "Cryptographically secure",
            alert: "info",
          },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Hashing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
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
  propertySchema: [],
  defaultProperties: {},
  execute: async (input: string): Promise<TransformResult> => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = await hashText(input, "sha384");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "SHA-384" },
          { label: "Output Length", value: "384 bits (96 hex chars)" },
          {
            label: "Security",
            value: "Cryptographically secure",
            alert: "info",
          },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Hashing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
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
  propertySchema: [],
  defaultProperties: {},
  execute: async (input: string): Promise<TransformResult> => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = await hashText(input, "sha512");
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "SHA-512" },
          { label: "Output Length", value: "512 bits (128 hex chars)" },
          {
            label: "Security",
            value: "Maximum cryptographic security",
            alert: "info",
          },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Hashing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
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
  propertySchema: [],
  defaultProperties: {},
  execute: async (input: string): Promise<TransformResult> => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = sha3_224(input);
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "SHA3-224" },
          { label: "Output Length", value: "224 bits (56 hex chars)" },
          {
            label: "Security",
            value: "Modern cryptographic standard",
            alert: "info",
          },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Hashing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
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
  propertySchema: [],
  defaultProperties: {},
  execute: async (input: string): Promise<TransformResult> => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = sha3_256(input);
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "SHA3-256" },
          { label: "Output Length", value: "256 bits (64 hex chars)" },
          {
            label: "Security",
            value: "Modern cryptographic standard",
            alert: "info",
          },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Hashing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
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
  propertySchema: [],
  defaultProperties: {},
  execute: async (input: string): Promise<TransformResult> => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = sha3_384(input);
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "SHA3-384" },
          { label: "Output Length", value: "384 bits (96 hex chars)" },
          {
            label: "Security",
            value: "High cryptographic security",
            alert: "info",
          },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Hashing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
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
  propertySchema: [],
  defaultProperties: {},
  execute: async (input: string): Promise<TransformResult> => {
    if (!input) {
      return {
        success: false,
        data: "",
        error: "Input is empty",
        mimeType: "text/plain",
      };
    }

    try {
      const output = sha3_512(input);
      return {
        success: true,
        data: output,
        mimeType: "text/plain",
        stats: [
          { label: "Algorithm", value: "SHA3-512" },
          { label: "Output Length", value: "512 bits (128 hex chars)" },
          {
            label: "Security",
            value: "Maximum cryptographic security",
            alert: "info",
          },
        ],
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Hashing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        mimeType: "text/plain",
      };
    }
  },
};
