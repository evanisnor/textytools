interface DiffStats {
  added: number;
  removed: number;
  modified: number;
}

interface DiffViewerHeaderProps {
  stats: DiffStats;
}

export function DiffViewerHeader({ stats }: DiffViewerHeaderProps) {
  return (
    <div className="grid grid-cols-3 gap-3 lg:min-w-[350px]">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
        <div className="text-xs text-zinc-600 dark:text-zinc-400">Added</div>
        <div className="text-xl font-bold text-green-600 dark:text-green-400">
          {stats.added}
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
        <div className="text-xs text-zinc-600 dark:text-zinc-400">Removed</div>
        <div className="text-xl font-bold text-red-600 dark:text-red-400">
          {stats.removed}
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
        <div className="text-xs text-zinc-600 dark:text-zinc-400">Modified</div>
        <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
          {stats.modified}
        </div>
      </div>
    </div>
  );
}
