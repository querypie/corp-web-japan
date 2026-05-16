# QueryPie AI Japan Website

This repository contains the Japan-facing QueryPie AI website.

README.md is the human-facing project guide. AI agents should read this file first for context, then follow `AGENTS.md` for execution rules.

## Environment URLs

- Production URL: [https://querypie.ai](https://querypie.ai)
- Redirect domains: [https://www.querypie.ai](https://www.querypie.ai) -> [https://querypie.ai](https://querypie.ai)
- Staging URL: [https://stage.querypie.ai](https://stage.querypie.ai)

## Project overview

This project is built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and npm.

The current public structure is:

- `/` — top page
- `/solutions/ai-crew`
- `/solutions/ai-dashi`
- `/blog` — local blog index
- `/blog/:id/:slug` — local MDX-backed blog detail, with `/blog/:id` redirecting to the canonical slug route
- `/whitepapers` — local whitepaper index
- `/whitepapers/:id/:slug` — local MDX-backed whitepaper detail, with `/whitepapers/:id` redirecting to the canonical slug route
- `/news` — local news index
- `/use-cases` — local use-case index
- `/demo/aip` — local AIP demo index
- `/demo/acp` — local ACP demo index
- `/news/:id/:slug` — local MDX-backed news detail, with `/news/:id` redirecting to the canonical slug route
- `/events/:id/:slug` — local event detail route
- `/contact-us` — local contact form page with stable query-string prefills and a local submit flow
- `/about-us` — local company overview page
- `/certifications` — local certifications page
- `/resources` — local resource index
- `/introduction-deck` — local introduction deck index and detail routes
- `/glossary` — local glossary index and detail routes
- `/manuals` — local manuals index and detail routes
- `/platforms/acp` — local ACP platform page
- `/platforms/acp/integrations` — local ACP integrations page

Additional notes:

- Blog and whitepaper detail pages are rendered from local MDX under `src/content/blog/` and `src/content/whitepapers/`.
- Whitepaper detail pages can use the current MDX gating contract.
- The `/events` list page is not publicly launched yet. It remains query-gated and is intentionally excluded from the top-level sitemap entry set.
- Public resource hubs now include local `/resources`, `/introduction-deck`, `/glossary`, and `/manuals` pages backed by the local content loaders.
- Some other top-level paths such as legal endpoints remain redirect routes to upstream QueryPie destinations.
- The catch-all missing-route flow only redirects paths that match the maintained QueryPie allowlist; other unmatched paths are logged and resolve to the local not-found flow.

## Shared principles

These principles apply to both humans and AI agents.

- Keep changes small, focused, and easy to review.
- Prefer structured content in `src/content/` over inline copy when possible.
- Keep docs, implementation, and tests aligned.
- Verify changes with the lightest command that proves correctness.
- If something is ambiguous, choose the smallest change that satisfies the request.

## Repository layout

Core directories:

- `src/app/` — App Router pages and redirect/API routes
- `src/components/` — shared UI, layout, and page sections
- `src/content/` — structured copy plus MDX source content
- `src/content/blog/` — local blog MDX source
- `src/content/whitepapers/` — local whitepaper MDX source
- `src/lib/` — shared helpers, publication loaders, list-item derivation, and route utilities
- `public/` — static assets
- `tests/` — Node-based repo verification tests
- `scripts/deploy/` — Vercel deployment scripts used by GitHub Actions

Representative files:

- `src/app/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[id]/[slug]/page.tsx`
- `src/app/whitepapers/page.tsx`
- `src/app/whitepapers/[id]/[slug]/page.tsx`
- `src/app/contact-us/page.tsx`
- `src/app/sitemap.ts`

## Publication content model

Blog and whitepaper lists are driven from local content source files.

- Blog frontmatter is read from `src/content/blog/*.mdx`.
- Blog frontmatter may additionally use `hidden: true` to keep a post out of the `/blog` list while preserving its local detail route, and `redirectUrl` to redirect local blog detail requests to another URL.
- Whitepaper frontmatter is read from `src/content/whitepapers/*.mdx`.
- Blog list items resolve to local canonical detail routes.
- Whitepaper list items currently keep upstream `querypie.com/ja` hrefs for card destinations while the local detail routes exist for the new MDX-backed rendering flow.
- For AI-agent execution, the repo-local publication skills are indexed in `.agents/skills/README.md`.
- Load `.agents/skills/mdx-publication-operations/SKILL.md` first for public MDX publication maintenance.
- Then load the narrowest matching family wrapper from `.agents/skills/` for the target content root.

Whitepaper gating contract:

- Use frontmatter `gated: true` on gated whitepaper MDX files.
- Use the `<GatingCut />` marker to split preview content from gated content.
- The shared gating helpers live in `src/lib/publications/gating.ts`.
- The internal reference route for the current pattern is `/internal/whitepaper-gating-demo`.

## Human quick start

1. Read this README for project context.
2. Check `AGENTS.md` if you are an AI agent or need repository work rules.
3. If your task is publication-content work, read `.agents/skills/README.md`, load `mdx-publication-operations` first for public MDX maintenance, then load the narrower family skill when one applies.
4. Use the structured content under `src/content/` first when updating copy.
5. Run the relevant verification commands before considering a change done.

Useful commands:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:ci
npm run build
```

Recommended verification before committing:

```bash
npm run test:ci
```

Recommended verification before deployment-sensitive changes:

```bash
npm run test:ci
npm run build
```

## CI and deployment

GitHub Actions currently provide:

- `ci.yml` — runs `npm run test:ci` and `npm run build` on pull requests and pushes to `main`
- `e2e-stage.yml` — manually runs the full hosted Playwright E2E suite against a chosen base URL, defaulting to stage
- `deploy-preview.yml` — preview deployment workflow
- `deploy-staging.yml` — staging deployment workflow
- `deploy-production.yml` — production deployment workflow
- `delete-deploy.yml` — preview deployment cleanup workflow

The repository relies on CI and hosted preview environments for normal verification. Do not assume local preview is required for every change.

## Common reference

Both humans and agents should remember:

- `src/content/` is preferred for structured copy changes.
- Repo-local AI agent skills belong under `.agents/skills/`.
- `.agents/skills/README.md` is the local skill index.
- Publication authoring should load `.agents/skills/mdx-publication-operations/SKILL.md` first for public MDX maintenance, then load the narrowest matching family wrapper from `.agents/skills/`.
- `npm run test:ci` is the standard baseline verification step.
- `npm run build` is required for deployment-sensitive changes.
- Working rules and execution details live in `AGENTS.md`.
