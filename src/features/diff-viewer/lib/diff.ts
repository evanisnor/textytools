import { diffLines } from "diff";
import type { DiffLine } from "../model/types";

export const splitIntoLines = (value: string, count?: number): string[] => {
  if (value === "") {
    return count ? Array.from({ length: count }, () => "") : [];
  }

  const lines = value.split("\n");
  if (lines.length && lines[lines.length - 1] === "") {
    lines.pop();
  }

  const expectedLength = count ?? lines.length;
  while (lines.length < expectedLength) {
    lines.push("");
  }

  return lines;
};

// Use a real diff algorithm so insertions/deletions no longer misalign all following lines.
export function computeDiff(input: string, output: string): DiffLine[] {
  if (!input && !output) {
    return [];
  }

  const structuredDiff = diffLines(input, output);
  const result: DiffLine[] = [];

  let inputLineNumber = 1;
  let outputLineNumber = 1;

  for (let i = 0; i < structuredDiff.length; i++) {
    const part = structuredDiff[i];
    const partLines = splitIntoLines(part.value, part.count);

    // Pair removed blocks that are immediately followed by added blocks and treat them as modifications.
    if (part.removed && structuredDiff[i + 1]?.added) {
      const addedPart = structuredDiff[i + 1];
      const addedLines = splitIntoLines(addedPart.value, addedPart.count);
      const maxLen = Math.max(partLines.length, addedLines.length);

      let localInputOffset = 0;
      let localOutputOffset = 0;

      for (let lineIndex = 0; lineIndex < maxLen; lineIndex++) {
        const hasInput = lineIndex < partLines.length;
        const hasOutput = lineIndex < addedLines.length;
        const inputContent = hasInput ? partLines[lineIndex] : "";
        const outputContent = hasOutput ? addedLines[lineIndex] : "";

        const currentInputLine = hasInput
          ? inputLineNumber + localInputOffset
          : null;
        const currentOutputLine = hasOutput
          ? outputLineNumber + localOutputOffset
          : null;

        if (hasInput && hasOutput) {
          result.push({
            type: "modified",
            inputLineNumber: currentInputLine,
            outputLineNumber: currentOutputLine,
            inputContent,
            outputContent,
          });
        } else if (hasInput) {
          result.push({
            type: "removed",
            inputLineNumber: currentInputLine,
            outputLineNumber: null,
            inputContent,
            outputContent: "",
          });
        } else if (hasOutput) {
          result.push({
            type: "added",
            inputLineNumber: null,
            outputLineNumber: currentOutputLine,
            inputContent: "",
            outputContent,
          });
        }

        if (hasInput) localInputOffset++;
        if (hasOutput) localOutputOffset++;
      }

      inputLineNumber += partLines.length;
      outputLineNumber += addedLines.length;
      i++; // Skip the added block we just consumed
      continue;
    }

    if (part.removed) {
      partLines.forEach((line) => {
        result.push({
          type: "removed",
          inputLineNumber,
          outputLineNumber: null,
          inputContent: line,
          outputContent: "",
        });
        inputLineNumber++;
      });
      continue;
    }

    if (part.added) {
      partLines.forEach((line) => {
        result.push({
          type: "added",
          inputLineNumber: null,
          outputLineNumber,
          inputContent: "",
          outputContent: line,
        });
        outputLineNumber++;
      });
      continue;
    }

    partLines.forEach((line) => {
      result.push({
        type: "unchanged",
        inputLineNumber,
        outputLineNumber,
        inputContent: line,
        outputContent: line,
      });
      inputLineNumber++;
      outputLineNumber++;
    });
  }

  return result;
}
