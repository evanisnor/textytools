import { useState, useEffect } from "react";

import { defaultOptions } from "./presets";

import { useTextSanitize } from "@/entities/transform/text-sanitize";
import type { SanitizationOption } from "@/entities/transform/text-sanitize";

export function useTextSanitizer() {
  const [mounted, setMounted] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [initialOptions, setInitialOptions] =
    useState<SanitizationOption[]>(defaultOptions);

  // Load persisted state on mount
  useEffect(() => {
    setTimeout(() => {
      const persistedState = sessionStorage.getItem("text-sanitizer-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.text !== undefined) setInitialText(state.text);
          if (state.options !== undefined) setInitialOptions(state.options);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
      setMounted(true);
    }, 0);
  }, []);

  const sanitizer = useTextSanitize({
    initialText,
    initialOptions,
  });

  // Persist state whenever inputs change
  useEffect(() => {
    if (!mounted) return;
    const state = { text: sanitizer.text, options: sanitizer.options };
    sessionStorage.setItem("text-sanitizer-state", JSON.stringify(state));
  }, [sanitizer.text, sanitizer.options, mounted]);

  return sanitizer;
}
