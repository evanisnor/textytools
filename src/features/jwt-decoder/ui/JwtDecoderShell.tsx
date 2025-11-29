"use client";

import Link from "next/link";

import { useJwtDecoderContext } from "../model/JwtDecoderProvider";

import { useJsonSyntaxHighlighter } from "@/entities/json";
import { useJwtSyntaxHighlighter } from "@/entities/jwt";

import { useCrossToolNavigation } from "@/shared/hooks";
import {
  trackCopyEvent,
  trackToolConversion,
  trackClearEvent,
} from "@/shared/lib/analytics";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { TextEditorContainer } from "@/shared/ui/text-editor/TextEditorContainer";
import { useToast } from "@/shared/ui/toast/Toast";

export function JwtDecoderShell() {
  const { input, setInput, result, formattedOutput } = useJwtDecoderContext();
  const { showToast, ToastComponent } = useToast();
  const { navigateToTool } = useCrossToolNavigation();

  const jwtSyntax = useJwtSyntaxHighlighter({
    enabled: Boolean(input.trim()) && !result.error,
  });

  const decodedJsonSyntax = useJsonSyntaxHighlighter({
    enabled: result.success && Boolean(formattedOutput),
  });

  return (
    <>
      {/* Input/Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <div>
          <div className="mb-2 flex items-center justify-between min-h-9">
            <label
              htmlFor="jwt-input"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              JWT Token
            </label>
            {input.trim() && (
              <button
                onClick={() => {
                  trackClearEvent({ tool: TOOL_NAMES.JWT_DECODER });
                  setInput("");
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
            id="jwt-input"
            value={input}
            onChange={setInput}
            placeholder={`Paste a JWT token here...\n\nExample:\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
            height="h-[500px]"
            renderContent={jwtSyntax?.renderContent}
            showLineNumbers={false}
            wrap={true}
          />
        </div>

        {/* Output */}
        <div>
          <div className="mb-2 flex items-center justify-between min-h-9">
            <label
              htmlFor="jwt-output"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Decoded Token
            </label>
            <div className="flex items-center gap-2">
              {result.success && result.decoded && (
                <Link
                  href="/json-wizard"
                  onClick={(e) => {
                    e.preventDefault();
                    trackToolConversion({
                      sourceTool: "jwt-decoder",
                      destinationTool: "json-wizard",
                    });
                    navigateToTool({
                      destination: "/json-wizard",
                      saveState: {
                        key: "jwt-decoder-state",
                        value: { input },
                      },
                      transferData: {
                        key: "cross-tool-input-json-wizard",
                        value: formattedOutput,
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 active:bg-blue-300 dark:active:bg-blue-900/70 transition-colors cursor-pointer"
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
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  Format with JSON Wizard
                </Link>
              )}
              {result.success && result.decoded && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(formattedOutput);
                    showToast("Copied to clipboard");
                    trackCopyEvent({ tool: TOOL_NAMES.JWT_DECODER });
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </button>
              )}
            </div>
          </div>
          <TextEditorContainer
            id="jwt-output"
            value={result.success ? formattedOutput : ""}
            readOnly
            placeholder={result.error ? "" : "Decoded JWT will appear here..."}
            height="h-[500px]"
            renderContent={decodedJsonSyntax?.renderContent}
          />
          {result.error && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              Error: {result.error}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
        <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
          <p>
            <strong className="text-zinc-900 dark:text-zinc-50">
              About JWT:
            </strong>{" "}
            JSON Web Tokens are an open, industry standard (RFC 7519) method for
            representing claims securely between two parties. This tool decodes
            and displays the contents without signature verification.
          </p>
          <p>
            <strong className="text-zinc-900 dark:text-zinc-50">
              Security Note:
            </strong>{" "}
            This decoder runs entirely in your browser. No tokens are sent to
            any server. However, avoid pasting production tokens containing
            sensitive data.
          </p>
        </div>
      </div>
      {ToastComponent}
    </>
  );
}
