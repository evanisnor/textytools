import type { ViewMode } from "../model/types";

interface ViewModeControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  disabled: boolean;
  hasInput: boolean;
}

export function ViewModeControls({
  viewMode,
  onViewModeChange,
  disabled,
  hasInput,
}: ViewModeControlsProps) {
  const buttonClass = (isActive: boolean) =>
    `px-3 py-2 rounded-lg border text-sm transition-colors ${
      isActive
        ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-zinc-900 dark:border-zinc-50"
        : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`;

  return (
    <>
      <button
        onClick={() => onViewModeChange("pretty")}
        disabled={disabled}
        className={buttonClass(viewMode === "pretty")}
      >
        Pretty Print
      </button>
      <button
        onClick={() => onViewModeChange("minified")}
        disabled={disabled}
        className={buttonClass(viewMode === "minified")}
      >
        Minified
      </button>
      <button
        onClick={() => onViewModeChange("escaped")}
        disabled={disabled || !hasInput}
        className={buttonClass(viewMode === "escaped")}
      >
        Escaped
      </button>
    </>
  );
}
