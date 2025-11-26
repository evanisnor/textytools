import type { ViewMode } from "../model/types";

interface OptionsControlsProps {
  sortKeys: boolean;
  onSortKeysToggle: () => void;
  indentSize: number;
  onIndentSizeChange: (size: number) => void;
  viewMode: ViewMode;
  disabled: boolean;
}

export function OptionsControls({
  sortKeys,
  onSortKeysToggle,
  indentSize,
  onIndentSizeChange,
  viewMode,
  disabled,
}: OptionsControlsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onSortKeysToggle}
        disabled={disabled}
        aria-pressed={sortKeys}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
          sortKeys
            ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-zinc-900 dark:border-zinc-50"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="font-semibold tracking-wide">Sort Keys</span>
      </button>

      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 min-w-[200px]">
        <label
          htmlFor="indent-size"
          className="text-sm text-zinc-900 dark:text-zinc-50 whitespace-nowrap"
        >
          Indent: {indentSize}
        </label>
        <input
          id="indent-size"
          type="range"
          min="2"
          max="8"
          step="2"
          value={indentSize}
          onChange={(e) => onIndentSizeChange(Number(e.target.value))}
          disabled={viewMode !== "pretty" || disabled}
          className="flex-1 sm:w-28"
        />
      </div>
    </>
  );
}
