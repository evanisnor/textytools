"use client";

import { TextEncoderShell } from "@/features/text-encoder";

import { TOOL_NAMES } from "@/shared/lib/constants";
import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";

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
