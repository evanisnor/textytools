/** @jest-environment jsdom */

import { act, renderHook } from "@testing-library/react";

import { useCsvJsonConverter } from "../useCsvJsonConverter";

import { ACTIVE_PRODUCT_FIXTURES } from "@/test/fixtures/activeProduct";

describe("useCsvJsonConverter", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("produces a useful result, reports failure, and recovers on correction", () => {
    const { result } = renderHook(() => useCsvJsonConverter());
    act(() => jest.runOnlyPendingTimers());

    act(() => {
      result.current.setInput(ACTIVE_PRODUCT_FIXTURES.csvJsonConverter.input);
    });
    expect(result.current.result.success).toBe(true);
    expect(JSON.parse(result.current.result.output)).toHaveLength(2);

    act(() => {
      result.current.setInput("name,count\nAlpha,2,extra");
    });
    expect(result.current.result).toMatchObject({
      success: false,
      output: "",
      error: expect.stringContaining("3 columns, expected 2"),
    });

    act(() => {
      result.current.setInput("name,count\nAlpha,2");
    });
    expect(result.current.result).toMatchObject({
      success: true,
      error: null,
    });
    expect(JSON.parse(result.current.result.output)).toEqual([
      { name: "Alpha", count: 2 },
    ]);
  });
});
