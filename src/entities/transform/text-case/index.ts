// Domain types
export type { CaseType, CaseOption } from "./model/types";

// Case conversion functions
export {
  convertCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toDotCase,
  toPathCase,
} from "./lib/case-converters";

// Word detection utilities
export { toWords } from "./lib/word-detection";

// Hooks
export { useCaseConversion } from "./model/useCaseConversion";

// Transform Definition (for Apogee)
export { caseConvertTransform, CASE_TYPE_OPTIONS } from "./lib/transforms";
