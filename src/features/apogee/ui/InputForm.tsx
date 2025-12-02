"use client";

import { useCallback, useState } from "react";

import { DataBlock } from "./DataBlock";

interface InputFormProps {
  onCreateDocument: (inputData: string, inputType: string) => void;
}

/**
 * InputForm - Initial data entry component
 *
 * Allows users to:
 * - Enter or paste input data
 * - Select input MIME type
 * - Create a new document/pipeline
 *
 * @example
 * ```tsx
 * <InputForm
 *   onCreateDocument={(data, type) => createDocument(data, type)}
 * />
 * ```
 */
export function InputForm({ onCreateDocument }: InputFormProps) {
  const [inputData, setInputData] = useState("");
  const [inputType, setInputType] = useState("text/plain");

  const handleCreate = useCallback(() => {
    if (!inputData.trim()) {
      return;
    }
    onCreateDocument(inputData, inputType);
  }, [inputData, inputType, onCreateDocument]);

  const handleClear = useCallback(() => {
    setInputData("");
  }, []);

  return (
    <div className="space-y-4">
      {/* Input Type Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="input-type" className="text-sm font-medium">
          Input Type:
        </label>
        <select
          id="input-type"
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
          className="px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="text/plain">Plain Text</option>
          <option value="application/json">JSON</option>
          <option value="text/csv">CSV</option>
          <option value="application/xml">XML</option>
          <option value="text/yaml">YAML</option>
          <option value="application/toml">TOML</option>
        </select>
      </div>

      {/* Input Data Block */}
      <DataBlock
        title="Input Data"
        value={inputData}
        onChange={setInputData}
        onClear={handleClear}
        readOnly={false}
      />

      {/* Create Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCreate}
          disabled={!inputData.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Create Pipeline
        </button>
      </div>
    </div>
  );
}
