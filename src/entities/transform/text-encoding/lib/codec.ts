/**
 * Codec functions for text encoding transformations
 * Routes encoding/decoding requests to the appropriate transformation function
 */

import type { EncodingType } from "../model/types";

import { toAscii85, fromAscii85 } from "./encoding/ascii85";
import { toBase58, fromBase58 } from "./encoding/base58";
import { toBase64, fromBase64 } from "./encoding/base64";
import { toBase91, fromBase91 } from "./encoding/base91";
import { toZ85, fromZ85 } from "./encoding/z85";
import { toBinary, fromBinary } from "./text/binary";
import { toHex, fromHex } from "./text/hex";
import { toHtmlEntities, fromHtmlEntities } from "./text/html";
import { toMorse, fromMorse } from "./text/morse";
import {
  toQuotedPrintable,
  fromQuotedPrintable,
} from "./text/quoted-printable";
import { toRot13, fromRot13 } from "./text/rot13";
import { toUnicodeEscape, fromUnicodeEscape } from "./text/unicode";
import { toUrlEncoding, fromUrlEncoding } from "./text/url";

/**
 * Encode text using the specified encoding type
 */
export function encodeText(text: string, type: EncodingType): string {
  if (!text) return "";

  switch (type) {
    case "base64":
      return toBase64(text);
    case "base58":
      return toBase58(text);
    case "base91":
      return toBase91(text);
    case "ascii85":
      return toAscii85(text);
    case "z85":
      return toZ85(text);
    case "url":
      return toUrlEncoding(text);
    case "html":
      return toHtmlEntities(text);
    case "hex":
      return toHex(text);
    case "binary":
      return toBinary(text);
    case "unicode":
      return toUnicodeEscape(text);
    case "quotedPrintable":
      return toQuotedPrintable(text);
    case "rot13":
      return toRot13(text);
    case "morse":
      return toMorse(text);
    default:
      return text;
  }
}

/**
 * Decode text using the specified encoding type
 */
export function decodeText(text: string, type: EncodingType): string {
  if (!text) return "";

  switch (type) {
    case "base64":
      return fromBase64(text);
    case "base58":
      return fromBase58(text);
    case "base91":
      return fromBase91(text);
    case "ascii85":
      return fromAscii85(text);
    case "z85":
      return fromZ85(text);
    case "url":
      return fromUrlEncoding(text);
    case "html":
      return fromHtmlEntities(text);
    case "hex":
      return fromHex(text);
    case "binary":
      return fromBinary(text);
    case "unicode":
      return fromUnicodeEscape(text);
    case "quotedPrintable":
      return fromQuotedPrintable(text);
    case "rot13":
      return fromRot13(text);
    case "morse":
      return fromMorse(text);
    default:
      return text;
  }
}

/**
 * Check if an encoding type supports decoding
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function supportsDecoding(_type: EncodingType): boolean {
  return true; // All encoding types support bidirectional transformation
}
