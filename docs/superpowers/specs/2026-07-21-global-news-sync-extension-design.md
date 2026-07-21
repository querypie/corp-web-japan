# Global News to Japan Sync Extension Design

## Status

Approved direction: extend the existing one-way Global-to-Japan publication sync from Global Documentation to the separate Global `/en/news` collection. This document defines the implementation shape. The accepted production contract remains `openspec/specs/contract-global-documentation-sync/spec.md` and must be updated when this extension ships.

## Objective

Add `https://www.querypie.com/en/news` as a production source surface and generate validated Japan `/news/:id/:slug` Draft PRs without changing the existing safety boundary:

- at most one candidate and one Draft PR per run
- no automatic content merge or deployment
- `sourceId`-based baseline, ignore, PR, and branch deduplication
- fresh no-tools Pi processes
- full contract, CI, build, and browser validation
- fail closed before remote mutation

This remains one-way. Japan publications never create or update Global content.

## Alternatives considered

### A. Add News conditionals to each existing module

Small initial diff, but it preserves the current duplicated category maps in discovery, preparation, baseline generation, routing, and prompts. Future agents can update one switch and miss another. Rejected.

### B. Add a source-family map as the shared contract

One explicit descriptor map covers Documentation categories and the separate News section while preserving the existing pipeline. This is the recommended design because it removes the current source of mapping drift without introducing a generic crawler.

### C. Build a generic managed-content crawler

Could support Demo and future sections automatically, but it expands scope, weakens family-specific validation, and adds speculative abstraction. Rejected under YAGNI.

## Source support map

The implementation must expose one source-family map as the single source of truth. Discovery, source loading, canonical URL generation, target allocation, baseline generation, prompts, validation, and documentation must consume this map rather than maintaining separate category switches.

| Source section | Source category | Global repository root | Production list | Content canonical pattern | Japan family | Japan route |
| --- | --- | --- | --- | --- | --- | --- |
| Documentation | `blogs` | `src/content/documentation/blogs` | `/en/documentation` | `/en/blog/:slug` | `blog` | `/blog/:id/:slug` |
| Documentation | `white-papers` | `src/content/documentation/white-papers` | `/en/documentation` | `/en/white-paper/:slug` | `whitepapers` | `/whitepapers/:id/:slug` |
| Documentation | `voc` | `src/content/documentation/voc` | `/en/documentation` | `/en/customer-story/:slug` | `use-cases` | `/use-cases/:id/:slug` |
| Documentation | `manuals` | `src/content/documentation/manuals` | `/en/documentation` | `/en/manual/:slug` | `manuals` | `/manuals/:id/:slug` |
| Documentation | `events` | `src/content/documentation/events` | `/en/documentation` | `/en/events/:slug` | `events` | `/events/:id/:slug` |
| Documentation | `glossary` | `src/content/documentation/glossary` | `/en/documentation` | `/en/glossary/:slug` | `glossary` | `/glossary/:id/:slug` |
| Documentation | `introduction` | `src/content/documentation/introduction` | `/en/documentation` | `/en/introduction/:slug` | `introduction-deck` | `/introduction-deck/:id/:slug` |
| News | `news` | `src/content/news` | `/en/news` | `/en/news/:slug` | `news` | `/news/:id/:slug` |

Recommended module: `scripts/global-documentation-sync/source-family-map.mjs`.

Each descriptor owns:

- source section and category
- source root layout
- production list URL
- content canonical path segment
- target family and target route root
- target frontmatter policy

No agent prompt should infer this mapping.

## Global News source contract

Global News is a separate managed-content section, not a Documentation category:

```text
src/content/news/<sourceId>/meta.json
src/content/news/<sourceId>/ja.html
src/content/news/<sourceId>/en.html
public/news/**
```

Current corpus evidence:

- 27 published records
- 4 `content` records with locale bodies
- 23 `outlink` records with title, summary, image, and external destination
- 18 records have non-empty Japanese title metadata
- six exact or uniquely resolved Global-to-Japan matches were identified before implementation; baseline generation must recompute and validate the final set

`storageId` remains the primary identity. `section` must equal `news`, `categorySlug` must equal `news`, and `status` must equal `published`.

## Production eligibility

`discoverLive()` must fetch these three surfaces once per run:

- `/sitemap.xml`
- `/en/documentation`
- `/en/news`

Evidence is selected through the source-family descriptor.

### News content record

A `content` News record is eligible only when:

- its exact normalized `/en/news/:slug` URL is present in `/en/news`
- the same exact canonical URL is present in the sitemap
- a non-empty Japanese body exists, otherwise a non-empty English body exists
- its slug is safe for the Japan canonical route

### News external-destination record

A Global `outlink` is a News list item whose user-facing destination is an external HTTPS URL. It is still part of `/en/news`; users do not choose a separate automation scope for it.

It is eligible only when:

- its exact normalized external URL is present in `/en/news`
- the URL uses HTTPS
- localized title and summary data can be selected from Japanese, otherwise English
- its source slug is safe for the Japan canonical route

It intentionally has no sitemap detail URL requirement.

Invalid records must produce a deterministic blocked source-contract outcome or require an explicit owner ignore decision; they must not fail later inside generation after being selected.

## Candidate and evidence model

Replace the Documentation-specific production evidence name with section-neutral fields:

```json
{
  "canonicalUrl": "https://www.querypie.com/en/news/example",
  "listed": true,
  "listUrl": "https://www.querypie.com/en/news",
  "sitemap": true
}
```

Candidates add `sourceSection`, while retaining `sourceCategory` for baseline and target mapping. Existing report artifacts are runtime evidence and do not require migration.

## Japan News output contract

Generated files:

```text
src/content/news/<targetId>-<slug>.mdx
public/news/<targetId>/thumbnail.png
public/news/<targetId>/<source-assets>
```

Required News frontmatter:

```yaml
id: "<targetId>"
slug: "<source slug>"
title: "<Japanese title>"
description: "<Japanese description>"
date: "YYYY-MM-DD"
heroImageSrc: "/news/<targetId>/thumbnail.png"
sourceLabel: "公式発表 | メディア掲載"
relatedIds: []
```

Policy:

- `author` is forbidden for News.
- `content` records use `sourceLabel: "公式発表"`.
- `outlink` records use `sourceLabel: "メディア掲載"` and `redirectUrl` equal to the exact Global external URL.
- `relatedIds` must resolve to Japan News numeric IDs. Unresolved cross-family or missing relations must block or be explicitly transformed with evidence; Pi must not invent IDs.
- route-aligned PNG hero/Open Graph assets remain mandatory.

For an outlink, browser QA must validate the local shadow record with a bot user agent so the route does not leave the local preview. Deterministic validation must separately prove that `redirectUrl` exactly matches source evidence. External destination availability must not become a flaky browser gate.

## Baseline and deduplication

`generate-baseline.mjs` must enumerate all source-family descriptors, including flat News storage. Matching order remains deterministic:

1. exact source slug
2. exact normalized external destination for outlinks
3. exact Japanese title when unique
4. otherwise report ambiguity or leave unmatched

Before enabling News discovery on the production host:

- regenerate the complete baseline
- review all News matches and ambiguities
- commit the source-ID-sorted result
- verify every mapped Japan target exists
- run discovery and inspect the first unmatched News candidate

Known pre-implementation evidence is six unique matches and no ambiguity using slug/title heuristics. This is evidence only, not a hard-coded baseline.

Existing baseline, ignore, PR marker, branch, and embedded `sourceId` suppression rules apply unchanged to News.

## Generation and review

The existing `news-posting` skill becomes the narrow family wrapper. Writer instructions must explicitly carry these deterministic candidate fields:

- resolved target family: `news`
- resolved `sourceLabel`
- resolved `redirectUrl` or null
- forbidden author policy
- resolved related IDs

Review ownership:

- fidelity: title, description, body, claims, links, external destination
- Japanese editorial: reader-facing Japanese only
- contract: News fields, no author, target route, route-aligned assets, source label, redirect URL, related IDs

The correction loop and five-attempt fail-closed limit remain unchanged.

## Validation and browser QA

Add focused regression coverage for:

- single source-family map and every existing category mapping
- flat News source enumeration
- `/en/news` exact-list evidence
- content News sitemap requirement
- outlink News no-sitemap exception
- unsafe or incomplete News source blocking
- baseline generation across Documentation and News
- News candidate allocation and frontmatter
- author rejection
- deterministic `sourceLabel` and `redirectUrl`
- related-ID handling
- News route generation
- local browser QA for content and redirect-backed News
- unchanged Documentation discovery behavior

Run the complete Global sync test suite, `npm run test:ci`, `next build`, and desktop/mobile browser QA for the first production News candidate.

## Runtime and rollout

The service, lock, one-hour timeout, Slack notifications, report retention, and 10:00 KST timer remain unchanged.

Rollout sequence:

1. Merge source-family SSOT and News tests with production News discovery disabled.
2. Regenerate and review baseline including News.
3. Run a production-discovery dry run and inspect the selected News candidate.
4. Run a full no-mutation News dry run through Pi, full CI, build, and browser QA.
5. Enable News discovery.
6. Run one manual production execution and verify one Draft PR plus Slack notification.
7. Leave the daily timer enabled only after successful evidence.

## Documentation

When implementation ships, update:

- `scripts/global-documentation-sync/README.md` with the complete support matrix above
- `ops/global-documentation-sync/README.md` with `/en/news` production evidence and rollout checks
- `openspec/specs/contract-global-documentation-sync/spec.md` with accepted News behavior
- `.agents/skills/global-documentation-sync/**` where source assumptions are documented

The support matrix must identify `section`, source root, production list, category, target family, and route. Do not reduce it to a category-name list that makes News appear to be a Documentation subcategory.

## Non-goals

- reverse sync from Japan to Global
- automatic updates to already baselined source IDs
- more than one candidate per run
- automatic content PR merge or deployment
- Demo section expansion
- generic crawling outside managed Global content
