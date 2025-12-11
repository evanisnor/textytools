/**
 * Tests for the Apogee execution engine
 */

import type { TransformDefinition } from "../../model/types";
import { ApogeeEngine } from "../engine";
import { registerTransform } from "../registry";

import {
  createTestDocument,
  registerDummyTransform,
  unregisterDummyTransform,
} from "./test-helpers";

describe("ApogeeEngine", () => {
  // Register dummy transform before each test
  beforeEach(() => {
    registerDummyTransform();
  });

  // Clean up after each test
  afterEach(() => {
    unregisterDummyTransform();
  });

  describe("executePipeline", () => {
    it("should execute a single transform step", async () => {
      const doc = createTestDocument();

      // Add a transform step using the dummy transform
      doc.transforms.push({
        id: "step-1",
        documentId: doc.id,
        order: 0,
        transformType: "dummy-transform",
        inputSelection: {
          mode: "all",
        },
        properties: {
          prefix: "RESULT:",
        },
        output: "",
        createdAt: Date.now(),
      });

      const result = await ApogeeEngine.executePipeline(doc);

      expect(result).toBe("RESULT: Hello World");
      expect(doc.transforms[0].output).toBe("RESULT: Hello World");
    });

    it("should execute multiple transform steps in sequence", async () => {
      const doc = createTestDocument();

      // Add two transform steps
      doc.transforms.push(
        {
          id: "step-1",
          documentId: doc.id,
          order: 0,
          transformType: "dummy-transform",
          inputSelection: { mode: "all" },
          properties: { prefix: "STEP1:" },
          output: "",
          createdAt: Date.now(),
        },
        {
          id: "step-2",
          documentId: doc.id,
          order: 1,
          transformType: "dummy-transform",
          inputSelection: { mode: "all" },
          properties: { prefix: "STEP2:" },
          output: "",
          createdAt: Date.now(),
        },
      );

      const result = await ApogeeEngine.executePipeline(doc);

      expect(result).toBe("STEP2: STEP1: Hello World");
      expect(doc.transforms[0].output).toBe("STEP1: Hello World");
      expect(doc.transforms[1].output).toBe("STEP2: STEP1: Hello World");
    });

    it("should handle missing transforms gracefully", async () => {
      const doc = createTestDocument();

      doc.transforms.push({
        id: "step-1",
        documentId: doc.id,
        order: 0,
        transformType: "nonexistent-transform",
        inputSelection: { mode: "all" },
        properties: {},
        output: "",
        createdAt: Date.now(),
      });

      const result = await ApogeeEngine.executePipeline(doc);

      expect(result).toContain("no longer available");
      expect(doc.transforms[0].output).toContain("no longer available");
    });

    it("should continue pipeline after transform failure", async () => {
      const doc = createTestDocument();

      // Register a failing transform (using dummy-transform type for testing)
      const failingTransform: TransformDefinition = {
        type: "dummy-transform",
        name: "Failing Transform",
        description: "Always fails",
        category: "encode",
        acceptsInput: ["text"],
        producesOutput: "text",
        propertySchema: [],
        defaultProperties: {},
        execute: () => ({
          success: false,
          data: "",
          error: "This transform always fails",
          mimeType: "text/plain",
        }),
      };

      // Temporarily replace the dummy transform with the failing one
      registerTransform(failingTransform);

      doc.transforms.push(
        {
          id: "step-1",
          documentId: doc.id,
          order: 0,
          transformType: "dummy-transform",
          inputSelection: { mode: "all" },
          properties: {},
          output: "",
          createdAt: Date.now(),
        },
        {
          id: "step-2",
          documentId: doc.id,
          order: 1,
          transformType: "dummy-transform",
          inputSelection: { mode: "all" },
          properties: { prefix: "AFTER_FAIL:" },
          output: "",
          createdAt: Date.now(),
        },
      );

      const result = await ApogeeEngine.executePipeline(doc);

      expect(doc.transforms[0].output).toBe("This transform always fails");
      expect(result).toBe("AFTER_FAIL: This transform always fails");
    });
  });

  describe("executeFromStep", () => {
    it("should re-execute from specified step onwards", async () => {
      const doc = createTestDocument();

      // Add three transforms
      doc.transforms.push(
        {
          id: "step-1",
          documentId: doc.id,
          order: 0,
          transformType: "dummy-transform",
          inputSelection: { mode: "all" },
          properties: { prefix: "STEP1:" },
          output: "STEP1: Hello World",
          createdAt: Date.now(),
        },
        {
          id: "step-2",
          documentId: doc.id,
          order: 1,
          transformType: "dummy-transform",
          inputSelection: { mode: "all" },
          properties: { prefix: "STEP2:" },
          output: "STEP2: STEP1: Hello World",
          createdAt: Date.now(),
        },
        {
          id: "step-3",
          documentId: doc.id,
          order: 2,
          transformType: "dummy-transform",
          inputSelection: { mode: "all" },
          properties: { prefix: "STEP3:" },
          output: "STEP3: STEP2: STEP1: Hello World",
          createdAt: Date.now(),
        },
      );

      // Change step 2 properties and re-execute from step 1
      doc.transforms[1].properties = { prefix: "MODIFIED:" };
      await ApogeeEngine.executeFromStep(doc, 1);

      // Step 0 should remain unchanged
      expect(doc.transforms[0].output).toBe("STEP1: Hello World");

      // Steps 1 and 2 should be re-executed
      expect(doc.transforms[1].output).toBe("MODIFIED: STEP1: Hello World");
      expect(doc.transforms[2].output).toBe(
        "STEP3: MODIFIED: STEP1: Hello World",
      );
    });
  });

  describe("getCurrentOutputType", () => {
    it("should return document inputType when no transforms", () => {
      const doc = createTestDocument();
      expect(ApogeeEngine.getCurrentOutputType(doc)).toBe("text");
    });

    it("should return last transform output type", () => {
      const doc = createTestDocument();

      doc.transforms.push({
        id: "step-1",
        documentId: doc.id,
        order: 0,
        transformType: "dummy-transform",
        inputSelection: { mode: "all" },
        properties: {},
        output: "",
        createdAt: Date.now(),
      });

      // The dummy transform produces "text"
      expect(ApogeeEngine.getCurrentOutputType(doc)).toBe("text");
    });
  });

  describe("getAvailableTransforms", () => {
    it("should filter transforms by input type compatibility", () => {
      const available = ApogeeEngine.getAvailableTransforms("text");

      // The dummy transform accepts "text" and "json"
      expect(available.length).toBeGreaterThan(0);
      expect(available.every((t) => t.acceptsInput.includes("text"))).toBe(
        true,
      );
    });

    it("should return empty array for incompatible types", () => {
      const available = ApogeeEngine.getAvailableTransforms("nonexistent-type");
      expect(available.length).toBe(0);
    });
  });
});
