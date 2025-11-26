import { findJsonSyntaxError } from "@/entities/json";
import type { ValidationResult } from "../model/types";

export function validateJSON(text: string): ValidationResult {
  if (!text.trim()) {
    return { isValid: true };
  }

  try {
    JSON.parse(text);
    return { isValid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      const positionMatch = error.message.match(/position (\d+)/i);
      let derivedPosition = positionMatch
        ? parseInt(positionMatch[1], 10)
        : undefined;
      let derivedMessage: string | undefined;

      if (Number.isNaN(derivedPosition)) {
        derivedPosition = undefined;
      }

      if (derivedPosition === undefined) {
        const fallback = findJsonSyntaxError(text);
        if (fallback) {
          derivedPosition = fallback.position;
          derivedMessage = fallback.message;
        }
      }

      if (derivedPosition !== undefined) {
        const lines = text.substring(0, derivedPosition).split("\n");
        const lineNumber = lines.length;
        const columnNumber = lines[lines.length - 1].length + 1;

        return {
          isValid: false,
          error: derivedMessage ?? error.message,
          lineNumber,
          columnNumber,
        };
      }

      return {
        isValid: false,
        error: derivedMessage ?? error.message,
      };
    }
    return {
      isValid: false,
      error: "Unknown parsing error",
    };
  }
}
