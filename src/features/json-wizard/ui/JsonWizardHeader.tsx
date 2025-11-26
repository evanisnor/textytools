"use client";

interface JsonWizardHeaderProps {
  keys: number;
  depth: number;
  size: number;
  isValid: boolean;
  hasInput: boolean;
  mounted: boolean;
}

export function JsonWizardHeader({
  keys,
  depth,
  size,
  isValid,
  hasInput,
  mounted,
}: JsonWizardHeaderProps) {
  return (
    <div className="grid grid-cols-3 gap-3 lg:min-w-[400px]">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
        <div className="text-xs text-zinc-600 dark:text-zinc-400">
          Total Keys
        </div>
        <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {mounted && isValid && hasInput ? keys.toLocaleString() : "—"}
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
        <div className="text-xs text-zinc-600 dark:text-zinc-400">
          Max Depth
        </div>
        <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {mounted && isValid && hasInput ? depth : "—"}
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
        <div className="text-xs text-zinc-600 dark:text-zinc-400">Size</div>
        <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {mounted && isValid && hasInput ? `${size.toLocaleString()} bytes` : "—"}
        </div>
      </div>
    </div>
  );
}
