/**
 * Pipeline Execution Engine
 * Handles transform execution and output type tracking
 */

import { Document, TransformType } from "../model/types";

import { EXPORT_REGISTRY } from "./exports";
import { TRANSFORM_REGISTRY } from "./registry";

export class PipelineEngine {
  /**
   * Execute entire pipeline from start to finish
   */
  static async executePipeline(document: Document): Promise<string> {
    let currentData = document.inputData;

    for (const step of document.transforms) {
      const transform = TRANSFORM_REGISTRY[step.transformType];

      if (!transform) {
        // Skip transforms that no longer exist in the registry
        step.output = `[Transform "${step.transformType}" no longer available]`;
        continue;
      }

      currentData = transform.execute(currentData, step.properties);
      step.output = currentData;
    }

    return currentData;
  }

  /**
   * Execute single transform step
   */
  static async executeStep(
    input: string,
    transformType: TransformType,
    properties: Record<string, unknown>,
  ): Promise<string> {
    const transform = TRANSFORM_REGISTRY[transformType];

    if (!transform) {
      throw new Error(`Unknown transform type: ${transformType}`);
    }

    return transform.execute(input, properties);
  }

  /**
   * Get current output type for a document
   */
  static getCurrentOutputType(document: Document): string {
    if (document.transforms.length === 0) {
      return document.inputType;
    }

    const lastTransform =
      TRANSFORM_REGISTRY[
        document.transforms[document.transforms.length - 1].transformType
      ];

    // Safety check: if transform no longer exists in registry, return text as default
    if (!lastTransform) {
      return "text";
    }

    return lastTransform.producesOutput;
  }

  /**
   * Get available transforms for current output type
   */
  static getAvailableTransforms(currentOutputType: string) {
    return Object.values(TRANSFORM_REGISTRY).filter((transform) =>
      transform.acceptsInput.includes(currentOutputType),
    );
  }

  /**
   * Get available exports for current output type
   */
  static getAvailableExports(currentOutputType: string) {
    return Object.values(EXPORT_REGISTRY).filter((exp) =>
      exp.acceptsInput.includes(currentOutputType),
    );
  }
}
