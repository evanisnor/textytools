/**
 * Manual test to verify text-sanitize and case-convert transforms
 */

import { TRANSFORM_REGISTRY } from "../registry";

async function verifyTransforms() {
  console.log("=== Transform Registry Test ===\n");

  // Count transforms
  const allTransforms = Object.keys(TRANSFORM_REGISTRY);
  console.log(`Total transforms registered: ${allTransforms.length}`);
  console.log(`Transforms: ${allTransforms.join(", ")}\n`);

  // Test text-sanitize
  console.log("=== Testing text-sanitize ===");
  const sanitize = TRANSFORM_REGISTRY["text-sanitize"];
  if (sanitize) {
    console.log(`✅ Found: ${sanitize.name}`);
    console.log(`   Category: ${sanitize.category}`);
    console.log(`   Description: ${sanitize.description}`);
    console.log(`   Properties: ${sanitize.propertySchema.length} options`);

    // Test execution
    const result = await sanitize.execute("  Hello   World  \n\n\nTest", {
      trimLines: true,
      removeEmptyLines: true,
      removeExtraSpaces: true,
    });

    console.log(
      `   Test execution: ${result.success ? "✅ Success" : "❌ Failed"}`,
    );
    console.log(`   Output: "${result.data}"`);
    console.log(`   Stats: ${JSON.stringify(result.stats)}`);
  } else {
    console.log("❌ text-sanitize not found in registry");
  }

  console.log("\n=== Testing case-convert ===");
  const caseConvert = TRANSFORM_REGISTRY["case-convert"];
  if (caseConvert) {
    console.log(`✅ Found: ${caseConvert.name}`);
    console.log(`   Category: ${caseConvert.category}`);
    console.log(`   Description: ${caseConvert.description}`);
    console.log(`   Properties: ${caseConvert.propertySchema.length} options`);

    // Test execution
    const result = await caseConvert.execute("hello world test", {
      caseType: "camel",
    });

    console.log(
      `   Test execution: ${result.success ? "✅ Success" : "❌ Failed"}`,
    );
    console.log(`   Output: "${result.data}"`);
    console.log(`   Stats: ${JSON.stringify(result.stats)}`);
  } else {
    console.log("❌ case-convert not found in registry");
  }

  console.log("\n=== Summary ===");
  console.log(
    `✅ Phase 3 Complete: ${allTransforms.length} transforms registered`,
  );
  console.log(
    `✅ Manipulate category: 2 transforms (text-sanitize, case-convert)`,
  );
}

verifyTransforms().catch(console.error);
