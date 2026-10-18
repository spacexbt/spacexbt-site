import { projects } from "@/content/projects";
import { projectsWithDetail } from "@/lib/content";
import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "spacexbt project";
export const size = OG_SIZE;
export const contentType = "image/png";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectsWithDetail(projects).map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectsWithDetail(projects).find((p) => p.slug === slug);
  if (!project) throw new Error(`Unknown project: ${slug}`);
  return renderOg({
    title: project.name,
    subtitle: project.summary,
    footer: "spacexbt",
    badge: project.status.toUpperCase(),
  });
}
