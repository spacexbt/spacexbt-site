# spacexbt — Personal Website Spec

> Build spec for Claude Code. Read the whole file before writing code. Where this spec makes a decision, follow it; where it says "Claude Code decides", pick the simplest option that meets the requirements and note the choice in the README.

---

## 1. Overview

A personal website for **spacexbt**, a self-taught developer and on-chain researcher. The site has three jobs:

1. Show the projects spacexbt has built or is building.
2. Show which crypto protocols spacexbt is currently farming for airdrops.
3. Point visitors to spacexbt's X account and Telegram channel.

It should also make clear that spacexbt mainly builds with **Claude Code** and **Kimi**.

**Audience:** crypto Twitter followers (~18k on X), people arriving from a project like Reddit Radar, potential collaborators.

**Tone:** confident, understated, builder-focused. No hype language, no emojis in UI copy.

### Hard rules

- **Never** show a real name, real location, city or country anywhere: not in copy, metadata, OG images, JSON-LD, or the README. The person is only "spacexbt".
- **Never** show wallet addresses.
- English only.
- No backend, no database, no login. All content lives in typed files in the repo; updating the site = editing a file and pushing.

---

## 2. Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js, latest stable, **App Router**, TypeScript (strict) |
| Rendering | Fully static (SSG). Every route is pre-rendered at build time. No runtime server code except what Next.js generates for OG images. |
| Styling | Tailwind CSS (latest stable) with CSS variables for theme tokens |
| Theme switching | `next-themes` (class strategy, `attribute="class"`), default = system |
| Fonts | `geist` package: Geist Sans for text, Geist Mono for labels/meta. Loaded via `next/font`, no external font requests. |
| Icons | `lucide-react` for UI icons. X and Telegram logos as small inline SVG components (Lucide has no brand icons). |
| Content validation | `zod` schemas, validated at build time; a build must fail on invalid content |
| Analytics | `@vercel/analytics` (cookieless, no banner needed) |
| Hosting | Vercel, deployed from a GitHub repo |
| Package manager | pnpm |
| Lint/format | ESLint (Next.js config) + Prettier |

Do not add: a CMS, a database, auth, a component library (no shadcn/MUI), animation libraries (no Framer Motion), or any client-side data fetching.

---

## 3. Site map

```
/                     Single-page home with all sections
/projects/[slug]      Optional project detail page (only generated if the project has a detail body)
/404                  Custom not-found page
/sitemap.xml          Generated
/robots.txt           Generated
/opengraph-image      Generated OG image for the home page
```

Home page section order (each section has an `id` for anchor links):

1. Header (sticky)
2. Hero — `#top`
3. Projects — `#projects`
4. Airdrop farming — `#farming`
5. About — `#about`
6. Contact — `#contact`
7. Footer

---

## 4. Content model

All editable content lives in `/content`. Claude Code creates these files with the initial data in section 9.

### 4.1 `content/site.ts`

```ts
export const site = {
  handle: "spacexbt",
  title: "spacexbt",
  tagline: "Self-taught dev. On-chain research. Building with Claude Code and Kimi.",
  description: "Projects, tools and airdrop farms by spacexbt — self-taught developer and on-chain researcher.",
  url: "https://spacexbt.vercel.app", // replace when a custom domain exists
  links: {
    x: "https://x.com/spacexbt",
    telegram: "https://t.me/spaceinsights",
    github: "https://github.com/REPLACE_ME", // TODO: owner fills in
  },
  buildsWith: ["Claude Code", "Kimi"],
} as const;
```

`site.url` must be the single source for canonical URLs, sitemap and OG metadata.

### 4.2 `content/projects.ts`

```ts
type ProjectStatus = "live" | "building" | "archived";

type Project = {
  slug: string;            // kebab-case, unique
  name: string;
  summary: string;         // 1–2 sentences, max ~180 chars, shown on the card
  status: ProjectStatus;
  tags: string[];          // e.g. ["Stocks", "Crypto", "Sentiment"]; max 4 shown on card
  stack?: string[];        // e.g. ["Next.js", "TypeScript"]
  links?: {
    live?: string;         // public URL
    repo?: string;         // GitHub URL; omit for closed-source
    x?: string;            // launch thread / announcement
  };
  image?: string;          // path under /public/projects/, 16:10 screenshot, optional
  featured?: boolean;      // featured projects sort first and get a larger card
  startedAt: string;       // "YYYY-MM"
  body?: string;           // optional markdown; if present, /projects/[slug] is generated
};
```

Rules:
- Links are per-project and all optional. Only render the buttons that exist.
- Sort: featured first, then `live` → `building` → `archived`, then `startedAt` descending.
- Validate with zod: unique slugs, valid URLs, summary length, `startedAt` format.
- Render `body` markdown with a small, safe renderer (e.g. `react-markdown` without raw HTML). Claude Code decides the exact library.

### 4.3 `content/farming.ts`

Simple list — no points, no estimates, no on-chain data.

```ts
type FarmStatus = "active" | "ended";

type Farm = {
  name: string;
  url: string;             // protocol app or docs link
  chains: string[];        // e.g. ["Ethereum", "BNB Chain", "Robinhood Chain"]
  status: FarmStatus;
  logo?: string;           // path under /public/farms/, square SVG/PNG; fallback = first letter monogram
  note?: string;           // optional one-liner, max ~100 chars
  since?: string;          // "YYYY-MM"
};
```

Rules:
- Show `active` farms first. `ended` farms appear below in a muted style.
- Never include wallet addresses, amounts, or referral links unless the owner adds them manually later.

---

## 5. Design system

### 5.1 Direction

Clean, minimal developer site. Lots of whitespace, strong typography, a single accent color, thin borders instead of shadows. Think of a well-made engineer's personal site, not a crypto landing page: no gradients, no glow, no glassmorphism, no stock 3D shapes.

### 5.2 Layout

- Content max width: `720px` for text sections, `960px` for the projects grid. Centered, `px-5` on mobile, `px-6` from `sm`.
- Vertical rhythm: sections separated by `py-20` desktop / `py-14` mobile.
- Section headings: small Geist Mono uppercase label (e.g. `01 / PROJECTS`) above a Geist Sans heading.
- Mobile-first. Must look right at 360px width with no horizontal scroll.

### 5.3 Color tokens

Define on `:root` and `.dark` as CSS variables; reference via Tailwind.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#FAFAF9` | `#0B0B0C` | page background |
| `--surface` | `#FFFFFF` | `#131315` | cards |
| `--border` | `#E7E5E4` | `#26262A` | 1px borders, dividers |
| `--text` | `#1C1917` | `#EDEDED` | primary text |
| `--muted` | `#78716C` | `#8B8B92` | secondary text, meta |
| `--accent` | `#2563EB` | `#60A5FA` | links, focus rings, active status |
| `--live` | `#16A34A` | `#4ADE80` | "Live" / "Active" dot |
| `--building` | `#D97706` | `#FBBF24` | "Building" dot |

Contrast: all text/background pairs must meet WCAG AA.

### 5.4 Typography

| Role | Font | Size (mobile → desktop) | Weight |
|---|---|---|---|
| Hero name | Geist Sans | 40 → 56px, tight tracking | 600 |
| Section heading | Geist Sans | 24 → 28px | 600 |
| Body | Geist Sans | 16 → 17px, line-height 1.6 | 400 |
| Labels, tags, dates, status | Geist Mono | 12–13px, uppercase for labels | 500 |

### 5.5 Components

**Header (sticky)**
- Left: `spacexbt` wordmark in Geist Mono, links to `#top`.
- Right (desktop): anchor links Projects · Farming · About · Contact, then theme toggle, then an X icon button.
- Mobile: wordmark + theme toggle + X icon; anchor links collapse into a simple menu button that opens a full-width dropdown. No hamburger animation library.
- Background `--bg` at ~85% opacity with `backdrop-blur`, bottom border appears only after scrolling 8px.

**Theme toggle**
- Icon button cycling Light → Dark → System, with `aria-label` reflecting the next state. Sun / Moon / Monitor icons.
- No flash of wrong theme on load (`next-themes` with `suppressHydrationWarning` on `<html>`).

**Hero**
- Small mono label: `SELF-TAUGHT DEV · ON-CHAIN RESEARCH`.
- H1: `spacexbt`.
- One-line tagline from `site.tagline`.
- "Builds with" row: two small pill badges, **Claude Code** and **Kimi** (text only, no third-party logos).
- Primary button: **Follow on X** (X logo + `@spacexbt`) → `site.links.x`, opens in new tab.
- Secondary button: **Telegram** → `site.links.telegram`.
- Tertiary text link: "See projects ↓" → `#projects`.
- No hero image, no avatar required. Optional: a subtle 1px dotted grid behind the hero at very low opacity, light and dark variants. Claude Code may skip it if it looks busy.

**Project card**
- Bordered card on `--surface`, 12px radius, 20–24px padding, hover: border shifts to `--muted`, no shadow, no lift.
- Top row: name (semibold) + status badge (colored dot + mono label `LIVE` / `BUILDING` / `ARCHIVED`).
- Summary text in `--muted`.
- Tags as small mono chips.
- Bottom row: link buttons that exist — `Visit ↗`, `GitHub ↗`, `Thread ↗`, and `Details →` if `body` exists.
- Featured card: full width of the grid, optional screenshot on top (16:10, `next/image`, rounded, bordered).
- Grid: 1 column mobile, 2 columns from `md`. With a single project, the featured card spans full width and the grid does not look empty (see empty-state below).
- External links: `target="_blank" rel="noopener noreferrer"`.

**Projects empty/low state**
- If there are fewer than 2 projects, show a muted dashed-border card after them: "More in the works — follow on X for updates." linking to X.

**Farming list**
- Section intro (one line): "Protocols I'm currently farming. Not financial advice — do your own research."
- Each row: logo (24px, rounded) or monogram · name · chain chips · status dot · `↗` link. On mobile, chips wrap below the name.
- Rendered as a list with dividers, not cards, to keep it lightweight.
- Ended farms below an `ENDED` mono sublabel, 60% opacity.
- Small mono footnote: `Last updated: <month year>` — derive from a `farmingUpdatedAt` constant exported from `content/farming.ts`.

**About**
- 2–3 short paragraphs (copy in section 9), max width 640px.
- A small "Tools" line: `Claude Code · Kimi · TypeScript · Python · Foundry` as mono chips.

**Contact**
- Heading: "Get in touch".
- Copy: "The fastest way to reach me is a DM on X. For updates and research, join the Telegram channel."
- Two large link rows: X (`@spacexbt`, "DMs open") and Telegram (`@spaceinsights`, "Channel").
- No contact form, no email address.

**Footer**
- Left: `© <current year> spacexbt`.
- Center/right: "Built with Claude Code & Kimi" in muted mono.
- Right: X icon link, Telegram icon link, GitHub icon link (hide GitHub if the URL still contains `REPLACE_ME`).
- Top border `--border`.

**Project detail page** (`/projects/[slug]`)
- Back link "← All projects" to `/#projects`.
- Name, status badge, tags, stack, link buttons, optional screenshot, then rendered `body` markdown in a 680px prose column.
- Own metadata (title = `<Project> — spacexbt`, description = summary).

**404 page**
- Mono `404`, line "Nothing here.", link back home. Same header/footer.

### 5.6 Motion

- Only CSS transitions (150–200ms) on hover, focus and theme change.
- Optional fade-up on section entry using CSS + `IntersectionObserver`, max 8px translate. Disabled entirely under `prefers-reduced-motion`.
- Smooth scrolling for anchor links, also disabled under reduced motion.

---

## 6. SEO, metadata, sharing

- Use the Next.js Metadata API. Default title `spacexbt`, template `%s — spacexbt`.
- `description` from `site.description`.
- Canonical URLs from `site.url`.
- Twitter card: `summary_large_image`, `creator: @spacexbt`, `site: @spacexbt`.
- **OG image** generated with `next/og` (1200×630): `--bg` dark background, large `spacexbt` in Geist Sans, tagline below, `x.com/spacexbt` in mono at the bottom. Project detail pages get their own OG image with the project name and status.
- Favicon/app icon: a simple mono monogram `s` or `sx` generated as SVG plus a 180px PNG apple icon. Claude Code designs it within the minimal style.
- `sitemap.ts` and `robots.ts` (allow all).
- JSON-LD: `Person` schema with `name: "spacexbt"`, `url`, and `sameAs` [X, Telegram]. No real name, no address.
- `<html lang="en">`.

---

## 7. Accessibility & performance

**Accessibility**
- WCAG 2.1 AA.
- Visible focus rings using `--accent` on every interactive element.
- Skip link "Skip to content" as the first focusable element.
- All icon-only buttons have `aria-label`s. External links announce "(opens in new tab)" via visually hidden text.
- Status is never conveyed by color alone (always dot + text label).
- Semantic landmarks: `header`, `main`, `section` with headings, `footer`.

**Performance targets (Lighthouse, mobile)**
- Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100.
- No layout shift from fonts or images (use `next/font` and sized `next/image`).
- No client-side JavaScript beyond the theme toggle, mobile menu, optional section fade-in, and Vercel Analytics. Everything else is a Server Component.

---

## 8. Project structure

```
/app
  layout.tsx            # fonts, ThemeProvider, header, footer, analytics, metadata defaults
  page.tsx              # home: composes the sections
  projects/[slug]/page.tsx
  not-found.tsx
  opengraph-image.tsx
  sitemap.ts
  robots.ts
  globals.css           # tokens + base styles
/components
  header.tsx
  mobile-menu.tsx       # client
  theme-toggle.tsx      # client
  hero.tsx
  section-heading.tsx
  project-card.tsx
  status-badge.tsx
  farming-list.tsx
  about.tsx
  contact.tsx
  footer.tsx
  icons/ (x.tsx, telegram.tsx, github.tsx)
/content
  site.ts
  projects.ts
  farming.ts
  schema.ts             # zod schemas + validation run at import time
/public
  projects/             # screenshots
  farms/                # protocol logos
README.md
```

---

## 9. Initial content

### 9.1 Projects

Only one project at launch. The structure must make adding more trivial.

```ts
{
  slug: "reddit-radar",
  name: "The Ticker Radar",
  summary: "A live front page of the stocks and crypto that Reddit and 4chan are talking about — mentions, buzz and sentiment across 15+ boards.",
  status: "live",
  tags: ["Stocks", "Crypto", "Sentiment", "Live data"],
  stack: ["Next.js", "TypeScript"], // TODO: owner confirms
  links: {
    live: "https://www.reddit-radar.app",
    repo: "https://github.com/REPLACE_ME/reddit-radar", // TODO: owner fills in exact repo URL
  },
  image: "/projects/reddit-radar.png", // TODO: owner adds a 16:10 screenshot; render without image if missing
  featured: true,
  startedAt: "2026-10",
  body: `
The Ticker Radar (reddit-radar.app) tracks which tickers retail is discussing right now.

- Boards: r/wallstreetbets, r/stocks, r/investing, r/options, r/Daytrading, r/SPACs, r/CryptoCurrency, r/CryptoMarkets, r/SatoshiStreetBets, r/Bitcoin, 4chan /biz/ and more
- Time windows: 24H, 7D, 30D
- Watchlist and keyboard-driven search (⌘K, /)
- Data: mentions and Reddit sentiment via ApeWisdom, posts and mood via StockTwits, prices via Yahoo Finance and CoinGecko

Discussion volume, not financial advice.
`,
}
```

If the screenshot or repo URL is missing at build time, the card must still render cleanly (no broken image, no dead button). Treat any URL containing `REPLACE_ME` as absent.

### 9.2 Farming

```ts
export const farmingUpdatedAt = "2026-10";

{
  name: "Metric",
  url: "https://docs.metric.xyz",
  chains: ["Ethereum", "BNB Chain", "Robinhood Chain"],
  status: "active",
  note: "DEX for active pools — oracle-guided and PropAMM liquidity.",
  since: "2026-10",
}
```

Logo: none at launch → use the monogram fallback.

### 9.3 Copy

**Hero tagline:** Self-taught dev. On-chain research. Building with Claude Code and Kimi.

**About:**

> I'm spacexbt — a self-taught developer and on-chain researcher. I build tools that turn noisy market data into something readable: sentiment trackers, alerting systems, data pipelines and dashboards.
>
> Almost everything I ship is built with Claude Code and Kimi. I started coding about two years ago and learned by building real things, in public.
>
> On X and Telegram I share on-chain research, token deep-dives and smart contract security notes.

Claude Code may tighten the wording but must not add personal details (name, location, age, employer).

---

## 10. README requirements

The README must explain, for a non-expert:

1. How to run locally (`pnpm install`, `pnpm dev`).
2. **How to add a project** — copy-paste example entry for `content/projects.ts`, where to put the screenshot, size recommendation (1600×1000).
3. **How to add/end a farm** — example entry, how to mark it `ended`, where to put a logo, and to bump `farmingUpdatedAt`.
4. How to change links (X, Telegram, GitHub) in `content/site.ts`.
5. How deploys work (push to `main` → Vercel builds automatically; open a PR for a preview URL).
6. **How to connect a custom domain later**: buy domain → Vercel project → Settings → Domains → add domain → set DNS records Vercel shows → update `site.url` → redeploy.
7. That builds fail on invalid content, and how to read the zod error.

---

## 11. Deployment

1. Create a new GitHub repo (e.g. `spacexbt-site`).
2. Import into Vercel; framework preset Next.js; no environment variables needed.
3. Enable Vercel Analytics in the project dashboard.
4. Default URL: `spacexbt.vercel.app` (or whatever Vercel assigns — update `site.url` to match).
5. Custom domain: later, see README.

---

## 12. Build order

1. Scaffold Next.js + TypeScript + Tailwind + pnpm, ESLint/Prettier.
2. Tokens, fonts, `ThemeProvider`, theme toggle, base layout (header/footer).
3. Content files + zod schemas + validation.
4. Hero, Projects (card, badge, low-state card), Farming list, About, Contact.
5. Project detail page.
6. Metadata, OG images, favicon, sitemap, robots, JSON-LD.
7. Accessibility pass (keyboard-only walk-through, reduced motion, contrast).
8. Lighthouse run, fix anything below target.
9. README.

---

## 13. Acceptance criteria

- [ ] `pnpm build` succeeds with zero type errors and zero lint errors.
- [ ] Every route is statically generated.
- [ ] X link appears in the hero and the footer (and header icon), all pointing to `https://x.com/spacexbt`.
- [ ] Telegram link `https://t.me/spaceinsights` appears in hero, contact and footer.
- [ ] "Claude Code" and "Kimi" appear in the hero and the footer.
- [ ] Reddit Radar card shows `LIVE`, links to reddit-radar.app, and opens a detail page.
- [ ] Metric appears as an active farm with its three chains.
- [ ] Light, dark and system themes work with no flash on reload.
- [ ] No real name, location, or wallet address anywhere in the built output (grep the `.next` output to confirm).
- [ ] Missing screenshot / `REPLACE_ME` URLs degrade gracefully.
- [ ] Lighthouse mobile targets from section 7 are met.
- [ ] Layout correct at 360px, 768px, 1280px.
- [ ] Adding a second project or farm requires editing only one file in `/content`.

---

## 14. Open items for the owner

- GitHub profile URL and exact Reddit Radar repo URL.
- Reddit Radar screenshot (16:10).
- Confirm Reddit Radar's stack for the `stack` field.
- Custom domain (optional, later).
- More projects to add over time (e.g. alerting tools, agents) — just add entries to `content/projects.ts`.

---

## 15. Decisions log (grilling session, 2026-10-18)

These override anything above that conflicts.

| # | Decision | Overrides |
|---|---|---|
| D1 | Launch with **one project only**: The Ticker Radar. The low-state "More in the works" card is therefore visible at launch. | §14 "more projects" |
| D2 | Project display name is **The Ticker Radar** (matches the live site title). Slug stays `reddit-radar` (matches the domain `reddit-radar.app`). | §9.1 naming mix |
| D3 | The Ticker Radar repo (`spacexbt/reddit-ticker-radar`) stays **private** → no `repo` link on the card or detail page. | §9.1 `links.repo` |
| D4 | The Ticker Radar stack: `["Next.js", "TypeScript", "Turso", "Vercel"]`. | §9.1 `stack` TODO |
| D5 | GitHub profile is `https://github.com/spacexbt` (public profile verified clean: display name "spacexbt", no location/company/email). | §4.1 `links.github`, §14 |
| D6 | Screenshot: captured by Claude Code from `https://www.reddit-radar.app` at 1600×1000 (site default theme) → `public/projects/reddit-radar.png`. Owner may replace later. | §9.1 `image` TODO |
| D7 | This repo commits as `spacexbt <176180399+spacexbt@users.noreply.github.com>` (repo-local git config). The owner's personal email address must never appear in this repo's history. | new |
| D8 | "Builds with Claude Code and Kimi" claim stays everywhere the spec puts it. | — |
| D9 | Privacy check: gitignored `.privacy-denylist` (one term per line, `#` comments) filled in by the owner only; `pnpm check:privacy` scans the build output + repo text files and fails on any match or on any `0x` + 40-hex wallet address. Missing denylist = failure. | §13 grep criterion |
| D10 | Repo lives at `~/Desktop/Apps/spacexbt-site`, GitHub `spacexbt/spacexbt-site`, **public**. | §11.1 |
| D11 | Testing: Vitest, test-first for logic only (zod schemas, sorting, farm grouping, `REPLACE_ME` handling, date formatting, asset-exists check, privacy scan, sitemap). UI verified via `pnpm build`, privacy check, Lighthouse, screenshots at 360/768/1280. No component tests. | new |
| D12 | Everything is built and reviewed on `localhost` first. GitHub repo creation, Vercel linking and deploy happen **only after the owner says go**. | §11 ordering |
| D13 | Process: this spec + decisions → `docs/superpowers/plans/` → execution. Brainstorming skipped (spec already serves as design doc). | CLAUDE.md default flow |
