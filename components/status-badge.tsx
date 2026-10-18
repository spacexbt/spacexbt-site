import type { Farm, Project } from "@/content/schema";

type Status = Project["status"] | Farm["status"];

const DOT: Record<Status, string> = {
  live: "bg-live",
  active: "bg-live",
  building: "bg-building",
  archived: "bg-muted",
  ended: "bg-muted",
};

export function StatusBadge({
  status,
  dotClassName = "",
}: {
  status: Status;
  dotClassName?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase text-muted">
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${DOT[status]} ${dotClassName}`}
      />
      {status}
    </span>
  );
}
