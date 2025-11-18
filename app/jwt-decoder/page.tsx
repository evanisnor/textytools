"use client";

import { useState, useMemo, useEffect, JSX } from "react";
import Link from "next/link";
import { useToast } from "@/app/components/Toast";
import { TextEditorContainer } from "@/app/components/TextEditorContainer";
import { ToolFrame } from "@/app/components/ToolFrame";

interface JWTPayload {
  [key: string]: unknown;
}

interface DecodedJWT {
  header: JWTPayload;
  payload: JWTPayload;
  signature: string;
  isValid: boolean;
  algorithm?: string;
  expiresAt?: Date;
  issuedAt?: Date;
  notBefore?: Date;
}

// Colors for JWT sections (header, payload, signature)
const JWT_SECTION_COLORS = {
  header: "bg-blue-200/60 dark:bg-blue-800/40",
  payload: "bg-green-200/60 dark:bg-green-800/40",
  signature: "bg-purple-200/60 dark:bg-purple-800/40",
};

function highlightJWT(jwt: string): JSX.Element {
  const parts = jwt.split(".");
  if (parts.length !== 3) {
    return <>{jwt}</>;
  }

  return (
    <>
      <span className={`${JWT_SECTION_COLORS.header} px-0.5`}>{parts[0]}</span>
      <span className="text-zinc-400">.</span>
      <span className={`${JWT_SECTION_COLORS.payload} px-0.5`}>{parts[1]}</span>
      <span className="text-zinc-400">.</span>
      <span className={`${JWT_SECTION_COLORS.signature} px-0.5`}>
        {parts[2]}
      </span>
    </>
  );
}

function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // Add padding if needed
  const pad = base64.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error("Invalid base64url string");
    }
    base64 += new Array(5 - pad).join("=");
  }
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
  } catch {
    throw new Error("Invalid base64url encoding");
  }
}

function decodeJWT(token: string): DecodedJWT {
  const parts = token.trim().split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid JWT format. Expected 3 parts separated by dots.");
  }

  try {
    const headerJson = base64UrlDecode(parts[0]);
    const payloadJson = base64UrlDecode(parts[1]);

    const header = JSON.parse(headerJson);
    const payload = JSON.parse(payloadJson);

    const result: DecodedJWT = {
      header,
      payload,
      signature: parts[2],
      isValid: true,
      algorithm: header.alg,
    };

    // Parse standard claims
    if (typeof payload.exp === "number") {
      result.expiresAt = new Date(payload.exp * 1000);
    }
    if (typeof payload.iat === "number") {
      result.issuedAt = new Date(payload.iat * 1000);
    }
    if (typeof payload.nbf === "number") {
      result.notBefore = new Date(payload.nbf * 1000);
    }

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Decode error: ${error.message}`
        : "Failed to decode JWT",
    );
  }
}

function formatDate(date: Date): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function isExpired(expiresAt: Date | undefined): boolean {
  if (!expiresAt) return false;
  return expiresAt < new Date();
}

function isNotYetValid(notBefore: Date | undefined): boolean {
  if (!notBefore) return false;
  return notBefore > new Date();
}

export default function JWTDecoder() {
  const [input, setInput] = useState("");
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    // Load from localStorage after mount to avoid hydration mismatch
    const storedInput = localStorage.getItem("jwt-decoder-input");
    if (storedInput) {
      localStorage.removeItem("jwt-decoder-input");
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setInput(storedInput), 0);
    }
  }, []);

  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        success: true,
        decoded: null,
        error: null,
      };
    }

    try {
      const decoded = decodeJWT(input);
      return {
        success: true,
        decoded,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        decoded: null,
        error: error instanceof Error ? error.message : "Decoding failed",
      };
    }
  }, [input]);

  const formattedOutput = useMemo(() => {
    if (!result.decoded) return "";

    return JSON.stringify(
      {
        header: result.decoded.header,
        payload: result.decoded.payload,
        signature: result.decoded.signature,
      },
      null,
      2,
    );
  }, [result.decoded]);

  const expired = result.decoded ? isExpired(result.decoded.expiresAt) : false;
  const notYetValid = result.decoded
    ? isNotYetValid(result.decoded.notBefore)
    : false;

  return (
    <ToolFrame
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens (JWT) with real-time validation"
      headerRight={
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:min-w-[600px]">
          {/* Algorithm */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
              Algorithm
            </div>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-mono">
              {result.decoded?.algorithm || "—"}
            </div>
          </div>

          {/* Issued At */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
              Issued At
            </div>
            <div className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
              {result.decoded?.issuedAt
                ? formatDate(result.decoded.issuedAt)
                : "—"}
            </div>
          </div>

          {/* Expires At */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
              {expired ? (
                <span className="block text-xs mt-0.5 text-red-600 dark:text-red-400">
                  ⚠️ Expired
                </span>
              ) : (
                "Expires At"
              )}
            </div>
            <div
              className={`text-xs font-medium ${
                result.decoded?.expiresAt
                  ? expired
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                  : "text-zinc-900 dark:text-zinc-50"
              }`}
            >
              {result.decoded?.expiresAt ? (
                <>{formatDate(result.decoded.expiresAt)}</>
              ) : (
                "—"
              )}
            </div>
          </div>

          {/* Not Before */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
              {notYetValid ? (
                <span className="block text-xs mt-0.5 text-orange-600 dark:text-orange-400">
                  ⚠️ Not yet valid
                </span>
              ) : (
                "Not Before"
              )}
            </div>
            <div
              className={`text-xs font-medium ${
                result.decoded?.notBefore
                  ? notYetValid
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-900 dark:text-zinc-50"
              }`}
            >
              {result.decoded?.notBefore ? (
                <>{formatDate(result.decoded.notBefore)}</>
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>
      }
    >
      {/* Input/Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <div>
          <div className="mb-2 flex items-center justify-between min-h-9">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              JWT Token
            </label>
            {input.trim() && (
              <button
                onClick={() => setInput("")}
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
            value={input}
            onChange={setInput}
            placeholder={`Paste a JWT token here...\n\nExample:\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
            height="h-[500px]"
            renderContent={
              input.trim() && !result.error
                ? (content) => highlightJWT(content)
                : undefined
            }
            showLineNumbers={false}
            wrap={true}
          />
        </div>

        {/* Output */}
        <div>
          <div className="mb-2 flex items-center justify-between min-h-9">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Decoded Token
            </label>
            <div className="flex items-center gap-2">
              {result.success && result.decoded && (
                <Link
                  href="/json-wizard"
                  onClick={(e) => {
                    e.preventDefault();
                    // Save current JWT input for restoration on back navigation
                    localStorage.setItem("jwt-decoder-input", input);
                    // Save formatted output for JSON Wizard
                    localStorage.setItem("json-wizard-input", formattedOutput);
                    window.location.href = "/json-wizard";
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 active:bg-blue-300 dark:active:bg-blue-900/70 transition-colors"
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </button>
              )}
            </div>
          </div>
          <TextEditorContainer
            value={result.success ? formattedOutput : ""}
            readOnly
            placeholder={result.error ? "" : "Decoded JWT will appear here..."}
            height="h-[500px]"
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
    </ToolFrame>
  );
}
