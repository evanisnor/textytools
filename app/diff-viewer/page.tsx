"use client";

import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";
import { DiffViewerShell, useDiffViewer } from "@/features/diff-viewer";
import { TOOL_NAMES } from "@/shared/lib/constants";

export default function DiffViewer() {
  const diff = useDiffViewer();

  // Get diff stats
  const stats = {
    added: diff.diffLines.filter((l) => l.type === "added").length,
    removed: diff.diffLines.filter((l) => l.type === "removed").length,
    modified: diff.diffLines.filter((l) => l.type === "modified").length,
  };

  return (
    <ToolFrame
      title="Diff Viewer"
      description="Compare two text blocks with side-by-side diff highlighting and search"
      toolName={TOOL_NAMES.DIFF_VIEWER}
      maxWidth="7xl"
      headerRight={
        <div className="grid grid-cols-3 gap-3 lg:min-w-[350px]">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Added
            </div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {stats.added}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Removed
            </div>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">
              {stats.removed}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Modified
            </div>
            <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.modified}
            </div>
          </div>
        </div>
      }
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
