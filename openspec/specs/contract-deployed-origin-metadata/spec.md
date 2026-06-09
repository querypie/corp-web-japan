# contract-deployed-origin-metadata

## Purpose

This spec defines how `corp-web-japan` emits absolute metadata URLs for the
currently deployed website.

The website is deployed to production, staging, and preview environments. Any
metadata URL that points back to this website must resolve on the same deployed
origin that served the page, so reviewers and crawlers do not receive broken
production URLs while inspecting a staging or preview deployment.

## Current implementation references

- `src/lib/site-url.ts`
- `src/app/layout.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/lib/publications/metadata.ts`
- `src/app/**/page.tsx` route metadata exports
- MDX publication detail routes under `src/app/{blog,whitepapers,news,events,use-cases,demo}/**`

## Change plan

Implementation tasks and verification scope for this accepted contract live in
`openspec/changes/deployed-origin-metadata/tasks.md`.

## Requirements

### Requirement: deployed-origin metadata URLs

Absolute URLs emitted in page metadata SHALL use the origin of the currently
deployed, working website that served the response. The implementation SHALL NOT
hard-code `https://querypie.ai` as the origin for staging, preview, localhost, or
any other non-production deployment response.

When the current request URL is available, the deployed origin SHOULD be derived
from that request's origin. When a route cannot access the request URL directly,
it SHALL use a deployment-provided public origin for the same deployed website
artifact. A production-origin fallback MAY be used only for an actual production
deployment or as an explicit development fallback when no deployed origin is
available.

This contract applies to metadata URLs including, but not limited to,
`alternates.canonical`, `openGraph.url`, `openGraph.images[].url`,
`twitter.images[]`, and equivalent route-specific metadata fields that reference
first-party website routes or first-party static assets.

#### Scenario: staging metadata points to staging assets

- GIVEN a page is served from `https://stage.querypie.ai/news/15/iso-42001-certification-press-release`
- AND the page emits an Open Graph image for `/news/15/thumbnail.png`
- WHEN a crawler reads the page metadata
- THEN `og:image` resolves to `https://stage.querypie.ai/news/15/thumbnail.png`
- AND the image URL is not rewritten to `https://querypie.ai/news/15/thumbnail.png`

#### Scenario: production metadata points to production assets

- GIVEN the same page is served from `https://querypie.ai/news/15/iso-42001-certification-press-release`
- AND the page emits an Open Graph image for `/news/15/thumbnail.png`
- WHEN a crawler reads the page metadata
- THEN `og:image` resolves to `https://querypie.ai/news/15/thumbnail.png`

#### Scenario: preview metadata points to the preview origin

- GIVEN a Vercel preview deployment serves a page from its preview hostname
- WHEN the page emits canonical, Open Graph, Twitter, or first-party image
  metadata URLs
- THEN those absolute URLs use the preview deployment origin that served the
  response
- AND they do not point to production unless the referenced URL is intentionally
  an external, non-first-party destination

### Requirement: canonical path behavior remains route-owned

The deployed origin SHALL be resolved independently from the canonical path. Route
owners SHALL continue to decide canonical path shape, slug redirects, id-based
lookup, and publication family routes. Changing the metadata origin contract
SHALL NOT introduce legacy route aliases, generic `/posts/...` routes, or a
different path architecture.

#### Scenario: mismatched slug keeps canonical path and current origin

- GIVEN a publication detail route receives a request with a valid id and a
  mismatched slug
- WHEN the route redirects or emits canonical metadata
- THEN the path uses the record's canonical `/section/:id/:slug` route
- AND the origin uses the deployed website origin that served the request

### Requirement: metadata image availability

First-party metadata image URLs SHALL point to static assets that are available
from the same deployed origin as the page. Publication metadata SHALL keep using
Open Graph compatible raster assets for effective Open Graph and Twitter images.

#### Scenario: new staged publication has staged image metadata

- GIVEN a new publication and its thumbnail are deployed to staging before
  production
- WHEN the staging detail page emits Open Graph and Twitter image metadata
- THEN the image metadata points to the staging origin
- AND the referenced image URL returns a successful image response on staging

### Requirement: sitemap and robots origin consistency

Sitemap URLs and `robots.txt` host/sitemap references SHALL use the intended
origin for the deployed website being served. Staging and preview deployments
SHALL NOT emit production-only sitemap or robots host URLs unless a separate
accepted indexing policy explicitly requires production-only output for that
deployment.

#### Scenario: staging robots and sitemap stay on staging

- GIVEN the app is served from the staging origin
- WHEN a crawler requests `/robots.txt` or `/sitemap.xml`
- THEN first-party absolute URLs in those responses use the staging origin
- AND they do not point to `https://querypie.ai` by default

## Follow-up implementation tasks

The canonical task checklist is
`openspec/changes/deployed-origin-metadata/tasks.md`. At minimum, implementation
must update the deployed-origin resolver, route metadata, publication/resource
metadata helpers, sitemap, robots, regression tests, and hosted verification for
`/news/15/iso-42001-certification-press-release`.

## Verification scope

Implementation work for this spec SHALL include at least the following checks:

1. Source/unit tests proving that origin resolution returns the expected origin
   for production, staging, preview, and localhost request/deployment inputs.
2. Metadata tests for at least one publication detail route proving that
   `alternates.canonical`, `openGraph.url`, `openGraph.images[].url`, and
   `twitter.images[]` use the current deployed origin while preserving the
   canonical path.
3. Sitemap and robots tests proving that first-party absolute URLs use the
   current deployed origin.
4. A regression test for a staged-only publication asset where the page and
   image exist on staging but not yet on production.
5. Hosted verification on staging with:
   - `curl -Ls https://stage.querypie.ai/news/15/iso-42001-certification-press-release`
   - extraction of `og:url`, `og:image`, and `twitter:image`
   - `curl -I` against the extracted image URL
   - expected result: the extracted image URL uses `https://stage.querypie.ai`
     and returns `200` with an image content type
6. Production verification after deployment with the same metadata extraction and
   image `curl -I` checks against `https://querypie.ai`.
7. `npm run test:ci` for repository regression coverage, and `npm run build`
   because metadata, sitemap, and routing output affect production rendering.

The implementation PR SHALL also record a Spec / Implementation Drift Check
against this spec.
