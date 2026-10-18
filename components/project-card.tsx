import Image from "next/image";
import { ProjectLinks } from "@/components/project-links";
import { StatusBadge } from "@/components/status-badge";
import type { Project } from "@/content/schema";
import { publicAssetExists } from "@/lib/assets";

export function ProjectCard({
  project,
  featured,
}: {
  project: Project;
  featured: boolean;
}) {
  return (
    <article
      className={`flex flex-col rounded-xl border border-border bg-surface p-5 hover:border-muted md:p-6 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {featured && publicAssetExists(project.image) && (
        <Image
          src={project.image}
          alt={`Screenshot of ${project.name}`}
          width={1600}
          height={1000}
          sizes="(min-width: 960px) 912px, 100vw"
          preload
          className="mb-5 aspect-[16/10] w-full rounded-lg border border-border object-cover object-top"
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-2 text-muted">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
        {project.tags.slice(0, 4).map((tag) => (
          <li
            key={tag}
            className="rounded-md border border-border px-2 py-0.5 font-mono text-xs font-medium text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <ProjectLinks project={project} showDetails />
      </div>
    </article>
  );
}
