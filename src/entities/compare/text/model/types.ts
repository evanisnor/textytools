export type DiffType = "unchanged" | "added" | "removed" | "modified";

export interface DiffLine {
  type: DiffType;
  inputLineNumber: number | null; // null for added lines
  outputLineNumber: number | null; // null for removed lines
  inputContent: string;
  outputContent: string;
}
