export interface RegexFlag {
  id: string;
  label: string;
  description: string;
}

export interface RegexMatch {
  fullMatch: string;
  groups: string[];
  namedGroups: Record<string, string | undefined>;
  groupNames: (string | null)[]; // Array mapping group index to name (null if unnamed)
  index: number;
  length: number;
}
