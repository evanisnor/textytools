"use client";

import { formatDate, isExpired, isNotYetValid } from "../lib/validators";
import { useJwtDecoderContext } from "../model/JwtDecoderProvider";

export function JwtDecoderHeader() {
  const { result } = useJwtDecoderContext();
  const decoded = result.decoded;
  const expired = decoded ? isExpired(decoded.expiresAt) : false;
  const notYetValid = decoded ? isNotYetValid(decoded.notBefore) : false;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:min-w-[600px]">
      {/* Algorithm */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
        <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
          Algorithm
        </div>
        <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-mono">
          {decoded?.algorithm || "—"}
        </div>
      </div>

      {/* Issued At */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
        <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
          Issued At
        </div>
        <div className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
          {decoded?.issuedAt ? formatDate(decoded.issuedAt) : "—"}
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
            decoded?.expiresAt
              ? expired
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
              : "text-zinc-900 dark:text-zinc-50"
          }`}
        >
          {decoded?.expiresAt ? <>{formatDate(decoded.expiresAt)}</> : "—"}
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
            decoded?.notBefore
              ? notYetValid
                ? "text-orange-600 dark:text-orange-400"
                : "text-zinc-900 dark:text-zinc-50"
              : "text-zinc-900 dark:text-zinc-50"
          }`}
        >
          {decoded?.notBefore ? <>{formatDate(decoded.notBefore)}</> : "—"}
        </div>
      </div>
    </div>
  );
}
