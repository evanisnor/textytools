import type { CaseType } from "../model/types";

import { toWords } from "./detection";

export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

export function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

export function toCamelCase(str: string): string {
  const words = toWords(str);
  return words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
}

export function toPascalCase(str: string): string {
  const words = toWords(str);
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export function toSnakeCase(str: string): string {
  return toWords(str)
    .map((w) => w.toLowerCase())
    .join("_");
}

export function toKebabCase(str: string): string {
  return toWords(str)
    .map((w) => w.toLowerCase())
    .join("-");
}

export function toConstantCase(str: string): string {
  return toWords(str)
    .map((w) => w.toUpperCase())
    .join("_");
}

export function toDotCase(str: string): string {
  return toWords(str)
    .map((w) => w.toLowerCase())
    .join(".");
}

export function toPathCase(str: string): string {
  return toWords(str)
    .map((w) => w.toLowerCase())
    .join("/");
}

export function convertCase(text: string, caseType: CaseType): string {
  if (!text) return "";

  switch (caseType) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return toTitleCase(text);
    case "sentence":
      return toSentenceCase(text);
    case "camel":
      return toCamelCase(text);
    case "pascal":
      return toPascalCase(text);
    case "snake":
      return toSnakeCase(text);
    case "kebab":
      return toKebabCase(text);
    case "constant":
      return toConstantCase(text);
    case "dot":
      return toDotCase(text);
    case "path":
      return toPathCase(text);
    default:
      return text;
  }
}
