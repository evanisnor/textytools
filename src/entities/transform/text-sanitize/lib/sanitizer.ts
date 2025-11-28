import type { SanitizationOption } from "../model/types";

export function sanitizeText(
  text: string,
  options: SanitizationOption[],
): string {
  let result = text;

  const enabledOptions = options.filter((opt) => opt.enabled);

  for (const option of enabledOptions) {
    switch (option.id) {
      case "trimLines":
        result = result
          .split("\n")
          .map((line) => line.trim())
          .join("\n");
        break;

      case "removeEmptyLines":
        result = result
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .join("\n");
        break;

      case "removeDuplicateLines":
        const lines = result.split("\n");
        const uniqueLines = [...new Set(lines)];
        result = uniqueLines.join("\n");
        break;

      case "removeExtraSpaces":
        result = result.replace(/ {2,}/g, " ");
        break;

      case "removeNonAscii":
        result = result.replace(/[^\x00-\x7F]/g, "");
        break;

      case "removeEmoji":
        // Unicode ranges for emoji
        result = result.replace(
          /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{200D}]/gu,
          "",
        );
        break;

      case "removeNumbers":
        result = result.replace(/\d/g, "");
        break;

      case "removePunctuation":
        result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"[\]\\|@+]/g, "");
        break;

      case "removeSpecialChars":
        result = result.replace(/[^a-zA-Z0-9\s\n\r\t]/g, "");
        break;

      case "normalizeWhitespace":
        result = result.replace(/\s+/g, " ").trim();
        break;

      case "sortLines":
        result = result
          .split("\n")
          .sort((a, b) => a.localeCompare(b))
          .join("\n");
        break;

      case "reverseLines":
        result = result.split("\n").reverse().join("\n");
        break;
    }
  }

  return result;
}
