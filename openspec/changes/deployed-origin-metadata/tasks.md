## 1. Contract

- [x] Add `openspec/specs/contract-deployed-origin-metadata/spec.md`.
- [x] Register the new spec in `openspec/specs/README.md`.
- [x] Link the metadata origin contract from `openspec/project.md`.

## 2. Implementation

- [ ] Replace the fixed production-origin `siteUrl` helper with a resolver that
  returns the deployed website origin for the current response.
  Candidate surfaces:
  - `src/lib/site-url.ts`
  - `src/app/layout.tsx`
  - server metadata helpers that need an absolute base URL
- [ ] Make route-level metadata use the deployed-origin resolver for first-party
  absolute URLs while preserving current route-owned canonical paths.
  Candidate surfaces:
  - `src/app/**/page.tsx` metadata exports
  - publication detail routes under `src/app/{blog,whitepapers,news,events,use-cases,demo}/**`
  - resource detail routes under `src/app/{introduction-deck,glossary,manuals}/**`
- [ ] Update publication metadata helpers so `openGraph.images[].url` and
  `twitter.images[]` resolve first-party relative image paths against the
  deployed origin.
  Candidate surfaces:
  - `src/lib/publications/metadata.ts`
  - `src/lib/resources/**`
- [ ] Update `src/app/sitemap.ts` and `src/app/robots.ts` so first-party absolute
  URLs use the deployed origin unless a separate accepted indexing policy
  explicitly requires production-only output.
- [ ] Preserve existing path behavior:
  - ID-based detail lookup.
  - Missing-slug redirects.
  - Mismatched-slug redirects.
  - Current resource family paths such as `/blog`, `/whitepapers`, `/news`,
    `/events`, `/use-cases`, `/demo/aip`, `/demo/acp`, `/introduction-deck`,
    `/glossary`, and `/manuals`.

## 3. Verification

- [ ] Add source/unit tests for deployed-origin resolution covering at least:
  - production origin: `https://querypie.ai`
  - staging origin: `https://stage.querypie.ai`
  - preview origin: a Vercel preview hostname
  - localhost-style origin
- [ ] Add metadata regression tests covering at least one representative detail
  route from each metadata family affected by the shared helper:
  - news publication detail
  - blog publication detail
  - whitepaper or gated resource detail
  - static marketing page metadata, if it uses shared absolute URL helpers
- [ ] In metadata tests, assert that `alternates.canonical`, `openGraph.url`,
  `openGraph.images[].url`, and `twitter.images[]` use the deployed origin while
  preserving the canonical path.
- [ ] Add sitemap and robots tests proving that first-party absolute URLs use the
  deployed origin.
- [ ] Add or update a regression fixture for a staged-only publication asset
  where the page and image exist on staging before production.
- [ ] Run `npm run test:ci`.
- [ ] Run `npm run build` because metadata, sitemap, robots, and routing output
  affect production rendering.
- [ ] Run hosted staging verification:
  ```bash
  curl -Ls https://stage.querypie.ai/news/15/iso-42001-certification-press-release
  ```
  Extract `og:url`, `og:image`, and `twitter:image`; expected image origin is
  `https://stage.querypie.ai`.
- [ ] Run `curl -I` against the extracted staging image URL; expected result is
  `200` with an image content type.
- [ ] After production deployment, repeat the metadata extraction and `curl -I`
  image checks against `https://querypie.ai/news/15/iso-42001-certification-press-release`.

## 4. Spec / Implementation Drift Check

- [ ] After implementation, compare current code against every Requirement and
  Scenario in `openspec/specs/contract-deployed-origin-metadata/spec.md`.
- [ ] Record the drift check result in the implementation PR body.
- [ ] If code cannot satisfy a Requirement without changing the accepted policy,
  update the OpenSpec contract first instead of silently narrowing the behavior.

## 5. OpenSpec Cleanup

- [ ] Run `git diff --check`.
- [ ] Run `openspec validate --all` when the OpenSpec CLI is available.
- [ ] Search for stale hard-coded production-origin guidance that contradicts the
  new contract:
  ```bash
  rg -n "metadataBase|siteUrl|canonical URL|og:image|Open Graph|robots|sitemap|https://querypie\\.ai" docs openspec src tests
  ```
  Keep legitimate production examples, but remove or bridge duplicated
  implementation-contract language to
  `openspec/specs/contract-deployed-origin-metadata/spec.md`.
