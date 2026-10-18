import { farms } from "@/content/farming";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { TOOLS } from "@/components/about";

function tickerItems(): string[] {
  const all = [
    ...site.buildsWith,
    ...TOOLS,
    ...projects.flatMap((p) => p.stack ?? []),
    ...farms.flatMap((f) => f.chains),
  ];
  return Array.from(new Set(all));
}

function Track({ items }: { items: string[] }) {
  return (
    <ul className="flex shrink-0 items-center">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center whitespace-nowrap px-5 font-mono text-xs font-medium uppercase tracking-wider text-muted"
        >
          <span className="mr-5 h-1 w-1 rounded-full bg-border" />
          {item}
        </li>
      ))}
    </ul>
  );
}

// Decorative: every item here is already listed elsewhere on the page.
export function Marquee() {
  const items = tickerItems();
  return (
    <div
      aria-hidden="true"
      className="marquee overflow-hidden border-y border-border py-3"
    >
      <div className="marquee-track flex w-max">
        <Track items={items} />
        <Track items={items} />
      </div>
    </div>
  );
}
