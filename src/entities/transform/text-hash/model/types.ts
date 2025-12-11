/**
 * Types for text hashing
 */

export type HashType =
  | "md5"
  | "sha1"
  | "sha256"
  | "sha384"
  | "sha512"
  | "sha3-224"
  | "sha3-256"
  | "sha3-384"
  | "sha3-512";

export interface HashOption {
  id: HashType;
  label: string;
  description: string;
}
