import { describe, expect, it } from "vitest";
import type { Farm, Project } from "@/content/schema";
import {
  formatYearMonth,
  groupFarms,
  handleFromUrl,
  isPresentUrl,
  projectsWithDetail,
  sortProjects,
  visibleLinks,
} from "@/lib/content";

const project = (overrides: Partial<Project> = {}): Project => ({
  slug: "p",
  name: "P",
  summary: "s",
  status: "live",
  tags: ["t"],
  startedAt: "2026-01",
  ...overrides,
});

const farm = (name: string, status: Farm["status"]): Farm => ({
  name,
  url: "https://example.com",
  chains: ["Ethereum"],
  status,
});

describe("isPresentUrl", () => {
  it("handles absent and placeholder values", () => {
    expect(isPresentUrl(undefined)).toBe(false);
    expect(isPresentUrl("")).toBe(false);
    expect(isPresentUrl("https://github.com/REPLACE_ME")).toBe(false);
    expect(isPresentUrl("https://x.com/spacexbt")).toBe(true);
  });
});

describe("sortProjects", () => {
  it("orders featured, then status, then startedAt desc, without mutating", () => {
    const input = [
      project({
        slug: "archived-2026-01",
        status: "archived",
        startedAt: "2026-01",
      }),
      project({ slug: "live-2025-01", status: "live", startedAt: "2025-01" }),
      project({
        slug: "building-2026-05",
        status: "building",
        startedAt: "2026-05",
      }),
      project({ slug: "live-2026-03", status: "live", startedAt: "2026-03" }),
      project({
        slug: "featured-archived",
        status: "archived",
        featured: true,
      }),
    ];
    const before = input.map((p) => p.slug);
    const sorted = sortProjects(input);
    expect(sorted.map((p) => p.slug)).toEqual([
      "featured-archived",
      "live-2026-03",
      "live-2025-01",
      "building-2026-05",
      "archived-2026-01",
    ]);
    expect(input.map((p) => p.slug)).toEqual(before);
    expect(sorted).not.toBe(input);
  });
});

describe("visibleLinks", () => {
  it("drops REPLACE_ME links", () => {
    const links = visibleLinks(
      project({
        links: {
          live: "https://a.example",
          repo: "https://github.com/REPLACE_ME/x",
          x: "https://x.com/a/status/1",
        },
      }),
    );
    expect(links.map((l) => l.kind)).toEqual(["live", "x"]);
    expect(links.map((l) => l.label)).toEqual(["Visit", "Thread"]);
  });
  it("returns [] without links", () => {
    expect(visibleLinks(project())).toEqual([]);
  });
});

describe("projectsWithDetail", () => {
  it("keeps only non-blank bodies", () => {
    const result = projectsWithDetail([
      project({ slug: "blank", body: "  \n " }),
      project({ slug: "text", body: "text" }),
      project({ slug: "none" }),
    ]);
    expect(result.map((p) => p.slug)).toEqual(["text"]);
  });
});

describe("groupFarms", () => {
  it("splits by status preserving order", () => {
    const { active, ended } = groupFarms([
      farm("A", "ended"),
      farm("B", "active"),
      farm("C", "active"),
    ]);
    expect(active.map((f) => f.name)).toEqual(["B", "C"]);
    expect(ended.map((f) => f.name)).toEqual(["A"]);
  });
});

describe("formatYearMonth", () => {
  it("formats in en-US", () => {
    expect(formatYearMonth("2026-10")).toBe("October 2026");
    expect(formatYearMonth("2027-01")).toBe("January 2027");
  });
});

describe("handleFromUrl", () => {
  it("returns @ plus the last path segment", () => {
    expect(handleFromUrl("https://t.me/somechannel")).toBe("@somechannel");
    expect(handleFromUrl("https://x.com/someone")).toBe("@someone");
  });
  it("ignores trailing slashes and query strings", () => {
    expect(handleFromUrl("https://x.com/someone/?s=1")).toBe("@someone");
  });
});
