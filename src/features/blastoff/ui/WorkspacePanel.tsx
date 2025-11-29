/**
 * Workspace Panel
 * Main area showing document editor or initial input
 */

"use client";

import { useBlastoffContext } from "../model/BlastoffProvider";

import { DataBlock } from "./DataBlock";
import { TransformPalette } from "./TransformPalette";
import { TransformPipeline } from "./TransformPipeline";

export function WorkspacePanel() {
  const { currentDocument, inputText, setInputText } = useBlastoffContext();

  // Show initial input state when no document
  if (!currentDocument) {
    return (
      <div className="space-y-6">
        {/* Initial Input Block */}
        <DataBlock title="Input" value={inputText} onChange={setInputText} />

        {/* Transform Palette */}
        <TransformPalette />
      </div>
    );
  }

  // Show document editor
  return (
    <div className="space-y-6">
      {/* Transform Pipeline */}
      <TransformPipeline />
    </div>
  );
}
