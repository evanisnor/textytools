"use client";

import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";
import { TOOL_NAMES } from "@/shared/lib/constants";
import {
  RegexTesterShell,
  RegexTesterHeader,
  useRegexTester,
} from "@/features/regex-tester";

export default function RegexTester() {
  const { matches, captureGroupCount, mounted } = useRegexTester();

  return (
    <ToolFrame
      title="Regex Tester"
      description="Test regular expressions with real-time match highlighting and capture group extraction."
      toolName={TOOL_NAMES.REGEX_TESTER}
      headerRight={
        <RegexTesterHeader
          matchCount={matches.length}
          captureGroupCount={captureGroupCount}
          mounted={mounted}
        />
      }
    >
      <RegexTesterShell />
    </ToolFrame>
  );
}
