"use client";

import { useCallback } from "react";

import type { PropertySchema } from "../model/types";

interface ConfigurationPanelProps {
  schema: PropertySchema[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

/**
 * ConfigurationPanel - Schema-driven form generation
 *
 * Automatically renders form controls based on PropertySchema definitions.
 * Supports text, number, select, toggle, toggle-group, and multi-select inputs.
 *
 * @example
 * ```tsx
 * <ConfigurationPanel
 *   schema={transform.propertySchema}
 *   values={step.properties}
 *   onChange={(key, value) => updateProperty(stepId, key, value)}
 * />
 * ```
 */
export function ConfigurationPanel({
  schema,
  values,
  onChange,
}: ConfigurationPanelProps) {
  if (schema.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-zinc-500">
        No configuration options available
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 py-3">
      {schema.map((property) => (
        <PropertyControl
          key={property.key}
          property={property}
          value={values[property.key] ?? property.defaultValue}
          onChange={(value) => onChange(property.key, value)}
        />
      ))}
    </div>
  );
}

interface PropertyControlProps {
  property: PropertySchema;
  value: unknown;
  onChange: (value: unknown) => void;
}

function PropertyControl({ property, value, onChange }: PropertyControlProps) {
  const handleChange = useCallback(
    (newValue: unknown) => {
      onChange(newValue);
    },
    [onChange],
  );

  switch (property.type) {
    case "text":
      return (
        <TextControl
          property={property}
          value={value as string}
          onChange={handleChange}
        />
      );

    case "number":
      return (
        <NumberControl
          property={property}
          value={value as number}
          onChange={handleChange}
        />
      );

    case "select":
      return (
        <SelectControl
          property={property}
          value={value}
          onChange={handleChange}
        />
      );

    case "toggle":
      return (
        <ToggleControl
          property={property}
          value={value as boolean}
          onChange={handleChange}
        />
      );

    case "toggle-group":
      return (
        <ToggleGroupControl
          property={property}
          value={value}
          onChange={handleChange}
        />
      );

    case "multi-select":
      return (
        <MultiSelectControl
          property={property}
          value={value as unknown[]}
          onChange={handleChange}
        />
      );

    default:
      return (
        <div className="text-sm text-red-500">
          Unknown control type: {property.type}
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
    <div>
      <label htmlFor={property.key} className="block text-sm font-medium mb-1">
        {property.label}
      </label>
      <input
        id={property.key}
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={property.label}
      />
    </div>
  );
}

interface NumberControlProps {
  property: PropertySchema;
  value: number;
  onChange: (value: number) => void;
}

function NumberControl({ property, value, onChange }: NumberControlProps) {
  return (
    <div>
      <label htmlFor={property.key} className="block text-sm font-medium mb-1">
        {property.label}
      </label>
      <input
        id={property.key}
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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
    <div>
      <label htmlFor={property.key} className="block text-sm font-medium mb-1">
        {property.label}
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
        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

interface ToggleControlProps {
  property: PropertySchema;
  value: boolean;
  onChange: (value: boolean) => void;
}

function ToggleControl({ property, value, onChange }: ToggleControlProps) {
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={property.key} className="text-sm font-medium">
        {property.label}
      </label>
      <button
        id={property.key}
        type="button"
        role="switch"
        aria-checked={value ?? false}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          value ? "bg-blue-600" : "bg-zinc-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

interface ToggleGroupControlProps {
  property: PropertySchema;
  value: unknown;
  onChange: (value: unknown) => void;
}

function ToggleGroupControl({
  property,
  value,
  onChange,
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

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{property.label}</label>
      <div className="space-y-2">
        {normalizedOptions.map((option) => (
          <label
            key={String(option.value)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="radio"
              name={property.key}
              value={String(option.value)}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface MultiSelectControlProps {
  property: PropertySchema;
  value: unknown[];
  onChange: (value: unknown[]) => void;
}

function MultiSelectControl({
  property,
  value,
  onChange,
}: MultiSelectControlProps) {
  if (!property.options || property.options.length === 0) {
    return (
      <div className="text-sm text-red-500">
        Multi-select requires options array
      </div>
    );
  }

  // Normalize options to { value, label } format
  const normalizedOptions = property.options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );

  const handleToggle = (optionValue: unknown) => {
    const currentValues = value ?? [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue];
    onChange(newValues);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{property.label}</label>
      <div className="space-y-2">
        {normalizedOptions.map((option) => (
          <label
            key={String(option.value)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={String(option.value)}
              checked={(value ?? []).includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
