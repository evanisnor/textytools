"use client";

import {
  DiffViewerProvider,
  DiffViewerShell,
  DiffViewerHeader,
} from "@/features/diff-viewer";

import { TOOL_NAMES } from "@/shared/lib/constants";
import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";

export default function DiffViewer() {
  return (
    <DiffViewerProvider>
      <ToolFrame
        title="Diff Viewer"
        description="Compare two text blocks with side-by-side diff highlighting and search"
        toolName={TOOL_NAMES.DIFF_VIEWER}
        maxWidth="7xl"
        headerRight={<DiffViewerHeader />}
      >
        <DiffViewerShell />
      </ToolFrame>
    </DiffViewerProvider>
  );
}
