import { expect, type Page } from "@playwright/test";

import type { ToolSlug } from "../../src/shared/lib/toolCatalog";

export async function installNetworkGuard(page: Page): Promise<string[]> {
  const externalRequests: string[] = [];

  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname !== "127.0.0.1" &&
      url.hostname !== "localhost"
    ) {
      externalRequests.push(`${request.method()} ${url.origin}${url.pathname}`);
    }
  });

  await page.route(/^https?:\/\//, async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") {
      await route.continue();
      return;
    }
    await route.abort("blockedbyclient");
  });

  return externalRequests;
}

export async function openTool(
  page: Page,
  slug: ToolSlug,
  heading: string,
): Promise<void> {
  const response = await page.goto(`/${slug}`);

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole("heading", { level: 1, name: heading, exact: true }),
  ).toBeVisible();
}
