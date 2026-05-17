# MDX collection inventory

This document summarizes the current MDX-backed content collections in this repository as of `origin/main` at commit `f3382958b0ce8c89c93d04ccf689606bc13f1948`.

Scope:

- Includes public MDX collection families backed by `src/content/**` and rendered through `src/lib/publications/**` or `src/lib/resources/**`.
- Excludes legal pages from the main collection inventory because they use a separate legal-document MDX renderer and route-owned page composition. Legal pages are documented in the final section.
- Excludes internal-only support MDX such as `src/content/internal/*.mdx`.

## Public MDX collection inventory

| Collection | Count | Endpoints | MDX source path | Public asset path | Loader / records source | Notes |
|---|---:|---|---|---|---|---|
| Blog | 29 | List: `/blog`<br>Detail: `/blog/:id/:slug`<br>ID redirect: `/blog/:id` | `src/content/blog/*.mdx` | `public/blog/<id>/...` | `src/lib/publications/blog/records.ts`<br>`src/lib/publications/blog/get-post.ts` | Standard publication family. Supports list hiding and detail redirects. |
| Whitepapers | 30 | List: `/whitepapers`<br>Detail: `/whitepapers/:id/:slug`<br>ID redirect: `/whitepapers/:id`<br>PDF page: `/whitepapers/:id/:slug/pdf`<br>Legacy download route: `/whitepapers/:id/:slug/download` | `src/content/whitepapers/*.mdx` | `public/whitepapers/<id>/...` | `src/lib/publications/whitepapers/records.ts`<br>`src/lib/publications/whitepapers/get-post.ts` | Gated publication family. Supports whitepaper-specific download CTA, PDF cover image, and visible-list fallback description. |
| News | 14 | List: `/news`<br>Detail: `/news/:id/:slug`<br>ID redirect: `/news/:id` | `src/content/news/*.mdx` | `public/news/<id>/...` | `src/lib/publications/news/records.ts`<br>`src/lib/publications/news/get-post.ts` | Standard publication family. Supports source labels and redirect-backed shadow records in code. |
| Events | 27 | List: `/events`<br>Detail: `/events/:id/:slug`<br>ID redirect: `/events/:id` | `src/content/events/*.mdx` | `public/events/<id>/...` | `src/lib/publications/events/records.ts`<br>`src/lib/publications/events/get-post.ts` | Standard publication family with event timeline behavior. The public list route is active and indexable. |
| Use cases | 29 | List: `/use-cases`<br>Detail: `/use-cases/:id/:slug`<br>ID redirect: `/use-cases/:id` | `src/content/use-cases/*.mdx` | `public/use-cases/<id>/...` | `src/lib/publications/use-cases/records.ts`<br>`src/lib/publications/use-cases/get-post.ts` | Standard publication family. List and detail routes share the same top-level use-case prefix. |
| AIP demo | 1 | List: `/demo/aip`<br>Detail: `/demo/aip/:id/:slug`<br>ID redirect: `/demo/aip/:id` | `src/content/demo/aip/*.mdx` | `public/demo/aip/<id>/...` | `src/lib/publications/demo/aip/records.ts`<br>`src/lib/publications/demo/aip/get-post.ts` | Standard publication family for AIP demo content. |
| ACP demo | 26 | List: `/demo/acp`<br>Detail: `/demo/acp/:id/:slug`<br>ID redirect: `/demo/acp/:id` | `src/content/demo/acp/*.mdx` | `public/demo/acp/<id>/...` | `src/lib/publications/demo/acp/records.ts`<br>`src/lib/publications/demo/acp/get-post.ts` | Standard publication family for ACP demo content. |
| Introduction deck | 2 | List: `/introduction-deck`<br>Detail: `/introduction-deck/:id/:slug`<br>ID redirect: `/introduction-deck/:id` | `src/content/introduction-deck/*.mdx` | `public/introduction-deck/<id>/...` | `src/lib/resources/introduction-deck-publications.ts`<br>`src/lib/resources/introduction-deck-post-loader.ts` | Resource publication family. Supports gated resources and frontmatter download CTA. |
| Glossary | 1 | List: `/glossary`<br>Detail: `/glossary/:id/:slug`<br>ID redirect: `/glossary/:id` | `src/content/glossary/*.mdx` | `public/glossary/<id>/...` | `src/lib/resources/glossary-publications.ts`<br>`src/lib/resources/glossary-post-loader.ts` | Resource publication family. Current content uses related-item cards. |
| Manuals | 7 | List: `/manuals`<br>Detail: `/manuals/:id/:slug`<br>ID redirect: `/manuals/:id` | `src/content/manuals/*.mdx` | `public/manuals/<id>/...` | `src/lib/resources/manual-publications.ts`<br>`src/lib/resources/manual-post-loader.ts` | Resource publication family. Source-file order is explicitly controlled in `manual-publications.ts`. |

## Frontmatter support model

### Common frontmatter field set

The closest shared frontmatter contract across public MDX collections is:

| Field | Type / shape | Common support | Functional use |
|---|---|---|---|
| `id` | string | Required for all public collections | Primary lookup key for detail pages and ID-to-canonical-slug redirects. |
| `slug` | string | Required for all public collections | Canonical URL display segment. Mismatched or missing slugs redirect to the canonical route where supported by the route. |
| `title` | string | Required for all public collections | Detail heading, list card title, and metadata source. |
| `description` | string | Required for all public collections | Metadata and list/detail summary text. |
| `heroImageSrc` | string path | Required for all non-legal public collections | List image and detail hero image source. |
| `date` | string | Required for standard publication families; optional for resource publication families | List/detail date display. Events may format an effective event date separately. |
| `author` | string or string[] | Supported by standard publication families and whitepapers | Resolved through the article author registry for detail-page author display. |
| `relatedIds` | string[] | Supported by standard publication families and whitepapers | Builds related cards by resolving IDs within the same collection. |
| `hidden` | boolean | Supported by standard publication families and whitepapers | Removes the record from list pages while keeping the detail route resolvable. |
| `redirectUrl` | string | Supported by standard publication families and whitepapers | Makes list hrefs resolve to the redirect target and redirects human detail visits where the detail route uses the redirectable-publication helper. |
| `hideHeroImageOnDetail` | boolean | Supported by selected standard publication families | Suppresses the detail hero image for records that need body-first rendering. |
| `hideTocOnDetail` | boolean | Supported by standard publication post rendering and currently typed by events | Suppresses generated table-of-contents output on detail pages. |
| `gated` | boolean | Supported by whitepapers and resource publication families | Splits preview and locked body with `<GatingCut />`. |
| `downloadCta` | object `{ href, label, external? }` | Supported by whitepapers and resource publication families | Renders a structured download/open CTA outside inline MDX body links. |
| `relatedItems` | array of explicit link objects | Supported by resource publication families | Builds related cards from explicit href/image/title/date data rather than same-family IDs. |

### Collection-by-collection frontmatter support

Legend:

- Yes: supported by the current loader/record code for that collection.
- No: not supported by the current loader/record code.
- Partial: supported in rendering or type shape, but not part of the primary list/records contract for that family.

| Collection | Common required fields (`id`, `slug`, `title`, `description`, `heroImageSrc`) | `date` | `author` | `relatedIds` | `hidden` | `redirectUrl` | `hideHeroImageOnDetail` | `hideTocOnDetail` | `gated` | `downloadCta` | `relatedItems` | Collection-specific fields |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Blog | Yes | Yes | Yes | Yes | Yes | Yes | No | Partial | No | No | No | None beyond shared publication fields. |
| Whitepapers | Yes | Yes | Yes | Yes | Yes | Yes | Partial | No | Yes | Yes | No | `listDescription`, `downloadCoverImageSrc`. |
| News | Yes | Yes | Yes | Yes | Yes | Yes | No | Partial | No | No | No | `sourceLabel`. If omitted, list label defaults from redirect state. |
| Events | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No | No | No | `eventDate`, `eventLabel`. `eventDate` must be ISO `YYYY-MM-DD` when present. |
| Use cases | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | No | No | No | None beyond shared publication fields plus optional hero suppression. |
| AIP demo | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | No | No | No | None beyond shared publication fields plus optional hero suppression. |
| ACP demo | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | No | No | No | None beyond shared publication fields plus optional hero suppression. |
| Introduction deck | Yes | Optional | No | No | No | No | No | No | Yes | Yes | Yes | Resource-family explicit related item objects. |
| Glossary | Yes | Optional | No | No | No | No | No | No | Yes | Yes | Yes | Resource-family explicit related item objects. |
| Manuals | Yes | Optional | No | No | No | No | No | No | Yes | Yes | Yes | Resource-family explicit related item objects. |

## Loader families and support boundaries

### Standard publication families

Standard publication families use `createStandardPublicationRecordsRepository` and usually `createStandardPublicationPostLoader`.

Families:

- Blog
- News
- Events
- Use cases
- AIP demo
- ACP demo

Functional characteristics:

- MDX files are scanned from one collection root under `src/content/**`.
- Records are sorted by numeric `id` descending unless a collection adds extra list behavior.
- `hidden: true` removes items from list pages while preserving `getRecord(id)` detail lookup.
- `redirectUrl` is resolved by `resolveRedirectablePublicationHref` for list hrefs.
- Detail routes use ID lookup and canonical slug redirects.
- Related cards use same-family `relatedIds`.

### Whitepapers

Whitepapers use the standard records repository but use `createGatedPublicationPostLoader` for detail rendering.

Functional characteristics:

- Supports the standard `hidden` / `redirectUrl` record behavior.
- Supports gated body splitting with `gated: true` and `<GatingCut />`.
- Supports structured `downloadCta` frontmatter.
- Supports `downloadCoverImageSrc` for the dedicated PDF/download flow.
- Supports `listDescription`, which the list uses before falling back to `description`.

### Resource publication families

Resource publication families use `BaseResourcePublicationRepository` and route-specific post loaders under `src/lib/resources/**`.

Families:

- Introduction deck
- Glossary
- Manuals

Functional characteristics:

- They support `id`, `slug`, `title`, `description`, `heroImageSrc`, optional `date`, optional `gated`, optional `downloadCta`, and optional `relatedItems`.
- They do not currently support `hidden` or `redirectUrl` in the shared resource repository.
- They use explicit `relatedItems` objects instead of same-family `relatedIds`.
- Manuals intentionally override the source-file order in `src/lib/resources/manual-publications.ts`.

## Legal MDX pages

Legal pages are intentionally separated from the public collection inventory above.
They are rendered through `src/lib/legal-mdx-source.ts`, which uses `next-mdx-remote-client/rsc` with `parseFrontmatter: true` and legal-document MDX components.
They do not use the publication/resource collection repositories, list item derivation, same-family related items, `hidden`, or `redirectUrl`.

| Legal page | Endpoints | MDX source path | Public image path | Frontmatter support | Loader / route source | Notes |
|---|---|---|---|---|---|---|
| Privacy policy | Latest: `/privacy-policy`<br>Versioned: `/privacy-policy/:slug` | `src/content/privacy-policy/YYYY-MM-DD.mdx` | None currently used | `title`, `description`, `date`, `version` | `src/lib/privacy-policy/records.ts`<br>`src/app/privacy-policy/page.tsx`<br>`src/app/privacy-policy/[slug]/page.tsx` | `slug` is derived from the filename, not frontmatter. The latest version is selected by filename sort. Metadata uses the MDX frontmatter title/description. |
| Terms of service | `/terms-of-service` | `src/app/terms-of-service/content.mdx` | None currently used | `title`, `description`, `date` | `src/app/terms-of-service/page.tsx`<br>`src/lib/legal-mdx-source.ts` | Route-adjacent MDX file. The page has no collection/list behavior and no version selector. |

### Legal frontmatter support compared with collection frontmatter

| Field / feature | Privacy policy | Terms of service | Notes |
|---|---|---|---|
| `title` | Yes | Yes | Used for metadata title and page heading. |
| `description` | Yes | Yes | Used for metadata description. |
| `date` | Yes | Yes | Parsed from frontmatter; current routes do not render it as collection-style card metadata. |
| `version` | Yes | No | Privacy policy uses this for the version selector's current value. |
| Filename-derived slug | Yes | No | Privacy policy version slugs come from `src/content/privacy-policy/YYYY-MM-DD.mdx` filenames. |
| `id`, `slug`, `heroImageSrc`, `author`, `relatedIds`, `hidden`, `redirectUrl`, `gated`, `downloadCta`, `relatedItems` | No | No | Legal pages do not use the public collection publication/resource contracts. |
