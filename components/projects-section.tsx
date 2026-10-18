import { ExternalLink } from "@/components/external-link";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { sortProjects } from "@/lib/content";

export function ProjectsSection() {
  const sorted = sortProjects(projects);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-14 md:py-20"
    >
      <div className="mx-auto max-w-[960px] px-5 sm:px-6">
        <SectionHeading
          index="01"
          label="PROJECTS"
          title="Projects"
          id="projects-heading"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {sorted.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              featured={Boolean(project.featured)}
            />
          ))}
          {sorted.length < 2 && (
            <ExternalLink
              href={site.links.x}
              className="flex items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-muted hover:border-muted hover:text-text md:col-span-2"
            >
              More in the works — follow on X for updates.
            </ExternalLink>
          )}
        </div>
      </div>
    </section>
  );
}
