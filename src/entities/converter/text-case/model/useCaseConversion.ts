import { useMemo } from "react";

import { convertCase } from "../lib/case-converters";
import { type CaseType } from "./types";

interface UseCaseConversionOptions {
  text: string;
  caseType: CaseType;
}

/**
 * React hook for converting text to a specific case.
 * Provides memoized conversion to avoid unnecessary recalculations.
 */
export function useCaseConversion({
  text,
  caseType,
}: UseCaseConversionOptions): string {
  return useMemo(() => convertCase(text, caseType), [text, caseType]);
}
