# spacexbt Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A fully static personal homepage for spacexbt (projects, airdrop farms, X/Telegram links) on Next.js, deployable to Vercel, with all content in typed, zod-validated files.

**Architecture:** Next.js App Router, every route pre-rendered at build. Content lives in `/content/*.ts` and is validated by zod at import time, so bad content fails `pnpm build`. Pure logic (sorting, grouping, URL presence, formatting) lives in `/lib` and is unit-tested; all components are Server Components except theme toggle and mobile menu.

**Tech Stack:** Next.js 16.4.2 (App Router, TS strict), Tailwind CSS v4, next-themes 0.4.6, geist 1.8.1, lucide-react, zod 4, react-markdown 10, @vercel/analytics, Vitest, ESLint (eslint-config-next) + Prettier, pnpm 10, Node 22.

**Spec:** `docs/superpowers/specs/2026-10-18-spacexbt-site-design.md` — read sections 1–14 **and** the decisions log in §15 (D1–D13), which overrides §1–14 where they conflict. Component copy and visual details are specified there and not repeated here.

## Global Constraints

- Never output a real name, location, city, country, wallet address, or email anywhere (copy, metadata, OG, JSON-LD, README, commits). The person is only `spacexbt`.
- Commits in this repo are authored `spacexbt <176180399+spacexbt@users.noreply.github.com>` (already set in repo-local git config — never override it). Message format `<type>: <description>`, ending with the line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- English only. No emojis in UI copy. No hype language.
- Do not add: a CMS, database, auth, component library (shadcn/MUI), animation library, client-side data fetching, `console.log`.
- Client components allowed only: `theme-toggle.tsx`, `mobile-menu.tsx`, `ThemeProvider` wrapper, `<Analytics />`. Everything else is a Server Component.
- Any URL containing `REPLACE_ME` is treated as absent.
- External links: `target="_blank" rel="noopener noreferrer"` + visually hidden text "(opens in new tab)".
- Content widths: 720px text sections, 960px projects grid, 680px detail prose, 640px about. Gutters `px-5` / `sm:px-6`. Sections `py-14` / `md:py-20`.
- Color tokens exactly as spec §5.3; fonts/sizes exactly as §5.4.
- Every route statically generated: `pnpm build` output must show no `ƒ (Dynamic)` routes.
- Files < 800 lines; comments only for what code can't say.

## Review Focus

1. **Ended farms at 60% opacity** — spec §5.5 says 60% opacity, but muted text at 60% falls below WCAG AA, and no ended farm exists at launch so Lighthouse won't catch it. Expected: ended rows use `--muted` text color; opacity-60 applies only to logo/monogram and status dot. Pinned by a fixture render check in Task 5 Step 7.
2. **Anchor links under the sticky header** — clicking "Projects" scrolls the heading under the 64px sticky header. Expected: `scroll-padding-top` on `html` keeps section labels visible. Pinned in Task 4 Step 6 and verified in Task 9.
3. **Theme toggle hydration** — server doesn't know the theme; rendering the icon on the server causes a mismatch or wrong icon flash. Expected: same-size button renders with no icon until mounted; no hydration warning in console. Pinned in Task 4 Step 7.
4. **`REPLACE_ME` / missing assets** — a forgotten `REPLACE_ME` in any link or a missing screenshot/logo file. Expected: button/image simply absent, never a dead link or broken image. Pinned by `visibleLinks` and `publicAssetExists` tests (Tasks 2, 5).
5. **Local Lighthouse vs. Vercel Analytics** — `<Analytics />` requests `/_vercel/insights/script.js`, which 404s off-Vercel and costs Best Practices points. Expected: `<Analytics />` renders only when `process.env.VERCEL` is set at build. Pinned in Task 4 Step 5 and verified in Task 9.

---

## File Map

```
app/
  layout.tsx                    fonts, ThemeProvider, skip link, Header, Footer, Analytics, default metadata
  page.tsx                      home: Hero, Projects, Farming, About, Contact + Person JSON-LD
  globals.css                   tokens (:root/.dark), @theme mapping, base, header scroll border, prose-body
  not-found.tsx                 404
  projects/[slug]/page.tsx      detail page
  projects/[slug]/opengraph-image.tsx
  opengraph-image.tsx           home OG
  icon.svg                      favicon
  apple-icon.tsx                180px PNG
  sitemap.ts, robots.ts
components/
  theme-provider.tsx (client), theme-toggle.tsx (client), mobile-menu.tsx (client)
  header.tsx, footer.tsx, external-link.tsx, section-heading.tsx, status-badge.tsx,
  hero.tsx, project-card.tsx, projects-section.tsx, farming-list.tsx, about.tsx, contact.tsx,
  project-links.tsx
  icons/x.tsx, icons/telegram.tsx, icons/github.tsx
content/
  schema.ts, site.ts, projects.ts, farming.ts
lib/
  content.ts      pure content helpers
  assets.ts       publicAssetExists (node fs)
  theme.ts        nextTheme
  og.tsx          shared OG renderer
scripts/
  privacy-scan.mjs, check-privacy.mjs
tests/
  schema.test.ts, content.test.ts, assets.test.ts, theme.test.ts, privacy.test.ts, sitemap.test.ts
public/projects/reddit-radar.png, public/farms/.gitkeep
README.md
```

---

### Task 1: Scaffold and tooling

**Files:**
- Create: Next.js scaffold in repo root, `vitest.config.ts`, `.prettierrc.json`, `.prettierignore`, `public/projects/.gitkeep`, `public/farms/.gitkeep`
- Modify: `package.json` scripts, `.gitignore`, `eslint.config.mjs`
- Delete: `app/favicon.ico`, scaffold SVGs in `public/`

**Interfaces:**
- Produces: scripts `dev`, `build`, `start`, `lint` (`eslint`), `test` (`vitest run`), `format` (`prettier --write .`), `check:privacy` (`node scripts/check-privacy.mjs`, script added in Task 3). Import alias `@/*` → repo root, resolvable in Vitest.

- [ ] **Step 1: Commit the spec and plan first** (repo already `git init`ed with local identity)

```bash
git add docs && git commit -m "docs: add site spec, decisions log and implementation plan"
```

- [ ] **Step 2: Scaffold into the existing directory**

Run: `pnpm create next-app@16.4.2 . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm --disable-git --yes`
Expected: succeeds (`docs/` and `.git` are on create-next-app's allowed-files list). If pnpm reports ignored build scripts for `sharp`, allow it (`pnpm approve-builds`) so `next start` can optimize images.

- [ ] **Step 3: Add dependencies**

Run: `pnpm add next-themes@0.4.6 geist@1.8.1 lucide-react zod@4 react-markdown@10 @vercel/analytics` and `pnpm add -D vitest prettier eslint-config-prettier`

- [ ] **Step 4: Configure tooling**

- `vitest.config.ts`: `environment: "node"`, `include: ["tests/**/*.test.ts"]`, alias `@` → repo root via `fileURLToPath(new URL(".", import.meta.url))`.
- `eslint.config.mjs`: append `eslint-config-prettier` as the last config entry.
- `.prettierrc.json`: `{}` (defaults). `.prettierignore`: `.next`, `pnpm-lock.yaml`, `docs`.
- `.gitignore`: add `.privacy-denylist` and `.env*`.
- Remove scaffold boilerplate: `app/favicon.ico`, `public/*.svg`; reduce `app/page.tsx` to `<main id="main">spacexbt</main>`; strip the scaffold's `next/font/google` usage from `layout.tsx` (Task 4 replaces it).
- Confirm `tsconfig.json` has `"strict": true`.

- [ ] **Step 5: Verify**

Run: `pnpm lint && pnpm build && pnpm vitest run --passWithNoTests`
Expected: all three exit 0; build lists `/` as `○ (Static)`.

- [ ] **Step 6: Commit** — `chore: scaffold Next.js 16 app with tooling`

---

### Task 2: Content model, validation and helpers

**Files:**
- Create: `content/schema.ts`, `content/site.ts`, `content/projects.ts`, `content/farming.ts`, `lib/content.ts`
- Test: `tests/schema.test.ts`, `tests/content.test.ts`

**Interfaces:**
- Produces (`content/schema.ts`):
  - `yearMonthSchema` — `z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)`
  - `projectSchema`, `type Project = z.infer<typeof projectSchema>`; `farmSchema`, `type Farm`
  - `parseProjects(raw: unknown): Project[]` — throws `ZodError` on invalid input or duplicate slugs
  - `parseFarms(raw: unknown): Farm[]`
- Produces (`content/*.ts`): `site` (spec §4.1 with `links.github = "https://github.com/spacexbt"` per D5), `projects: Project[]`, `farms: Farm[]`, `farmingUpdatedAt: string` (validated with `yearMonthSchema.parse`).
- Produces (`lib/content.ts`):
  - `isPresentUrl(url: string | undefined): url is string` — false for `undefined`, `""`, or containing `REPLACE_ME`
  - `sortProjects(projects: readonly Project[]): Project[]` — new array; featured first, then live → building → archived, then `startedAt` desc
  - `projectsWithDetail(projects: readonly Project[]): Project[]` — those whose `body?.trim()` is non-empty
  - `visibleLinks(project: Project): { kind: "live" | "repo" | "x"; label: "Visit" | "GitHub" | "Thread"; href: string }[]` — order live, repo, x; drops absent/`REPLACE_ME`
  - `groupFarms(farms: readonly Farm[]): { active: Farm[]; ended: Farm[] }` — preserves input order within groups
  - `formatYearMonth(ym: string): string` — `"2026-10"` → `"October 2026"` (en-US, UTC so it's timezone-independent)

Schema rules (spec §4.2/4.3): `slug` kebab-case `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`; `summary` 1–180 chars; `tags` min 1; URLs via `z.url()`; `image` must start with `/projects/`; `logo` must start with `/farms/`; `note` ≤ 100 chars; `startedAt`/`since` use `yearMonthSchema`; `status` enums exactly `live|building|archived` and `active|ended`. Use `.strict()` objects so typos in keys fail the build.

- [ ] **Step 1: Write failing schema tests** (`tests/schema.test.ts`), built around a `validProject()` fixture factory:
  - `accepts a valid project` → `parseProjects([validProject()])` has length 1
  - `rejects duplicate slugs` → `parseProjects([validProject(), validProject()])` throws
  - `rejects non-kebab slug` (`"Reddit_Radar"`), `rejects summary over 180 chars`, `rejects startedAt "2026-13"` and `"2026/10"`, `rejects invalid live URL "not a url"`, `rejects unknown key "feature: true"`, `rejects image outside /projects/`
  - `accepts a valid farm` / `rejects note over 100 chars` / `rejects status "paused"`
  - `real content parses` → importing `@/content/projects` and `@/content/farming` does not throw; `projects[0].name === "The Ticker Radar"`, `projects[0].links?.repo === undefined`, `farms[0].chains` equals `["Ethereum", "BNB Chain", "Robinhood Chain"]`

- [ ] **Step 2: Write failing helper tests** (`tests/content.test.ts`):
  - `isPresentUrl`: `undefined` → false, `""` → false, `"https://github.com/REPLACE_ME"` → false, `"https://x.com/spacexbt"` → true
  - `sortProjects`: given archived-2026-01, live-2025-01, building-2026-05, live-2026-03, and a featured archived → order `[featured archived, live-2026-03, live-2025-01, building-2026-05, archived-2026-01]`; input array unchanged (same reference contents after call)
  - `visibleLinks`: `{ live, repo: ".../REPLACE_ME/x", x }` → kinds `["live", "x"]`, labels `["Visit", "Thread"]`; no links → `[]`
  - `projectsWithDetail`: body `"  \n "` excluded, body `"text"` included, no body excluded
  - `groupFarms`: `[ended A, active B, active C]` → `active: [B, C]`, `ended: [A]`
  - `formatYearMonth("2026-10") === "October 2026"`, `formatYearMonth("2027-01") === "January 2027"`

- [ ] **Step 3: Run tests to verify they fail** — `pnpm test` → FAIL (modules not found)

- [ ] **Step 4: Implement `content/schema.ts` and `lib/content.ts`** per Interfaces.

- [ ] **Step 5: Create content files** with initial data from spec §9.1/§9.2 as amended by D2–D6: name `"The Ticker Radar"`, slug `reddit-radar`, `links: { live: "https://www.reddit-radar.app" }` (no repo), `stack: ["Next.js", "TypeScript", "Turso", "Vercel"]`, `image: "/projects/reddit-radar.png"`, `featured: true`, `startedAt: "2026-10"`, body verbatim from §9.1. Metric farm verbatim from §9.2, `farmingUpdatedAt = "2026-10"`. Remove all `TODO` comments that D-decisions resolved.

- [ ] **Step 6: Run tests** — `pnpm test` → all PASS

- [ ] **Step 7: Prove the build fails on bad content** — temporarily set the slug to `"Reddit Radar"`, run `pnpm build`, expect a failure containing the zod path `slug`; revert. (README Task 8 quotes this error shape.)

- [ ] **Step 8: Commit** — `feat: add zod-validated content model and helpers`

---

### Task 3: Privacy check

**Files:**
- Create: `scripts/privacy-scan.mjs`, `scripts/check-privacy.mjs`
- Modify: `package.json` (`check:privacy` script)
- Test: `tests/privacy.test.ts`

**Interfaces:**
- Produces (`scripts/privacy-scan.mjs`, plain JS + JSDoc types):
  - `parseDenylist(text: string): string[]` — trims lines, drops blanks and lines starting with `#`
  - `findLeaks(text: string, terms: string[]): string[]` — case-insensitive term matches (each reported as the term) plus every `\b0x[a-fA-F0-9]{40}\b` match (reported as `wallet 0x1234...abcd`, truncated so the report itself doesn't reprint the address)
- Produces (`scripts/check-privacy.mjs`): CLI. Exit 1 with `Missing .privacy-denylist — create it with one private term per line (it is gitignored).` if the file is absent. Otherwise scan text files (`.html .js .json .txt .xml .rsc .body .meta .ts .tsx .mjs .md .css .svg`) under `.next/` (excluding `.next/cache`), `app/`, `components/`, `content/`, `lib/`, `public/`, `README.md`; also check every `git log --format=%ae` value equals `176180399+spacexbt@users.noreply.github.com`. Print `path: finding` per hit; exit 1 on any hit, else print `Privacy check passed (<n> files scanned)` and exit 0. Requires a prior `pnpm build` (exit 1 with a message if `.next/` is missing).

- [ ] **Step 1: Write failing tests** (`tests/privacy.test.ts`):
  - `parseDenylist("# comment\n\n Alice \nBerlin\n")` → `["Alice", "Berlin"]`
  - `findLeaks("hello ALICE from berlin", ["alice", "Berlin"])` → contains `"alice"` and `"Berlin"`
  - `findLeaks("addr 0x52908400098527886E0F7030069857D2E4169EE7", [])` → `["wallet 0x5290...9EE7"]`
  - `findLeaks("tx hash 0x" + "a".repeat(64), [])` → `[]` (64-hex hashes are not addresses)
  - `findLeaks("clean text", ["alice"])` → `[]`

- [ ] **Step 2: Run** `pnpm test tests/privacy.test.ts` → FAIL
- [ ] **Step 3: Implement both scripts**; add `"check:privacy": "node scripts/check-privacy.mjs"`
- [ ] **Step 4: Run** `pnpm test` → PASS
- [ ] **Step 5: Smoke-test the CLI** — with no denylist: `pnpm build && pnpm check:privacy` → exit 1 with the missing-file message. Then `printf 'definitely-not-present-term\n' > .privacy-denylist && pnpm check:privacy` → exit 0. Delete that test file afterwards (the owner writes the real one; never create it with real terms).
- [ ] **Step 6: Commit** — `feat: add privacy leak check for build output and git history`

---

### Task 4: Design foundation and layout shell

**Files:**
- Create: `components/theme-provider.tsx`, `components/theme-toggle.tsx`, `components/mobile-menu.tsx`, `components/header.tsx`, `components/footer.tsx`, `components/external-link.tsx`, `components/icons/{x,telegram,github}.tsx`, `lib/theme.ts`
- Modify: `app/layout.tsx`, `app/globals.css`
- Test: `tests/theme.test.ts`

**Interfaces:**
- Consumes: `site`, `isPresentUrl` (Task 2).
- Produces:
  - `nextTheme(current: string | undefined): "light" | "dark" | "system"` — light → dark → system → light; `undefined`/unknown → `"light"`
  - `<ExternalLink href className? children />` — server component applying the external-link constraint
  - Icon components `XIcon`, `TelegramIcon`, `GithubIcon`: `(props: { className?: string }) => JSX`, `aria-hidden`, `fill="currentColor"`, 24×24 viewBox
  - Tailwind color utilities `bg-bg`, `bg-surface`, `border-border`, `text-text`, `text-muted`, `text-accent`, `bg-live`, `bg-building`; font utilities `font-sans` (Geist Sans), `font-mono` (Geist Mono)
  - Layout renders `<a href="#main">Skip to content</a>` first, then `<Header />`, `{children}` (pages own `<main id="main">`), `<Footer />`

- [ ] **Step 1: Write failing test** (`tests/theme.test.ts`): `nextTheme("light") === "dark"`, `("dark") === "system"`, `("system") === "light"`, `(undefined) === "light"`
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement `lib/theme.ts`** → **Step 4: Run** → PASS

- [ ] **Step 5: `app/layout.tsx`** — `<html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>` (from `geist/font/sans`, `geist/font/mono`); `ThemeProvider` with `attribute="class" defaultTheme="system" enableSystem`; render `<Analytics />` (from `@vercel/analytics/next`) only when `process.env.VERCEL` is truthy (Review Focus 5). Metadata is added in Task 7.

- [ ] **Step 6: `app/globals.css`** — `@import "tailwindcss"`; `@custom-variant dark (&:where(.dark, .dark *))`; tokens from spec §5.3 on `:root` and `.dark`; `@theme inline` mapping `--color-bg: var(--bg)` etc. and `--font-sans: var(--font-geist-sans)`, `--font-mono: var(--font-geist-mono)`; `body` bg/text tokens, 16px → 17px at `md`, line-height 1.6; `html { scroll-padding-top: 80px }` (Review Focus 2); `scroll-behavior: smooth` only inside `@media (prefers-reduced-motion: no-preference)`; global `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }`; color/border transitions 150ms. **Header bottom border without JS:** `.header-border` starts `border-color: transparent` and, inside `@supports (animation-timeline: scroll())`, animates to `var(--border)` with `animation-timeline: scroll(root); animation-range: 0 8px; animation-fill-mode: both`; outside `@supports` the border is always `var(--border)`. Section fade-up from spec §5.6 is skipped (optional; note in README).

- [ ] **Step 7: Theme toggle (client)** — reads `theme`/`setTheme` from `useTheme`; tracks mounted state; before mount renders the same 36×36 button with no icon and `aria-label="Toggle theme"` (Review Focus 3); after mount shows Sun/Moon/Monitor for the *current* theme and `aria-label` = "Switch to {nextTheme(theme)} theme"; click → `setTheme(nextTheme(theme))`.

- [ ] **Step 8: Header + mobile menu** per spec §5.5. Nav items `[{ href: "#projects", label: "Projects" }, { href: "#farming", label: "Farming" }, { href: "#about", label: "About" }, { href: "#contact", label: "Contact" }]` — use `/#projects` form so links work from detail/404 pages. Sticky, `bg-bg/85 backdrop-blur`, class `header-border border-b`, height 64px. Mobile menu (client): button `aria-expanded`, `aria-controls`, label "Open menu"/"Close menu"; full-width dropdown; closes on link click and Escape. X icon button `aria-label="spacexbt on X (opens in new tab)"`.

- [ ] **Step 9: Footer** per spec §5.5; GitHub icon rendered only if `isPresentUrl(site.links.github)`; each icon link has an `aria-label` naming the destination.

- [ ] **Step 10: Verify**
  - `pnpm lint && pnpm build` → exit 0, `/` still `○ (Static)`
  - `pnpm dev`, open `http://localhost:3000` with chrome-devtools MCP: cycle the toggle through all three states; reload in dark → no light flash; console has no hydration warnings; at 360px width the menu button opens/closes and Escape closes it.
- [ ] **Step 11: Commit** — `feat: add theme tokens, layout shell, header and footer`

---

### Task 5: Home page sections

**Files:**
- Create: `lib/assets.ts`, `components/section-heading.tsx`, `components/status-badge.tsx`, `components/project-links.tsx`, `components/hero.tsx`, `components/project-card.tsx`, `components/projects-section.tsx`, `components/farming-list.tsx`, `components/about.tsx`, `components/contact.tsx`, `public/projects/reddit-radar.png`
- Modify: `app/page.tsx`
- Test: `tests/assets.test.ts`

**Interfaces:**
- Consumes: Task 2 helpers + content; `ExternalLink`, icons (Task 4).
- Produces:
  - `publicAssetExists(assetPath: string | undefined, publicDir?: string): assetPath is string` in `lib/assets.ts` — `publicDir` defaults to `path.join(process.cwd(), "public")`; false for `undefined` or a file that doesn't exist
  - `<SectionHeading index="01" label="PROJECTS" title="Projects" id? />` — mono label `01 / PROJECTS` above an `h2`
  - `<StatusBadge status={ProjectStatus | FarmStatus} />` — dot + uppercase mono label (`LIVE`, `BUILDING`, `ARCHIVED`, `ACTIVE`, `ENDED`); live/active → `bg-live`, building → `bg-building`, archived/ended → `bg-muted`
  - `<ProjectLinks project showDetails />` — renders `visibleLinks` as `Visit ↗` / `GitHub ↗` / `Thread ↗` plus `Details →` when `showDetails` and the project has a body. Shared by card and detail page.

- [ ] **Step 1: Write failing test** (`tests/assets.test.ts`) using a `mkdtemp` dir containing `projects/a.png`: `publicAssetExists("/projects/a.png", dir) === true`, `("/projects/missing.png", dir) === false`, `(undefined, dir) === false`
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** → **Step 4: Run** → PASS

- [ ] **Step 5: Capture the screenshot (D6)**

Run: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1600,1000 --virtual-time-budget=10000 --screenshot="$PWD/public/projects/reddit-radar.png" https://www.reddit-radar.app`
Expected: a 1600×1000 PNG showing loaded data (not a skeleton). Open it with the Read tool to confirm; raise the time budget if it shows loading state.

- [ ] **Step 6: Build the sections** per spec §5.5 and copy from §9.3 (section ids `top`, `projects`, `farming`, `about`, `contact`; headings `01 / PROJECTS` … `04 / CONTACT`):
  - Hero: optional dotted grid = `radial-gradient(var(--border) 1px, transparent 1px)` at 20px spacing, masked to fade out; drop it if it looks busy in either theme.
  - Projects: `sortProjects(projects)`; featured card `md:col-span-2` with `next/image` (`width={1600} height={1000}`, `sizes="(min-width: 960px) 912px, 100vw"`, `priority`) only when `publicAssetExists(project.image)`; tags `slice(0, 4)`; low-state dashed card when `projects.length < 2`.
  - Farming: `groupFarms(farms)`; monogram fallback when `!publicAssetExists(farm.logo)`; footnote "Last updated: " + `formatYearMonth(farmingUpdatedAt)`.
  - About, Contact: copy verbatim from §9.3 / §5.5. Tools chips `["Claude Code", "Kimi", "TypeScript", "Python", "Foundry"]`.
  - `app/page.tsx`: `<main id="main">` containing the sections in spec §3 order.

- [ ] **Step 7: Check ended-farm contrast (Review Focus 1)** — temporarily add an `ended` farm to `content/farming.ts`, run `pnpm dev`, and confirm via chrome-devtools MCP that the ended row's name/text color computes to `--muted` at full opacity and that only the logo and dot carry `opacity: 0.6`. Revert the content change.

- [ ] **Step 8: Verify** — `pnpm lint && pnpm build && pnpm test` → exit 0, `/` static. Then temporarily rename `public/projects/reddit-radar.png` and rebuild: the card renders without an image or a gap. Restore it.
- [ ] **Step 9: Commit** — `feat: add hero, projects, farming, about and contact sections`

---

### Task 6: Project detail page and 404

**Files:**
- Create: `app/projects/[slug]/page.tsx`, `app/not-found.tsx`
- Modify: `app/globals.css` (`.prose-body` styles)

**Interfaces:**
- Consumes: `projects`, `projectsWithDetail`, `publicAssetExists`, `StatusBadge`, `ProjectLinks`.
- Produces: static routes `/projects/<slug>` for every project with a body; `export const dynamicParams = false` so unknown slugs 404.

- [ ] **Step 1: Detail page** per spec §5.5: `generateStaticParams` from `projectsWithDetail(projects)`; Next 16 signature `({ params }: { params: Promise<{ slug: string }> })`; `notFound()` if missing; `generateMetadata` → `title: project.name` (layout template appends ` — spacexbt`), `description: project.summary`, `alternates.canonical: /projects/${slug}`. Body via `react-markdown` with `skipHtml` and no rehype plugins, in `max-w-[680px] prose-body`. `.prose-body` styles `p`, `ul/li`, `a` (accent, underline), `code` with tokens. No typography plugin.
- [ ] **Step 2: 404** — mono `404`, "Nothing here.", link "Back home" to `/`. Header and footer come from the layout.
- [ ] **Step 3: Verify** — `pnpm build` lists `/projects/reddit-radar` as `● (SSG)` and `/_not-found` as static. `pnpm start`: `/projects/reddit-radar` renders the body list; `/projects/nope` and `/nope` return 404 with the custom page.
- [ ] **Step 4: Commit** — `feat: add project detail page and custom 404`

---

### Task 7: Metadata, OG images, icons, sitemap, robots, JSON-LD

**Files:**
- Create: `lib/og.tsx`, `app/opengraph-image.tsx`, `app/projects/[slug]/opengraph-image.tsx`, `app/icon.svg`, `app/apple-icon.tsx`, `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx` (metadata), `app/page.tsx` (JSON-LD)
- Test: `tests/sitemap.test.ts`

**Interfaces:**
- Consumes: `site`, `projects`, `projectsWithDetail`.
- Produces: `renderOg(opts: { title: string; subtitle: string; footer: string; badge?: string }): Promise<ImageResponse>` in `lib/og.tsx` — 1200×630, background `#0B0B0C`, title `#EDEDED` Geist Sans SemiBold, subtitle/footer `#8B8B92`, footer and badge in Geist Mono. Fonts read with `readFile(path.join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf"))`, `.../geist-sans/Geist-Regular.ttf`, `.../geist-mono/GeistMono-Medium.ttf`.

- [ ] **Step 1: Write failing test** (`tests/sitemap.test.ts`): `sitemap().map(e => e.url)` equals `[site.url, site.url + "/projects/reddit-radar"]`; `robots().sitemap` equals `site.url + "/sitemap.xml"`, and its rules allow `/` for user agent `*`.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement `sitemap.ts`, `robots.ts`** → **Step 4: Run** → PASS
- [ ] **Step 5: Layout metadata** per spec §6: `metadataBase: new URL(site.url)`, `title: { default: "spacexbt", template: "%s — spacexbt" }`, `description: site.description`, `alternates.canonical: "/"`, `openGraph { type: "website", siteName: "spacexbt", url: site.url }`, `twitter { card: "summary_large_image", creator: "@spacexbt", site: "@spacexbt" }`.
- [ ] **Step 6: OG images** — home: title `spacexbt`, subtitle `site.tagline`, footer `x.com/spacexbt`. Project: title project name, badge status uppercase, subtitle summary, footer `spacexbt`; export `generateStaticParams` from `projectsWithDetail`. Both export `size`, `contentType = "image/png"`, `alt`.
- [ ] **Step 7: Icons** — `app/icon.svg`: 32×32 rounded square `#0B0B0C` with a lowercase `s` in `#EDEDED`, `font-family="ui-monospace, Menlo, monospace"`, weight 600. `app/apple-icon.tsx`: same design rendered via `ImageResponse` at 180×180 using GeistMono-Medium.
- [ ] **Step 8: JSON-LD** in `app/page.tsx`: `<script type="application/ld+json">` with `{"@context":"https://schema.org","@type":"Person","name":"spacexbt","url":site.url,"sameAs":[site.links.x, site.links.telegram]}`.
- [ ] **Step 9: Verify** — `pnpm build`: no `ƒ` routes; `opengraph-image` routes prerendered. `pnpm start`, then open `/opengraph-image`, `/projects/reddit-radar/opengraph-image`, `/apple-icon`, `/icon.svg`, `/sitemap.xml`, `/robots.txt` and view the images with the Read tool after saving them via `curl -o`. Home `<head>` contains `og:image`, `twitter:card`, canonical, JSON-LD.
- [ ] **Step 10: Commit** — `feat: add metadata, OG images, icons, sitemap and robots`

---

### Task 8: README

**Files:** Create/replace `README.md`

- [ ] **Step 1: Write the README** covering all seven items in spec §10, for a non-developer. Include: copy-paste project entry (all optional fields shown and commented), screenshot path + 1600×1000 recommendation; farm entry example, how to mark `ended`, logo path, bump `farmingUpdatedAt`; links in `content/site.ts`; push to `main` → Vercel builds, PRs get preview URLs; the custom-domain steps verbatim from §10.6; a real zod error excerpt from Task 2 Step 7 with how to read the path. Add a **Privacy check** section (create `.privacy-denylist`, run `pnpm build && pnpm check:privacy` before pushing) and a **Choices** section noting: `react-markdown` for bodies; section fade-in skipped; ended farms use muted text instead of 60% opacity for AA; header border uses CSS scroll-driven animation (always visible in browsers without support); Analytics renders only on Vercel builds. No real name, location or email anywhere.
- [ ] **Step 2: Verify** — `pnpm format` then `pnpm lint` → clean.
- [ ] **Step 3: Commit** — `docs: add README for content updates and deploys`

---

### Task 9: Verification pass (acceptance criteria §13)

No new features. Fix anything that fails here in the owning component, then re-run.

- [ ] **Step 1: Clean build** — `rm -rf .next && pnpm lint && pnpm test && pnpm build` → zero errors; route table has only `○`/`●`.
- [ ] **Step 2: Link and copy greps** on built HTML (`.next/server/app/index.html`): `x.com/spacexbt` appears in hero, header and footer; `t.me/spaceinsights` in hero, contact and footer; "Claude Code" and "Kimi" in hero and footer; `LIVE`, `reddit-radar.app`, `/projects/reddit-radar`; `Metric` with `Ethereum`, `BNB Chain`, `Robinhood Chain`; no `REPLACE_ME`.
- [ ] **Step 3: Privacy** — ask the owner to create `.privacy-denylist` themselves (do not ask them to paste its contents). Run `pnpm check:privacy` → `Privacy check passed`.
- [ ] **Step 4: Responsive + keyboard** with chrome-devtools MCP against `pnpm start`: at 360, 768 and 1280 take screenshots and evaluate `document.documentElement.scrollWidth <= window.innerWidth` → `true`. Tab from page load: first stop is "Skip to content"; every interactive element shows an accent focus ring; header anchor links land with section labels visible below the sticky header (Review Focus 2). Emulate `prefers-reduced-motion: reduce` → no smooth scrolling.
- [ ] **Step 5: Themes** — light, dark and system each render correctly; reload in each state → no flash; console clean.
- [ ] **Step 6: Lighthouse (mobile)** — `pnpm start`, then `pnpm dlx lighthouse http://localhost:3000 --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --output=json --output-path=<scratchpad>/lh.json`. Expected: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100. Repeat for `/projects/reddit-radar`. Fix and re-run until met.
- [ ] **Step 7: "One file to add content"** — add a throwaway second project only in `content/projects.ts` and a second farm only in `content/farming.ts`; `pnpm build` passes, the grid goes to 2 columns, the low-state card disappears; revert.
- [ ] **Step 8: Commit any fixes** — `fix: address verification findings` (skip if none). Then **stop and hand over to the owner for local review** (`pnpm start` → `http://localhost:3000`).

---

### Task 10: Publish (GATED — run only after the owner explicitly says go, per D12)

- [ ] **Step 1:** `pnpm check:privacy` passes on the final commit; `git log --format='%an <%ae>' | sort -u` shows only the noreply identity.
- [ ] **Step 2:** `gh repo create spacexbt/spacexbt-site --public --source . --push`
- [ ] **Step 3:** `vercel link` (project name `spacexbt`, so the default domain is `spacexbt.vercel.app`) then `vercel --prod`. If Vercel assigns a different domain, update `site.url` in `content/site.ts`, commit, and redeploy.
- [ ] **Step 4:** Connect the Git integration so pushes to `main` deploy (`vercel git connect`), and tell the owner to enable Analytics in the Vercel dashboard (spec §11.3).
- [ ] **Step 5:** Re-run Lighthouse against the production URL; confirm `/opengraph-image` and the X card preview render.
