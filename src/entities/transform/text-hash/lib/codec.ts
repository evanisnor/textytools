/**
 * Codec functions for text hashing transformations
 * Routes hash requests to the appropriate hash function
 */

import type { HashType } from "../model/types";

import { toMd5 } from "./md5";
import { toSha1, toSha256, toSha384, toSha512 } from "./sha";

/**
 * Generate hash for text using the specified hash type
 */
export async function hashText(text: string, type: HashType): Promise<string> {
  if (!text) return "";

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
