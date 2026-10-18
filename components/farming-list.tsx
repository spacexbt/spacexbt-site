import Image from "next/image";
import { ExternalLink } from "@/components/external-link";
import { SectionHeading } from "@/components/section-heading";
import { StatusBadge } from "@/components/status-badge";
import { farms, farmingUpdatedAt } from "@/content/farming";
import type { Farm } from "@/content/schema";
import { publicAssetExists } from "@/lib/assets";
import { formatYearMonth, groupFarms } from "@/lib/content";

function FarmRow({ farm }: { farm: Farm }) {
  const ended = farm.status === "ended";
  const fade = ended ? "opacity-60" : "";

  return (
    <li className="flex items-start gap-3 py-4">
      {publicAssetExists(farm.logo) ? (
        <Image
          src={farm.logo}
          alt=""
          width={24}
          height={24}
          className={`mt-0.5 h-6 w-6 rounded ${farm.logoMono ? "dark:invert" : ""} ${fade}`}
        />
      ) : (
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border font-mono text-xs font-medium text-muted ${fade}`}
        >
          {farm.name.charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className={`font-medium ${ended ? "text-muted" : "text-text"}`}>
            {farm.name}
          </span>
          <StatusBadge status={farm.status} dotClassName={fade} />
        </div>
        <ul className="mt-1.5 flex flex-wrap gap-2" aria-label="Chains">
          {farm.chains.map((chain) => (
            <li
              key={chain}
              className="rounded-md border border-border px-2 py-0.5 font-mono text-xs font-medium text-muted"
            >
              {chain}
            </li>
          ))}
        </ul>
        {farm.note && <p className="mt-1.5 text-sm text-muted">{farm.note}</p>}
        {farm.referral && (
          <ExternalLink
            href={farm.referral}
            className="mt-2 inline-flex font-mono text-xs font-medium text-accent hover:underline"
          >
            Join {farm.name} ↗
          </ExternalLink>
        )}
      </div>
      <ExternalLink
        href={farm.url}
        aria-label={`${farm.name} (opens in new tab)`}
        className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted hover:text-text"
      >
        <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          ↗
        </span>
      </ExternalLink>
    </li>
  );
}

export function FarmingList() {
  const { active, ended } = groupFarms(farms);

  return (
    <section
      id="farming"
      aria-labelledby="farming-heading"
      className="py-14 md:py-20"
    >
      <div className="mx-auto max-w-[960px] px-5 sm:px-6">
        <div className="max-w-[720px]">
          <SectionHeading
            index="02"
            label="AIRDROP FARMING"
            title="Airdrop farming"
            id="farming-heading"
          />
          <p className="text-muted">
            Protocols I&apos;m currently farming. Not financial advice, do your
            own research.
          </p>
          <ul
            data-reveal
            className="mt-6 divide-y divide-border border-y border-border"
          >
            {active.map((farm) => (
              <FarmRow key={farm.name} farm={farm} />
            ))}
          </ul>
          {ended.length > 0 && (
            <>
              <p className="mt-8 font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Ended
              </p>
              <ul className="mt-3 divide-y divide-border border-y border-border">
                {ended.map((farm) => (
                  <FarmRow key={farm.name} farm={farm} />
                ))}
              </ul>
            </>
          )}
          <p className="mt-4 font-mono text-xs text-muted">
            Last updated: {formatYearMonth(farmingUpdatedAt)}
          </p>
        </div>
      </div>
    </section>
  );
}
