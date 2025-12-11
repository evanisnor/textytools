/**
 * Text Hashing Transform Definition
 * Wraps existing hashing functions with TransformDefinition interface
 */

import type {
  PropertySchema,
  TransformDefinition,
  TransformResult,
  TransformStat,
} from "../../shared/types";
import type { HashType } from "../model/types";

import { hashText } from "./codec";

// ============================================================================
// Hash Algorithm Configuration
// ============================================================================

interface HashAlgorithmConfig {
  value: HashType;
  label: string;
  outputLength: string;
  securityMessage: string;
  securityAlert: "info" | "warning";
}

const HASH_ALGORITHMS: HashAlgorithmConfig[] = [
  {
    value: "md5",
    label: "MD5",
    outputLength: "128 bits (32 hex chars)",
    securityMessage: "Deprecated - Use SHA-256 or stronger",
    securityAlert: "warning",
  },
  {
    value: "sha1",
    label: "SHA-1",
    outputLength: "160 bits (40 hex chars)",
    securityMessage: "Deprecated - Use SHA-256 or stronger",
    securityAlert: "warning",
  },
  {
    value: "sha256",
    label: "SHA-256",
    outputLength: "256 bits (64 hex chars)",
    securityMessage: "Cryptographically secure",
    securityAlert: "info",
  },
  {
    value: "sha384",
    label: "SHA-384",
    outputLength: "384 bits (96 hex chars)",
    securityMessage: "Cryptographically secure",
    securityAlert: "info",
  },
  {
    value: "sha512",
    label: "SHA-512",
    outputLength: "512 bits (128 hex chars)",
    securityMessage: "Maximum cryptographic security",
    securityAlert: "info",
  },
  {
    value: "sha3-224",
    label: "SHA3-224",
    outputLength: "224 bits (56 hex chars)",
    securityMessage: "Modern cryptographic standard",
    securityAlert: "info",
  },
  {
    value: "sha3-256",
    label: "SHA3-256",
    outputLength: "256 bits (64 hex chars)",
    securityMessage: "Modern cryptographic standard",
    securityAlert: "info",
  },
  {
    value: "sha3-384",
    label: "SHA3-384",
    outputLength: "384 bits (96 hex chars)",
    securityMessage: "High cryptographic security",
    securityAlert: "info",
  },
  {
    value: "sha3-512",
    label: "SHA3-512",
    outputLength: "512 bits (128 hex chars)",
    securityMessage: "Maximum cryptographic security",
    securityAlert: "info",
  },
];

const HASH_ALGORITHM_OPTIONS = HASH_ALGORITHMS.map((alg) => ({
  value: alg.value,
  label: alg.label,
}));

function getAlgorithmConfig(algorithm: HashType): HashAlgorithmConfig {
  const config = HASH_ALGORITHMS.find((alg) => alg.value === algorithm);
  if (!config) {
    throw new Error(`Unknown hash algorithm: ${algorithm}`);
  }
  return config;
}

// ============================================================================
// Property Schema
// ============================================================================

const HASH_SCHEMA: PropertySchema[] = [
  {
    key: "algorithm",
    label: "Algorithm",
    type: "select",
    options: HASH_ALGORITHM_OPTIONS,
    defaultValue: "sha256",
  },
  {
    key: "lineByLine",
    label: "Line-by-Line",
    type: "toggle",
    defaultValue: false,
  },
];

// ============================================================================
// Transform Definition
// ============================================================================

/**
 * Consolidated Text Hash Transform
 */
export const textHashTransform: TransformDefinition = {
  type: "text-hash",
  name: "Text Hash",
  description: "Generate cryptographic hash using various algorithms",
  category: "hash",
  acceptsInput: ["*"],
  producesOutput: "text/plain",
  supportsLineByLine: true,
  propertySchema: HASH_SCHEMA,
  defaultProperties: {
    algorithm: "sha256",
    lineByLine: false,
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

    const algorithm = (properties.algorithm as HashType) || "sha256";
    const lineByLine = properties.lineByLine === true;

    try {
      const config = getAlgorithmConfig(algorithm);
      const output = await hashText(input, algorithm, lineByLine);

      const stats: TransformStat[] = [
        { label: "Output Length", value: config.outputLength },
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
  },
};
