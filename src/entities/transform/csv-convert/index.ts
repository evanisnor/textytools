/**
 * CSV Convert Transform
 * Exports TransformDefinition for Apogee registry
 */

import type { TransformDefinition } from "../shared/types";

import {
  executeCsvConvert,
  csvConvertPropertySchema,
  csvConvertDefaultProperties,
} from "./lib/csvConvert";

export const csvConvertDefinition: TransformDefinition = {
  type: "csv-convert",
  name: "Convert to CSV",
  description:
    "Parse JSON or CSV and convert to CSV format with customizable delimiters",
  category: "convert",
  acceptsInput: ["application/json", "text/csv", "*"],
  producesOutput: "text/csv",
  propertySchema: csvConvertPropertySchema,
  defaultProperties: csvConvertDefaultProperties,
  execute: executeCsvConvert,
};
