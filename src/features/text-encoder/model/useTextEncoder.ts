import { useState, useEffect } from "react";

import { encode, decode } from "../lib/codec";

import type { EncodingType, EncodingMode } from "./types";

export function useTextEncoder() {
  const [text, setText] = useState("");
  const [selectedEncoding, setSelectedEncoding] =
    useState<EncodingType>("base64");
  const [mode, setMode] = useState<EncodingMode>("encode");
  const [outputText, setOutputText] = useState("");
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
    const hashFunctions: EncodingType[] = ["md5", "sha1", "sha256", "sha512"];
    if (newMode === "decode" && hashFunctions.includes(selectedEncoding)) {
      setSelectedEncoding("base64");
    }
  };

  // Update output when inputs change
  useEffect(() => {
    const updateOutput = async () => {
      if (mode === "encode") {
        const result = await encode(text, selectedEncoding);
        setOutputText(result);
      } else {
        const result = decode(text, selectedEncoding);
        setOutputText(result);
      }
    };
    updateOutput();
  }, [text, selectedEncoding, mode]);

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
