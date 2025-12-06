/**
 * Apogee Execution Engine
 *
 * Orchestrates the pipeline execution flow:
 * 1. Lens Pass: Extract and parse data
 * 2. Transform Pass: Apply transformation
 * 3. Cache results and continue to next step
 */

import type { Document, TransformDefinition } from "../model/types";

import { executeLensPass } from "./lens";
import { TRANSFORM_REGISTRY } from "./registry";

import { detectFormat } from "@/entities/transform/shared";

/**
 * Apogee Pipeline Execution Engine
 */
export class ApogeeEngine {
  /**
   * Execute complete pipeline from start to finish
   */
  static async executePipeline(document: Document): Promise<string> {
    let currentData = document.inputData;

    for (const step of document.transforms) {
      const transform = TRANSFORM_REGISTRY[step.transformType];

      if (!transform) {
        // Graceful degradation for missing transforms
        step.output = `[Transform "${step.transformType}" no longer available]`;
        currentData = step.output;
        continue;
      }

      // PHASE 1: Lens Pass
      // Only use lens extraction if:
      // 1. Transform is a "convert" type AND
      // 2. Input format is unknown (unstructured text)
      // Otherwise, use mode "all" (pass-through)
      const shouldUseLens =
        transform.category === "convert" &&
        detectFormat(currentData) === "unknown";

      // When lens extraction is needed but mode is "all", it means
      // the user hasn't configured extraction yet - skip this step
      if (shouldUseLens && step.inputSelection.mode === "all") {
        step.output =
          "Enter an extraction pattern to convert unstructured text";
        currentData = step.output;
        continue;
      }

      const effectiveInputSelection = shouldUseLens
        ? step.inputSelection
        : { ...step.inputSelection, mode: "all" as const };

      const lensResult = await executeLensPass(
        currentData,
        effectiveInputSelection,
      );

      if (!lensResult.success) {
        // Lens extraction failed - halt this step
        step.output = lensResult.error || "[Lens extraction failed]";
        currentData = step.output;
        continue;
      }

      // PHASE 2: Transform Pass
      const transformResult = await transform.execute(
        lensResult.data,
        step.properties,
      );

      if (!transformResult.success) {
        // Transform failed - store error but continue pipeline
        step.output = transformResult.error || "[Transform failed]";
        currentData = step.output;
        continue;
      }

      // Success - cache output, mimeType, stats, and continue
      step.output = transformResult.data;
      step.mimeType = transformResult.mimeType;
      step.stats = transformResult.stats;
      currentData = transformResult.data;
    }

    return currentData;
  }

  /**
   * Incremental execution: only re-run from modified step onwards
   */
  static async executeFromStep(
    document: Document,
    fromStepIndex: number,
  ): Promise<void> {
    // Get starting data: either document input or previous step's output
    let currentData =
      fromStepIndex === 0
        ? document.inputData
        : document.transforms[fromStepIndex - 1].output;

    // Re-execute from modified step to end of pipeline
    for (let i = fromStepIndex; i < document.transforms.length; i++) {
      const step = document.transforms[i];
      const transform = TRANSFORM_REGISTRY[step.transformType];

      if (!transform) {
        step.output = `[Transform "${step.transformType}" no longer available]`;
        currentData = step.output;
        continue;
      }

      const lensResult = await executeLensPass(
        currentData,
        step.inputSelection,
      );

      if (!lensResult.success) {
        step.output = lensResult.error || "[Lens extraction failed]";
        currentData = step.output;
        continue;
      }

      const transformResult = await transform.execute(
        lensResult.data,
        step.properties,
      );
      step.output = transformResult.success
        ? transformResult.data
        : transformResult.error || "";
      step.mimeType = transformResult.mimeType;
      step.stats = transformResult.stats;
      currentData = step.output;
    }
  }

  /**
   * Get current output type at any point in pipeline
   * Used to filter available transforms in UI
   */
  static getCurrentOutputType(document: Document): string {
    if (document.transforms.length === 0) {
      return document.inputType;
    }

    const lastTransform =
      TRANSFORM_REGISTRY[
        document.transforms[document.transforms.length - 1].transformType
      ];

    if (!lastTransform) {
      return "text"; // Fallback for missing transforms
    }

    return lastTransform.producesOutput;
  }

  /**
   * Filter transforms that accept current output type
   * Prevents invalid transform chains
   */
  static getAvailableTransforms(
    currentOutputType: string,
  ): TransformDefinition[] {
    return Object.values(TRANSFORM_REGISTRY).filter((transform) =>
      transform.acceptsInput.includes(currentOutputType),
    );
  }
}
