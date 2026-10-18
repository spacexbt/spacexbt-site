import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { projectsWithDetail } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url },
    ...projectsWithDetail(projects).map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
    })),
  ];
}
