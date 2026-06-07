import { describe, expect, it } from "vitest";
import {
  buildCheckoutUrl,
  validateEmbedOptions,
  withEmbeddedParam,
} from "./utils";

describe("validateEmbedOptions", () => {
  it("accepts checkoutUrl alone", () => {
    expect(() =>
      validateEmbedOptions({ checkoutUrl: "https://checkout.lomi.africa/x" }),
    ).not.toThrow();
  });

  it("accepts sessionId without checkoutUrl", () => {
    expect(() => validateEmbedOptions({ sessionId: "cs_test" })).not.toThrow();
  });

  it("throws when neither checkoutUrl nor sessionId", () => {
    expect(() => validateEmbedOptions({})).toThrow(/checkoutUrl or sessionId/);
  });
});

describe("withEmbeddedParam", () => {
  it("appends embedded and embed_origin", () => {
    const url = withEmbeddedParam(
      "https://checkout.lomi.africa/checkout/cs_1",
      "https://shop.example",
    );
    expect(url).toContain("embedded=true");
    expect(url).toContain("embed_origin=");
  });
});

describe("buildCheckoutUrl", () => {
  it("uses checkoutUrl when provided", () => {
    const url = buildCheckoutUrl({
      checkoutUrl: "https://checkout.lomi.africa/checkout/cs_1",
    });
    expect(url).toContain("embedded=true");
  });
});
