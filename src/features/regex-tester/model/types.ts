export interface RegexFlag {
  id: string;
  label: string;
  description: string;
}

export interface RegexMatch {
  fullMatch: string;
  index: number;
  groups: string[];
  groupNames: (string | null)[];
}

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
