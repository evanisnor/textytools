import type { EncodingType } from "../model/types";
import {
  toBase64,
  toBase58,
  toBase91,
  toAscii85,
  toZ85,
  toUrlEncoding,
  toHtmlEntities,
  toHex,
  toBinary,
  toUnicodeEscape,
  toQuotedPrintable,
  toRot13,
  toMorse,
  toMd5,
  toSha1,
  toSha256,
  toSha512,
} from "./encoders";
import {
  fromBase64,
  fromBase58,
  fromBase91,
  fromAscii85,
  fromZ85,
  fromUrlEncoding,
  fromHtmlEntities,
  fromHex,
  fromBinary,
  fromUnicodeEscape,
  fromQuotedPrintable,
  fromRot13,
  fromMorse,
} from "./decoders";

export async function encode(text: string, type: EncodingType): Promise<string> {
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
    case "md5":
      return toMd5(text);
    case "sha1":
      return await toSha1(text);
    case "sha256":
      return await toSha256(text);
    case "sha512":
      return await toSha512(text);
    default:
      return text;
  }
}

export function decode(text: string, type: EncodingType): string {
  if (!text) return "";

  // Hash functions are one-way only
  if (["md5", "sha1", "sha256", "sha512"].includes(type)) {
    return "Error: Hash functions are one-way only (cannot be decoded)";
  }

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
