// Types
export type { EncodingType } from "./model/types";

// Hooks
export { useTextEncoding } from "./model/useTextEncoding";
export type {
  UseTextEncodingOptions,
  UseTextEncodingResult,
} from "./model/useTextEncoding";

// Codec functions
export { encodeText, decodeText } from "./lib/codec";
