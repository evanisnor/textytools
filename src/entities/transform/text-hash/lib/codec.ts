/**
 * Codec functions for text hashing transformations
 * Routes hash requests to the appropriate hash function
 */

import { sha3_224, sha3_256, sha3_384, sha3_512 } from "js-sha3";

import type { HashType } from "../model/types";

import { toMd5 } from "./md5";
import { toSha1, toSha256, toSha384, toSha512 } from "./sha";

/**
 * Generate hash for text using the specified hash type
 */
export async function hashText(
  text: string,
  type: HashType,
  lineByLine = false,
): Promise<string> {
  if (!text) return "";

  if (lineByLine) {
    const lines = text.split("\n");
    const hashedLines = await Promise.all(
      lines.map(async (line) => {
        switch (type) {
          case "md5":
            return toMd5(line);
          case "sha1":
            return await toSha1(line);
          case "sha256":
            return await toSha256(line);
          case "sha384":
            return await toSha384(line);
          case "sha512":
            return await toSha512(line);
          case "sha3-224":
            return sha3_224(line);
          case "sha3-256":
            return sha3_256(line);
          case "sha3-384":
            return sha3_384(line);
          case "sha3-512":
            return sha3_512(line);
          default:
            return line;
        }
      }),
    );
    return hashedLines.join("\n");
  }

  switch (type) {
    case "md5":
      return toMd5(text);
    case "sha1":
      return await toSha1(text);
    case "sha256":
      return await toSha256(text);
    case "sha384":
      return await toSha384(text);
    case "sha512":
      return await toSha512(text);
    case "sha3-224":
      return sha3_224(text);
    case "sha3-256":
      return sha3_256(text);
    case "sha3-384":
      return sha3_384(text);
    case "sha3-512":
      return sha3_512(text);
    default:
      return text;
  }
}

/**
 * Check if a hash type supports decoding (they don't - hashes are one-way)
 */
export function supportsDecoding(): boolean {
  return false;
}
