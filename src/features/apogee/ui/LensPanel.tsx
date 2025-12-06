"use client";

import type { PropertySchema } from "../model/types";

import { ToggleGroupControl } from "./controls/ToggleGroupControl";

interface LensPanelProps {
  schema: PropertySchema[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  inputMimeType?: string;
}

/**
 * Get dynamic label for fieldPath based on input MIME type
 */
function getFieldPathLabel(inputMimeType?: string): string {
  if (!inputMimeType) {
    return "Field Path";
  }

  if (inputMimeType === "application/xml") {
    return "XPath";
  }

  if (inputMimeType === "text/csv") {
    return "CSV Column";
  }

  // JSON, YAML, TOML all use JSONPath
  return "JSONPath";
}

/**
 * LensPanel - Renders properties marked with showInLens
 *
 * Similar to ConfigurationPanel but specifically for lens properties
 * with a different visual style (amber background)
 */
export function LensPanel({
  schema,
  values,
  onChange,
  inputMimeType,
}: LensPanelProps) {
  // Filter to only properties marked with showInLens
  const lensSchema = schema.filter((property) => property.showInLens === true);

  if (lensSchema.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700 bg-amber-50 dark:bg-amber-950/20">
      <div className="px-4 py-3 space-y-3">
        {lensSchema.map((property) => {
          // Override label for fieldPath based on input type
          const effectiveProperty =
            property.key === "fieldPath"
              ? { ...property, label: getFieldPathLabel(inputMimeType) }
              : property;

          return (
            <PropertyControl
              key={property.key}
              property={effectiveProperty}
              value={values[property.key] ?? property.defaultValue}
              onChange={(value) => onChange(property.key, value)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface PropertyControlProps {
  property: PropertySchema;
  value: unknown;
  onChange: (value: unknown) => void;
}

function PropertyControl({ property, value, onChange }: PropertyControlProps) {
  switch (property.type) {
    case "text":
      return (
        <TextControl
          property={property}
          value={value as string}
          onChange={onChange}
        />
      );

    case "select":
      return (
        <SelectControl property={property} value={value} onChange={onChange} />
      );

    case "toggle-group":
      return (
        <ToggleGroupControl
          property={property}
          value={value}
          onChange={onChange}
          variant="lens"
        />
      );

    default:
      return (
        <div className="text-sm text-red-500">
          Unsupported lens control type: {property.type}
        </div>
      );
  }
}

interface TextControlProps {
  property: PropertySchema;
  value: string;
  onChange: (value: string) => void;
}

function TextControl({ property, value, onChange }: TextControlProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <label
          htmlFor={property.key}
          className="text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-20"
        >
          {property.label}:
        </label>
        <input
          id={property.key}
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={property.placeholder || property.label}
          className="flex-1 px-2 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
        />
      </div>
      {property.helpText && (
        <div className="px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400">
          {property.helpText}
        </div>
      )}
    </div>
  );
}

interface SelectControlProps {
  property: PropertySchema;
  value: unknown;
  onChange: (value: unknown) => void;
}

function SelectControl({ property, value, onChange }: SelectControlProps) {
  if (!property.options || property.options.length === 0) {
    return (
      <div className="text-sm text-red-500">Select requires options array</div>
    );
  }

  // Normalize options to { value, label } format
  const normalizedOptions = property.options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={property.key}
        className="text-xs font-medium text-zinc-700 dark:text-zinc-300 min-w-20"
      >
        {property.label}:
      </label>
      <select
        id={property.key}
        value={String(value ?? property.defaultValue)}
        onChange={(e) => {
          const option = normalizedOptions.find(
            (opt) => String(opt.value) === e.target.value,
          );
          onChange(option?.value);
        }}
        className="flex-1 px-2 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        {normalizedOptions.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
