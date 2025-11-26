"use client";

import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { CaseConverterShell } from "@/features/case-converter";

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
