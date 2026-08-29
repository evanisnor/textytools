import { isAnalyticsEnabled } from "../analyticsConfig";

describe("isAnalyticsEnabled", () => {
  it("enables analytics for Vercel Production", () => {
    expect(
      isAnalyticsEnabled({ nodeEnv: "production", vercelEnv: "production" }),
    ).toBe(true);
  });

  it.each(["preview", "development"])(
    "disables analytics for the Vercel %s environment",
    (vercelEnv) => {
      expect(isAnalyticsEnabled({ nodeEnv: "production", vercelEnv })).toBe(
        false,
      );
    },
  );

  it("allows an explicitly configured non-production analytics property", () => {
    expect(
      isAnalyticsEnabled({
        nodeEnv: "production",
        vercelEnv: "preview",
        explicitlyEnabled: "true",
      }),
    ).toBe(true);
  });

  it("preserves production behavior outside Vercel", () => {
    expect(isAnalyticsEnabled({ nodeEnv: "production" })).toBe(true);
    expect(isAnalyticsEnabled({ nodeEnv: "development" })).toBe(false);
  });
});
