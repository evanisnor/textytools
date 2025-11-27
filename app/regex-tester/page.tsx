"use client";

import {
  RegexTesterProvider,
  RegexTesterShell,
  RegexTesterHeader,
} from "@/features/regex-tester";

import { TOOL_NAMES } from "@/shared/lib/constants";
import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";

export default function RegexTester() {
  return (
    <RegexTesterProvider>
      <ToolFrame
        title="Regex Tester"
        description="Test regular expressions with real-time match highlighting and capture group extraction."
        toolName={TOOL_NAMES.REGEX_TESTER}
        headerRight={<RegexTesterHeader />}
      >
        <RegexTesterShell />
      </ToolFrame>
    </RegexTesterProvider>
  );
}
