import { useCounter } from "@/entities/counter";

import { usePersistedState } from "@/shared/hooks";

/**
 * Feature-level hook for the text counter tool.
 * Manages text input state and persistence, delegating counting logic to the counter entity.
 */
export function useTextCounter() {
  const { state, updateState } = usePersistedState({
    storageKey: "text-counter-state",
    initialState: { text: "" },
  });

  // Use the counter entity hook for all counting logic
  const counts = useCounter(state.text);

  return {
    text: state.text,
    setText: (newText: string) => updateState({ text: newText }),
    ...counts,
  };
}
