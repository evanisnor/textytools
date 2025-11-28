import type { SanitizationOption } from "./types";

export const defaultOptions: SanitizationOption[] = [
  {
    id: "trimLines",
    label: "Trim Lines",
    description: "Remove leading and trailing whitespace from each line",
    enabled: false,
  },
  {
    id: "removeEmptyLines",
    label: "Remove Empty Lines",
    description: "Delete all blank lines from the text",
    enabled: false,
  },
  {
    id: "removeDuplicateLines",
    label: "Remove Duplicate Lines",
    description: "Keep only unique lines, removing duplicates",
    enabled: false,
  },
  {
    id: "removeExtraSpaces",
    label: "Remove Extra Spaces",
    description: "Replace multiple spaces with a single space",
    enabled: false,
  },
  {
    id: "removeNonAscii",
    label: "Remove Non-ASCII",
    description: "Strip all non-ASCII characters (keeps only 0-127)",
    enabled: false,
  },
  {
    id: "removeEmoji",
    label: "Remove Emoji",
    description: "Remove all emoji characters",
    enabled: false,
  },
  {
    id: "removeNumbers",
    label: "Remove Numbers",
    description: "Strip all numeric digits (0-9)",
    enabled: false,
  },
  {
    id: "removePunctuation",
    label: "Remove Punctuation",
    description: "Remove all punctuation marks",
    enabled: false,
  },
  {
    id: "removeSpecialChars",
    label: "Remove Special Characters",
    description: "Keep only letters, numbers, and basic whitespace",
    enabled: false,
  },
  {
    id: "normalizeWhitespace",
    label: "Normalize Whitespace",
    description: "Convert all whitespace (tabs, newlines) to single spaces",
    enabled: false,
  },
  {
    id: "sortLines",
    label: "Sort Lines",
    description: "Sort all lines alphabetically",
    enabled: false,
  },
  {
    id: "reverseLines",
    label: "Reverse Lines",
    description: "Reverse the order of lines",
    enabled: false,
  },
];
