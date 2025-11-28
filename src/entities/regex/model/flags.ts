import type { RegexFlag } from "./types";

export const FLAGS: RegexFlag[] = [
  { id: "g", label: "g", description: "Global - find all matches" },
  { id: "i", label: "i", description: "Case insensitive" },
  { id: "m", label: "m", description: "Multiline - ^ and $ match line breaks" },
  { id: "s", label: "s", description: "Dotall - . matches newlines" },
  { id: "u", label: "u", description: "Unicode - treat pattern as Unicode" },
  { id: "y", label: "y", description: "Sticky - match from lastIndex only" },
];
