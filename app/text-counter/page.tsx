"use client";

import { TextCounterShell } from "@/features/text-counter";

import { TOOL_NAMES } from "@/shared/lib/constants";
import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";

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
