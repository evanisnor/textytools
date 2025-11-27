"use client";

import {
  JsonWizardProvider,
  JsonWizardShell,
  JsonWizardHeader,
} from "@/features/json-wizard";

import { TOOL_NAMES } from "@/shared/lib/constants";
import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";

export default function JSONWizard() {
  return (
    <JsonWizardProvider>
      <ToolFrame
        title="JSON Wizard"
        description="Format, validate, and search JSON with real-time feedback."
        toolName={TOOL_NAMES.JSON_WIZARD}
        headerRight={<JsonWizardHeader />}
      >
        <JsonWizardShell />
      </ToolFrame>
    </JsonWizardProvider>
  );
}
