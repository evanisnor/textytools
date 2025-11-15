'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SanitizationOption {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const defaultOptions: SanitizationOption[] = [
  {
    id: 'trimLines',
    label: 'Trim Lines',
    description: 'Remove leading and trailing whitespace from each line',
    enabled: false,
  },
  {
    id: 'removeEmptyLines',
    label: 'Remove Empty Lines',
    description: 'Delete all blank lines from the text',
    enabled: false,
  },
  {
    id: 'removeDuplicateLines',
    label: 'Remove Duplicate Lines',
    description: 'Keep only unique lines, removing duplicates',
    enabled: false,
  },
  {
    id: 'removeExtraSpaces',
    label: 'Remove Extra Spaces',
    description: 'Replace multiple spaces with a single space',
    enabled: false,
  },
  {
    id: 'removeNonAscii',
    label: 'Remove Non-ASCII',
    description: 'Strip all non-ASCII characters (keeps only 0-127)',
    enabled: false,
  },
  {
    id: 'removeEmoji',
    label: 'Remove Emoji',
    description: 'Remove all emoji characters',
    enabled: false,
  },
  {
    id: 'removeNumbers',
    label: 'Remove Numbers',
    description: 'Strip all numeric digits (0-9)',
    enabled: false,
  },
  {
    id: 'removePunctuation',
    label: 'Remove Punctuation',
    description: 'Remove all punctuation marks',
    enabled: false,
  },
  {
    id: 'removeSpecialChars',
    label: 'Remove Special Characters',
    description: 'Keep only letters, numbers, and basic whitespace',
    enabled: false,
  },
  {
    id: 'normalizeWhitespace',
    label: 'Normalize Whitespace',
    description: 'Convert all whitespace (tabs, newlines) to single spaces',
    enabled: false,
  },
  {
    id: 'sortLines',
    label: 'Sort Lines',
    description: 'Sort all lines alphabetically',
    enabled: false,
  },
  {
    id: 'reverseLines',
    label: 'Reverse Lines',
    description: 'Reverse the order of lines',
    enabled: false,
  },
];

function sanitizeText(text: string, options: SanitizationOption[]): string {
  let result = text;

  const enabledOptions = options.filter(opt => opt.enabled);

  for (const option of enabledOptions) {
    switch (option.id) {
      case 'trimLines':
        result = result.split('\n').map(line => line.trim()).join('\n');
        break;

      case 'removeEmptyLines':
        result = result.split('\n').filter(line => line.trim().length > 0).join('\n');
        break;

      case 'removeDuplicateLines':
        const lines = result.split('\n');
        const uniqueLines = [...new Set(lines)];
        result = uniqueLines.join('\n');
        break;

      case 'removeExtraSpaces':
        result = result.replace(/ {2,}/g, ' ');
        break;

      case 'removeNonAscii':
        result = result.replace(/[^\x00-\x7F]/g, '');
        break;

      case 'removeEmoji':
        // Unicode ranges for emoji
        result = result.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{200D}]/gu, '');
        break;

      case 'removeNumbers':
        result = result.replace(/\d/g, '');
        break;

      case 'removePunctuation':
        result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"[\]\\|@+]/g, '');
        break;

      case 'removeSpecialChars':
        result = result.replace(/[^a-zA-Z0-9\s\n\r\t]/g, '');
        break;

      case 'normalizeWhitespace':
        result = result.replace(/\s+/g, ' ').trim();
        break;

      case 'sortLines':
        result = result.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
        break;

      case 'reverseLines':
        result = result.split('\n').reverse().join('\n');
        break;
    }
  }

  return result;
}

export default function TextSanitizer() {
  const [text, setText] = useState('');
  const [options, setOptions] = useState<SanitizationOption[]>(defaultOptions);

  const sanitizedText = sanitizeText(text, options);

  const toggleOption = (id: string) => {
    setOptions(prev =>
      prev.map(opt =>
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
      )
    );
  };

  const enableAll = () => {
    setOptions(prev => prev.map(opt => ({ ...opt, enabled: true })));
  };

  const disableAll = () => {
    setOptions(prev => prev.map(opt => ({ ...opt, enabled: false })));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sanitizedText);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const activeCount = options.filter(opt => opt.enabled).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Text Sanitizer
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Clean and transform your text with customizable sanitization options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Input Text
              </label>
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your text here..."
                  className="w-full h-64 p-4 bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none focus:outline-none font-mono text-sm"
                  spellCheck={false}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Sanitized Text {activeCount > 0 && <span className="text-xs font-normal text-zinc-500">({activeCount} {activeCount === 1 ? 'filter' : 'filters'} active)</span>}
                </label>
                {sanitizedText && (
                  <button
                    onClick={copyToClipboard}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                  >
                    Copy to clipboard
                  </button>
                )}
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
                <div className="w-full h-64 p-4 overflow-auto font-mono text-sm text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap break-words">
                  {sanitizedText || <span className="text-zinc-400 dark:text-zinc-600">Sanitized text will appear here...</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Sanitization Options
              </label>
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

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  <input
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

        {text.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setText('')}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Clear text
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
