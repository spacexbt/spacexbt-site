import { ExternalLink } from "@/components/external-link";
import { SectionHeading } from "@/components/section-heading";
import { TelegramIcon } from "@/components/icons/telegram";
import { XIcon } from "@/components/icons/x";
import { site } from "@/content/site";
import { handleFromUrl } from "@/lib/content";

const row =
  "flex items-center gap-4 rounded-xl border border-border bg-surface p-4 hover:border-muted md:p-5";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-14 md:py-20"
    >
      <div className="mx-auto max-w-[960px] px-5 sm:px-6">
        <div className="max-w-[720px]">
          <SectionHeading
            index="04"
            label="CONTACT"
            title="Get in touch"
            id="contact-heading"
          />
          <p className="text-muted">
            The fastest way to reach me is a DM on X or Telegram. The Telegram
            channel is where I share research and thoughts, so DMs there
            won&apos;t reach me.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ExternalLink href={site.links.x} className={row}>
              <XIcon className="h-5 w-5 shrink-0" />
              <span className="flex flex-col">
                <span className="font-medium">
                  {handleFromUrl(site.links.x)}
                </span>
                <span className="font-mono text-xs text-muted">DMs open</span>
              </span>
            </ExternalLink>
            <ExternalLink href={site.links.telegramDm} className={row}>
              <TelegramIcon className="h-5 w-5 shrink-0" />
              <span className="flex flex-col">
                <span className="font-medium">
                  {handleFromUrl(site.links.telegramDm)}
                </span>
                <span className="font-mono text-xs text-muted">DMs open</span>
              </span>
            </ExternalLink>
            <ExternalLink
              href={site.links.telegram}
              className={`${row} sm:col-span-2`}
            >
              <TelegramIcon className="h-5 w-5 shrink-0" />
              <span className="flex flex-col">
                <span className="font-medium">
                  {handleFromUrl(site.links.telegram)}
                </span>
                <span className="font-mono text-xs text-muted">
                  Channel, updates only
                </span>
              </span>
            </ExternalLink>
          </div>
        </div>
      </div>
    </section>
  );
}
