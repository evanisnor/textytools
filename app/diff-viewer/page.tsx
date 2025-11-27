"use client";

import {
  DiffViewerShell,
  DiffViewerHeader,
  useDiffViewer,
} from "@/features/diff-viewer";

import { TOOL_NAMES } from "@/shared/lib/constants";
import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";

export default function DiffViewer() {
  const diff = useDiffViewer();

  return (
    <ToolFrame
      title="Diff Viewer"
      description="Compare two text blocks with side-by-side diff highlighting and search"
      toolName={TOOL_NAMES.DIFF_VIEWER}
      maxWidth="7xl"
      headerRight={<DiffViewerHeader stats={diff.stats} />}
    >
      <DiffViewerShell
        input={diff.input}
        setInput={diff.setInput}
        output={diff.output}
        setOutput={diff.setOutput}
        searchTerm={diff.searchTerm}
        setSearchTerm={diff.setSearchTerm}
        caseSensitive={diff.caseSensitive}
        setCaseSensitive={diff.setCaseSensitive}
        currentMatchIndex={diff.currentMatchIndex}
        setCurrentMatchIndex={diff.setCurrentMatchIndex}
        diffLines={diff.diffLines}
        searchMatches={diff.searchMatches}
        totalMatches={diff.totalMatches}
        inputMatchMap={diff.inputMatchMap}
        outputMatchMap={diff.outputMatchMap}
        goToNextMatch={diff.goToNextMatch}
        goToPreviousMatch={diff.goToPreviousMatch}
      />
    </ToolFrame>
  );
}
