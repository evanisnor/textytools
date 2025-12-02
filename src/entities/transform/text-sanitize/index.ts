// Types
export type { SanitizationOption, SanitizationOptionId } from "./model/types";

// Hook
export { useTextSanitize } from "./model/useTextSanitize";
export type {
  UseTextSanitizeOptions,
  UseTextSanitizeResult,
} from "./model/useTextSanitize";

// Core logic
export { sanitizeText } from "./lib/sanitizer";

// Transform Definition (for Apogee)
export { textSanitizeTransform } from "./lib/transforms";
