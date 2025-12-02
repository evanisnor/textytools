/**
 * Tests for useDocumentManager hook
 *
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from "@testing-library/react";

import {
  registerDummyTransform,
  unregisterDummyTransform,
} from "../../lib/__tests__/test-helpers";
import { useDocumentManager } from "../useDocumentManager";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useDocumentManager", () => {
  beforeEach(() => {
    localStorageMock.clear();
    registerDummyTransform();
  });

  afterEach(() => {
    unregisterDummyTransform();
  });

  describe("Document Creation", () => {
    it("should create a new document", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Hello World", "text");
      });

      expect(result.current.currentDocument).not.toBeNull();
      expect(result.current.currentDocument?.inputData).toBe("Hello World");
      expect(result.current.currentDocument?.inputType).toBe("text");
      expect(result.current.currentDocument?.transforms).toEqual([]);
      expect(result.current.documents).toHaveLength(1);
    });

    it("should set the newly created document as current", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Test Data", "json");
      });

      expect(result.current.currentDocument?.inputData).toBe("Test Data");
      expect(result.current.currentDocument?.inputType).toBe("json");
    });

    it("should generate unique IDs for documents", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Doc 1", "text");
      });
      const doc1Id = result.current.currentDocument?.id;

      act(() => {
        result.current.createDocument("Doc 2", "text");
      });
      const doc2Id = result.current.currentDocument?.id;

      expect(doc1Id).not.toBe(doc2Id);
      expect(result.current.documents).toHaveLength(2);
    });
  });

  describe("Document Deletion", () => {
    it("should delete a document", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Test", "text");
      });

      const docId = result.current.currentDocument!.id;

      act(() => {
        result.current.deleteDocument(docId);
      });

      expect(result.current.documents).toHaveLength(0);
      expect(result.current.currentDocument).toBeNull();
    });

    it("should switch to another document when deleting current", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Doc 1", "text");
      });
      const doc1Id = result.current.currentDocument!.id;

      act(() => {
        result.current.createDocument("Doc 2", "text");
      });

      act(() => {
        result.current.deleteDocument(result.current.currentDocument!.id);
      });

      expect(result.current.documents).toHaveLength(1);
      expect(result.current.currentDocument?.id).toBe(doc1Id);
    });
  });

  describe("Input Data Updates", () => {
    it("should update input data", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Initial", "text");
      });

      act(() => {
        result.current.updateInputData("Updated");
      });

      expect(result.current.currentDocument?.inputData).toBe("Updated");
    });

    it("should trigger pipeline execution after debounce", async () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Hello", "text");
      });

      act(() => {
        result.current.addTransform("dummy-transform");
      });

      // Wait for initial execution
      await waitFor(
        () => {
          expect(result.current.isExecuting).toBe(false);
        },
        { timeout: 1000 },
      );

      act(() => {
        result.current.updateInputData("World");
      });

      // Should eventually execute pipeline
      await waitFor(
        () => {
          expect(
            result.current.currentDocument?.transforms[0].output,
          ).toContain("World");
        },
        { timeout: 1000 },
      );
    });
  });

  describe("Transform Operations", () => {
    it("should add a transform", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Test", "text");
      });

      act(() => {
        result.current.addTransform("dummy-transform");
      });

      expect(result.current.currentDocument?.transforms).toHaveLength(1);
      expect(result.current.currentDocument?.transforms[0].transformType).toBe(
        "dummy-transform",
      );
    });

    it("should initialize transform with default properties", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Test", "text");
      });

      act(() => {
        result.current.addTransform("dummy-transform");
      });

      expect(result.current.currentDocument?.transforms[0].properties).toEqual({
        prefix: "OUTPUT:",
      });
    });

    it("should execute pipeline after adding transform", async () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Hello", "text");
      });

      act(() => {
        result.current.addTransform("dummy-transform");
      });

      await waitFor(
        () => {
          expect(result.current.currentDocument?.transforms[0].output).toBe(
            "OUTPUT: Hello",
          );
        },
        { timeout: 1000 },
      );
    });

    it("should remove a transform", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Test", "text");
      });

      act(() => {
        result.current.addTransform("dummy-transform");
      });

      const stepId = result.current.currentDocument!.transforms[0].id;

      act(() => {
        result.current.removeTransform(stepId);
      });

      expect(result.current.currentDocument?.transforms).toHaveLength(0);
    });

    it("should update transform properties", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Test", "text");
      });

      act(() => {
        result.current.addTransform("dummy-transform");
      });

      const stepId = result.current.currentDocument!.transforms[0].id;

      act(() => {
        result.current.updateTransformProperties(stepId, { prefix: "RESULT:" });
      });

      expect(
        result.current.currentDocument?.transforms[0].properties.prefix,
      ).toBe("RESULT:");
    });

    it("should re-execute from modified step", async () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Hello", "text");
      });

      act(() => {
        result.current.addTransform("dummy-transform");
        result.current.addTransform("dummy-transform");
      });

      // Wait for initial execution
      await waitFor(
        () => {
          expect(result.current.isExecuting).toBe(false);
        },
        { timeout: 1000 },
      );

      const stepId = result.current.currentDocument!.transforms[0].id;

      act(() => {
        result.current.updateTransformProperties(stepId, { prefix: "NEW:" });
      });

      // Should re-execute from first step
      await waitFor(
        () => {
          expect(result.current.currentDocument?.transforms[0].output).toBe(
            "NEW: Hello",
          );
          expect(
            result.current.currentDocument?.transforms[1].output,
          ).toContain("NEW: Hello");
        },
        { timeout: 1000 },
      );
    });

    it("should update transform input selection", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Test", "text");
      });

      act(() => {
        result.current.addTransform("dummy-transform");
      });

      const stepId = result.current.currentDocument!.transforms[0].id;

      act(() => {
        result.current.updateTransformInputSelection(stepId, {
          mode: "regex",
          regexPattern: "test",
          regexFlags: "g",
        });
      });

      expect(
        result.current.currentDocument?.transforms[0].inputSelection.mode,
      ).toBe("regex");
      expect(
        result.current.currentDocument?.transforms[0].inputSelection
          .regexPattern,
      ).toBe("test");
    });

    it("should reorder transforms", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Test", "text");
      });

      act(() => {
        result.current.addTransform("dummy-transform");
        result.current.addTransform("dummy-transform");
      });

      const step1Id = result.current.currentDocument!.transforms[0].id;
      const step2Id = result.current.currentDocument!.transforms[1].id;

      act(() => {
        result.current.reorderTransform(step1Id, 1);
      });

      expect(result.current.currentDocument?.transforms[0].id).toBe(step2Id);
      expect(result.current.currentDocument?.transforms[1].id).toBe(step1Id);
      expect(result.current.currentDocument?.transforms[0].order).toBe(0);
      expect(result.current.currentDocument?.transforms[1].order).toBe(1);
    });
  });

  describe("Pipeline Execution", () => {
    it("should execute full pipeline manually", async () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Hello", "text");
      });

      act(() => {
        result.current.addTransform("dummy-transform");
      });

      // Wait for auto-execution
      await waitFor(
        () => {
          expect(result.current.isExecuting).toBe(false);
        },
        { timeout: 1000 },
      );

      // Manually execute
      await act(async () => {
        await result.current.executePipeline();
      });

      expect(result.current.currentDocument?.transforms[0].output).toBe(
        "OUTPUT: Hello",
      );
    });
  });

  describe("LocalStorage Persistence", () => {
    it("should save documents to localStorage", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Persistent Data", "text");
      });

      const stored = localStorageMock.getItem("apogee-documents");
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].inputData).toBe("Persistent Data");
    });

    it("should load documents from localStorage on mount", () => {
      // Seed localStorage
      const testDoc = {
        id: "test-doc",
        name: "Test Document",
        inputType: "text",
        inputData: "Loaded Data",
        transforms: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      localStorageMock.setItem("apogee-documents", JSON.stringify([testDoc]));

      // Render hook
      const { result } = renderHook(() => useDocumentManager());

      expect(result.current.documents).toHaveLength(1);
      expect(result.current.documents[0].inputData).toBe("Loaded Data");
      expect(result.current.currentDocument?.id).toBe("test-doc");
    });
  });

  describe("Document Switching", () => {
    it("should switch current document", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Doc 1", "text");
      });
      const doc1Id = result.current.currentDocument!.id;

      act(() => {
        result.current.createDocument("Doc 2", "text");
      });

      act(() => {
        result.current.setCurrentDocument(doc1Id);
      });

      expect(result.current.currentDocument?.inputData).toBe("Doc 1");
    });

    it("should set current document to null", () => {
      const { result } = renderHook(() => useDocumentManager());

      act(() => {
        result.current.createDocument("Test", "text");
      });

      act(() => {
        result.current.setCurrentDocument(null);
      });

      expect(result.current.currentDocument).toBeNull();
    });
  });
});
