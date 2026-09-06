import { executeSimpleMatch, executeWithNamedGroups } from "../execution";

import { ACTIVE_PRODUCT_FIXTURES } from "@/test/fixtures/activeProduct";

describe("regex execution", () => {
  it("collects every approved named capture", () => {
    const { input } = ACTIVE_PRODUCT_FIXTURES.regexTester;

    expect(
      executeWithNamedGroups(input.pattern, input.flags, input.text, ["label"]),
    ).toEqual([{ label: "alpha" }, { label: "beta" }]);
  });

  it("adds global execution when collecting repeated named captures", () => {
    expect(
      executeWithNamedGroups("(?<digit>\\d)", "", "1 2", ["digit"]),
    ).toEqual([{ digit: "1" }, { digit: "2" }]);
  });

  it("terminates zero-length global matches", () => {
    expect(executeWithNamedGroups("(?<empty>)", "g", "ab", ["empty"])).toEqual([
      { empty: "" },
      { empty: "" },
      { empty: "" },
    ]);
  });

  it("preserves native syntax errors for the feature recovery path", () => {
    expect(() => executeSimpleMatch("(", "g", "synthetic")).toThrow(
      SyntaxError,
    );
  });
});
