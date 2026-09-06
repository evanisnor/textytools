import { expect, test } from "@playwright/test";

import { ACTIVE_PRODUCT_FIXTURES } from "../../src/test/fixtures/activeProduct";

import { installNetworkGuard, openTool } from "./support";

let externalRequests: string[];

test.beforeEach(async ({ page }) => {
  externalRequests = await installNetworkGuard(page);
});

test.afterEach(() => {
  expect(externalRequests, "fixture content must not leave loopback").toEqual(
    [],
  );
});

test("Text Counter completes its primary counting job", async ({ page }) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.textCounter;
  await openTool(page, fixture.tool, "Text Counter");

  await page.getByLabel("Input Text").fill(fixture.input);

  await expect(
    page.getByText("Characters", { exact: true }).locator(".."),
  ).toContainText("16");
  await expect(
    page.getByText("Words", { exact: true }).locator(".."),
  ).toContainText("3");
  await expect(
    page.getByText("Lines", { exact: true }).locator(".."),
  ).toContainText("2");
  await expect(
    page.getByText("Paragraphs", { exact: true }).locator(".."),
  ).toContainText("1");
});

test("Diff Viewer completes its primary comparison job", async ({ page }) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.diffViewer;
  await openTool(page, fixture.tool, "Diff Viewer");

  await page.getByLabel("Left").fill(fixture.input.left);
  await page.getByLabel("Right").fill(fixture.input.right);

  const changedLines = page.locator('span[class*="bg-yellow-200"]');
  await expect(changedLines).toHaveCount(2);
  await expect(changedLines.nth(0)).toContainText("beta");
  await expect(changedLines.nth(1)).toContainText("gamma");

  await page.getByLabel("Search").fill(fixture.input.search);
  await expect(page.getByText("1 / 2", { exact: true })).toBeVisible();
});

test("Case Converter completes its primary conversion job", async ({
  page,
}) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.caseConverter;
  await openTool(page, fixture.tool, "Case Converter");

  await page.getByLabel("Input Text").fill(fixture.input);
  await page.getByRole("button", { name: /^snake_case/ }).click();

  await expect(page.getByLabel("Converted Text")).toHaveValue(
    "project_baseline",
  );
});

test("Text Sanitizer completes its primary cleanup job", async ({ page }) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.textSanitizer;
  await openTool(page, fixture.tool, "Text Sanitizer");

  await page.getByLabel("Input Text").fill(fixture.input);
  await page.getByLabel(/^Remove Extra Spaces/).check();

  await expect(page.getByLabel(/^Sanitized Text/)).toHaveValue("alpha beta");
  await expect(
    page.getByText("1 filter active", { exact: false }),
  ).toBeVisible();
});

test("JSON Wizard completes its primary formatting job", async ({ page }) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.jsonWizard;
  await openTool(page, fixture.tool, "JSON Wizard");

  await page
    .getByPlaceholder('Paste your JSON here, e.g., {"key": "value"}')
    .fill(fixture.input);

  await expect(page.getByText("✓ Valid", { exact: true })).toBeVisible();
  await expect(
    page.getByPlaceholder("Formatted JSON will appear here..."),
  ).toHaveValue('{\n  "status": "synthetic",\n  "count": 2\n}');
});

test("CSV / JSON Converter completes its primary conversion job", async ({
  page,
}) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.csvJsonConverter;
  await openTool(page, fixture.tool, "CSV / JSON Converter");

  await page.getByLabel("Input").fill(fixture.input);

  await expect(page.getByText("CSV → JSON", { exact: true })).toBeVisible();
  const output = page.getByLabel("Output");
  await expect(output).toHaveValue(/"name": "Alpha Example"/);
  await expect(output).toHaveValue(/"count": 3/);
});

test("Text Encoder completes its primary Base64 job", async ({ page }) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.textEncoder;
  await openTool(page, fixture.tool, "Text Encoder");

  await page.getByLabel("Plain Text").fill(fixture.input);

  await expect(page.getByLabel("Encoded Output")).toHaveValue("SGVsbG8=");
});

test("JWT Decoder completes its primary decode job", async ({ page }) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.jwtDecoder;
  await openTool(page, fixture.tool, "JWT Decoder");

  await page.getByLabel("JWT Token").fill(fixture.input);

  await expect(page.getByLabel("Decoded Token")).toHaveValue(
    /"name": "Ada Example"/,
  );
  await expect(page.getByText(/without signature verification/i)).toBeVisible();
});

test("Regex Tester completes its primary matching job", async ({ page }) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.regexTester;
  await openTool(page, fixture.tool, "Regex Tester");

  await page.getByLabel("Pattern").fill(fixture.input.pattern);
  await page.getByLabel("Test String").fill(fixture.input.text);

  await expect(page.getByText("1 / 2", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "alpha", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "beta", exact: true }),
  ).toBeVisible();
});

test("tool state survives a same-session reload", async ({ page }) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.textCounter;
  await openTool(page, fixture.tool, "Text Counter");

  const input = page.getByLabel("Input Text");
  await input.fill(fixture.input);
  await expect
    .poll(() =>
      page.evaluate(() => sessionStorage.getItem("text-counter-state")),
    )
    .toContain("Alpha beta");

  await page.reload();
  await expect(page.getByLabel("Input Text")).toHaveValue(fixture.input);
});

test("a representative tool explains and honors its browser-data boundary", async ({
  page,
}) => {
  await openTool(page, "text-counter", "Text Counter");

  const dataNotice = page.getByLabel("Tool data handling");
  await expect(dataNotice).toContainText("Processed in this browser");
  await expect(dataNotice).toContainText(
    "kept in this tab for this browser session",
  );
  await expect(
    dataNotice.getByRole("link", { name: "Privacy details" }),
  ).toHaveAttribute("href", "/privacy");

  const syntheticContent = "private-boundary-fixture-2048";
  await page.getByLabel("Input Text").fill(syntheticContent);
  await expect
    .poll(() =>
      page.evaluate(() => sessionStorage.getItem("text-counter-state")),
    )
    .toContain(syntheticContent);
  await expect(
    page.evaluate(
      (value) => JSON.stringify(localStorage).includes(value),
      syntheticContent,
    ),
  ).resolves.toBe(false);

  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => sessionStorage.getItem("text-counter-state")),
    )
    .not.toContain(syntheticContent);

  await page.getByRole("button", { name: "Send Feedback" }).click();
  await expect(
    page.getByText(/submitting sends your name, email/i),
  ).toBeVisible();
  await expect(page.getByText(/tool content is not attached/i)).toBeVisible();
});

test("the privacy page names the deployed storage and network services", async ({
  page,
}) => {
  const response = await page.goto("/privacy");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle(/Privacy Policy - Textytools data practices/);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /Information We Process/i,
    }),
  ).toBeVisible();
  const browserStorageSection = page
    .getByRole("heading", { level: 2, name: /Browser Storage/i })
    .locator("..");
  await expect(browserStorageSection).toBeVisible();
  await expect(
    browserStorageSection.getByText("sessionStorage", { exact: true }),
  ).toBeVisible();
  await expect(
    browserStorageSection.getByText("localStorage", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /Analytics and Cookies/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /Feedback/i }),
  ).toBeVisible();
  await expect(
    page.getByText(/passes that information to Resend/i),
  ).toBeVisible();
  await expect(
    page.getByText(
      /does not currently run an advertising-network integration/i,
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      /does not currently display a separate cookie-consent manager/i,
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /Information Security/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /International Data Transfers/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /Canadian Privacy Rights/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /European Economic Area and United Kingdom Rights/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /California Privacy Rights/i }),
  ).toBeVisible();
});

test("a cross-tool continuation consumes its one-time transfer", async ({
  page,
}) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.jwtDecoder;
  await openTool(page, fixture.tool, "JWT Decoder");

  await page.getByLabel("JWT Token").fill(fixture.input);
  await page.getByRole("link", { name: "Format with JSON Wizard" }).click();

  await expect(page).toHaveURL(/\/json-wizard$/);
  const jsonInput = page.getByPlaceholder(
    'Paste your JSON here, e.g., {"key": "value"}',
  );
  await expect(jsonInput).toHaveValue(/"name": "Ada Example"/);
  await expect(
    page.evaluate(() => sessionStorage.getItem("cross-tool-input-json-wizard")),
  ).resolves.toBeNull();
});

test("the primary conversion path is keyboard operable", async ({ page }) => {
  const fixture = ACTIVE_PRODUCT_FIXTURES.caseConverter;
  await openTool(page, fixture.tool, "Case Converter");

  const input = page.getByLabel("Input Text");
  await input.focus();
  await page.keyboard.type(fixture.input);

  const snakeCase = page.getByRole("button", { name: /^snake_case/ });
  await snakeCase.focus();
  await page.keyboard.press("Enter");

  await expect(page.getByLabel("Converted Text")).toHaveValue(
    "project_baseline",
  );
  await expect(snakeCase).toBeFocused();
});
