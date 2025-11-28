import type { RegexMatch } from "@/entities/regex";

export interface RegexTesterState {
  pattern: string;
  flags: string;
  testString: string;
  currentMatchIndex: number;
  matches: RegexMatch[];
  error: string | null;
  captureGroupCount: number;
  mounted: boolean;
}
