import Link from "next/link";
import { ExternalLink } from "@/components/external-link";
import type { Project } from "@/content/schema";
import { projectsWithDetail, visibleLinks } from "@/lib/content";

const linkClass =
  "inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text hover:border-muted";

export function ProjectLinks({
  project,
  showDetails,
}: {
  project: Project;
  showDetails: boolean;
}) {
  const links = visibleLinks(project);
  const hasDetails = showDetails && projectsWithDetail([project]).length > 0;
  if (links.length === 0 && !hasDetails) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <ExternalLink key={link.kind} href={link.href} className={linkClass}>
          {link.label} ↗
        </ExternalLink>
      ))}
      {hasDetails && (
        <Link
          href={`/projects/${project.slug}`}
          className={`${linkClass} text-accent`}
        >
          Details →
        </Link>
      )}
    </div>
  );
}
