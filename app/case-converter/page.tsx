"use client";

import { CaseConverterShell } from "@/features/case-converter";

import { TOOL_NAMES } from "@/shared/lib/constants";
import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";

export default function CaseConverter() {
  return (
    <ToolFrame
      title="Case Converter"
      description="Transform text between different case formats instantly."
      toolName={TOOL_NAMES.CASE_CONVERTER}
    >
      <CaseConverterShell />
    </ToolFrame>
  );
}
