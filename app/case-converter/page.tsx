"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/Toast";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot"
  | "path";

interface CaseOption {
  id: CaseType;
  label: string;
  description: string;
}

const caseOptions: CaseOption[] = [
  { id: "upper", label: "UPPER CASE", description: "ALL CHARACTERS UPPERCASE" },
  { id: "lower", label: "lower case", description: "all characters lowercase" },
  {
    id: "title",
    label: "Title Case",
    description: "Capitalize First Letter Of Each Word",
  },
  {
    id: "sentence",
    label: "Sentence case",
    description: "Capitalize first letter of sentences",
  },
  {
    id: "camel",
    label: "camelCase",
    description: "firstWordLowercaseRestCapitalized",
  },
  {
    id: "pascal",
    label: "PascalCase",
    description: "AllWordsCapitalizedNoSpaces",
  },
  {
    id: "snake",
    label: "snake_case",
    description: "words_separated_by_underscores",
  },
  {
    id: "kebab",
    label: "kebab-case",
    description: "words-separated-by-hyphens",
  },
  {
    id: "constant",
    label: "CONSTANT_CASE",
    description: "UPPER_CASE_WITH_UNDERSCORES",
  },
  { id: "dot", label: "dot.case", description: "words.separated.by.dots" },
  { id: "path", label: "path/case", description: "words/separated/by/slashes" },
];

function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

function toWords(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/[_\-./\\]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

function toCamelCase(str: string): string {
  const words = toWords(str);
  return words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
}

function toPascalCase(str: string): string {
  const words = toWords(str);
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function toSnakeCase(str: string): string {
  return toWords(str)
    .map((w) => w.toLowerCase())
    .join("_");
}

function toKebabCase(str: string): string {
  return toWords(str)
    .map((w) => w.toLowerCase())
    .join("-");
}

function toConstantCase(str: string): string {
  return toWords(str)
    .map((w) => w.toUpperCase())
    .join("_");
}

function toDotCase(str: string): string {
  return toWords(str)
    .map((w) => w.toLowerCase())
    .join(".");
}

function toPathCase(str: string): string {
  return toWords(str)
    .map((w) => w.toLowerCase())
    .join("/");
}

function convertCase(text: string, caseType: CaseType): string {
  if (!text) return "";

  switch (caseType) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return toTitleCase(text);
    case "sentence":
      return toSentenceCase(text);
    case "camel":
      return toCamelCase(text);
    case "pascal":
      return toPascalCase(text);
    case "snake":
      return toSnakeCase(text);
    case "kebab":
      return toKebabCase(text);
    case "constant":
      return toConstantCase(text);
    case "dot":
      return toDotCase(text);
    case "path":
      return toPathCase(text);
    default:
      return text;
  }
}

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseType>("upper");
  const { showToast, ToastComponent } = useToast();

  const convertedText = convertCase(text, selectedCase);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(convertedText);
      showToast("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">
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
            Case Converter
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Transform text between different case formats instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <div>
              <div className="flex items-center justify-between mb-2 min-h-9">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Input Text
                </label>
                {text.trim() && (
                  <button
                    onClick={() => setText("")}
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
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your text here..."
                  className="w-full h-48 p-4 bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none focus:outline-none font-mono text-sm"
                  spellCheck={false}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 min-h-9">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Converted Text
                </label>
                {convertedText && (
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
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
                <div className="w-full h-48 p-4 overflow-auto font-mono text-sm text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap wrap-break-word">
                  {convertedText || (
                    <span className="text-zinc-400 dark:text-zinc-600">
                      Converted text will appear here...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="mb-2 min-h-9">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Select Case Format
              </label>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto pr-2">
              {caseOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedCase(option.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
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
      </div>
      {ToastComponent}
    </div>
  );
}
