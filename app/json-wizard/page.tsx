'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type ViewMode = 'pretty' | 'minified' | 'raw';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  lineNumber?: number;
  columnNumber?: number;
}

function validateJSON(text: string): ValidationResult {
  if (!text.trim()) {
    return { isValid: true };
  }

  try {
    JSON.parse(text);
    return { isValid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      const match = error.message.match(/position (\d+)/);
      const position = match ? parseInt(match[1]) : undefined;

      if (position !== undefined) {
        const lines = text.substring(0, position).split('\n');
        const lineNumber = lines.length;
        const columnNumber = lines[lines.length - 1].length + 1;

        return {
          isValid: false,
          error: error.message,
          lineNumber,
          columnNumber,
        };
      }

      return {
        isValid: false,
        error: error.message,
      };
    }
    return {
      isValid: false,
      error: 'Unknown parsing error',
    };
  }
}

function escapeJSON(text: string): string {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(JSON.stringify(parsed));
  } catch {
    return text;
  }
}

function unescapeJSON(text: string): string {
  try {
    const unescaped = JSON.parse(text);
    if (typeof unescaped === 'string') {
      return unescaped;
    }
    return text;
  } catch {
    return text;
  }
}

function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm || !text) return text;

  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedTerm, 'gi');

  return text.replace(regex, (match) => `⟪${match}⟫`);
}

function getJSONStats(text: string): { keys: number; depth: number; size: number } {
  try {
    const parsed = JSON.parse(text);

    const countKeys = (obj: any): number => {
      if (typeof obj !== 'object' || obj === null) return 0;

      let count = 0;
      for (const key in obj) {
        count++;
        count += countKeys(obj[key]);
      }
      return count;
    };

    const getDepth = (obj: any, current = 1): number => {
      if (typeof obj !== 'object' || obj === null) return current;

      let maxDepth = current;
      for (const key in obj) {
        const depth = getDepth(obj[key], current + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
      return maxDepth;
    };

    return {
      keys: countKeys(parsed),
      depth: getDepth(parsed),
      size: new Blob([text]).size,
    };
  } catch {
    return { keys: 0, depth: 0, size: new Blob([text]).size };
  }
}

export default function JSONWizard() {
  const [input, setInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('pretty');
  const [indentSize, setIndentSize] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKeys, setSortKeys] = useState(false);

  const validation = useMemo(() => validateJSON(input), [input]);
  const stats = useMemo(() => getJSONStats(input), [input]);

  const processedJSON = useMemo(() => {
    if (!input.trim() || !validation.isValid) return input;

    try {
      let parsed = JSON.parse(input);

      if (sortKeys) {
        const sortObject = (obj: any): any => {
          if (typeof obj !== 'object' || obj === null) return obj;
          if (Array.isArray(obj)) return obj.map(sortObject);

          const sorted: any = {};
          Object.keys(obj)
            .sort()
            .forEach(key => {
              sorted[key] = sortObject(obj[key]);
            });
          return sorted;
        };
        parsed = sortObject(parsed);
      }

      let result: string;
      switch (viewMode) {
        case 'pretty':
          result = JSON.stringify(parsed, null, indentSize);
          break;
        case 'minified':
          result = JSON.stringify(parsed);
          break;
        case 'raw':
          result = input;
          break;
      }

      if (searchTerm) {
        result = highlightSearchTerm(result, searchTerm);
      }

      return result;
    } catch {
      return input;
    }
  }, [input, viewMode, indentSize, searchTerm, sortKeys, validation.isValid]);

  const copyToClipboard = async () => {
    try {
      const cleanText = processedJSON.replace(/⟪|⟫/g, '');
      await navigator.clipboard.writeText(cleanText);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEscape = () => {
    if (validation.isValid && input.trim()) {
      setInput(escapeJSON(input));
    }
  };

  const handleUnescape = () => {
    setInput(unescapeJSON(input));
  };

  const renderOutput = () => {
    if (!processedJSON) {
      return <span className="text-zinc-400 dark:text-zinc-600">Formatted JSON will appear here...</span>;
    }

    if (!searchTerm) {
      return processedJSON;
    }

    const parts = processedJSON.split(/⟪|⟫/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="bg-yellow-300 dark:bg-yellow-600 text-black">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderWithLineNumbers = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');
    const lineNumberWidth = String(lines.length).length;

    return (
      <div className="flex font-mono text-sm">
        <div className="select-none text-zinc-400 dark:text-zinc-600 text-right pr-4 border-r border-zinc-200 dark:border-zinc-800" style={{ minWidth: `${lineNumberWidth + 2}ch` }}>
          {lines.map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>
        <div className="flex-1 pl-4 whitespace-pre">
          {searchTerm ? renderOutput() : text}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
              JSON Wizard
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Validate, format, and manipulate JSON data with powerful tools.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 lg:min-w-[400px]">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Total Keys</div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {validation.isValid && input.trim() ? stats.keys.toLocaleString() : '—'}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Max Depth</div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {validation.isValid && input.trim() ? stats.depth : '—'}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Size</div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {validation.isValid && input.trim() ? `${stats.size.toLocaleString()} bytes` : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Input */}
            <div>
              <div className="flex items-center justify-between mb-2 min-h-[28px]">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Input JSON
                </label>
                {input.trim() && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium ${
                    validation.isValid
                      ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200'
                      : 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200'
                  }`}>
                    {validation.isValid ? '✓ Valid JSON' : '✗ Invalid JSON'}
                    {!validation.isValid && validation.lineNumber && validation.columnNumber && (
                      <span className="text-red-700 dark:text-red-300">
                        (Line {validation.lineNumber}, Col {validation.columnNumber})
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 h-64 overflow-auto relative">
                {input ? (
                  <div className="flex font-mono text-sm">
                    <div className="select-none text-zinc-400 dark:text-zinc-600 text-right pr-4 border-r border-zinc-200 dark:border-zinc-800" style={{ minWidth: `${String(input.split('\n').length).length + 2}ch` }}>
                      {input.split('\n').map((_, index) => (
                        <div key={index}>{index + 1}</div>
                      ))}
                    </div>
                    <div className="flex-1 pl-4 relative">
                      <div className="absolute inset-0 whitespace-pre text-zinc-900 dark:text-zinc-50">
                        {input}
                      </div>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder=""
                        className="absolute inset-0 bg-transparent text-transparent caret-zinc-900 dark:caret-zinc-50 resize-none focus:outline-none whitespace-pre"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Paste your JSON here, e.g., {"key": "value"}'
                    className="w-full h-full bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none focus:outline-none font-mono text-sm"
                    spellCheck={false}
                  />
                )}
              </div>
            </div>

            {/* Output */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Output
                </label>
                {processedJSON && validation.isValid && (
                  <button
                    onClick={copyToClipboard}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                  >
                    Copy to clipboard
                  </button>
                )}
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 h-64 overflow-auto">
                {processedJSON ? (
                  renderWithLineNumbers(processedJSON)
                ) : (
                  <div className="text-zinc-400 dark:text-zinc-600 font-mono text-sm">
                    Formatted JSON will appear here...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                View Mode
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setViewMode('pretty')}
                  disabled={!validation.isValid}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    viewMode === 'pretty'
                      ? 'border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-800'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                  } ${!validation.isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium text-sm text-zinc-900 dark:text-zinc-50">Pretty Print</div>
                </button>
                <button
                  onClick={() => setViewMode('minified')}
                  disabled={!validation.isValid}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    viewMode === 'minified'
                      ? 'border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-800'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                  } ${!validation.isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium text-sm text-zinc-900 dark:text-zinc-50">Minified</div>
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    viewMode === 'raw'
                      ? 'border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-800'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="font-medium text-sm text-zinc-900 dark:text-zinc-50">Raw</div>
                </button>
              </div>
            </div>

            {/* Indent Size */}
            {viewMode === 'pretty' && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Indent Size: {indentSize}
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="2"
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  disabled={!validation.isValid}
                  className="w-full"
                />
              </div>
            )}

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Search & Highlight
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in JSON..."
                disabled={!validation.isValid}
                className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Options
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sortKeys}
                  onChange={(e) => setSortKeys(e.target.checked)}
                  disabled={!validation.isValid}
                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
                <span className="text-sm text-zinc-900 dark:text-zinc-50">Sort Keys</span>
              </label>
            </div>

            {/* Actions */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Actions
              </label>
              <div className="space-y-2">
                <button
                  onClick={handleEscape}
                  disabled={!validation.isValid || !input.trim()}
                  className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Escape JSON
                </button>
                <button
                  onClick={handleUnescape}
                  disabled={!input.trim()}
                  className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Unescape JSON
                </button>
                <button
                  onClick={() => setInput('')}
                  disabled={!input.trim()}
                  className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
