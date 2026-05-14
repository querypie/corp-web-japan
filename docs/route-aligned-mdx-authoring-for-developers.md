# Route-Aligned MDX Authoring for Developers

## 1. Why this document exists

PR 470 documented the main route-local refactoring direction for static marketing pages:

- keep `page.tsx` as the primary authoring surface
- keep section composition readable in the route
- keep extracted section files focused on UI implementation details

This document covers a related but different pattern.
It is a route-local refactoring variant for content-heavy routes where the real authored body should live in `.mdx` files instead of inline JSX in `page.tsx`.

Typical examples in this repository are:

- blog posts
- whitepapers
- news posts
- events
- use cases and demo detail pages
- legal documents such as EULA, Terms of Service, and versioned privacy policies

In these route families, the best route-local outcome is usually not “put all copy back into `page.tsx`.”
The better outcome is:

- keep the route file thin
- move the content body into a route-aligned MDX file
- preserve a predictable file and directory convention that maps cleanly to the route or slug
- let shared code render a consistent UI shell around the MDX content

So this pattern is not a rejection of PR 470.
It is an extension of the same authoring-ownership idea, applied to publication and document families.

## 2. Core idea

For these route families, separate responsibilities like this:

- `src/app/**/page.tsx`
  - route entry
  - param handling
  - canonical redirect logic
  - metadata wiring
  - thin page composition
- `src/content/**` or route-adjacent `content.mdx`
  - the actual long-form content body
  - frontmatter that describes the document or publication
- `src/lib/**`
  - loaders, route resolution, frontmatter parsing, MDX rendering, and family-specific rules
- `src/components/sections/**`
  - shared post/document page shells and reusable UI primitives

In short:

- static marketing page pattern -> `page.tsx` owns most copy
- publication / document pattern -> `.mdx` owns the long-form copy, while `page.tsx` stays thin

## 3. When this pattern is the right fit

Use route-aligned MDX authoring when most of the following are true:

- the route is a publication, article, document, or long-form resource
- the content body is primarily prose rather than highly bespoke marketing composition
- many pages in the same family should share one rendering contract
- the route naturally maps to an `id`, `slug`, or version identifier
- future content updates should be possible without touching page implementation code
- multilingual expansion is likely or already expected

Good fits in this repo:

- `/blog/:id/:slug`
- `/whitepapers/:id/:slug`
- `/news/:id/:slug`
- `/events/:id/:slug`
- `/demo/aip/:id/:slug`
- `/demo/acp/:id/:slug`
- `/t/eula`
- `/t/terms-of-service`
- `/t/privacy-policy/[slug]`

Not the default fit:

- top page
- solution landing pages
- static marketing pages whose copy and section composition should remain reviewer-visible in JSX

## 4. Main benefits

### 4.1 Route-to-content mapping becomes obvious

A predictable MDX file layout makes it much easier to answer:

- which file owns this route?
- which file owns this slug?
- where should a new localized version live?

Examples from the current repo shape:

- [src/app/blog/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/%5Bid%5D/%5Bslug%5D/page.tsx) -> [src/content/blog](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog) (MDX files named `<id>-<slug>.mdx`)
- [src/app/whitepapers/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/whitepapers/%5Bid%5D/%5Bslug%5D/page.tsx) -> [src/content/whitepapers](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/whitepapers) (MDX files named `<id>-<slug>.mdx`)
- [src/app/news/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/news/%5Bid%5D/%5Bslug%5D/page.tsx) -> [src/content/news](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/news) (MDX files named `<id>-<slug>.mdx`)
- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx) -> [src/app/t/terms-of-service/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/content.mdx)
- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx) -> [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)
- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx) -> [src/content/privacy-policy](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy) (versioned MDX files such as [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx))

That mapping is especially valuable for reviewers, content editors, and AI agents.

### 4.2 `page.tsx` stays thin and stable

For publication and legal families, the route file should mostly answer routing questions, not duplicate document text.

A good thin route file usually handles:

- route params
- canonical slug redirects
- `notFound()` for missing records
- metadata generation from frontmatter
- calling one shared page shell

That keeps implementation code stable even when content changes frequently.

### 4.3 One family can share a consistent UI

A publication family often wants the same visual structure across many entries:

- shared hero treatment
- shared byline / meta area
- shared body typography
- shared related-items area
- shared gated-content behavior
- shared legal-document wrapper

By keeping the content in MDX and the presentation in shared components, the repo can render many content items consistently without copying page implementation logic.

### 4.4 Code becomes language-agnostic

When implementation code is mostly shell, loader, and rendering logic, it does not need to be rewritten per language.

That means:

- Japanese, English, or Korean content can reuse the same rendering contract
- UI code focuses on layout and behavior
- content language stays in the content file instead of leaking through component logic

This usually makes future localization or cross-language parity work much cleaner.

### 4.5 i18n becomes structurally easier

Route-aligned MDX conventions make it easier to support multiple language variants later because the content identity and the route identity can stay explicit.

For example, a family can preserve:

- a stable `id`
- a canonical route `slug`
- one or more language-specific content files
- a shared renderer and shared route behavior

The exact multilingual file contract may vary by family, but the key point is that MDX content separation makes language expansion easier than burying long-form copy inside route code.

## 5. Two useful sub-patterns

This repository already shows two important forms of the same idea.

### 5.1 Content-root MDX for publication families

Use a shared family content root when many items share the same route structure.

Examples:

- [src/content/blog](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog) (`*.mdx`)
- [src/content/whitepapers](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/whitepapers) (`*.mdx`)
- [src/content/news](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/news) (`*.mdx`)
- [src/content/events](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/events) (`*.mdx`)
- [src/content/demo/aip](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/demo/aip) (`*.mdx`)
- [src/content/demo/acp](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/demo/acp) (`*.mdx`)

Recommended contract:

- file name includes the stable `id` and readable slug
- frontmatter keeps the canonical route slug
- loader resolves by `id`
- route redirects `/section/:id` or mismatched slugs to `/section/:id/:slug`

This is the right fit when the route family has many entries and wants one consistent loading pipeline.

### 5.2 Route-adjacent MDX for singleton or route-owned documents

Use route-adjacent `content.mdx` when the route itself is the clearest owner of one document.

Current examples:

- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx) + [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)
- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx) + [src/app/t/terms-of-service/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/content.mdx)

This is a good fit when:

- one route owns one document
- there is no large multi-record loader requirement
- route adjacency is more readable than putting the file in a shared content root

### 5.3 Versioned MDX under a dedicated content root

A versioned document family often fits best in a dedicated content root keyed by slug or date.

Current example:

- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx)
- [src/content/privacy-policy](https://github.com/querypie/corp-web-japan/tree/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy) (for example [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx))

This is a good fit when:

- the route is still family-specific
- records are versioned
- the route needs a list of valid slugs and frontmatter-derived metadata
- storing all versions next to each other is clearer than colocating each file under its own route folder

## 6. Recommended mapping conventions

### 6.1 For publication/detail families

Preferred pattern:

- route: `src/app/<section>/[id]/[slug]/page.tsx`
- content: `src/content/<section>/<id>-<slug>.mdx`
- canonical identity: frontmatter `id` + frontmatter `slug`
- shared asset root: `public/<section>/<id>/...`

Examples:

- [src/app/blog/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/%5Bid%5D/%5Bslug%5D/page.tsx)
- [src/content/blog/9-data-discovery-privacy-management.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/blog/9-data-discovery-privacy-management.mdx)
- [public/blog/9/thumbnail.png](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/public/blog/9/thumbnail.png)

### 6.2 For singleton documents

Preferred pattern:

- route: `src/app/<route>/page.tsx`
- content: `src/app/<route>/content.mdx`

Examples:

- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx)
- [src/app/t/eula/content.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/content.mdx)

### 6.3 For versioned document families

Preferred pattern:

- route: `src/app/<route>/[slug]/page.tsx`
- content: `src/content/<family>/<slug>.mdx`

Examples:

- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx)
- [src/content/privacy-policy/2026-01-15.mdx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/content/privacy-policy/2026-01-15.mdx)

## 7. What the thin wrapper should do

A good thin wrapper route usually does only the following:

1. read params
2. resolve the target record or document
3. redirect if the slug is missing or mismatched
4. build metadata from frontmatter
5. render one shared family page shell

Representative current shapes in this repo:

- [src/app/blog/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/blog/%5Bid%5D/%5Bslug%5D/page.tsx)
- [src/app/news/\[id\]/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/news/%5Bid%5D/%5Bslug%5D/page.tsx)
- [src/app/t/eula/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/eula/page.tsx)
- [src/app/t/terms-of-service/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/terms-of-service/page.tsx)
- [src/app/t/privacy-policy/\[slug\]/page.tsx](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/privacy-policy/%5Bslug%5D/page.tsx)

A route of this kind should not also become a giant content registry or a page-specific prose container.

## 8. Frontmatter matters

When content moves into MDX, frontmatter becomes part of the route contract.

Typical responsibilities of frontmatter include:

- canonical slug
- title
- description
- date or version
- hero image path
- related item IDs
- gated-content flags
- redirect targets, where supported

That means frontmatter quality is not optional.
It is part of the application contract between route, loader, metadata, and rendering shell.

## 9. Patterns to avoid

### Bad pattern A: thin route, but opaque content lookup

```tsx
export default function Page() {
  return <PublicationPage sourceKey="item-17" />;
}
```

Why it is bad:

- the route does not reveal which file owns the content
- the mapping is hidden in another registry
- reviewers and AI agents must chase indirect keys

### Bad pattern B: content moved to MDX, but file naming ignores route identity

Examples of poor naming:

- `src/content/blog/final.mdx`
- `src/content/blog/post-latest.mdx`
- `src/content/privacy-policy/current.mdx`

Why it is bad:

- route ownership is unclear
- slug lookup becomes fragile
- future i18n or versioning becomes harder

### Bad pattern C: publication routes rewritten as static marketing pages

If a blog or legal document route is forced back into giant inline JSX inside `page.tsx`, the result is often worse:

- long-form copy becomes harder to edit
- one shared renderer becomes harder to maintain
- future language expansion becomes harder
- page implementation churn increases for simple content edits

## 10. Review questions

When reviewing this pattern, ask:

- can I tell which MDX file owns this route?
- does the file naming convention map cleanly to the URI and slug?
- is `page.tsx` thin for the right reasons, or just hiding complexity in a bad registry?
- does shared UI live in components and shared logic in loaders?
- does frontmatter clearly define the route contract?
- would adding a second language or a second version still look structurally sane?

## 11. Suggested guidance for AI-agent tasks

Useful task shapes include instructions such as:

- “Implement this publication route as a thin wrapper around route-aligned MDX content.”
- “Keep the route-to-content mapping explicit through `id`/`slug`-aligned MDX filenames.”
- “Use shared page shells for rendering, and keep the long-form body in MDX.”
- “Do not turn this publication or legal route into a large JSX-authored marketing page.”

A strong task packet should also say:

- which route family is in scope
- whether the pattern should be route-adjacent `content.mdx` or shared `src/content/**`
- which file path and naming convention must be followed
- whether canonical slug redirects and metadata generation must be preserved

## 12. Bottom line

PR 470 established the main route-local refactoring direction for static marketing pages.
This MDX pattern is the corresponding publication/document variant:

- route stays local and thin
- content ownership moves into MDX
- file paths align with route identity
- UI stays consistent through shared renderers
- implementation code stays language-agnostic
- future i18n and content scaling become easier

So the real principle is not “always put copy in `page.tsx`.”
The real principle is:

- keep authorship near the route
- make route-to-content ownership obvious
- choose the authoring surface that best fits the page family

For static marketing pages, that usually means JSX in `page.tsx`.
For publications and legal documents, that usually means route-aligned MDX plus a thin route wrapper.

## 13. Current MDX content-management capabilities in this repository

The route-aligned MDX pattern in `corp-web-japan` is not only a file-placement rule.
It is also a content-management contract implemented through loaders, frontmatter, shared shells, and route behavior.

### 13.1 Supported content families

The current public MDX-backed families include:

- publications under `src/lib/publications/**`
  - blog
  - whitepapers
  - news
  - events
  - use cases
  - AIP demos
  - ACP demos
- resource-style families under `src/lib/resources/**`
  - introduction deck
  - glossary
  - manuals
- route-adjacent or versioned document families
  - `src/app/t/eula/content.mdx`
  - `src/app/t/terms-of-service/content.mdx`
  - `src/content/privacy-policy/*.mdx`

So the practical pattern is broader than “blog posts in MDX.”
The repository already uses MDX as the authoring layer for multiple public content families with shared route and rendering rules.

### 13.2 Content lists are frontmatter-driven and pre-indexed

For publication-style families, list pages are built from frontmatter records rather than by rendering the full MDX body first.

The core repository shape is visible in:

- `src/lib/publications/create-standard-records-repository.ts`
- `src/lib/publications/blog/records.ts`
- `src/lib/publications/whitepapers/records.ts`
- `src/lib/publications/events/records.ts`

Current behavior includes:

- reading every `*.mdx` file under the family content root
- parsing the frontmatter block once per source file
- normalizing that frontmatter into typed records
- sorting records by descending numeric `id`
- filtering `hidden: true` records out of visible list items
- resolving list-card hrefs through `redirectUrl` when a shadow record should point elsewhere
- generating `listParams()` and `listIds()` for static route generation

This means a list page can answer “what content exists?” and “which cards should be visible?” from the record index alone, without eagerly rendering every full post body.

### 13.3 Detail loaders cache file reads for faster repeat access

The detail loaders add another layer of runtime efficiency.
The current implementations are:

- `src/lib/publications/create-standard-publication-post-loader.ts`
- `src/lib/publications/create-gated-publication-post-loader.ts`
- `src/lib/resources/base-resource-publication-post-loader.ts`

The important behavior is that each loader keeps an in-memory body-source cache keyed by `sourcePath`.
That gives the current implementation these benefits:

- repeated requests for the same post do not need to re-read the MDX file from disk every time
- metadata, table-of-contents extraction, related-item wiring, and rendering can all reuse the same cached source text
- list-page loading and detail-page loading stay separated, so list responses remain lightweight while detail routes still get the full rendered MDX output

In practice, the repository uses two complementary optimizations:

- frontmatter-indexed list repositories for fast list and route-param resolution
- per-source body caching for repeated detail-page reads

### 13.4 Frontmatter controls more than titles and dates

In this repository, frontmatter is a behavior surface, not just a descriptive header.
It currently drives list visibility, redirects, shared imagery, metadata, event timeline behavior, and gating flows.

#### Common identity and presentation fields

The common baseline fields across the major families are:

- `id`
- `slug`
- `title`
- `description`
- `date`
- `heroImageSrc`
- `relatedIds` or family-equivalent related-item metadata
- `author` where supported

These fields feed the canonical route, the page header, the list card, metadata generation, and related-item rendering.

#### List and detail behavior fields

The current implementation also uses frontmatter for route and list behavior:

- `hidden: true`
  - keep a record out of visible list pages
- `redirectUrl`
  - preserve a local record identity while sending human visitors and list cards to another destination
- `hideHeroImageOnDetail: true`
  - suppress the hero image on the detail page while keeping the list image metadata
- `hideTocOnDetail: true`
  - suppress automatic heading-based table-of-contents output where that UI should not appear

This is why frontmatter quality must be reviewed as application behavior, not only as content copy.

#### Family-specific fields already supported

The current repo also supports family-specific frontmatter features such as:

- `listDescription`
  - lets whitepapers use a list-specific summary instead of the full detail description
- `eventDate`
  - lets events use the actual event date for timeline placement instead of only the publish date
- `eventLabel`
  - lets events override the default badge label
- `gated: true`
  - enables the gated-content path for supported families
- `downloadCta`
  - defines the CTA label and download destination contract
- `downloadCoverImageSrc`
  - lets whitepapers show a dedicated portrait cover on the PDF gating page instead of the article thumbnail

### 13.5 SEO and canonical route behavior are frontmatter-backed

The MDX layer also feeds SEO and canonical routing behavior.
Representative route files include:

- `src/app/blog/[id]/[slug]/page.tsx`
- `src/app/whitepapers/[id]/[slug]/page.tsx`
- `src/app/events/[id]/[slug]/page.tsx`

The current route contract is:

- resolve content by `id`
- treat `slug` as the canonical display segment
- redirect `/section/:id` or mismatched slugs to `/section/:id/:slug`
- build page metadata from the record/frontmatter values
- preserve redirect-aware behavior where a record intentionally points to another route or destination

So frontmatter is already part of the repository’s SEO and canonicalization layer, not just the visible page body.

### 13.6 Event pages support both archive and upcoming-event UX

The event family shows how frontmatter-backed MDX content can power richer list behavior.
The main implementation lives in:

- `src/lib/publications/events/records.ts`
- `src/app/events/page.tsx`

Current event-page capabilities include:

- preserving a visible archive of past events
- computing `heroEvent` from the nearest visible upcoming event
- using `eventDate` when present, and falling back to `date` otherwise
- rendering the selected upcoming item in the hero with the `Upcoming Event` eyebrow and a CTA button
- rendering the remaining timeline as `Past Events`
- keeping that past-event list available even when the hero item changes over time

In other words, the event page is not a hard-coded landing page.
It is a frontmatter-driven timeline view over the MDX event corpus.

### 13.7 CTA buttons and gating forms are part of the authoring contract

The current MDX system also supports conversion-oriented behavior without moving that logic into each route file.
Representative implementation files include:

- `src/components/sections/publication-post-page.tsx`
- `src/components/sections/publication/gated-content.tsx`
- `src/lib/publications/gating.ts`
- `src/lib/gating-form.ts`
- `src/app/whitepapers/[id]/[slug]/pdf/page.tsx`

Current capabilities include:

- article-body CTA buttons driven by `downloadCta`
- gated preview/body splitting through `<GatingCut />`
- gated-content unlocking through `/api/gating-form/unlock`
- per-content gating cookies derived from the content key
- preview-mode bypass for internal review flows
- whitepaper-specific PDF gate pages that can use `downloadCoverImageSrc` instead of the regular article thumbnail

The practical authoring rule is:

- if a resource is gated, the MDX file must declare `gated: true`
- the body must include `<GatingCut />`
- the route and shared shell can then render preview content, a gating form, and the unlocked content without route-specific reimplementation

## 14. Practical authoring checklist for a new MDX-backed entry

When adding or reviewing a new MDX-backed content item in this repository, the minimum checklist is:

1. Choose the correct content root for the family.
2. Use a file name that keeps `id` and route-readable slug aligned where that family expects it.
3. Set the required identity and metadata fields: `id`, `slug`, `title`, `description`, `date`, and `heroImageSrc`.
4. Add relationship and behavior fields only when they are intentionally needed:
   - `relatedIds`
   - `hidden`
   - `redirectUrl`
   - `listDescription`
   - `eventDate`
   - `eventLabel`
   - `hideHeroImageOnDetail`
   - `hideTocOnDetail`
   - `gated`
   - `downloadCta`
   - `downloadCoverImageSrc`
5. Keep route-aligned assets under the matching public family/id path.
6. If the content is gated, include `<GatingCut />` and verify the unlock flow.
7. Verify that the canonical route, list visibility, redirect behavior, and metadata all match the intended contract.

That is the key extension to the original PR 471 guidance:
route-aligned MDX authoring in this repository already includes a substantial content-management feature set, not only a file-layout convention.
