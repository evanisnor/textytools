"use client";

import { caseOptions } from "../model/presets";
import { useCaseConverter } from "../model/useCaseConverter";

import { TextEditor } from "@/entities/editor";

import { trackCopyEvent, trackClearEvent } from "@/shared/lib/analytics";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { useToast } from "@/shared/ui/toast/Toast";

export function CaseConverterShell() {
  const { text, setText, selectedCase, setSelectedCase, convertedText } =
    useCaseConverter();
  const { showToast, ToastComponent } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(convertedText);
      showToast("Copied to clipboard");
      trackCopyEvent({
        tool: TOOL_NAMES.CASE_CONVERTER,
        caseType: selectedCase,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:items-start">
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          <div>
            <div className="flex items-center justify-between mb-2 min-h-9">
              <label
                htmlFor="case-converter-input"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Input Text
              </label>
              {text.trim() && (
                <button
                  onClick={() => {
                    trackClearEvent({
                      tool: TOOL_NAMES.CASE_CONVERTER,
                      caseType: selectedCase,
                    });
                    setText("");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear
                </button>
              )}
            </div>
            <TextEditor
              id="case-converter-input"
              value={text}
              onChange={setText}
              placeholder="Paste or type your text here..."
              height="h-48"
              showLineNumbers={false}
              wrap
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 min-h-9">
              <label
                htmlFor="case-converter-output"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Converted Text
              </label>
              {convertedText && (
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </button>
              )}
            </div>
            <TextEditor
              id="case-converter-output"
              value={convertedText}
              readOnly
              placeholder="Converted text will appear here..."
              height="h-48"
              showLineNumbers={false}
              wrap
            />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="mb-2 min-h-9">
            <div className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Select Case Format
            </div>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto pr-2">
            {caseOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedCase(option.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors cursor-pointer ${
                  selectedCase === option.id
                    ? "border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-800"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                  {option.label}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {ToastComponent}
    </>
  );
}
