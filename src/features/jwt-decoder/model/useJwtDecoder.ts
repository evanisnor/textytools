import { useState, useEffect, useMemo } from "react";

import { decodeJWT, type JWTDecodeResult } from "@/entities/transform/jwt";

export function useJwtDecoder() {
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from sessionStorage after mount to avoid hydration mismatch
    setTimeout(() => {
      setMounted(true);

      // Check for cross-tool data first (takes precedence)
      const storedInput = sessionStorage.getItem(
        "cross-tool-input-jwt-decoder",
      );
      if (storedInput) {
        sessionStorage.removeItem("cross-tool-input-jwt-decoder");
        setInput(storedInput);
        return;
      }

      // Load persisted state from sessionStorage
      const persistedState = sessionStorage.getItem("jwt-decoder-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.input !== undefined) setInput(state.input);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state whenever input changes
  useEffect(() => {
    if (!mounted) return;
    const state = { input };
    sessionStorage.setItem("jwt-decoder-state", JSON.stringify(state));
  }, [input, mounted]);

  const result: JWTDecodeResult = useMemo(() => {
    if (!input.trim()) {
      return {
        success: true,
        decoded: null,
        error: null,
      };
    }

    try {
      const decoded = decodeJWT(input);
      return {
        success: true,
        decoded,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        decoded: null,
        error: error instanceof Error ? error.message : "Decoding failed",
      };
    }
  }, [input]);

  const formattedOutput = useMemo(() => {
    if (!result.decoded) return "";

    return JSON.stringify(
      {
        header: result.decoded.header,
        payload: result.decoded.payload,
        signature: result.decoded.signature,
      },
      null,
      2,
    );
  }, [result.decoded]);

  return {
    input,
    setInput,
    result,
    formattedOutput,
  };
}
