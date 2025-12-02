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

// Transform Definitions (Apogee support)
export {
  base64EncodeDefinition,
  base64DecodeDefinition,
  base58EncodeDefinition,
  base58DecodeDefinition,
  hexEncodeDefinition,
  hexDecodeDefinition,
  urlEncodeDefinition,
  htmlEntityEncodeDefinition,
  rot13EncodeDefinition,
  morseEncodeDefinition,
  morseDecodeDefinition,
  quotedPrintableEncodeDefinition,
  quotedPrintableDecodeDefinition,
  base91EncodeDefinition,
  base91DecodeDefinition,
  ascii85EncodeDefinition,
  ascii85DecodeDefinition,
  z85EncodeDefinition,
  z85DecodeDefinition,
  unicodeEncodeDefinition,
  unicodeDecodeDefinition,
} from "./lib/transforms";
