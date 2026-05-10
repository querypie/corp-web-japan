---
name: privacy-policy-version-archive
description: Maintain a versioned corp-web-japan privacy-policy preview archive using dated MDX files under src/content/privacy-policy, with /t/privacy-policy as the latest alias and /t/privacy-policy/[slug] for dated versions.
---

# Privacy policy version archive

Use this when working on the corp-web-japan privacy policy preview flow and the page must support multiple historical versions.

## When to use
- The user wants all upstream privacy policy versions migrated locally
- The preview must support both:
  - `/t/privacy-policy` for the latest version
  - `/t/privacy-policy/yyyy-mm-dd` for a specific historical version
- The user wants content stored as dated MDX files under `src/content/privacy-policy/`
- The user explicitly prefers filenames like `src/content/privacy-policy/2019-11-29.mdx`

## Canonical file layout

Routes:
- `src/app/t/privacy-policy/page.tsx`
- `src/app/t/privacy-policy/[slug]/page.tsx`
- `src/app/t/privacy-policy/privacy-policy-document.tsx`
- `src/app/t/privacy-policy/privacy-policy-version-selector.tsx`
- `src/app/t/privacy-policy/privacy-policy-versions.ts`

Content:
- `src/content/privacy-policy/2019-11-29.mdx`
- `src/content/privacy-policy/2021-03-30.mdx`
- ...
- `src/content/privacy-policy/2026-01-15.mdx`

Do not keep the dated MDX files route-adjacent under `src/app/t/privacy-policy/` once the user has asked for `src/content/privacy-policy/*.mdx`.

## Route contract

### Latest alias
- `/t/privacy-policy` should render the latest version from `LATEST_PRIVACY_POLICY_VERSION`.
- Keep this page thin: it should delegate to the shared document renderer.

### Historical detail route
- `/t/privacy-policy/[slug]` should render the exact requested version.
- Use `generateStaticParams()` from the version registry.
- Treat the slug as the ISO date string, e.g. `2025-06-05`.

## Content registry
Create and maintain a route-local version registry file:
- `src/app/t/privacy-policy/privacy-policy-versions.ts`

Recommended shape:
- `slug`: `yyyy-mm-dd`
- `title`: display title
- `date`: `yyyy-mm-dd`
- `label`: version selector label

Also export:
- `PRIVACY_POLICY_VERSIONS`
- `LATEST_PRIVACY_POLICY_VERSION`
- `getPrivacyPolicyVersion(slug)`

Keep the array in descending order so index `0` is the latest version.

## Loader pattern
In `privacy-policy-document.tsx`:
- use `join(process.cwd(), "src/content/privacy-policy", `${version.slug}.mdx`)`
- read via `readFile`
- evaluate via `next-mdx-remote-client/rsc`
- enable `parseFrontmatter: true`

Recommended frontmatter fields in each MDX file:
- `title`
- `description`
- `date`
- `version`

## MDX migration pattern
When migrating from `../corp-web-contents/pages/privacy-policy-en/<yy-mm-dd>/en/content.mdx`:

1. Convert source folder date `yy-mm-dd` to slug `yyyy-mm-dd`
   - `26-01-15` -> `2026-01-15`
2. Name the file exactly:
   - `src/content/privacy-policy/2026-01-15.mdx`
3. Add frontmatter with:
   - title
   - description
   - date
   - version
4. Strip old page-only wrapper markup from the body, including:
   - route title wrapper
   - language selector
   - version selector
   - old route-scaffolding components such as `StaticH3` or equivalent page header wrappers
5. Keep only the legal article body in the MDX file

## Page composition pattern
Keep these in the route-rendering layer, not in the MDX body:
- page hero/title/description
- effective date display
- language selector
- version selector
- footer/header/CTA

The shared document renderer should:
- load the selected MDX file
- render frontmatter-driven hero content
- render the route-local version selector
- render the legal body below

## Selector behavior
For the English preview archive selector:
- push to local preview routes:
  - `/t/privacy-policy/${nextSlug}`
- do not navigate to upstream `querypie.com` English privacy-policy version URLs once the local archive exists

For the Korean language link:
- keep the current external/upstream behavior unless the user explicitly asks for a local Korean archive too

## Testing expectations
Add or update a narrow source-structure test such as:
- `tests/legal-privacy-policy-preview.test.mjs`

Verify:
1. `src/app/t/privacy-policy/page.tsx` exists
2. `src/app/t/privacy-policy/[slug]/page.tsx` exists
3. `privacy-policy-document.tsx` reads from `src/content/privacy-policy/${version.slug}.mdx`
4. `parseFrontmatter: true` is enabled
5. `generateStaticParams()` exists on the `[slug]` route
6. `src/content/privacy-policy/*.mdx` matches the full expected version set
7. old route-adjacent files such as `privacy-policy-content.mdx` no longer exist
8. old shared selector file `src/components/sections/legal-privacy-policy-version-selector.tsx` no longer exists if the selector has been made route-local
9. footer legal links remain preview-aware

## Important lesson from this task
There are two distinct valid layouts for large legal preview content in corp-web-japan:
- route-adjacent MDX for a single self-contained legal page
- `src/content/privacy-policy/*.mdx` for a versioned archive with many dated documents

Do not force the route-adjacent pattern when the user explicitly asks for a shared content root and dated filenames.

## Done criteria
- All privacy policy versions exist as `src/content/privacy-policy/yyyy-mm-dd.mdx`
- `/t/privacy-policy` renders the latest version
- `/t/privacy-policy/[slug]` renders historical versions
- the English version selector uses the local dated preview routes
- tests cover the new content root and route structure
