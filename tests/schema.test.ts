import { describe, expect, it } from "vitest";
import { parseFarms, parseProjects, parseSite } from "@/content/schema";

const validProject = (overrides: Record<string, unknown> = {}) => ({
  slug: "reddit-radar",
  name: "The Ticker Radar",
  summary: "A short summary.",
  status: "live",
  tags: ["Stocks"],
  startedAt: "2026-10",
  ...overrides,
});

const validFarm = (overrides: Record<string, unknown> = {}) => ({
  name: "Metric",
  url: "https://docs.metric.xyz",
  chains: ["Ethereum"],
  status: "active",
  ...overrides,
});

describe("project schema", () => {
  it("accepts a valid project", () => {
    expect(parseProjects([validProject()])).toHaveLength(1);
  });
  it("rejects duplicate slugs", () => {
    expect(() => parseProjects([validProject(), validProject()])).toThrow();
  });
  it("rejects non-kebab slug", () => {
    expect(() =>
      parseProjects([validProject({ slug: "Reddit_Radar" })]),
    ).toThrow();
  });
  it("rejects summary over 180 chars", () => {
    expect(() =>
      parseProjects([validProject({ summary: "a".repeat(181) })]),
    ).toThrow();
  });
  it("rejects startedAt 2026-13", () => {
    expect(() =>
      parseProjects([validProject({ startedAt: "2026-13" })]),
    ).toThrow();
  });
  it("rejects startedAt 2026/10", () => {
    expect(() =>
      parseProjects([validProject({ startedAt: "2026/10" })]),
    ).toThrow();
  });
  it("rejects invalid live URL", () => {
    expect(() =>
      parseProjects([validProject({ links: { live: "not a url" } })]),
    ).toThrow();
  });
  it.each(["javascript:alert(1)", "htps://x.com"])(
    "rejects non-http live URL %s",
    (live) => {
      expect(() =>
        parseProjects([validProject({ links: { live } })]),
      ).toThrow();
    },
  );
  it("rejects unknown key", () => {
    expect(() => parseProjects([validProject({ feature: true })])).toThrow();
  });
  it("rejects image outside /projects/", () => {
    expect(() =>
      parseProjects([validProject({ image: "/other/a.png" })]),
    ).toThrow();
  });
});

describe("farm schema", () => {
  it("accepts a valid farm", () => {
    expect(parseFarms([validFarm()])).toHaveLength(1);
  });
  it("rejects note over 100 chars", () => {
    expect(() => parseFarms([validFarm({ note: "a".repeat(101) })])).toThrow();
  });
  it("accepts a referral link and mono logo flag", () => {
    const [farm] = parseFarms([
      validFarm({ referral: "https://app.example.xyz/r/abc", logoMono: true }),
    ]);
    expect(farm.referral).toBe("https://app.example.xyz/r/abc");
  });
  it("rejects a referral that is not an http(s) URL", () => {
    expect(() =>
      parseFarms([validFarm({ referral: "app.example.xyz/r/abc" })]),
    ).toThrow();
  });
  it("rejects status paused", () => {
    expect(() => parseFarms([validFarm({ status: "paused" })])).toThrow();
  });
});

const validSite = (overrides: Record<string, unknown> = {}) => ({
  handle: "someone",
  title: "someone",
  tagline: "Tagline.",
  description: "Description.",
  url: "https://example.com",
  links: {
    x: "https://x.com/someone",
    telegram: "https://t.me/somechannel",
    telegramDm: "https://t.me/someperson",
    github: "https://github.com/someone",
  },
  ...overrides,
});

describe("site schema", () => {
  it("accepts a valid site", () => {
    expect(parseSite(validSite()).url).toBe("https://example.com");
  });
  it("rejects a trailing slash on url", () => {
    expect(() =>
      parseSite(validSite({ url: "https://example.com/" })),
    ).toThrow();
  });
  it("rejects non-http url", () => {
    expect(() => parseSite(validSite({ url: "ftp://example.com" }))).toThrow();
  });
  it("rejects an invalid telegram link", () => {
    expect(() =>
      parseSite(
        validSite({
          links: {
            x: "https://x.com/someone",
            telegram: "javascript:alert(1)",
            github: "https://github.com/someone",
          },
        }),
      ),
    ).toThrow();
  });
  it("rejects unknown key", () => {
    expect(() => parseSite(validSite({ extra: 1 }))).toThrow();
  });
});

describe("real content", () => {
  it("parses and is non-empty", async () => {
    const { projects } = await import("@/content/projects");
    const { farms } = await import("@/content/farming");
    const { site } = await import("@/content/site");
    expect(parseProjects(projects).length).toBeGreaterThanOrEqual(1);
    expect(parseFarms(farms).length).toBeGreaterThanOrEqual(1);
    expect(parseSite(site).url).toBe(site.url);
  });
});
