import { useState, useEffect } from "react";

import { useCounter } from "@/entities/counter";

/**
 * Feature-level hook for the text counter tool.
 * Manages text input state and persistence, delegating counting logic to the counter entity.
 */
export function useTextCounter() {
  const [text, setText] = useState("");
  const [mounted, setMounted] = useState(false);

  // Use the counter entity hook for all counting logic
  const counts = useCounter(text);

  // Load persisted state on mount
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const persistedState = sessionStorage.getItem("text-counter-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.text !== undefined) setText(state.text);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state whenever text changes
  useEffect(() => {
    if (!mounted) return;
    const state = { text };
    sessionStorage.setItem("text-counter-state", JSON.stringify(state));
  }, [text, mounted]);

  return {
    text,
    setText,
    ...counts,
  };
}
