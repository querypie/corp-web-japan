---
name: mdx-publication-operations
description: Use when maintaining public MDX publication content in corp-web-japan across blog, whitepaper, news, event, use-case, and demo families.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [mdx, publication, content, frontmatter, corp-web-japan]
---

# MDX publication operations in corp-web-japan

Use this skill for day-2 MDX content work in this repository:
- add a new MDX file
- edit an existing MDX file
- hide an item from list visibility without breaking the canonical detail route
- create or maintain a redirect-backed shadow record when the current family supports `redirectUrl`
- apply the correct frontmatter for each MDX family

This skill is the generic, repository-wide reference.
Use it before editing any MDX family under `src/content/`.
If a narrower repo-local family wrapper exists, load this skill first and then load that family wrapper.
The family wrapper should only add the target content root, family-only fields, current support limits, and the most relevant checks.

## Current family map

### Publication families with shared `hidden` + `redirectUrl` support

These families use the shared publication loader pattern in `src/lib/publications/**`.
They support:
- `hidden: true`
- `redirectUrl: "..."`
- ID-based detail lookup with canonical slug redirects
- list filtering that keeps hidden records resolvable by detail route

| Family | Content root | Canonical detail route | List route | Asset root | Extra frontmatter |
|---|---|---|---|---|---|
| Blog | `src/content/blog/*.mdx` | `/blog/:id/:slug` | `/blog` | `public/blog/<id>/...` | none beyond shared fields |
| Whitepapers | `src/content/whitepapers/*.mdx` | `/whitepapers/:id/:slug` | `/whitepapers` | `public/whitepapers/<id>/...` | `listDescription`, `gated` |
| News | `src/content/news/*.mdx` | `/news/:id/:slug` | `/news` | `public/news/<id>/...` | `sourceLabel` |
| Events | `src/content/events/*.mdx` | `/events/:id/:slug` | `/events` (launch-gated list) | `public/events/<id>/...` | `eventDate`, `eventLabel`, `hideHeroImageOnDetail` |
| Use cases | `src/content/use-cases/*.mdx` | `/use-cases/:id/:slug` | `/use-cases` | `public/use-cases/<id>/...` | none beyond shared fields |
| AIP demo | `src/content/demo/aip/*.mdx` | `/demo/aip/:id/:slug` | `/demo/aip` | `public/demo/aip/<id>/...` | none beyond shared fields |
| ACP demo | `src/content/demo/acp/*.mdx` | `/demo/acp/:id/:slug` | `/demo/acp` | `public/demo/acp/<id>/...` | none beyond shared fields |

### Resource publication families without shared `hidden` + `redirectUrl` support

These families use `src/lib/resources/**`.
They currently support add/edit, and they support `gated: true` where applicable, but they do not currently use the same `hidden` / `redirectUrl` record contract as the publication families above.

| Family | Content root | Canonical detail route | List route | Asset root | Extra frontmatter |
|---|---|---|---|---|---|
| Introduction deck | `src/content/introduction-deck/*.mdx` | `/introduction-deck/:id/:slug` | `/introduction-deck` | `public/introduction-deck/<id>/...` | `date?`, `author?`, `gated?`, `downloadCta?`, `relatedItems?` |
| Glossary | `src/content/glossary/*.mdx` | `/glossary/:id/:slug` | `/glossary` | `public/glossary/<id>/...` | `date?`, `author?`, `gated?`, `downloadCta?`, `relatedItems?` |
| Manuals | `src/content/manuals/*.mdx` | `/manuals/:id/:slug` | `/manuals` | `public/manuals/<id>/...` | `date?`, `author?`, `gated?`, `downloadCta?`, `relatedItems?` |

### Out of scope

- `src/content/internal/*.mdx`
- scratch/demo/internal reference files such as the whitepaper gating demo

Do not treat internal support content as a normal public posting family unless the user explicitly asks.

## Shared rules for all public MDX families

1. Keep `id` as a string in frontmatter.
2. Keep the file name shaped as `src/content/<family>/<id>-<slug>.mdx`.
3. Treat frontmatter `slug` as the canonical route source of truth.
4. Keep family-specific assets under the route-aligned public root for that family.
5. Do not put new post-specific assets under generic roots such as `public/assets/...`.
6. Prefer editing the existing MDX file directly instead of recreating it.
7. Preserve current route behavior:
   - `/section/:id` redirects to `/section/:id/:slug`
   - mismatched slug redirects to the canonical slug
8. Only use `hidden` / `redirectUrl` on families that actually support those fields in code.
9. Keep all `date` / `eventDate` frontmatter values as ISO `YYYY-MM-DD`; the website loaders convert ISO source dates to Japanese display dates such as `2024年11月22日`.

## Frontmatter contracts

### A. Shared publication-family frontmatter

Applies to blog, news, use-cases, AIP demo, and ACP demo.

```mdx
---
id: "30"
slug: "example-slug"
title: "タイトル"
description: "一覧・メタデータ用の説明"
date: "2026-05-01"
heroImageSrc: "/section/30/thumbnail.png"
author: "querypie"
relatedIds:
  - "29"
  - "28"
hidden: false
redirectUrl: "https://example.com"
---
```

Field notes:
- `id`, `slug`, `title`, `description`, `date`, `heroImageSrc` are required.
- `author` is optional and may be either a single string or a string array in the current loaders.
- `relatedIds` should be an array of string IDs. Use `[]` semantics by omitting or leaving it empty when there are no related items.
- `hidden` is optional. When `true`, the item is removed from the list page but still kept in the record set.
- `redirectUrl` is optional. When set on supported publication families, the list item href resolves to that URL and human detail-page visits redirect there.

### B. Whitepaper frontmatter

Whitepapers use the shared publication contract plus whitepaper-specific fields.

```mdx
---
id: "29"
slug: "example-whitepaper"
title: "ホワイトペーパータイトル"
description: "詳細ページ導入とメタデータ用の説明"
listDescription: "一覧カード向けの短い説明"
date: "2026-05-01"
heroImageSrc: "/whitepapers/29/thumbnail.png"
author: "kenny"
relatedIds:
  - "28"
gated: true
hidden: false
redirectUrl: "https://example.com"
---
```

Field notes:
- `listDescription` is optional but strongly recommended because the list uses `listDescription ?? description`.
- `gated: true` is optional and requires `<GatingCut />` in the body.
- `hidden` and `redirectUrl` are supported on whitepapers.

### C. News frontmatter

News uses the shared publication contract plus `sourceLabel`.

```mdx
---
id: "13"
slug: "terrasky-mitoco-buddy-announcement"
title: "ニュースタイトル"
description: "ニュース説明"
date: "2025-11-07"
heroImageSrc: "/news/13/thumbnail.png"
sourceLabel: "公式発表"
author: "querypie"
relatedIds:
  - "12"
hidden: false
redirectUrl: "https://example.com"
---
```

Field notes:
- `sourceLabel` is optional.
- If omitted, the list defaults to `メディア掲載` when `redirectUrl` exists, otherwise `公式発表`.

### D. Event frontmatter

Events use the shared publication contract plus event-specific fields.

```mdx
---
id: "27"
slug: "air-company-ai-agent-security-webinar"
title: "イベントタイトル"
description: "イベント説明"
date: "2026-04-09"
eventDate: "2026-04-16"
heroImageSrc: "/events/27/thumbnail.png"
eventLabel: "ウェビナー"
hideHeroImageOnDetail: false
author: "querypie"
relatedIds:
  - "26"
hidden: false
redirectUrl: "/events/26/example"
---
```

Field notes:
- `eventDate` is optional but, when present, must be ISO `YYYY-MM-DD`.
- Only add `eventDate` when the body/source explicitly provides a concrete event date.
- `eventLabel` is optional and changes the list badge.
- `hideHeroImageOnDetail` is optional boolean.
- `hidden` and `redirectUrl` are supported on events.

### E. Resource-family frontmatter

Applies to introduction deck, glossary, and manuals.

```mdx
---
id: "1"
slug: "querypie-ai-glossary"
title: "タイトル"
description: "説明"
heroImageSrc: "/glossary/1/thumbnail.png"
date: "2026-05-01"
author: "querypie"
gated: true
downloadCta:
  href: "/glossary/1/download.pdf"
  label: "資料を開く"
  external: true
relatedItems:
  - href: "/manuals/1/example"
    imageSrc: "/manuals/1/thumbnail.png"
    title: "関連資料"
    date: "2026-04-01"
---
```

Field notes:
- `date` is optional.
- `author` is optional and uses the same registered author display path as the publication families.
- `gated` is optional and uses the same `<GatingCut />` marker contract in the current resource post loader.
- `downloadCta` is optional. When present, it is parsed from frontmatter and rendered through the shared publication CTA flow instead of requiring an inline MDX `ButtonLink` for the actual downloadable file action.
- In gated resource families, keep the explanatory copy inside the post body after `<GatingCut />`, but prefer the actual file-opening action in frontmatter `downloadCta`.
- Important current rendering nuance in this repo: whitepapers intentionally keep their `downloadCta` visible before the form wall, but resource families such as introduction-deck should keep the actual file-opening CTA inside the unlocked gated-content flow, after the gated body copy, not above the form wall.
- `relatedItems` is optional and is an array of explicit link objects, not `relatedIds`.
- Do not assume `hidden` or `redirectUrl` support for these families unless code is updated first.

## Operational workflows

### 1. Add a new MDX file

1. Identify the family and confirm its content root, route, and asset root from the family map above.
2. Inspect nearby examples in the same directory.
3. Pick the intended numeric `id`.
4. Add or copy the thumbnail to the route-aligned asset root:
   - `public/<family-root>/<id>/thumbnail.png`
5. Add any extra figures or attachments under the same family-specific asset root.
6. Create `src/content/<family>/<id>-<slug>.mdx`.
7. Fill the exact frontmatter required by that family.
8. Write the body using existing MDX patterns already used by that family.
9. Run the lightest family-relevant verification.

### 2. Edit an existing MDX file

1. Edit the existing `.mdx` file in place.
2. Preserve the same `id` unless the user explicitly asks for a migration that changes canonical identity.
3. If you change `slug`, verify the canonical route expectation still makes sense.
4. If you change asset paths, move the files so the route-aligned public structure stays consistent.
5. If you add new frontmatter, confirm the target family loader actually supports it.
6. Re-run family-relevant tests.

### 3. Hide an item from list visibility without breaking detail routes

Only for publication families with code support.

Use:
```yaml
hidden: true
```

What happens in the current implementation:
- the record stays in the full `records` set
- the record stays resolvable by `id`
- the record still participates in `listParams()` and detail-route lookup
- the list page filters it out

Use this when:
- the detail route should keep working
- the item should disappear from the list page
- no external redirect is needed

Do not use this pattern for manuals / introduction-deck / glossary unless code support is added first.

### 4. Create a redirect-backed shadow record

Only for publication families with code support.

Use both:
```yaml
hidden: true
redirectUrl: "/target-or-external-url"
```

Recommended use cases:
- old locale-specific or duplicate content IDs that should no longer appear in the list
- a preserved canonical path that should forward humans to a replacement page
- a legacy record that should remain discoverable to bots via sitemap while redirecting human visitors

Current behavior to remember:
- list pages filter out hidden records
- detail pages check `redirectUrl`
- human visitors are redirected
- search-bot user agents are not force-redirected by the detail page helper
- sitemap includes hidden records when `redirectUrl` is present

This means `hidden + redirectUrl` is the correct shadow-record pattern for supported publication families in the current codebase.

### 5. Use gating

For whitepapers and resource families that support it:
- set `gated: true`
- add `<GatingCut />` where preview content should stop
- keep meaningful preview content before the cut

Example:

```mdx
## Intro

This part is visible.

<GatingCut />

## Gated section

This part is shown after unlock.
```

Do not set `gated: true` without `<GatingCut />`.

## Family-specific writing tips

### Blog
- Keep blog assets under `public/blog/<id>/...`.
- Use author IDs from `src/content/authors/ja.yaml` when available.
- Blog list cards resolve to the local canonical detail route.

### Whitepapers
- Prefer adding `listDescription` explicitly.
- Use gating only when the user truly wants partial unlock behavior.
- Whitepaper detail pages exist locally even though some list-card behavior has legacy/upstream history.

### News
- Choose `sourceLabel` intentionally when the entry represents media coverage.
- Use `redirectUrl` when the item should preserve a local canonical surface but open an upstream/media destination for humans.

### Events
- Keep `eventDate` evidence-based.
- Hidden + redirect shadow records are already used in this family and are a good reference pattern.
- The public list page is launch-gated, so avoid undocumented assumptions based only on `/events` visibility.

### Use cases / AIP demo / ACP demo
- Treat them as publication families with the shared `hidden` / `redirectUrl` contract.
- Keep assets strictly route-aligned:
  - `public/use-cases/<id>/...`
  - `public/demo/aip/<id>/...`
  - `public/demo/acp/<id>/...`

### Introduction deck / Glossary / Manuals
- Support add/edit today.
- Support `author`, `gated`, `downloadCta`, and `relatedItems`.
- For real downloadable files in these families, prefer frontmatter `downloadCta` over inline MDX `ButtonLink` markup so the shared publication renderer controls when the CTA appears.
- In gated resource posts, the actual `downloadCta` should appear after unlock, not before the form.
- Do not document hide/remove/shadow-record workflows for these families as if they already exist.

## Common pitfalls

- Using numeric `id` values without quoting them as strings
- Treating filename slug as more authoritative than frontmatter `slug`
- Adding post-specific assets under `public/assets/...`
- Using `relatedIds` on resource families that actually expect `relatedItems`
- Using `hidden` / `redirectUrl` on resource families without loader support
- Setting `gated: true` without `<GatingCut />`
- Adding `eventDate` without explicit source evidence
- Deleting a record when the real requirement was “hide from list but preserve the route”
- Filtering hidden records out of the entire record set in code changes; hide should affect list visibility, not detail resolution

## Verification checklist

Pick the lightest checks that prove the specific change.

### Blog
```bash
npm run test -- tests/blog-list-server-source.test.mjs
npm run test -- tests/blog-publication-cache.test.mjs
npm run test -- tests/blog-canonical-slug-routing.test.mjs
npm run test -- tests/blog-mdx-rendering-architecture.test.mjs
```

### Whitepapers
```bash
npm run test -- tests/whitepaper-canonical-slug-routing.test.mjs
npm run test -- tests/whitepaper-gating-source.test.mjs
npm run test -- tests/whitepaper-route-aligned-assets.test.mjs
```

### Broader or mixed publication work
```bash
npm run test:ci
npm run build
```

When author records change, also run:
```bash
npm run test -- tests/author-profile-image-paths.test.mjs
```

## Minimal execution summary

When asked to do MDX content work in this repo:
1. identify the family
2. confirm whether it is a publication family or a resource family
3. apply the exact frontmatter contract for that family
4. keep assets in the route-aligned public root
5. use `hidden` / `redirectUrl` only on the families that support them
6. use `gated: true` only with `<GatingCut />`
7. run the lightest relevant tests
8. update `.agents/skills/README.md` if a new repo-local skill is added or removed
