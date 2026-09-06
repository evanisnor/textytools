import { decodeJWT } from "../decoder";

import { ACTIVE_PRODUCT_FIXTURES } from "@/test/fixtures/activeProduct";

describe("JWT decoding", () => {
  it("decodes the approved synthetic three-part token", () => {
    const decoded = decodeJWT(ACTIVE_PRODUCT_FIXTURES.jwtDecoder.input);

    expect(decoded).toMatchObject({
      header: { alg: "none", typ: "JWT" },
      payload: {
        sub: "fixture-user",
        name: "Ada Example",
        iat: 1704067200,
      },
      signature: "synthetic-signature",
      algorithm: "none",
      isValid: true,
    });
    expect(decoded.issuedAt?.toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("rejects the wrong number of compact-token parts", () => {
    expect(() => decodeJWT("only.two")).toThrow(
      "Invalid JWT format. Expected 3 parts separated by dots.",
    );
  });

  it("rejects a non-JSON payload without accepting a partial decode", () => {
    expect(() => decodeJWT("e30.bm90LWpzb24.synthetic-signature")).toThrow(
      "Decode error:",
    );
  });
});
