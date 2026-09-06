"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";

import { FeedbackModal } from "./FeedbackModal";

import {
  trackFeedbackOpen,
  trackToolActivation,
  trackToolView,
} from "@/shared/lib/analytics";

interface ToolFrameProps {
  title: string;
  description: string;
  children: ReactNode;
  maxWidth?: "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  /** Optional stats or custom content to appear on the right side of the header */
  headerRight?: ReactNode;
  /** Tool name for analytics tracking */
  toolName: string;
}

export function ToolFrame({
  title,
  description,
  children,
  maxWidth = "7xl",
  headerRight,
  toolName,
}: ToolFrameProps) {
  const maxWidthClass = `max-w-${maxWidth}`;
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const hasActivated = useRef(false);

  useEffect(() => {
    trackToolView({ tool: toolName });
  }, [toolName]);

  const handleActivation = () => {
    if (hasActivated.current) return;

    hasActivated.current = true;
    trackToolActivation({ tool: toolName });
  };

  const handleFeedbackClick = () => {
    setIsFeedbackModalOpen(true);
    trackFeedbackOpen({ tool: toolName });
  };

  return (
    <div
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6"
      onInputCapture={handleActivation}
    >
      <div className={`${maxWidthClass} mx-auto`}>
        {/* Back button and Feedback button */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
          >
            ← back to textytools.dev
          </Link>
          <button
            onClick={handleFeedbackClick}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
          >
            Send Feedback
          </button>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
              {title}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>

        <aside
          aria-label="Tool data handling"
          className="mb-8 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
        >
          <strong className="text-zinc-900 dark:text-zinc-50">
            Processed in this browser.
          </strong>{" "}
          Current tool content and settings are kept in this tab for this
          browser session and may survive reload or session restore. Use the
          tool&apos;s Clear control to remove its current content, or browser
          site-data controls to remove all stored content and settings. Site
          analytics and submitted feedback use network services.{" "}
          <Link
            href="/privacy"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Privacy details
          </Link>
          .
        </aside>

        {/* Content */}
        {children}

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          toolName={toolName}
        />
      </div>
    </div>
  );
}
