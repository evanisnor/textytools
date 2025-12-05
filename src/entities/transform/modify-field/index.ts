/**
 * Modify Field Transform
 * Exports TransformDefinition for Apogee registry
 */

import type { TransformDefinition } from "../shared/types";

import {
  executeModifyField,
  modifyFieldPropertySchema,
  modifyFieldDefaultProperties,
} from "./lib/modifyField";

export const modifyFieldDefinition: TransformDefinition = {
  type: "modify-field",
  name: "Modify Field",
  description:
    "Modify specific fields in structured data using regex replace, case conversion, or date formatting",
  category: "manipulate",
  acceptsInput: [
    "application/json",
    "text/csv",
    "application/yaml",
    "application/xml",
    "application/toml",
  ],
  producesOutput: "application/json",
  propertySchema: modifyFieldPropertySchema,
  defaultProperties: modifyFieldDefaultProperties,
  execute: executeModifyField,
};
