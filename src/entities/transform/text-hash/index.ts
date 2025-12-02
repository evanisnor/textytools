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
  sha512HashDefinition,
} from "./lib/transforms";
