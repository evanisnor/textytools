"use client";

import { useTextCounter } from "../model/useTextCounter";

import { TextEditorContainer } from "@/shared/ui/text-editor/TextEditorContainer";

export function TextCounterShell() {
  const {
    text,
    setText,
    characterCount,
    wordCount,
    lineCount,
    paragraphCount,
    tokenCount,
  } = useTextCounter();

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
            Characters
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {characterCount.toLocaleString()}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
            Words
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {wordCount}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
            Lines
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {lineCount.toLocaleString()}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
            Paragraphs
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {paragraphCount}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
            Tokens (GPT-4+)
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {tokenCount}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2 min-h-9">
          <label
            htmlFor="text-counter-input"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Input Text
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
          id="text-counter-input"
          value={text}
          onChange={setText}
          placeholder="Paste or type your text here..."
          height="h-96"
          wrap={true}
        />
      </div>
    </>
  );
}
