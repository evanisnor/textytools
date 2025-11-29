"use client";

import { useMemo } from "react";

import {
  csvToJson,
  detectInputFormat,
  jsonToCsv,
  type ConversionResult,
} from "@/entities/transform";

import { usePersistedState } from "@/shared/hooks";

export function useCsvJsonConverter() {
  const { state, updateState } = usePersistedState({
    storageKey: "csv-json-converter-state",
    initialState: {
      input: "",
      delimiter: ",",
      includeHeaders: true,
    },
    crossToolKey: "cross-tool-input-csv-json-converter",
    crossToolField: "input",
  });

  const result: ConversionResult = useMemo(() => {
    if (!state.input.trim()) {
      return {
        success: true,
        output: "",
        error: null,
        detectedFormat: "csv",
      };
    }

    const detectedFormat = detectInputFormat(state.input);

    try {
      if (detectedFormat === "json") {
        const conversionResult = jsonToCsv(
          state.input,
          state.delimiter,
          state.includeHeaders,
        );
        return { ...conversionResult, detectedFormat };
      } else {
        const conversionResult = csvToJson(
          state.input,
          state.delimiter,
          state.includeHeaders,
        );
        return { ...conversionResult, detectedFormat };
      }
    } catch (error) {
      return {
        success: false,
        output: "",
        error: error instanceof Error ? error.message : "Conversion failed",
        detectedFormat,
      };
    }
  }, [state.input, state.delimiter, state.includeHeaders]);

  return {
    input: state.input,
    setInput: (newInput: string) => updateState({ input: newInput }),
    delimiter: state.delimiter,
    setDelimiter: (newDelimiter: string) =>
      updateState({ delimiter: newDelimiter }),
    includeHeaders: state.includeHeaders,
    setIncludeHeaders: (newIncludeHeaders: boolean) =>
      updateState({ includeHeaders: newIncludeHeaders }),
    result,
  };
}
