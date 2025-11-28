/**
 * Types for text hashing
 */

export type HashType = "md5" | "sha1" | "sha256" | "sha512";

export interface HashOption {
  id: HashType;
  label: string;
  description: string;
}
