import { useState, useEffect } from "react";

import { sanitizeText } from "../lib/sanitizer";

import { defaultOptions } from "./presets";
import type { SanitizationOption } from "./types";

export function useTextSanitizer() {
  const [text, setText] = useState("");
  const [options, setOptions] = useState<SanitizationOption[]>(defaultOptions);
  const [mounted, setMounted] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const persistedState = sessionStorage.getItem("text-sanitizer-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.text !== undefined) setText(state.text);
          if (state.options !== undefined) setOptions(state.options);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state whenever inputs change
  useEffect(() => {
    if (!mounted) return;
    const state = { text, options };
    sessionStorage.setItem("text-sanitizer-state", JSON.stringify(state));
  }, [text, options, mounted]);

  const sanitizedText = sanitizeText(text, options);

  const toggleOption = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt,
      ),
    );
  };

  const enableAll = () => {
    setOptions((prev) => prev.map((opt) => ({ ...opt, enabled: true })));
  };

  const disableAll = () => {
    setOptions((prev) => prev.map((opt) => ({ ...opt, enabled: false })));
  };

  const activeCount = options.filter((opt) => opt.enabled).length;

  return {
    text,
    setText,
    options,
    sanitizedText,
    toggleOption,
    enableAll,
    disableAll,
    activeCount,
  };
}
