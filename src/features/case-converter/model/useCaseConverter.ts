import { useState, useEffect } from "react";

import { convertCase, type CaseType } from "@/entities/text-case";

export function useCaseConverter() {
  const [text, setText] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseType>("upper");
  const [mounted, setMounted] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const persistedState = sessionStorage.getItem("case-converter-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.text !== undefined) setText(state.text);
          if (state.selectedCase !== undefined)
            setSelectedCase(state.selectedCase);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state whenever inputs change
  useEffect(() => {
    if (!mounted) return;
    const state = { text, selectedCase };
    sessionStorage.setItem("case-converter-state", JSON.stringify(state));
  }, [text, selectedCase, mounted]);

  const convertedText = convertCase(text, selectedCase);

  return {
    text,
    setText,
    selectedCase,
    setSelectedCase,
    convertedText,
  };
}
