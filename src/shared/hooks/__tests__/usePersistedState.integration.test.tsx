/** @jest-environment jsdom */

import { act, renderHook } from "@testing-library/react";

import { usePersistedState } from "../usePersistedState";

describe("usePersistedState browser boundary", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("restores saved state and persists subsequent updates", () => {
    sessionStorage.setItem(
      "fixture-tool-state",
      JSON.stringify({ input: "restored synthetic input", mode: "pretty" }),
    );

    const { result } = renderHook(() =>
      usePersistedState({
        storageKey: "fixture-tool-state",
        initialState: { input: "", mode: "pretty" },
      }),
    );

    act(() => jest.runOnlyPendingTimers());
    expect(result.current.state).toEqual({
      input: "restored synthetic input",
      mode: "pretty",
    });

    act(() => result.current.updateState({ mode: "minified" }));
    expect(
      JSON.parse(sessionStorage.getItem("fixture-tool-state") ?? ""),
    ).toEqual({ input: "restored synthetic input", mode: "minified" });
  });

  it("consumes a one-time cross-tool transfer ahead of persisted input", () => {
    sessionStorage.setItem(
      "fixture-tool-state",
      JSON.stringify({ input: "older value", mode: "pretty" }),
    );
    sessionStorage.setItem("cross-tool-input-fixture", "transferred value");

    const { result } = renderHook(() =>
      usePersistedState({
        storageKey: "fixture-tool-state",
        initialState: { input: "", mode: "pretty" },
        crossToolKey: "cross-tool-input-fixture",
        crossToolField: "input",
      }),
    );

    act(() => jest.runOnlyPendingTimers());
    expect(result.current.state).toEqual({
      input: "transferred value",
      mode: "pretty",
    });
    expect(sessionStorage.getItem("cross-tool-input-fixture")).toBeNull();
  });

  it("recovers to the initial state when persisted JSON is corrupt", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    sessionStorage.setItem("fixture-tool-state", "{broken");

    const { result } = renderHook(() =>
      usePersistedState({
        storageKey: "fixture-tool-state",
        initialState: { input: "safe default" },
      }),
    );

    act(() => jest.runOnlyPendingTimers());
    expect(result.current.state).toEqual({ input: "safe default" });
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to load persisted state from fixture-tool-state:",
      expect.any(SyntaxError),
    );
  });
});
