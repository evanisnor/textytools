import {
  countCharacters,
  countLines,
  countParagraphs,
  countWords,
} from "../counters";

import { ACTIVE_PRODUCT_FIXTURES } from "@/test/fixtures/activeProduct";

describe("text counters", () => {
  it("counts the approved multiline fixture by each published rule", () => {
    const { input } = ACTIVE_PRODUCT_FIXTURES.textCounter;

    expect(countCharacters(input)).toBe(16);
    expect(countWords(input)).toBe(3);
    expect(countLines(input)).toBe(2);
    expect(countParagraphs(input)).toBe(1);
  });

  it("distinguishes empty, whitespace, line, and paragraph boundaries", () => {
    expect(countCharacters("  ")).toBe(2);
    expect(countWords("  \n\t")).toBe(0);
    expect(countLines("")).toBe(0);
    expect(countLines("alpha\r\nbeta")).toBe(2);
    expect(countParagraphs("alpha\n\n  \n\nbeta")).toBe(2);
  });
});
