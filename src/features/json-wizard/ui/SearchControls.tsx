import { SearchBox } from "@/shared/ui/search-box/SearchBox";

interface SearchControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEnter: () => void;
  caseSensitive: boolean;
  onCaseSensitiveToggle: () => void;
  canSearch: boolean;
  currentMatchIndex: number;
  totalMatches: number;
  onPreviousMatch: () => void;
  onNextMatch: () => void;
}

export function SearchControls({
  searchTerm,
  onSearchChange,
  onEnter,
  caseSensitive,
  onCaseSensitiveToggle,
  canSearch,
  currentMatchIndex,
  totalMatches,
  onPreviousMatch,
  onNextMatch,
}: SearchControlsProps) {
  return (
    <div className="flex flex-1 min-w-[280px] flex-wrap items-center gap-2 lg:flex-nowrap">
      <div className="flex-1 min-w-[200px] max-w-full xl:max-w-[440px]">
        <SearchBox
          id="json-search"
          value={searchTerm}
          onChange={onSearchChange}
          onEnter={onEnter}
          placeholder="Search in JSON..."
          disabled={!canSearch}
          endAdornment={
            canSearch && searchTerm && totalMatches > 0 ? (
              <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                <button
                  onClick={onPreviousMatch}
                  className="px-1.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Previous match"
                  type="button"
                >
                  ←
                </button>
                <span className="min-w-[60px] text-center text-[11px] font-medium">
                  {currentMatchIndex + 1} / {totalMatches}
                </span>
                <button
                  onClick={onNextMatch}
                  className="px-1.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Next match"
                  type="button"
                >
                  →
                </button>
              </div>
            ) : null
          }
        />
      </div>
      <button
        type="button"
        onClick={onCaseSensitiveToggle}
        disabled={!canSearch}
        aria-label="Case sensitive search"
        title="Case sensitive search"
        aria-pressed={caseSensitive}
        className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
          caseSensitive
            ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-zinc-900 dark:border-zinc-50"
            : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
        } ${!canSearch ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        Aa
      </button>
    </div>
  );
}
