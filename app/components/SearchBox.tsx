"use client";

export interface SearchBoxProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * SearchBox - A reusable search input with an inline clear button
 *
 * Features:
 * - Shows a clear button (X icon) on the right when value is not empty
 * - Handles Enter key for quick navigation
 * - Fully accessible with proper labeling
 * - Consistent styling with the design system
 *
 * @example
 * ```tsx
 * <SearchBox
 *   id="my-search"
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   onEnter={goToNextMatch}
 *   placeholder="Search..."
 * />
 * ```
 */
export function SearchBox({
  id,
  value,
  onChange,
  onEnter,
  placeholder = "Search...",
  disabled = false,
  className = "",
}: SearchBoxProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            e.preventDefault();
            onEnter();
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-2 pr-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
      />
      {value && !disabled && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors cursor-pointer"
          title="Clear search"
          type="button"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
