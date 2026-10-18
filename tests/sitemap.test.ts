import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { projectsWithDetail } from "@/lib/content";

describe("sitemap", () => {
  it("lists home and project detail pages", () => {
    expect(sitemap().map((e) => e.url)).toEqual([
      site.url,
      ...projectsWithDetail(projects).map(
        (p) => `${site.url}/projects/${p.slug}`,
      ),
    ]);
  });
});

describe("robots", () => {
  it("allows all and points at the sitemap", () => {
    const r = robots();
    expect(r.sitemap).toBe(`${site.url}/sitemap.xml`);
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    expect(rules.some((x) => x.userAgent === "*" && x.allow === "/")).toBe(
      true,
    );
  });
});
