/**
 * Blastoff Page
 * New document creation page
 */

"use client";

import { BlastoffProvider, BlastoffShell } from "@/features/blastoff";

export default function BlastoffPage() {
  return (
    <BlastoffProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Blastoff</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Linear transform pipeline for text and data
            </p>
          </div>

          {/* Shell */}
          <BlastoffShell />
        </div>
      </div>
    </BlastoffProvider>
  );
}
