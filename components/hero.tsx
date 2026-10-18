import { ExternalLink } from "@/components/external-link";
import { XIcon } from "@/components/icons/x";
import { TelegramIcon } from "@/components/icons/telegram";
import { site } from "@/content/site";
import { handleFromUrl } from "@/lib/content";

const pill =
  "rounded-full border border-border px-3 py-1 font-mono text-xs font-medium text-muted";

export function Hero() {
  return (
    <section id="top" className="py-14 md:py-20">
      <div className="mx-auto max-w-[960px] px-5 sm:px-6">
        <div className="max-w-[720px]">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Self-taught dev · On-chain research
          </p>
          <h1 className="mt-4 text-[40px] font-semibold leading-tight tracking-tight md:text-[56px]">
            {site.handle}
          </h1>
          <p className="mt-4 max-w-[560px] text-muted">{site.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-xs font-medium uppercase text-muted">
              Builds with
            </span>
            {site.buildsWith.map((tool) => (
              <span key={tool} className={pill}>
                {tool}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ExternalLink
              href={site.links.x}
              className="inline-flex items-center gap-2 rounded-md bg-text px-4 py-2.5 text-sm font-medium text-bg hover:opacity-90"
            >
              <XIcon className="h-4 w-4" />
              Follow on X · {handleFromUrl(site.links.x)}
            </ExternalLink>
            <ExternalLink
              href={site.links.telegram}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:border-muted"
            >
              <TelegramIcon className="h-4 w-4" />
              Telegram
            </ExternalLink>
            <a
              href="#projects"
              className="px-2 py-2.5 text-sm text-muted hover:text-text"
            >
              See projects ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
