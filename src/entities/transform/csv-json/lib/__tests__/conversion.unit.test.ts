import { csvToJson } from "../csv-to-json";
import { jsonToCsv } from "../json-to-csv";

import { ACTIVE_PRODUCT_FIXTURES } from "@/test/fixtures/activeProduct";

describe("CSV and JSON conversion", () => {
  it("converts the approved CSV fixture to typed JSON", () => {
    const fixture = ACTIVE_PRODUCT_FIXTURES.csvJsonConverter;
    const result = csvToJson(
      fixture.input,
      String(fixture.configuration.delimiter),
      Boolean(fixture.configuration.includeHeaders),
    );

    expect(result).toMatchObject({ success: true, error: null });
    expect(JSON.parse(result.output)).toEqual([
      { name: "Alpha Example", count: 2 },
      { name: "Beta Example", count: 3 },
    ]);
  });

  it("reports an uneven CSV row without returning a partial result", () => {
    const result = csvToJson("name,count\nAlpha,2,extra", ",", true);

    expect(result).toEqual({
      success: false,
      output: "",
      error: "Row 2 has 3 columns, expected 2. Check your delimiter setting.",
    });
  });

  it("flattens nested JSON deterministically", () => {
    const result = jsonToCsv(
      '[{"name":"Alpha Example","meta":{"count":2}}]',
      ",",
      true,
    );

    expect(result).toEqual({
      success: true,
      output: "meta.count,name\n2,Alpha Example",
      error: null,
    });
  });

  it("rejects JSON values outside the supported array-of-objects shape", () => {
    expect(jsonToCsv('{"name":"Alpha Example"}', ",", true)).toEqual({
      success: false,
      output: "",
      error: "JSON must be an array of objects",
    });
  });
});
