import type { ReactNode } from "react";

import { ToolStructuredData } from "./ToolStructuredData";

import type { ToolSlug } from "@/shared/lib/toolCatalog";

export function ToolRouteLayout({
  children,
  slug,
}: {
  children: ReactNode;
  slug: ToolSlug;
}) {
  return (
    <>
      <ToolStructuredData slug={slug} />
      {children}
    </>
  );
}
