export interface SanitizationOption {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export type SanitizationOptionId =
  | "trimLines"
  | "removeEmptyLines"
  | "removeDuplicateLines"
  | "removeExtraSpaces"
  | "removeNonAscii"
  | "removeEmoji"
  | "removeNumbers"
  | "removePunctuation"
  | "removeSpecialChars"
  | "normalizeWhitespace"
  | "sortLines"
  | "reverseLines";
