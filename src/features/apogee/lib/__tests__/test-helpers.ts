/**
 * Test helpers for Apogee tests
 * These utilities are only available in test files
 */

import type { TransformDefinition, Document } from "../../model/types";
import { registerTransform, unregisterTransform } from "../registry";

/**
 * Dummy transform for testing the execution engine
 * This transform is ONLY for use in tests
 */
export const DUMMY_TRANSFORM: TransformDefinition = {
  type: "dummy-transform",
  name: "Dummy Transform",
  description: "A placeholder transform for testing the execution engine",
  category: "manipulate",
  acceptsInput: ["text", "json"],
  producesOutput: "text",
  propertySchema: [
    {
      key: "prefix",
      label: "Prefix",
      type: "text",
      defaultValue: "OUTPUT:",
    },
  ],
  defaultProperties: {
    prefix: "OUTPUT:",
  },
  execute: (input: string, properties: Record<string, unknown>) => {
    const prefix = properties.prefix as string;
    return {
      success: true,
      data: `${prefix} ${input}`,
      mimeType: "text/plain",
      stats: [
        { label: "Status", value: "Success", alert: "info" },
        { label: "Length", value: input.length + prefix.length + 1 },
      ],
    };
  },
};

/**
 * Register the dummy transform for testing
 * Call this in beforeEach() or at the start of your test
 */
export function registerDummyTransform(): void {
  registerTransform(DUMMY_TRANSFORM);
}

/**
 * Unregister the dummy transform after testing
 * Call this in afterEach() to clean up
 */
export function unregisterDummyTransform(): void {
  unregisterTransform("dummy-transform");
}

/**
 * Helper to create test documents
 */
export function createTestDocument(overrides?: Partial<Document>): Document {
  return {
    id: "test-doc-1",
    name: "Test Document",
    inputType: "text",
    inputData: "Hello World",
    transforms: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}
