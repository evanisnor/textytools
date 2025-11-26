"use client";

import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { TextCounterShell } from "@/features/text-counter";

export default function TextCounter() {
  return (
    <ToolFrame
      title="Text Counter"
      description="Paste or type text below to see character, word, line, paragraph, and AI token counts in real-time."
      toolName={TOOL_NAMES.TEXT_COUNTER}
    >
      <TextCounterShell />
    </ToolFrame>
  );
}
