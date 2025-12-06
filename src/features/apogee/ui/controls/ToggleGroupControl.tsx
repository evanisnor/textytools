import type { PropertySchema } from "../../model/types";

interface ToggleGroupControlProps {
  property: PropertySchema;
  value: unknown;
  onChange: (value: unknown) => void;
  variant?: "default" | "lens";
}

export function ToggleGroupControl({
  property,
  value,
  onChange,
  variant = "default",
}: ToggleGroupControlProps) {
  if (!property.options || property.options.length === 0) {
    return (
      <div className="text-sm text-red-500">
        Toggle group requires options array
      </div>
    );
  }

  // Normalize options to { value, label } format
  const normalizedOptions = property.options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );

  const labelClass =
    variant === "lens"
      ? "text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-20"
      : "text-xs text-zinc-500 dark:text-zinc-400 mr-1";

  const activeClass =
    variant === "lens"
      ? "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
      : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300";

  const inactiveClass =
    "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600";

  const containerClass = variant === "lens" ? "gap-2" : "gap-1";

  return (
    <div className={`flex items-center ${containerClass}`}>
      <span className={labelClass}>{property.label}:</span>
      <div className="flex gap-1">
        {normalizedOptions.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              value === option.value ? activeClass : inactiveClass
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
