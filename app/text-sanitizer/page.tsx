"use client";

import { TextSanitizerShell } from "@/features/text-sanitizer";

import { TOOL_NAMES } from "@/shared/lib/constants";
import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";

export default function TextSanitizer() {
  return (
    <ToolFrame
      title="Text Sanitizer"
      description="Clean and transform your text with customizable sanitization options."
      toolName={TOOL_NAMES.TEXT_SANITIZER}
    >
      <TextSanitizerShell />
    </ToolFrame>
  );
}
