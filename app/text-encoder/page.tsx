"use client";

import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { TextEncoderShell } from "@/features/text-encoder";

export default function TextEncoderPage() {
  return (
    <ToolFrame
      title="Text Encoder"
      description="Encode and decode text using various formats including Base64, URL, Hex, and more."
      toolName={TOOL_NAMES.TEXT_ENCODER}
    >
      <TextEncoderShell />
    </ToolFrame>
  );
}
