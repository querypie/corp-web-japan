---
name: privacy-policy-version-archive
description: Migrate QueryPie privacy-policy revision history into corp-web-japan as local MDX files, render `/t/privacy-policy` plus `/t/privacy-policy/[slug]`, and derive version navigation from content filenames instead of a duplicated registry.
version: 1.0.0
author: Hermes Agent
license: MIT
---

# Privacy policy version archive

Use this when `../corp-web-contents/pages/privacy-policy-en/*/en/content.mdx` contains multiple historical revisions and the user wants them migrated into local corp-web-japan preview routes.

## Goal

Implement a local privacy-policy revision archive with:
- latest alias route: `/t/privacy-policy`
- version detail route: `/t/privacy-policy/[slug]`
- one local MDX file per revision under `src/content/privacy-policy/*.mdx`
- version navigation derived from actual content filenames, not from a duplicated hardcoded TypeScript registry

## Preferred final file layout

- `src/content/privacy-policy/2019-11-29.mdx`
- `src/content/privacy-policy/2021-03-30.mdx`
- ...
- `src/content/privacy-policy/2026-01-15.mdx`
- `src/app/t/privacy-policy/page.tsx`
- `src/app/t/privacy-policy/[slug]/page.tsx`
- `src/app/t/privacy-policy/privacy-policy-document.tsx`
- `src/app/t/privacy-policy/privacy-policy-version-selector.tsx`
- `src/app/t/privacy-policy/privacy-policy-sources.ts`

Do not keep the MDX files route-adjacent once the user explicitly asks for `src/content/privacy-policy/*.mdx`.
Do not keep a duplicated `privacy-policy-versions.ts` registry when all slugs are already encoded in the filenames.

## Source discovery

1. Inspect upstream files under:
   - `../corp-web-contents/pages/privacy-policy-en/*/en/content.mdx`
2. Treat directory names like `26-01-15` as the upstream revision key.
3. Convert those to local canonical slugs in `yyyy-mm-dd` form:
   - `26-01-15` -> `2026-01-15`
   - `25-06-05` -> `2025-06-05`
4. Sort local slugs descending so the newest file is the latest alias target.

## MDX migration rules

For each upstream revision:
1. create `src/content/privacy-policy/<yyyy-mm-dd>.mdx`
2. add frontmatter:
   - `title`
   - `description`
   - `date`
   - `version`
3. strip upstream wrapper-only chrome from the body:
   - `StaticH3`
   - `PrivacySelectorBox`
   - `PrivacyPolicyLanguageSelector`
   - `PrivacyPolicyVersionSelector`
   - page-level wrapper boxes/centering wrappers when they only exist for layout
4. keep the actual legal content body only

### Important body-cleanup nuance

Upstream privacy-policy MDX mixes:
- real prose/heading lines that should become normal Markdown
- JSX table blocks where indentation still matters visually/readability-wise

When normalizing indentation after migration:
- remove leading indentation from headings and ordinary paragraph lines
- do **not** blindly left-trim every indented line in the file
- especially do not flatten text nested inside JSX table blocks just because it starts with spaces

A safe practical heuristic:
- strip indentation for lines that are clearly top-level Markdown prose such as:
  - `# ...`, `## ...`
  - ordinary English paragraph lines
  - effective-date bullet lines like `* Effective from ...`
- keep indentation inside lines that remain structurally nested under JSX tags like `<Table>`, `<Table.Tr>`, `<Table.Td>`, or JSX expressions

If a first pass accidentally drags table-cell text left (for example `QueryPie Homepage` suddenly aligns at column 0 inside `<Table.Td>`), restore and redo the cleanup more narrowly.

## Route implementation pattern

### `page.tsx`
- keep this as the latest alias route only
- compute the newest slug from the scanned content files
- render `PrivacyPolicyDocumentPage` with that slug
- generate metadata from that same slug

### `[slug]/page.tsx`
- use the slug literally as the route parameter
- generate static params from the scanned content files
- render `PrivacyPolicyDocumentPage` with the requested slug
- let metadata use `/t/privacy-policy/${slug}` as canonical

### `privacy-policy-document.tsx`
This is the shared renderer for the privacy-policy route family.
It should:
- verify slug existence from scanned filenames
- read `src/content/privacy-policy/${slug}.mdx`
- evaluate MDX with `parseFrontmatter: true`
- render:
  - hero/date/title/description
  - language selector
  - version selector
  - MDX body
  - existing CTA/footer shell

Keep this renderer route-local unless the user explicitly wants a broader legal-page abstraction.

## Filename-scanning implementation

Create a small route-local helper such as `privacy-policy-sources.ts`.
Preferred responsibilities:
- `listPrivacyPolicySlugs()`
- `getLatestPrivacyPolicySlug()`
- `hasPrivacyPolicySlug(slug)`

Recommended implementation shape:
- scan `src/content/privacy-policy`
- keep only files matching `/^\d{4}-\d{2}-\d{2}\.mdx$/`
- remove `.mdx`
- sort descending

Why this matters:
- avoids duplicated version metadata lists
- keeps content filenames as the single source of truth for available revisions
- makes future addition of a new revision a content-only change when the route behavior stays the same

## Selector behavior

`privacy-policy-version-selector.tsx` should:
- accept `currentSlug`
- accept `slugs`
- navigate to `/t/privacy-policy/${nextSlug}` on change

Do not import a duplicated hardcoded version registry into the selector.
Pass the scanned slug list from the server renderer instead.

## Testing

Add/update a narrow test such as `tests/src/app/t/privacy-policy/page.test.mjs`.

Verify:
1. `/t/privacy-policy` uses latest-slug discovery, not a hardcoded registry constant
2. `/t/privacy-policy/[slug]` uses scanned slugs for `generateStaticParams()`
3. `privacy-policy-document.tsx` reads `src/content/privacy-policy/${slug}.mdx`
4. slug existence is validated from scanned filenames
5. no `privacy-policy-versions.ts` file remains
6. each migrated content file still contains frontmatter `date` and `version`
7. migrated content no longer contains old page-level selector/header wrapper components
8. footer legal links remain preview-aware if that behavior already exists

## Pitfalls

- keeping MDX under `src/app/t/privacy-policy/*.mdx` after the user asks for `src/content/privacy-policy/*.mdx`
- keeping a duplicated `privacy-policy-versions.ts` registry after switching to content filenames as source of truth
- normalizing indentation too broadly and breaking table-cell formatting
- moving the route renderer into a broad shared area too early; this page family is still route-specific
- hardcoding the latest slug in `page.tsx`

## Done criteria

- each revision lives at `src/content/privacy-policy/<yyyy-mm-dd>.mdx`
- `/t/privacy-policy` resolves the newest file automatically
- `/t/privacy-policy/[slug]` resolves each historical revision
- version navigation is derived from scanned content filenames
- no duplicated TypeScript version registry remains
- heading/paragraph indentation cleanup does not flatten JSX table content
- narrow tests pass
