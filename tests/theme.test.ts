import { describe, expect, it } from "vitest";
import { nextTheme } from "@/lib/theme";

describe("nextTheme", () => {
  it("cycles light -> dark -> system -> light", () => {
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("system");
    expect(nextTheme("system")).toBe("light");
  });
  it("falls back to light for undefined or unknown", () => {
    expect(nextTheme(undefined)).toBe("light");
    expect(nextTheme("sepia")).toBe("light");
  });
});
