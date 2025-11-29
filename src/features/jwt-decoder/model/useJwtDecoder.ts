import { useMemo } from "react";

import { decodeJWT, type JWTDecodeResult } from "@/entities/transform/jwt";

import { usePersistedState } from "@/shared/hooks";

export function useJwtDecoder() {
  const { state, updateState } = usePersistedState({
    storageKey: "jwt-decoder-state",
    initialState: { input: "" },
    crossToolKey: "cross-tool-input-jwt-decoder",
    crossToolField: "input",
  });

  const result: JWTDecodeResult = useMemo(() => {
    if (!state.input.trim()) {
      return {
        success: true,
        decoded: null,
        error: null,
      };
    }

    try {
      const decoded = decodeJWT(state.input);
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
  }, [state.input]);

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
    input: state.input,
    setInput: (newInput: string) => updateState({ input: newInput }),
    result,
    formattedOutput,
  };
}
