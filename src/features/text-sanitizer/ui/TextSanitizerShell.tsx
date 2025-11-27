"use client";

import { useTextSanitizer } from "../model/useTextSanitizer";

import {
  trackCopyEvent,
  trackClearEvent,
  trackToggleAllEvent,
} from "@/shared/lib/analytics";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { TextEditorContainer } from "@/shared/ui/text-editor/TextEditorContainer";
import { useToast } from "@/shared/ui/toast/Toast";

export function TextSanitizerShell() {
  const {
    text,
    setText,
    options,
    sanitizedText,
    toggleOption,
    enableAll,
    disableAll,
    activeCount,
  } = useTextSanitizer();

  const { showToast, ToastComponent } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sanitizedText);
      showToast("Copied to clipboard");
      const enabledOptions = options
        .filter((opt) => opt.enabled)
        .map((opt) => opt.id);
      trackCopyEvent({
        tool: TOOL_NAMES.TEXT_SANITIZER,
        options: enabledOptions,
        optionsCount: enabledOptions.length,
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
                htmlFor="text-sanitizer-input"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Input Text
              </label>
              {text.trim() && (
                <button
                  onClick={() => {
                    const enabledOptions = options
                      .filter((opt) => opt.enabled)
                      .map((opt) => opt.id);
                    trackClearEvent({
                      tool: TOOL_NAMES.TEXT_SANITIZER,
                      enabledOptions,
                      optionsCount: enabledOptions.length,
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
            <TextEditorContainer
              id="text-sanitizer-input"
              value={text}
              onChange={setText}
              placeholder="Paste or type your text here..."
              height="h-64"
              showLineNumbers={false}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 min-h-9">
              <label
                htmlFor="text-sanitizer-output"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Sanitized Text{" "}
                {activeCount > 0 && (
                  <span className="text-xs font-normal text-zinc-500">
                    ({activeCount} {activeCount === 1 ? "filter" : "filters"}{" "}
                    active)
                  </span>
                )}
              </label>
              {sanitizedText && (
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
            <TextEditorContainer
              id="text-sanitizer-output"
              value={sanitizedText}
              readOnly
              placeholder="Sanitized text will appear here..."
              height="h-64"
              showLineNumbers={false}
            />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2 min-h-9">
            <div className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Sanitization Options
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  enableAll();
                  trackToggleAllEvent({
                    tool: TOOL_NAMES.TEXT_SANITIZER,
                    action: "enable",
                  });
                }}
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
              >
                Enable all
              </button>
              <span className="text-xs text-zinc-400">•</span>
              <button
                onClick={() => {
                  disableAll();
                  trackToggleAllEvent({
                    tool: TOOL_NAMES.TEXT_SANITIZER,
                    action: "disable",
                  });
                }}
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
              >
                Disable all
              </button>
            </div>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto pr-2">
            {options.map((option) => (
              <label
                key={option.id}
                htmlFor={`sanitizer-${option.id}`}
                className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <input
                  id={`sanitizer-${option.id}`}
                  type="checkbox"
                  checked={option.enabled}
                  onChange={() => toggleOption(option.id)}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {option.label}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
      {ToastComponent}
    </>
  );
}
