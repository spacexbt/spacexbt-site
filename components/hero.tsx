import { ExternalLink } from "@/components/external-link";
import { XIcon } from "@/components/icons/x";
import { TelegramIcon } from "@/components/icons/telegram";
import { site } from "@/content/site";
import { handleFromUrl } from "@/lib/content";
import { delay } from "@/lib/motion";

const pill =
  "rounded-full border border-border bg-bg/60 px-3 py-1 font-mono text-xs font-medium text-muted backdrop-blur-sm";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden py-14 md:py-24">
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="hero-glow absolute -left-32 top-4 -z-10 h-[420px] w-[420px] rounded-full"
      />
      <div className="mx-auto max-w-[960px] px-5 sm:px-6">
        <div className="max-w-[720px]">
          <p className="enter font-mono text-xs font-medium uppercase tracking-wider">
            <span className="shimmer">Self-taught dev · Onchain research</span>
          </p>
          <h1
            className="enter mt-4 text-[40px] font-semibold leading-tight tracking-tight md:text-[56px]"
            style={delay(80)}
          >
            {site.handle}
            <span
              aria-hidden="true"
              className="caret ml-1 inline-block h-[0.8em] w-[0.08em] translate-y-[0.08em] bg-accent"
            />
          </h1>
          <p className="enter mt-4 max-w-[560px] text-muted" style={delay(160)}>
            {site.tagline}
          </p>
          <div
            className="enter mt-6 flex flex-wrap items-center gap-2"
            style={delay(240)}
          >
            <span className="mr-1 font-mono text-xs font-medium uppercase text-muted">
              Builds with
            </span>
            {site.buildsWith.map((tool) => (
              <span key={tool} className={pill}>
                {tool}
              </span>
            ))}
          </div>
          <div
            className="enter mt-8 flex flex-wrap items-center gap-3"
            style={delay(320)}
          >
            <ExternalLink
              href={site.links.x}
              className="shine inline-flex items-center gap-2 rounded-md bg-text px-4 py-2.5 text-sm font-medium text-bg hover:opacity-90"
            >
              <XIcon className="h-4 w-4" />
              Follow on X · {handleFromUrl(site.links.x)}
            </ExternalLink>
            <ExternalLink
              href={site.links.telegram}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-bg/60 px-4 py-2.5 text-sm font-medium backdrop-blur-sm hover:border-muted"
            >
              <TelegramIcon className="h-4 w-4" />
              Telegram channel
            </ExternalLink>
            <a
              href="#projects"
              className="group px-2 py-2.5 text-sm text-muted hover:text-text"
            >
              See projects{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
