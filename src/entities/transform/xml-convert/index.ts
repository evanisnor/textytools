/**
 * XML Convert Transform
 * Exports TransformDefinition for Apogee registry
 */

import type { TransformDefinition } from "../shared/types";

import {
  executeXmlConvert,
  xmlConvertPropertySchema,
  xmlConvertDefaultProperties,
} from "./lib/xmlConvert";

export const xmlConvertDefinition: TransformDefinition = {
  type: "xml-convert",
  name: "Convert to XML",
  description:
    "Parse and convert data to XML format with customizable formatting options",
  category: "convert",
  acceptsInput: ["*"],
  producesOutput: "application/xml",
  propertySchema: xmlConvertPropertySchema,
  defaultProperties: xmlConvertDefaultProperties,
  execute: executeXmlConvert,
};
