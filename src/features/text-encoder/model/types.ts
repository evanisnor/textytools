import type { EncodingType as EntityEncodingType } from "@/entities/transform/text-encoding";
import type { HashType } from "@/entities/transform/text-hash";

// Feature-level combined type for encodings and hashes
export type EncodingType = EntityEncodingType | HashType;

export interface EncodingOption {
  id: EncodingType;
  label: string;
  description: string;
}

export type EncodingMode = "encode" | "decode";

// Helper to check if type is a hash
export function isHashType(type: EncodingType): type is HashType {
  return ["md5", "sha1", "sha256", "sha512"].includes(type);
}
