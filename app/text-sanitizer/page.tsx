"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/app/components/Toast";
import { TextEditorContainer } from "@/app/components/TextEditorContainer";
import { ToolFrame } from "@/app/components/ToolFrame";
import {
  trackCopyEvent,
  trackClearEvent,
  trackToggleAllEvent,
} from "@/app/lib/analytics";
import { TOOL_NAMES } from "@/app/lib/constants";

interface SanitizationOption {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const defaultOptions: SanitizationOption[] = [
  {
    id: "trimLines",
    label: "Trim Lines",
    description: "Remove leading and trailing whitespace from each line",
    enabled: false,
  },
  {
    id: "removeEmptyLines",
    label: "Remove Empty Lines",
    description: "Delete all blank lines from the text",
    enabled: false,
  },
  {
    id: "removeDuplicateLines",
    label: "Remove Duplicate Lines",
    description: "Keep only unique lines, removing duplicates",
    enabled: false,
  },
  {
    id: "removeExtraSpaces",
    label: "Remove Extra Spaces",
    description: "Replace multiple spaces with a single space",
    enabled: false,
  },
  {
    id: "removeNonAscii",
    label: "Remove Non-ASCII",
    description: "Strip all non-ASCII characters (keeps only 0-127)",
    enabled: false,
  },
  {
    id: "removeEmoji",
    label: "Remove Emoji",
    description: "Remove all emoji characters",
    enabled: false,
  },
  {
    id: "removeNumbers",
    label: "Remove Numbers",
    description: "Strip all numeric digits (0-9)",
    enabled: false,
  },
  {
    id: "removePunctuation",
    label: "Remove Punctuation",
    description: "Remove all punctuation marks",
    enabled: false,
  },
  {
    id: "removeSpecialChars",
    label: "Remove Special Characters",
    description: "Keep only letters, numbers, and basic whitespace",
    enabled: false,
  },
  {
    id: "normalizeWhitespace",
    label: "Normalize Whitespace",
    description: "Convert all whitespace (tabs, newlines) to single spaces",
    enabled: false,
  },
  {
    id: "sortLines",
    label: "Sort Lines",
    description: "Sort all lines alphabetically",
    enabled: false,
  },
  {
    id: "reverseLines",
    label: "Reverse Lines",
    description: "Reverse the order of lines",
    enabled: false,
  },
];

function sanitizeText(text: string, options: SanitizationOption[]): string {
  let result = text;

  const enabledOptions = options.filter((opt) => opt.enabled);

  for (const option of enabledOptions) {
    switch (option.id) {
      case "trimLines":
        result = result
          .split("\n")
          .map((line) => line.trim())
          .join("\n");
        break;

      case "removeEmptyLines":
        result = result
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .join("\n");
        break;

      case "removeDuplicateLines":
        const lines = result.split("\n");
        const uniqueLines = [...new Set(lines)];
        result = uniqueLines.join("\n");
        break;

      case "removeExtraSpaces":
        result = result.replace(/ {2,}/g, " ");
        break;

      case "removeNonAscii":
        result = result.replace(/[^\x00-\x7F]/g, "");
        break;

      case "removeEmoji":
        // Unicode ranges for emoji
        result = result.replace(
          /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{200D}]/gu,
          "",
        );
        break;

      case "removeNumbers":
        result = result.replace(/\d/g, "");
        break;

      case "removePunctuation":
        result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"[\]\\|@+]/g, "");
        break;

      case "removeSpecialChars":
        result = result.replace(/[^a-zA-Z0-9\s\n\r\t]/g, "");
        break;

      case "normalizeWhitespace":
        result = result.replace(/\s+/g, " ").trim();
        break;

      case "sortLines":
        result = result
          .split("\n")
          .sort((a, b) => a.localeCompare(b))
          .join("\n");
        break;

      case "reverseLines":
        result = result.split("\n").reverse().join("\n");
        break;
    }
  }

  return result;
}

export default function TextSanitizer() {
  const [text, setText] = useState("");
  const [options, setOptions] = useState<SanitizationOption[]>(defaultOptions);
  const [mounted, setMounted] = useState(false);
  const { showToast, ToastComponent } = useToast();

  // Load persisted state on mount
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const persistedState = sessionStorage.getItem("text-sanitizer-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.text !== undefined) setText(state.text);
          if (state.options !== undefined) setOptions(state.options);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state whenever inputs change
  useEffect(() => {
    if (!mounted) return;
    const state = { text, options };
    sessionStorage.setItem("text-sanitizer-state", JSON.stringify(state));
  }, [text, options, mounted]);

  const sanitizedText = sanitizeText(text, options);

  const toggleOption = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt,
      ),
    );
  };

  const enableAll = () => {
    setOptions((prev) => prev.map((opt) => ({ ...opt, enabled: true })));
    trackToggleAllEvent({ tool: TOOL_NAMES.TEXT_SANITIZER, action: "enable" });
  };

  const disableAll = () => {
    setOptions((prev) => prev.map((opt) => ({ ...opt, enabled: false })));
    trackToggleAllEvent({ tool: TOOL_NAMES.TEXT_SANITIZER, action: "disable" });
  };

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

  const activeCount = options.filter((opt) => opt.enabled).length;

  return (
    <ToolFrame
      title="Text Sanitizer"
      description="Clean and transform your text with customizable sanitization options."
      toolName={TOOL_NAMES.TEXT_SANITIZER}
    >
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors"
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
                onClick={enableAll}
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                Enable all
              </button>
              <span className="text-xs text-zinc-400">•</span>
              <button
                onClick={disableAll}
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
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
    </ToolFrame>
  );
}
