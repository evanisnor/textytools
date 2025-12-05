import { useMemo } from "react";

import { getRegexPreview } from "../lib/lens";
import type { RegexPreviewResult } from "../lib/lens";

/**
 * Hook to get live preview of regex pattern matches
 *
 * @param pattern - The regex pattern string
 * @param flags - The regex flags (e.g., "gm")
 * @param input - The input text to match against
 * @returns Preview result showing first match or error/info message
 */
export function useRegexPreview(
  pattern: string,
  flags: string,
  input: string,
): RegexPreviewResult | null {
  return useMemo(() => {
    if (!pattern) {
      return null;
    }

    return getRegexPreview(pattern, flags, input);
  }, [pattern, flags, input]);
}
