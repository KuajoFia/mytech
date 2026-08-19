import { describe, it, expect } from "vitest";
import { formatFCFA, slugify, formatDate, safeParse, truncate } from "@/lib/utils";

describe("formatFCFA", () => {
  // fr-FR uses narrow no-break space (U+202F) as thousands separator in Intl
  const sep = "\u202F";

  it("formats a number with thousands separators and FCFA suffix", () => {
    expect(formatFCFA(1500000)).toBe(`1${sep}500${sep}000 FCFA`);
  });

  it("handles zero", () => {
    expect(formatFCFA(0)).toBe("0 FCFA");
  });

  it("handles negative numbers", () => {
    expect(formatFCFA(-500)).toBe("-500 FCFA");
  });

  it("handles non-finite numbers safely", () => {
    expect(formatFCFA(Number.NaN)).toBe("0 FCFA");
    expect(formatFCFA(Number.POSITIVE_INFINITY)).toBe("0 FCFA");
  });

  it("rounds decimal values", () => {
    expect(formatFCFA(1499.99)).toBe(`1${sep}500 FCFA`);
  });
});

describe("slugify", () => {
  it("lowercases the input", () => {
    expect(slugify("HELLO")).toBe("hello");
  });

  it("replaces accented characters", () => {
    expect(slugify("Câblage réseau")).toBe("cablage-reseau");
  });

  it("replaces special characters with hyphens", () => {
    expect(slugify("Caméra IP 4MP")).toBe("camera-ip-4mp");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("---test---")).toBe("test");
  });

  it("handles empty strings", () => {
    expect(slugify("")).toBe("");
  });
});

describe("safeParse", () => {
  it("parses valid JSON", () => {
    expect(safeParse("[1, 2, 3]", [])).toEqual([1, 2, 3]);
  });

  it("returns fallback for invalid JSON", () => {
    expect(safeParse("not json", "fallback")).toBe("fallback");
  });

  it("returns fallback for non-string input", () => {
    expect(safeParse(42, "fallback")).toBe("fallback");
    expect(safeParse(null, "fallback")).toBe("fallback");
    expect(safeParse(undefined, "fallback")).toBe("fallback");
  });
});

describe("formatDate", () => {
  it("formats a Date in dd/mm/yyyy format", () => {
    const d = new Date("2026-01-15T10:00:00Z");
    const result = formatDate(d);
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it("formats a date string", () => {
    const result = formatDate("2026-01-15T10:00:00Z");
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});

describe("truncate", () => {
  it("returns the input when shorter than max", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns the input when equal to max", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates and adds ellipsis when longer", () => {
    const result = truncate("hello world this is long", 10);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBe(10);
  });
});
