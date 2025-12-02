// Types
export type { HashType } from "./model/types";

// Hooks
export { useTextHashing } from "./model/useTextHashing";
export type {
  UseTextHashingOptions,
  UseTextHashingResult,
} from "./model/useTextHashing";

// Codec function
export { hashText } from "./lib/codec";

// Transform Definitions (Apogee support)
export {
  md5HashDefinition,
  sha1HashDefinition,
  sha256HashDefinition,
  sha384HashDefinition,
  sha512HashDefinition,
  sha3_224HashDefinition,
  sha3_256HashDefinition,
  sha3_384HashDefinition,
  sha3_512HashDefinition,
} from "./lib/transforms";
