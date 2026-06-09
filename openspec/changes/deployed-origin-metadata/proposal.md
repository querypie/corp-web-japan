## Why

Staging and preview deployments can contain pages and first-party assets that are
not yet available on production. If metadata URLs are expanded with a fixed
production origin, Open Graph and Twitter crawlers can receive 404 responses even
though the staged page and staged image exist.

The deployed website should emit first-party metadata URLs that resolve on the
same origin that served the response.

## What Changes

- Add the durable `contract-deployed-origin-metadata` spec.
- Require first-party canonical, Open Graph, Twitter image, sitemap, and robots
  absolute URLs to use the currently deployed website origin.
- Preserve existing route path ownership, slug canonicalization, and publication
  family URI architecture.
- Add follow-up implementation and verification tasks for metadata, sitemap,
  robots, publication detail routes, static route metadata, and hosted
  stage/production checks.

## Capabilities

### New Capabilities

- Deployed-origin metadata URL contract for production, staging, preview, and
  localhost-style environments.
- Verification scope for staged-only publication assets and hosted Open Graph
  image checks.

### Modified Capabilities

- Existing site URL helpers and metadata generation must stop assuming a fixed
  production origin for every deployment.
- Existing sitemap and robots output must follow the same deployed-origin policy
  unless a separate accepted indexing policy explicitly says otherwise.

## Impact

- OpenSpec-only change in this branch.
- Implementation follow-up is required in `src/lib/site-url.ts`,
  `src/app/layout.tsx`, route metadata exports, publication metadata helpers,
  `src/app/sitemap.ts`, and `src/app/robots.ts`.
- Verification must include source tests, build/test CI, and hosted checks
  against the current news 15 staging URL.
