import { describe, expect, it } from "vitest";
import {
  parsePromptVariables,
  sanitizeVariableValues,
  substituteVariables,
} from "./prompt-variables";

describe("parsePromptVariables", () => {
  it("keeps only well-formed variable entries", () => {
    const result = parsePromptVariables([
      { key: "product", label_ar: "المنتج", label_en: "Product" },
      { label_ar: "no key" },
      "not an object",
      null,
    ]);

    expect(result).toEqual([{ key: "product", label_ar: "المنتج", label_en: "Product" }]);
  });

  it("returns an empty array for non-array input", () => {
    expect(parsePromptVariables(null)).toEqual([]);
    expect(parsePromptVariables({ key: "x" })).toEqual([]);
  });
});

describe("substituteVariables", () => {
  it("replaces every occurrence of a known placeholder", () => {
    const result = substituteVariables(
      "a photo of {{product}} in {{color}}, studio shot of {{product}}",
      { product: "a perfume bottle", color: "blue" },
    );
    expect(result).toBe(
      "a photo of a perfume bottle in blue, studio shot of a perfume bottle",
    );
  });

  it("leaves unknown or empty placeholders untouched", () => {
    const result = substituteVariables("{{known}} and {{unknown}} and {{empty}}", {
      known: "value",
      empty: "",
    });
    expect(result).toBe("value and {{unknown}} and {{empty}}");
  });

  it("tolerates whitespace inside the placeholder braces", () => {
    const result = substituteVariables("{{ product }}", { product: "shoes" });
    expect(result).toBe("shoes");
  });
});

describe("sanitizeVariableValues", () => {
  it("drops keys that are not on the allowlist", () => {
    const result = sanitizeVariableValues(
      { product: "shoes", admin_override: "true" },
      ["product"],
    );
    expect(result).toEqual({ product: "shoes" });
  });

  it("drops non-string values", () => {
    const result = sanitizeVariableValues(
      { product: 123, color: ["red"], size: "large" },
      ["product", "color", "size"],
    );
    expect(result).toEqual({ size: "large" });
  });

  it("truncates values longer than the max length", () => {
    const result = sanitizeVariableValues(
      { product: "x".repeat(500) },
      ["product"],
      10,
    );
    expect(result.product).toHaveLength(10);
  });

  it("returns an empty object for non-object input", () => {
    expect(sanitizeVariableValues(null, ["product"])).toEqual({});
    expect(sanitizeVariableValues("nope", ["product"])).toEqual({});
  });
});
