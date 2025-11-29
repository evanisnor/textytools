# Shared Hooks

## `usePersistedState`

Manages feature state persistence to sessionStorage with SSR hydration safety and cross-tool data transfer support.

### Usage

**Basic state persistence:**

```tsx
import { usePersistedState } from "@/shared/hooks";

export function useTextCounter() {
  const { state, updateState, mounted } = usePersistedState({
    storageKey: "text-counter-state",
    initialState: { text: "" },
  });

  const { text } = state;

  return {
    text,
    setText: (newText: string) => updateState({ text: newText }),
    mounted,
  };
}
```

**With cross-tool data support:**

```tsx
import { useState } from "react";
import { usePersistedState } from "@/shared/hooks";

export function useJsonWizard() {
  const [input, setInput] = useState("");

  const { state, updateState, mounted } = usePersistedState({
    storageKey: "json-wizard-state",
    initialState: {
      viewMode: "pretty" as const,
      indentSize: 2,
      sortKeys: false,
    },
    crossToolKey: "cross-tool-input-json-wizard",
    onCrossToolData: (data) => {
      // Handle cross-tool input separately
      setInput(data);
    },
  });

  return {
    input,
    setInput,
    ...state,
    updateState,
    mounted,
  };
}
```

### Benefits

- ✅ Eliminates duplicate hydration safety logic
- ✅ Consistent cross-tool data handling
- ✅ Automatic error handling for corrupted storage
- ✅ Type-safe state management
- ✅ Single source of truth for storage patterns

## `useCrossToolNavigation`

Handles navigation between tools with data transfer via sessionStorage.

### Usage

```tsx
import { useCrossToolNavigation } from "@/shared/hooks";
import { trackToolConversion } from "@/shared/lib/analytics";

export function JwtDecoderShell() {
  const { input, formattedOutput } = useJwtDecoderContext();

  const { navigateToTool } = useCrossToolNavigation({
    currentFeatureKey: "jwt-decoder-state",
    currentState: { input },
  });

  const handleSendToJsonWizard = () => {
    trackToolConversion({
      sourceTool: "jwt-decoder",
      destinationTool: "json-wizard",
    });

    navigateToTool({
      destination: "/json-wizard",
      data: formattedOutput,
      crossToolKey: "cross-tool-input-json-wizard",
    });
  };

  return (
    <button onClick={handleSendToJsonWizard}>
      Send to JSON Wizard
    </button>
  );
}
```

### Benefits

- ✅ Encapsulates cross-tool navigation pattern
- ✅ Ensures current state is saved before navigation
- ✅ Consistent data transfer mechanism
- ✅ Type-safe navigation API

## Storage Key Conventions

### Feature State Keys

Format: `"{feature-name}-state"`

Examples:
- `"text-counter-state"`
- `"json-wizard-state"`
- `"regex-tester-state"`

### Cross-Tool Keys

Format: `"cross-tool-input-{destination-feature-name}"`

Examples:
- `"cross-tool-input-json-wizard"`
- `"cross-tool-input-csv-json-converter"`
- `"cross-tool-input-regex-tester"`

## Migration Guide

### Before (duplicated code):

```tsx
export function useTextCounter() {
  const [text, setText] = useState("");
  const [mounted, setMounted] = useState(false);

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

  return { text, setText };
}
```

### After (using shared hook):

```tsx
export function useTextCounter() {
  const { state, updateState, mounted } = usePersistedState({
    storageKey: "text-counter-state",
    initialState: { text: "" },
  });

  return {
    text: state.text,
    setText: (newText: string) => updateState({ text: newText }),
    mounted,
  };
}
```

## Testing

The hooks handle the following edge cases:

1. **SSR Hydration**: Uses `setTimeout` to avoid hydration mismatches
2. **Corrupted Storage**: Catches JSON parse errors gracefully
3. **Missing Data**: Falls back to initial state
4. **Cross-tool Priority**: Cross-tool data takes precedence over persisted state
5. **Cleanup**: Cross-tool data is removed after being read once
