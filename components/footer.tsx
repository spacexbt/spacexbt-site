import { ExternalLink } from "@/components/external-link";
import { GithubIcon } from "@/components/icons/github";
import { TelegramIcon } from "@/components/icons/telegram";
import { XIcon } from "@/components/icons/x";
import { site } from "@/content/site";
import { isPresentUrl } from "@/lib/content";

const iconLink =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-text";
const icon = "h-[18px] w-[18px]";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[960px] flex-col gap-3 px-5 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.handle}
        </p>
        <p>Built with Claude Code &amp; Kimi</p>
        <div className="flex items-center gap-1">
          <ExternalLink
            href={site.links.x}
            aria-label={`${site.handle} on X (opens in new tab)`}
            className={iconLink}
          >
            <XIcon className={icon} />
          </ExternalLink>
          <ExternalLink
            href={site.links.telegram}
            aria-label="Telegram channel (opens in new tab)"
            className={iconLink}
          >
            <TelegramIcon className={icon} />
          </ExternalLink>
          {isPresentUrl(site.links.github) && (
            <ExternalLink
              href={site.links.github}
              aria-label={`${site.handle} on GitHub (opens in new tab)`}
              className={iconLink}
            >
              <GithubIcon className={icon} />
            </ExternalLink>
          )}
        </div>
      </div>
    </footer>
  );
}
