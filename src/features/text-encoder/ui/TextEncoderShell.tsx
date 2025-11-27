"use client";

import { encodingOptions } from "../model/presets";
import { useTextEncoder } from "../model/useTextEncoder";

import { trackCopyEvent } from "@/shared/lib/analytics";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { TextEditorContainer } from "@/shared/ui/text-editor/TextEditorContainer";
import { useToast } from "@/shared/ui/toast/Toast";


export function TextEncoderShell() {
  const {
    text,
    setText,
    selectedEncoding,
    setSelectedEncoding,
    mode,
    handleModeChange,
    outputText,
  } = useTextEncoder();

  const { showToast, ToastComponent } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      showToast("Copied to clipboard");
      trackCopyEvent({
        tool: TOOL_NAMES.TEXT_ENCODER,
        mode: mode,
        encoding: selectedEncoding,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:items-start">
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleModeChange("encode")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === "encode"
                  ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              } cursor-pointer`}
            >
              Encode
            </button>
            <button
              onClick={() => handleModeChange("decode")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === "decode"
                  ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              } cursor-pointer`}
            >
              Decode
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 min-h-9">
              <label
                htmlFor="text-encoder-input"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {mode === "encode" ? "Plain Text" : "Encoded Text"}
              </label>
              {text.trim() && (
                <button
                  onClick={() => setText("")}
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
              id="text-encoder-input"
              value={text}
              onChange={setText}
              placeholder={
                mode === "encode"
                  ? "Enter text to encode..."
                  : "Enter encoded text to decode..."
              }
              height="h-48"
              showLineNumbers={false}
              wrap={true}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 min-h-9">
              <label
                htmlFor="text-encoder-output"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {mode === "encode" ? "Encoded Output" : "Decoded Output"}
              </label>
              {outputText && !outputText.startsWith("Error:") && (
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
              id="text-encoder-output"
              value={outputText}
              readOnly
              placeholder={
                mode === "encode"
                  ? "Encoded output will appear here..."
                  : "Decoded output will appear here..."
              }
              height="h-48"
              showLineNumbers={false}
              wrap={true}
              className={
                outputText.startsWith("Error:")
                  ? "text-red-600 dark:text-red-400"
                  : ""
              }
            />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="mb-2 min-h-9">
            <div className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Select Encoding Format
            </div>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto pr-2">
            {encodingOptions.map((option) => {
              const isHashFunction = [
                "md5",
                "sha1",
                "sha256",
                "sha512",
              ].includes(option.id);
              const isDisabled = mode === "decode" && isHashFunction;

              return (
                <button
                  key={option.id}
                  onClick={() => !isDisabled && setSelectedEncoding(option.id)}
                  disabled={isDisabled}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                      : selectedEncoding === option.id
                        ? "border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer"
                  }`}
                >
                  <div className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                    {option.label}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    {option.description}
                    {isDisabled && " (encode only)"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {ToastComponent}
    </>
  );
}
