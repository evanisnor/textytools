"use client";

import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { Tiktoken } from "js-tiktoken/lite";
import cl100k_base from "js-tiktoken/ranks/cl100k_base";
import { TextEditorContainer } from "@/app/components/TextEditorContainer";
import { ToolFrame } from "@/app/components/ToolFrame";
import { TOOL_NAMES } from "@/app/lib/constants";

export default function TextCounter() {
  const [text, setText] = useState("");
  const [textTrimmed, setTextTrimmed] = useState("");
  const [mounted, setMounted] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const persistedState = sessionStorage.getItem("text-counter-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.text !== undefined) setText(state.text);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state whenever text changes
  useEffect(() => {
    if (!mounted) return;
    const state = { text };
    sessionStorage.setItem("text-counter-state", JSON.stringify(state));
  }, [text, mounted]);

  useEffect(() => {
    setTextTrimmed(text.trim());
  }, [text]);

  const characterCount = text.length;
  const lineCount = text === "" ? 0 : text.split("\n").length;
  const [wordCount, setWordCount] = useState("0");
  const [paragraphCount, setParagraphCount] = useState("0");
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [tokenCount, setTokenCount] = useState("0");

  // Word Counting
  useEffect(() => {
    if (textTrimmed === "") {
      setWordCount("0");
    } else {
      setWordCount(textTrimmed.split(/\s+/).length.toLocaleString());
    }
  }, [textTrimmed]);

  // Paragraph Counting
  useEffect(() => {
    if (textTrimmed === "") {
      setParagraphCount("0");
    } else {
      const count = textTrimmed
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0).length;
      setParagraphCount(count.toLocaleString());
    }
  }, [textTrimmed]);

  // Token Counting
  useEffect(() => {
    if (!isTokenizing) {
      debounce(tokenize, 100)();
    }
    return;

    async function tokenize() {
      if (isTokenizing) {
        setTokenCount("...");
        return;
      } else if (textTrimmed === "") {
        setTokenCount("0");
        setIsTokenizing(false);
      } else {
        setIsTokenizing(true);
        try {
          const encoding = new Tiktoken(cl100k_base);
          const tokens = encoding.encode(textTrimmed);
          setTokenCount(tokens.length.toLocaleString());
        } catch (error) {
          console.error("Error encoding tokens:", error);
          setTokenCount("ERR");
        }
        setIsTokenizing(false);
      }
    }
  }, [textTrimmed, isTokenizing]);

  return (
    <ToolFrame
      title="Text Counter"
      description="Paste or type text below to see character, word, line, paragraph, and AI token counts in real-time."
      toolName={TOOL_NAMES.TEXT_COUNTER}
      headerRight={
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:min-w-[700px]">
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
      }
    >
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
    </ToolFrame>
  );
}
