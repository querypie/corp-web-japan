## ADDED Requirements

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
