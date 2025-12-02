/**
 * YAML Convert Transform
 * Exports TransformDefinition for Apogee registry
 */

import type { TransformDefinition } from "../shared/types";

import {
  executeYamlConvert,
  yamlConvertPropertySchema,
  yamlConvertDefaultProperties,
} from "./lib/yamlConvert";

export const yamlConvertDefinition: TransformDefinition = {
  type: "yaml-convert",
  name: "Convert to YAML",
  description:
    "Parse and convert data to YAML format with customizable formatting options",
  category: "convert",
  acceptsInput: ["*"],
  producesOutput: "text/yaml",
  propertySchema: yamlConvertPropertySchema,
  defaultProperties: yamlConvertDefaultProperties,
  execute: executeYamlConvert,
};
