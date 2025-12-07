"use client";

import { useCallback, useRef, useEffect, useState } from "react";

import type { PropertySchema } from "../model/types";

import { ToggleGroupControl } from "./controls/ToggleGroupControl";

import { Modal } from "@/shared/ui/modal/Modal";

interface ConfigurationPanelProps {
  schema: PropertySchema[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onBatchChange?: (updates: Record<string, unknown>) => void;
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
  onBatchChange,
}: ConfigurationPanelProps) {
  // Use ref to access current values without causing re-renders
  const valuesRef = useRef(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  // Handle combined toggle value and order update
  const handleToggleWithOrder = useCallback(
    (key: string, newValue: boolean) => {
      const currentOrder = (valuesRef.current._optionOrder as string[]) || [];
      const updatedOrder = newValue
        ? currentOrder.includes(key)
          ? currentOrder
          : [...currentOrder, key]
        : currentOrder.filter((k) => k !== key);

      // Use batch update if available to update both properties atomically
      if (
        onBatchChange &&
        JSON.stringify(currentOrder) !== JSON.stringify(updatedOrder)
      ) {
        onBatchChange({
          [key]: newValue,
          _optionOrder: updatedOrder,
        });
      } else {
        onChange(key, newValue);
      }
    },
    [onChange, onBatchChange],
  );

  // Filter properties based on showWhen conditions and exclude lens properties
  const visibleSchema = schema.filter((property) => {
    // Exclude properties shown in Lens
    if (property.showInLens === true) {
      return false;
    }

    if (!property.showWhen) {
      return true;
    }

    // Check if all conditions in showWhen are met
    return Object.entries(property.showWhen).every(([key, expectedValue]) => {
      const actualValue = values[key];

      // If expectedValue is an array, check if actualValue matches ANY of the values
      if (Array.isArray(expectedValue)) {
        return expectedValue.includes(actualValue);
      }

      return actualValue === expectedValue;
    });
  });

  if (visibleSchema.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-zinc-500">
        No configuration options available
      </div>
    );
  }

  // Group properties into rows based on flex-start markers
  const rows: PropertySchema[][] = [];
  let currentRow: PropertySchema[] = [];

  visibleSchema.forEach((property) => {
    const width = property.width ?? "auto";

    if (width === "flex-start") {
      // Start a new row
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [property];
    } else if (
      (width === "flex" || width === "auto") &&
      currentRow.length > 0
    ) {
      // Add to current row if it was started by flex-start or flex
      const firstInRow = currentRow[0];
      if (firstInRow.width === "flex-start" || firstInRow.width === "flex") {
        currentRow.push(property);
      } else {
        // Start a new row if current row doesn't support flex
        rows.push(currentRow);
        currentRow = [property];
      }
    } else {
      // Non-flex items (full width) get their own row
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [property];
    }
  });

  // Add the last row
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      {rows.map((row, rowIndex) => {
        const isFlexRow =
          row.length > 1 &&
          row.some((p) => p.width === "flex-start" || p.width === "flex");

        return (
          <div
            key={rowIndex}
            className={isFlexRow ? "flex gap-2" : "flex flex-wrap gap-2"}
          >
            {row.map((property) => (
              <PropertyControl
                key={property.key}
                property={property}
                value={values[property.key] ?? property.defaultValue}
                onChange={(value) => onChange(property.key, value)}
                onToggleWithOrder={handleToggleWithOrder}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

interface PropertyControlProps {
  property: PropertySchema;
  value: unknown;
  onChange: (value: unknown) => void;
  onToggleWithOrder?: (key: string, newValue: boolean) => void;
}

function PropertyControl({
  property,
  value,
  onChange,
  onToggleWithOrder,
}: PropertyControlProps) {
  switch (property.type) {
    case "text":
      return (
        <TextControl
          property={property}
          value={value as string}
          onChange={onChange}
        />
      );

    case "number":
      return (
        <NumberControl
          property={property}
          value={value as number}
          onChange={onChange}
        />
      );

    case "select":
      return (
        <SelectControl property={property} value={value} onChange={onChange} />
      );

    case "toggle":
      return (
        <ToggleControl
          property={property}
          value={value as boolean}
          onToggleWithOrder={onToggleWithOrder}
        />
      );

    case "toggle-group":
      return (
        <ToggleGroupControl
          property={property}
          value={value}
          onChange={onChange}
        />
      );

    case "multi-select":
      return (
        <MultiSelectControl
          property={property}
          value={value as unknown[]}
          onChange={onChange}
        />
      );

    case "help":
      return <HelpControl property={property} />;

    case "modal-link":
      return <ModalLinkControl property={property} />;

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
  const width = property.width ?? "full";

  // Map width to container and input classes
  const containerClass =
    width === "full"
      ? "w-full"
      : width === "flex" || width === "flex-start"
        ? "flex-1"
        : "w-auto";

  const inputClass =
    width === "full" || width === "flex" || width === "flex-start"
      ? "flex-1"
      : "w-16";

  return (
    <div className={`flex flex-col gap-0.5 ${containerClass}`}>
      <div className="flex items-center gap-1">
        {property.label && (
          <label
            htmlFor={property.key}
            className="text-xs text-zinc-500 dark:text-zinc-400"
          >
            {property.label}:
          </label>
        )}
        <input
          id={property.key}
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={`px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
          placeholder={property.placeholder || property.label}
        />
      </div>
      {property.helpText && (
        <div className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">
          {property.helpText}
        </div>
      )}
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
    <div className="flex items-center gap-1">
      {property.label && (
        <label
          htmlFor={property.key}
          className="text-xs text-zinc-500 dark:text-zinc-400"
        >
          {property.label}:
        </label>
      )}
      <input
        id={property.key}
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

  const width = property.width ?? "auto";

  // Map width to container classes
  const containerClass =
    width === "full"
      ? "w-full"
      : width === "flex" || width === "flex-start"
        ? "flex-1"
        : "w-auto";

  // Normalize options to { value, label } format
  const normalizedOptions = property.options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );

  return (
    <div className={`flex items-center gap-1 ${containerClass}`}>
      {property.label && (
        <label
          htmlFor={property.key}
          className="text-xs text-zinc-500 dark:text-zinc-400"
        >
          {property.label}:
        </label>
      )}
      <select
        id={property.key}
        value={String(value ?? property.defaultValue)}
        onChange={(e) => {
          const option = normalizedOptions.find(
            (opt) => String(opt.value) === e.target.value,
          );
          onChange(option?.value);
        }}
        className={`px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          width === "full" || width === "flex" || width === "flex-start"
            ? "flex-1"
            : ""
        }`}
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
  onToggleWithOrder?: (key: string, newValue: boolean) => void;
}

function ToggleControl({
  property,
  value,
  onToggleWithOrder,
}: ToggleControlProps) {
  const handleClick = useCallback(() => {
    const newValue = !value;
    if (onToggleWithOrder) {
      onToggleWithOrder(property.key, newValue);
    }
  }, [value, onToggleWithOrder, property.key]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`px-3 py-1.5 text-xs rounded transition-colors ${
        value
          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
          : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
      }`}
      title={
        property.label
          ? value
            ? `Disable ${property.label}`
            : `Enable ${property.label}`
          : undefined
      }
    >
      {property.label}
    </button>
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
    <div className="flex flex-col gap-0.5 w-full">
      <div className="flex items-center gap-1 flex-wrap">
        {property.label && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-1">
            {property.label}:
          </span>
        )}
        {normalizedOptions.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              (value ?? []).includes(option.value)
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {property.helpText && (
        <div className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">
          {property.helpText}
        </div>
      )}
    </div>
  );
}

interface HelpControlProps {
  property: PropertySchema;
}

function HelpControl({ property }: HelpControlProps) {
  if (!property.helpText) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="text-xs text-zinc-400 dark:text-zinc-500">
        {property.label && (
          <>
            <span className="font-medium text-zinc-500 dark:text-zinc-400">
              {property.label}:
            </span>{" "}
          </>
        )}
        {property.helpText}
      </div>
    </div>
  );
}

interface ModalLinkControlProps {
  property: PropertySchema;
}

function ModalLinkControl({ property }: ModalLinkControlProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!property.modalContent) {
    return null;
  }

  return (
    <>
      <div className="w-full">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline focus:outline-none cursor-pointer"
        >
          {property.label}
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {property.modalContent}
      </Modal>
    </>
  );
}
