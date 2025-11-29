/**
 * Blastoff Shell
 * Main layout with side panel and primary panel
 */

"use client";

import { useBlastoffContext } from "../model/BlastoffProvider";

import { DocumentList } from "./DocumentList";
import { WorkspacePanel } from "./WorkspacePanel";

export function BlastoffShell() {
  const { mounted, documents } = useBlastoffContext();

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-zinc-400 dark:text-zinc-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Left Panel - Document List (full height, touches left edge) */}
      {documents.length > 0 && (
        <aside className="w-64 shrink-0 -ml-6 sticky top-0 self-start h-screen overflow-y-auto">
          <DocumentList />
        </aside>
      )}

      {/* Primary Panel - Workspace */}
      <main className={`flex-1 min-w-0 ${documents.length > 0 ? "pl-6" : ""}`}>
        <WorkspacePanel />
      </main>
    </div>
  );
}
