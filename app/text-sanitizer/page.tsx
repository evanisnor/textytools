"use client";

import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { TextSanitizerShell } from "@/features/text-sanitizer";

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
