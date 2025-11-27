import { useRegexTesterContext } from "../model/RegexTesterProvider";

export function RegexTesterHeader() {
  const { matches, captureGroupCount, mounted } = useRegexTesterContext();
  const matchCount = matches.length;
  return (
    <div className="grid grid-cols-2 gap-3 min-w-[220px]">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
        <div className="text-xs text-zinc-600 dark:text-zinc-400">Matches</div>
        <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {mounted ? matchCount.toLocaleString() : "—"}
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
        <div className="text-xs text-zinc-600 dark:text-zinc-400">Groups</div>
        <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {mounted ? captureGroupCount.toLocaleString() : "—"}
        </div>
      </div>
    </div>
  );
}
