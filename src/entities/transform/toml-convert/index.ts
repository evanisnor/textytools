/**
 * TOML Convert Transform
 * Exports TransformDefinition for Apogee registry
 */

import type { TransformDefinition } from "../shared/types";

import {
  executeTomlConvert,
  tomlConvertPropertySchema,
  tomlConvertDefaultProperties,
} from "./lib/tomlConvert";

export const tomlConvertDefinition: TransformDefinition = {
  type: "toml-convert",
  name: "Convert to TOML",
  description:
    "Parse and convert data to TOML format with customizable formatting options",
  category: "convert",
  acceptsInput: ["*"],
  producesOutput: "application/toml",
  propertySchema: tomlConvertPropertySchema,
  defaultProperties: tomlConvertDefaultProperties,
  execute: executeTomlConvert,
};
