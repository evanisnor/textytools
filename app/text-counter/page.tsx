"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { Tiktoken } from "js-tiktoken/lite";
import cl100k_base from "js-tiktoken/ranks/cl100k_base";

export default function TextCounter() {
  const [text, setText] = useState("");
  const [textTrimmed, setTextTrimmed] = useState("");
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            ← back to textytools.dev
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Text Counter
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Paste or type text below to see character, word, line, paragraph,
            and AI token counts in real-time.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Characters
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {characterCount.toLocaleString()}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Words
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {wordCount}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Lines
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {lineCount.toLocaleString()}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Paragraphs
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {paragraphCount}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Tokens (GPT-4+)
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {tokenCount}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Input Text
            </label>
            {text.trim() && (
              <button
                onClick={() => setText("")}
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="w-full h-96 p-4 bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none focus:outline-none font-mono text-sm"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
