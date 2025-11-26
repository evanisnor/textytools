"use client";

import { useState, useMemo, useEffect } from "react";
import type { ConversionResult } from "./types";
import { detectInputFormat } from "../lib/detection";
import { jsonToCsv } from "../lib/json-to-csv";
import { csvToJson } from "../lib/csv-to-json";

export function useCsvJsonConverter() {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from sessionStorage after mount to avoid hydration mismatch
    setTimeout(() => {
      setMounted(true);

      // Check for cross-tool data first (takes precedence)
      const storedInput = sessionStorage.getItem(
        "cross-tool-input-csv-json-converter",
      );
      if (storedInput) {
        sessionStorage.removeItem("cross-tool-input-csv-json-converter");
        setInput(storedInput);
        return;
      }

      // Load persisted state from sessionStorage
      const persistedState = sessionStorage.getItem("csv-json-converter-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.input !== undefined) setInput(state.input);
          if (state.delimiter !== undefined) setDelimiter(state.delimiter);
          if (state.includeHeaders !== undefined)
            setIncludeHeaders(state.includeHeaders);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state whenever inputs change
  useEffect(() => {
    if (!mounted) return;
    const state = { input, delimiter, includeHeaders };
    sessionStorage.setItem("csv-json-converter-state", JSON.stringify(state));
  }, [input, delimiter, includeHeaders, mounted]);

  const result: ConversionResult = useMemo(() => {
    if (!input.trim()) {
      return {
        success: true,
        output: "",
        error: null,
        detectedFormat: "csv",
      };
    }

    const detectedFormat = detectInputFormat(input);

    try {
      if (detectedFormat === "json") {
        const conversionResult = jsonToCsv(input, delimiter, includeHeaders);
        return { ...conversionResult, detectedFormat };
      } else {
        const conversionResult = csvToJson(input, delimiter, includeHeaders);
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
  }, [input, delimiter, includeHeaders]);

  return {
    input,
    setInput,
    delimiter,
    setDelimiter,
    includeHeaders,
    setIncludeHeaders,
    result,
  };
}
