/**
 * JSON Convert Transform
 * Exports TransformDefinition for Apogee registry
 */

import type { TransformDefinition } from "../shared/types";

import {
  executeJsonConvert,
  jsonConvertPropertySchema,
  jsonConvertDefaultProperties,
} from "./lib/jsonConvert";

export const jsonConvertDefinition: TransformDefinition = {
  type: "json-convert",
  name: "Convert to JSON",
  description:
    "Parse and convert data to JSON format with customizable formatting options",
  category: "convert",
  acceptsInput: ["*"],
  producesOutput: "application/json",
  propertySchema: jsonConvertPropertySchema,
  defaultProperties: jsonConvertDefaultProperties,
  execute: executeJsonConvert,
};
