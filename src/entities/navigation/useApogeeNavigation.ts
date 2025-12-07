/**
 * Apogee Navigation Hook
 *
 * Handles URL-based navigation for Apogee documents:
 * - Extracts document ID from URL
 * - Navigates to document routes
 * - Syncs URL with application state
 */

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

// ============================================================================
// Types
// ============================================================================

export interface ApogeeNavigationState {
  pathname: string;
  documentId: string | null;
}

export interface ApogeeNavigationActions {
  navigateToDocument: (documentId: string) => void;
  navigateToHome: () => void;
  replaceWithHome: () => void;
}

export type ApogeeNavigation = ApogeeNavigationState & ApogeeNavigationActions;

// ============================================================================
// Hook Implementation
// ============================================================================

export function useApogeeNavigation(): ApogeeNavigation {
  const router = useRouter();
  const pathname = usePathname();

  // Extract document ID from URL (format: /apogee/[id])
  const pathParts = pathname.split("/");
  const documentId = pathParts.length >= 3 ? pathParts[2] : null;

  const navigateToDocument = useCallback(
    (docId: string) => {
      router.push(`/apogee/${docId}`);
    },
    [router],
  );

  const navigateToHome = useCallback(() => {
    router.push("/apogee");
  }, [router]);

  const replaceWithHome = useCallback(() => {
    router.replace("/apogee");
  }, [router]);

  return {
    pathname,
    documentId,
    navigateToDocument,
    navigateToHome,
    replaceWithHome,
  };
}
