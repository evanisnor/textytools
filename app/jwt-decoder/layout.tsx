import { createToolMetadata } from "@/shared/lib/toolMetadata";
import { ToolRouteLayout } from "@/shared/ui/tool-structured-data/ToolRouteLayout";

export const metadata = createToolMetadata("jwt-decoder");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolRouteLayout slug="jwt-decoder">{children}</ToolRouteLayout>;
}
