import type { Farm, Project } from "@/content/schema";

export function isPresentUrl(url: string | undefined): url is string {
  return typeof url === "string" && url !== "" && !url.includes("REPLACE_ME");
}

export function handleFromUrl(url: string): string {
  const segments = new URL(url).pathname.split("/").filter(Boolean);
  return `@${segments[segments.length - 1] ?? ""}`;
}

const STATUS_ORDER: Record<Project["status"], number> = {
  live: 0,
  building: 1,
  archived: 2,
};

export function sortProjects(projects: readonly Project[]): Project[] {
  return [...projects].sort(
    (a, b) =>
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
      b.startedAt.localeCompare(a.startedAt),
  );
}

export function projectsWithDetail(projects: readonly Project[]): Project[] {
  return projects.filter((p) => (p.body?.trim() ?? "") !== "");
}

type VisibleLink = {
  kind: "live" | "repo" | "x";
  label: "Visit" | "GitHub" | "Thread";
  href: string;
};

export function visibleLinks(project: Project): VisibleLink[] {
  const candidates: {
    kind: VisibleLink["kind"];
    label: VisibleLink["label"];
    href?: string;
  }[] = [
    { kind: "live", label: "Visit", href: project.links?.live },
    { kind: "repo", label: "GitHub", href: project.links?.repo },
    { kind: "x", label: "Thread", href: project.links?.x },
  ];
  return candidates.flatMap(({ kind, label, href }) =>
    isPresentUrl(href) ? [{ kind, label, href }] : [],
  );
}

export function groupFarms(farms: readonly Farm[]): {
  active: Farm[];
  ended: Farm[];
} {
  return {
    active: farms.filter((f) => f.status === "active"),
    ended: farms.filter((f) => f.status === "ended"),
  };
}

export function formatYearMonth(ym: string): string {
  const [year, month] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}
