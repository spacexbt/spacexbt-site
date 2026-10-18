import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { ProjectLinks } from "@/components/project-links";
import { StatusBadge } from "@/components/status-badge";
import { projects } from "@/content/projects";
import { publicAssetExists } from "@/lib/assets";
import { projectsWithDetail } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projectsWithDetail(projects).map((p) => ({ slug: p.slug }));
}

function findProject(slug: string) {
  return projectsWithDetail(projects).find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: project.name,
      description: project.summary,
      url: `/projects/${slug}`,
    },
  };
}

const chipClass =
  "rounded-md border border-border px-2 py-0.5 font-mono text-xs font-medium text-muted";

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  return (
    <main id="main" className="py-14 md:py-20">
      <div className="mx-auto max-w-[960px] px-5 sm:px-6">
        <div className="max-w-[680px]">
          <Link
            href="/#projects"
            className="text-sm text-muted hover:text-text"
          >
            ← All projects
          </Link>
          <div className="mt-6 flex items-start justify-between gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              {project.name}
            </h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="mt-3 text-muted">{project.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
            {project.tags.map((tag) => (
              <li key={tag} className={chipClass}>
                {tag}
              </li>
            ))}
          </ul>
          {project.stack && project.stack.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2" aria-label="Stack">
              {project.stack.map((item) => (
                <li key={item} className={chipClass}>
                  {item}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5">
            <ProjectLinks project={project} showDetails={false} />
          </div>
        </div>
        {publicAssetExists(project.image) && (
          <Image
            src={project.image}
            alt={`Screenshot of ${project.name}`}
            width={1600}
            height={1000}
            sizes="(min-width: 960px) 912px, 100vw"
            preload
            className="mt-8 aspect-[16/10] w-full rounded-lg border border-border object-cover object-top"
          />
        )}
        <div className="prose-body mt-8 max-w-[680px]">
          <Markdown skipHtml>{project.body}</Markdown>
        </div>
      </div>
    </main>
  );
}
