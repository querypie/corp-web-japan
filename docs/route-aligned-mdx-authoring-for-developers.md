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

- `src/app/blog/[id]/[slug]/page.tsx` -> `src/content/blog/<id>-<slug>.mdx`
- `src/app/whitepapers/[id]/[slug]/page.tsx` -> `src/content/whitepapers/<id>-<slug>.mdx`
- `src/app/news/[id]/[slug]/page.tsx` -> `src/content/news/<id>-<slug>.mdx`
- `src/app/t/terms-of-service/page.tsx` -> `src/app/t/terms-of-service/content.mdx`
- `src/app/t/eula/page.tsx` -> `src/app/t/eula/content.mdx`
- `src/app/t/privacy-policy/[slug]/page.tsx` -> `src/content/privacy-policy/<slug>.mdx`

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

- `src/content/blog/*.mdx`
- `src/content/whitepapers/*.mdx`
- `src/content/news/*.mdx`
- `src/content/events/*.mdx`
- `src/content/demo/aip/*.mdx`
- `src/content/demo/acp/*.mdx`

Recommended contract:

- file name includes the stable `id` and readable slug
- frontmatter keeps the canonical route slug
- loader resolves by `id`
- route redirects `/section/:id` or mismatched slugs to `/section/:id/:slug`

This is the right fit when the route family has many entries and wants one consistent loading pipeline.

### 5.2 Route-adjacent MDX for singleton or route-owned documents

Use route-adjacent `content.mdx` when the route itself is the clearest owner of one document.

Current examples:

- `src/app/t/eula/page.tsx` + `src/app/t/eula/content.mdx`
- `src/app/t/terms-of-service/page.tsx` + `src/app/t/terms-of-service/content.mdx`

This is a good fit when:

- one route owns one document
- there is no large multi-record loader requirement
- route adjacency is more readable than putting the file in a shared content root

### 5.3 Versioned MDX under a dedicated content root

A versioned document family often fits best in a dedicated content root keyed by slug or date.

Current example:

- `src/app/t/privacy-policy/[slug]/page.tsx`
- `src/content/privacy-policy/<slug>.mdx`

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

- `src/app/blog/[id]/[slug]/page.tsx`
- `src/content/blog/30-example-post.mdx`
- `public/blog/30/thumbnail.png`

### 6.2 For singleton documents

Preferred pattern:

- route: `src/app/<route>/page.tsx`
- content: `src/app/<route>/content.mdx`

Examples:

- `src/app/t/eula/page.tsx`
- `src/app/t/eula/content.mdx`

### 6.3 For versioned document families

Preferred pattern:

- route: `src/app/<route>/[slug]/page.tsx`
- content: `src/content/<family>/<slug>.mdx`

Examples:

- `src/app/t/privacy-policy/[slug]/page.tsx`
- `src/content/privacy-policy/2026-01-15.mdx`

## 7. What the thin wrapper should do

A good thin wrapper route usually does only the following:

1. read params
2. resolve the target record or document
3. redirect if the slug is missing or mismatched
4. build metadata from frontmatter
5. render one shared family page shell

Representative current shapes in this repo:

- `src/app/blog/[id]/[slug]/page.tsx`
- `src/app/news/[id]/[slug]/page.tsx`
- `src/app/t/eula/page.tsx`
- `src/app/t/terms-of-service/page.tsx`
- `src/app/t/privacy-policy/[slug]/page.tsx`

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
