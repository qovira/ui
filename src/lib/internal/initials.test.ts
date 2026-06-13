import { describe, expect, it } from "vitest";
import { computeInitials } from "./initials.js";

describe("computeInitials", () => {
  it("takes the first letter of the first two words", () => {
    expect(computeInitials("Ada Lovelace")).toBe("AL");
  });

  it("keeps only the first two of three or more words", () => {
    expect(computeInitials("John Ronald Reuel Tolkien")).toBe("JR");
  });

  it("yields a single initial for a one-word name", () => {
    expect(computeInitials("Madonna")).toBe("M");
  });

  it("uppercases a lowercase name", () => {
    expect(computeInitials("ada lovelace")).toBe("AL");
  });

  it("picks the first LETTER of a word, skipping leading digits/symbols", () => {
    expect(computeInitials("3Com Networks")).toBe("CN");
  });

  it("handles accented / non-Latin letters via \\p{L}", () => {
    expect(computeInitials("José Ñoño")).toBe("JÑ");
    expect(computeInitials("Ża Źródło")).toBe("ŻŹ");
  });

  it("collapses surrounding and repeated whitespace", () => {
    expect(computeInitials("   Ada    Lovelace ")).toBe("AL");
  });

  it("returns an empty string when the name has no letters", () => {
    expect(computeInitials("?")).toBe("");
    expect(computeInitials("123 !!!")).toBe("");
  });

  it("returns an empty string for an empty name", () => {
    expect(computeInitials("")).toBe("");
  });
});
