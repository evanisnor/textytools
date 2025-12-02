/**
 * Apogee Provider Component
 *
 * Wraps the Apogee Shell with document manager state
 */

"use client";

import { useDocumentManager } from "../model/useDocumentManager";
import { ApogeeShell } from "../ui/ApogeeShell";

export function ApogeeProvider() {
  const documentManager = useDocumentManager();

  return <ApogeeShell documentManager={documentManager} />;
}
