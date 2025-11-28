import { useState, useEffect } from "react";

import { isHashType } from "./types";
import type { EncodingType, EncodingMode } from "./types";

import { useTextEncoding, useTextHashing } from "@/entities/transform";
import type { EncodingType as EntityEncodingType } from "@/entities/transform/text-encoding";
import type { HashType } from "@/entities/transform/text-hash";

export function useTextEncoder() {
  const [text, setText] = useState("");
  const [selectedEncoding, setSelectedEncoding] =
    useState<EncodingType>("base64");
  const [mode, setMode] = useState<EncodingMode>("encode");
  const [mounted, setMounted] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const crossToolInput = sessionStorage.getItem(
        "cross-tool-input-text-encoder",
      );
      if (crossToolInput) {
        sessionStorage.removeItem("cross-tool-input-text-encoder");
        setText(crossToolInput);
        setMode("encode");
        return;
      }
      const persistedState = sessionStorage.getItem("text-encoder-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.text !== undefined) setText(state.text);
          if (state.selectedEncoding !== undefined)
            setSelectedEncoding(state.selectedEncoding);
          if (state.mode !== undefined) setMode(state.mode);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state whenever inputs change
  useEffect(() => {
    if (!mounted) return;
    const state = { text, selectedEncoding, mode };
    sessionStorage.setItem("text-encoder-state", JSON.stringify(state));
  }, [text, selectedEncoding, mode, mounted]);

  const handleModeChange = (newMode: EncodingMode) => {
    setMode(newMode);
    // Switch to base64 if switching to decode mode with a hash function selected
    if (newMode === "decode" && isHashType(selectedEncoding)) {
      setSelectedEncoding("base64");
    }
  };

  // Use entity hooks for transformations
  const isHash = isHashType(selectedEncoding);

  const encodingResult = useTextEncoding({
    text,
    type: selectedEncoding as EntityEncodingType,
    direction: mode === "encode" ? "encode" : "decode",
  });

  const hashingResult = useTextHashing({
    text,
    type: selectedEncoding as HashType,
  });

  // Compute output based on mode and type
  const outputText =
    isHash && mode === "encode"
      ? hashingResult.hash
      : isHash && mode === "decode"
        ? "Error: Hash functions are one-way only (cannot be decoded)"
        : encodingResult.result;

  return {
    text,
    setText,
    selectedEncoding,
    setSelectedEncoding,
    mode,
    handleModeChange,
    outputText,
  };
}
