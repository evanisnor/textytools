"use client";

import { useState, useEffect } from "react";
import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { JsonWizardShell, JsonWizardHeader } from "@/features/json-wizard";
import { validateJSON } from "@/features/json-wizard/lib/validators";
import { getJSONStats } from "@/features/json-wizard/lib/stats";

export default function JSONWizard() {
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const storedInput = sessionStorage.getItem("cross-tool-input-json-wizard");
      if (storedInput) {
        sessionStorage.removeItem("cross-tool-input-json-wizard");
        setInput(storedInput);
        return;
      }
      const persistedState = sessionStorage.getItem("json-wizard-state");
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

  const validation = validateJSON(input);
  const stats = getJSONStats(input);

  return (
    <ToolFrame
      title="JSON Wizard"
      description="Format, validate, and search JSON with real-time feedback."
      toolName={TOOL_NAMES.JSON_WIZARD}
      headerRight={
        <JsonWizardHeader
          keys={stats.keys}
          depth={stats.depth}
          size={stats.size}
          isValid={validation.isValid}
          hasInput={Boolean(input.trim())}
          mounted={mounted}
        />
      }
    >
      <JsonWizardShell />
    </ToolFrame>
  );
}

