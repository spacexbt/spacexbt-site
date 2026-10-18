import { SectionHeading } from "@/components/section-heading";

const tools = ["Claude Code", "Kimi", "TypeScript", "Python", "Foundry"];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-14 md:py-20"
    >
      <div className="mx-auto max-w-[960px] px-5 sm:px-6">
        <div className="max-w-[720px]">
          <div className="max-w-[640px]">
            <SectionHeading
              index="03"
              label="ABOUT"
              title="About"
              id="about-heading"
            />
            <div className="space-y-4">
              <p>
                I&apos;m spacexbt, a self-taught developer and on-chain
                researcher. I build tools that turn noisy market data into
                something readable: sentiment trackers, alerting systems, data
                pipelines and dashboards.
              </p>
              <p>
                Almost everything I ship is built with Claude Code and Kimi. I
                started coding about two years ago and learned by building real
                things, in public.
              </p>
              <p>
                On X and Telegram I share on-chain research, token deep-dives
                and smart contract security notes.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-xs font-medium uppercase text-muted">
                Tools
              </span>
              <ul className="flex flex-wrap gap-2" aria-label="Tools">
                {tools.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-md border border-border px-2 py-0.5 font-mono text-xs font-medium text-muted"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
