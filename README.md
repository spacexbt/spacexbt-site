# spacexbt-site

Personal site for spacexbt: projects, tools and airdrop farms. Static Next.js 16 site, hosted on Vercel. All editable content lives in the `content/` folder. There is no database and no admin panel: you edit a file, push, and the site rebuilds.

## What you need

- Node.js 22 or newer. Check with `node --version`.
- pnpm 10. Check with `pnpm --version`. Install it with `corepack enable` if missing.

## 1. Run it locally

```bash
pnpm install   # downloads dependencies, once
pnpm dev       # starts the site at http://localhost:3000, reloads on save
```

Other commands you will use:

| Command              | What it does                                                   |
| -------------------- | -------------------------------------------------------------- |
| `pnpm build`         | Builds the production site and validates all content           |
| `pnpm lint`          | Checks the code for mistakes                                   |
| `pnpm test`          | Runs the automated tests                                       |
| `pnpm format`        | Reformats files to the project style                           |
| `pnpm check:privacy` | Scans the build and repo for private terms (see Privacy check) |

## 2. Add a project

Open `content/projects.ts` and add an object to the list inside `parseProjects([ ... ])`. Copy this and delete the lines you do not need. Only `slug`, `name`, `summary`, `status`, `tags` and `startedAt` are required.

```ts
{
  slug: "my-new-tool",            // required. lowercase, digits, single hyphens. Unique. Becomes /projects/my-new-tool
  name: "My New Tool",            // required
  summary: "One or two sentences.", // required. max 180 characters, shown on the card
  status: "building",             // required. "live" | "building" | "archived"
  tags: ["Crypto", "Research"],   // required. at least one. Card shows the first 4
  stack: ["Next.js", "TypeScript"], // optional. technologies used
  links: {                        // optional. every link inside is optional
    live: "https://example.com",  // public URL
    repo: "https://github.com/spacexbt/my-new-tool", // leave out if closed-source
    x: "https://x.com/spacexbt/status/123", // announcement thread
  },
  image: "/projects/my-new-tool.png", // optional. screenshot, see below
  featured: true,                 // optional. featured projects sort first and get a larger card that shows the screenshot
  startedAt: "2026-10",           // required. format YYYY-MM
  body: `
Optional markdown. If this field exists, the site builds a detail page
at /projects/my-new-tool. Leave it out and the card has no detail page.
`,
},
```

Notes:

- Sort order: featured first, then `live`, `building`, `archived`, then newest `startedAt`.
- `body` accepts markdown (headings, bold, bulleted and numbered lists, quotes, links, inline code). Raw HTML is ignored on purpose.
- A link set to a URL containing `REPLACE_ME` is treated as missing and its button does not show.
- Unknown field names are rejected, so a typo like `sumary` fails the build instead of being silently ignored.

### Screenshot

1. Take a screenshot at **1600 x 1000 pixels** (16:10). Other sizes get cropped to fit.
2. Save it in `public/projects/`, for example `public/projects/my-new-tool.png`.
3. Set `image: "/projects/my-new-tool.png"` in the entry. The path must start with `/projects/`.

The screenshot shows on featured cards and on the project detail page. If the file is missing, no image is shown. Nothing breaks.

## 3. Add or end a farm

Open `content/farming.ts`. Add an object to the list inside `parseFarms([ ... ])`:

```ts
{
  name: "Protocol Name",          // required
  url: "https://docs.example.xyz", // required. app or docs link
  chains: ["Ethereum", "Robinhood Chain"], // required. at least one
  status: "active",               // required. "active" | "ended"
  logo: "/farms/protocol-name.svg", // optional. see below
  logoMono: true,                 // optional. set for one-colour dark logos so they flip to white in dark mode
  referral: "https://app.example.xyz/r/yourcode", // optional. shown as "Join with my referral link"
  note: "One-liner.",             // optional. max 100 characters
  since: "2026-10",               // optional. format YYYY-MM
},
```

**Mark a farm as ended:** change `status: "active"` to `status: "ended"`. Ended farms drop below the active ones in a muted style. Do not delete them if you want the history.

**Logo:** save a square SVG or PNG in `public/farms/` and set `logo: "/farms/protocol-name.svg"`. The path must start with `/farms/`. With no logo (or a missing file) the site shows the first letter of the name instead.

**Bump the update date:** every time you change the farm list, update `farmingUpdatedAt` at the top of `content/farming.ts` to the current month, for example `"2026-11"`. That date is shown on the site as "last updated".

Keep wallet addresses and amounts out of this file. Referral links go only in the `referral` field, which the site labels as a referral.

## 4. Change links (X, Telegram, GitHub)

Open `content/site.ts` and edit the `links` block:

```ts
links: {
  x: "https://x.com/spacexbt",
  telegram: "https://t.me/spaceinsights",   // channel (updates only)
  telegramDm: "https://t.me/highvolume",   // personal account for DMs
  github: "https://github.com/spacexbt",
},
```

A GitHub link containing `REPLACE_ME` is hidden (footer), and so are project links (Visit, GitHub, Thread). The X and both Telegram links are always shown, so keep them real. The same file holds the tagline, description and `url` (the site address, used for canonical links, the sitemap and share previews).

## 5. How deploys work

- Push to `main` and Vercel builds and publishes the site automatically.
- Open a pull request and Vercel posts a preview URL for that branch. Check it before merging.
- No environment variables are needed.
- Turn on Vercel Analytics once: Vercel dashboard, your project, Analytics tab, Enable. After that it just works. The analytics script is only included in builds made on Vercel, so local builds stay clean.

## 6. Connect a custom domain later

1. Buy the domain.
2. Vercel project, Settings, Domains.
3. Add the domain.
4. Set the DNS records Vercel shows at your domain registrar.
5. Update `site.url` in `content/site.ts` to the new domain (with `https://`, no trailing slash).
6. Redeploy (push the change to `main`).

If you skip step 5, canonical links, the sitemap and share previews keep pointing at the old address.

## 7. Builds fail on invalid content (on purpose)

The entries in `content/site.ts`, `content/projects.ts` and `content/farming.ts` are checked against a schema (zod) during `pnpm build`. A mistake in them stops the build and nothing gets published. Vercel keeps serving the last good version. Edits elsewhere (page code, styles, markdown text) are not checked this way.

Real example. The slug was changed to `"Reddit Radar"` (capitals and a space are not allowed):

```text
Error: Failed to collect configuration for /projects/[slug]/opengraph-image
  [cause]: Error [ZodError]: [
    {
      "origin": "string",
      "code": "invalid_format",
      "format": "regex",
      "pattern": "/^[a-z0-9]+(?:-[a-z0-9]+)*$/",
      "path": [
        0,
        "slug"
      ],
      "message": "Invalid string: must match pattern /^[a-z0-9]+(?:-[a-z0-9]+)*$/"
    }
  ]
      at <unknown> (content/schema.ts:69:6)
      at module evaluation (content/projects.ts:3:36)
      at module evaluation (app/projects/[slug]/opengraph-image.tsx:1:1)
```

How to read it:

- `path` says where the problem is. `[0, "slug"]` means item number 0 in the list (counting starts at 0, so the first project), field `slug`. `[2, "links", "live"]` would be the third project, its `links.live` URL.
- `message` says what is wrong. Here: the slug must be lowercase letters and digits separated by single hyphens.
- `pattern` is the rule it failed. Ignore it if the message is clear.
- The `at module evaluation (content/projects.ts:...)` line names the file that holds the mistake. The `content/schema.ts` line only shows where the rule is checked, not where the mistake is.
- Fix the entry in `content/projects.ts`, `content/farming.ts` or `content/site.ts`. Never edit `content/schema.ts` to make an error go away; that file holds the rules.
- Ignore the "opengraph-image" wording at the top. The content is loaded by several pages and the first one to hit the error gets named.

Common messages: `Duplicate slug "..."` (two projects share a slug), `Invalid URL` (missing `https://`), `Too big` (summary over 180 or note over 100 characters), `Invalid option` (status is not one of the allowed values), `Unrecognized key` (a field name is misspelled).

## Privacy check

The repo is public, so a script checks that nothing private slipped in.

1. Create a file named `.privacy-denylist` in the repo root. It is gitignored and never leaves your machine.
2. Put one private term per line. Lines starting with `#` are comments. Example:

   ```text
   # names, places, emails you never want on the site
   my-real-name
   my-home-city
   my-private-email
   ```

   Those are placeholders. Replace them with your real terms.

3. Before every push, run:

   ```bash
   pnpm build && pnpm check:privacy
   ```

It scans the build output, every file tracked by git, and the full commit history (all branches). It fails on:

- any term from your denylist,
- any `0x` wallet address (0x followed by 40 hex characters),
- any commit authored or committed with an email other than the GitHub noreply one, on any branch,
- any denylist term or wallet address in a commit message.

If `.privacy-denylist` is missing the check fails. If it has no terms (empty or only comments) the check also fails.

## Choices

Decisions made while building, one line each:

- Project bodies render with `react-markdown`, with raw HTML disabled.
- Section fade-in on scroll was skipped.
- Ended farms use muted text at full opacity; only the logo and status dot fade, to keep WCAG AA contrast.
- The header bottom border uses a CSS scroll-driven animation; in browsers without support it is always visible.
- Vercel Analytics renders only on Vercel builds.
- Classic static rendering is used (Cache Components off).
- Text sections are left-aligned inside a 960px container so they line up with the header and the project grid.
- The screenshot image uses `preload` instead of the deprecated `priority`.
