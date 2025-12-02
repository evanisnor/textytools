/**
 * Tests for ApogeeProvider and useApogeeContext
 *
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { render, renderHook } from "@testing-library/react";
import React from "react";

import { ApogeeProvider, useApogeeContext } from "../ApogeeProvider";

describe("ApogeeProvider", () => {
  it("should render children", () => {
    const { getByText } = render(
      <ApogeeProvider>
        <div>Test Child</div>
      </ApogeeProvider>,
    );

    expect(getByText("Test Child")).toBeInTheDocument();
  });

  it("should provide context value to children", () => {
    const TestComponent = () => {
      const context = useApogeeContext();
      return <div>{context ? "Has Context" : "No Context"}</div>;
    };

    const { getByText } = render(
      <ApogeeProvider>
        <TestComponent />
      </ApogeeProvider>,
    );

    expect(getByText("Has Context")).toBeInTheDocument();
  });
});

describe("useApogeeContext", () => {
  it("should throw error when used outside provider", () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useApogeeContext());
    }).toThrow(
      "useApogeeContext must be used within an ApogeeProvider. " +
        "Make sure your component is wrapped in <ApogeeProvider>.",
    );

    // Restore console.error
    console.error = originalError;
  });

  it("should return context when used inside provider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ApogeeProvider>{children}</ApogeeProvider>
    );

    const { result } = renderHook(() => useApogeeContext(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.currentDocument).toBeDefined();
    expect(result.current.documents).toBeDefined();
    expect(result.current.createDocument).toBeInstanceOf(Function);
    expect(result.current.addTransform).toBeInstanceOf(Function);
  });

  it("should provide access to all document manager methods", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ApogeeProvider>{children}</ApogeeProvider>
    );

    const { result } = renderHook(() => useApogeeContext(), { wrapper });

    // Verify all expected methods exist
    expect(result.current.createDocument).toBeInstanceOf(Function);
    expect(result.current.deleteDocument).toBeInstanceOf(Function);
    expect(result.current.setCurrentDocument).toBeInstanceOf(Function);
    expect(result.current.updateInputData).toBeInstanceOf(Function);
    expect(result.current.addTransform).toBeInstanceOf(Function);
    expect(result.current.updateTransformProperties).toBeInstanceOf(Function);
    expect(result.current.updateTransformInputSelection).toBeInstanceOf(
      Function,
    );
    expect(result.current.removeTransform).toBeInstanceOf(Function);
    expect(result.current.reorderTransform).toBeInstanceOf(Function);
    expect(result.current.executeFromStep).toBeInstanceOf(Function);
    expect(result.current.executePipeline).toBeInstanceOf(Function);
  });

  it("should provide access to state properties", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ApogeeProvider>{children}</ApogeeProvider>
    );

    const { result } = renderHook(() => useApogeeContext(), { wrapper });

    // Verify state properties exist
    expect(result.current).toHaveProperty("currentDocument");
    expect(result.current).toHaveProperty("documents");
    expect(result.current).toHaveProperty("isExecuting");
  });
});
