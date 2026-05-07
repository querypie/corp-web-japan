---
name: events-posting
description: Thin wrapper for event MDX work in corp-web-japan. Load the shared mdx-publication-operations skill first, then apply the event-specific paths, fields, and checks.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [events, mdx, content, publishing, corp-web-japan]
---

# Events MDX wrapper

Always load `.agents/skills/mdx-publication-operations/SKILL.md` first.
This wrapper only adds the event-specific contract.

## Use this for
- add an event post
- edit an existing `src/content/events/*.mdx` file
- hide an event from the events list/timeline
- create a redirect-backed event shadow record

## Event-specific contract
- Content root: `src/content/events/*.mdx`
- Canonical detail route: `/events/:id/:slug`
- ID-only route: `/events/:id`
- List route: `/events` (launch-gated)
- Asset root: `public/events/<id>/...`
- Records loader: `src/lib/publications/events/records.ts`
- Detail loader: `src/lib/publications/events/get-post.ts`
- Related field: `relatedIds`
- Event-only frontmatter: `eventDate`, `eventLabel`, `hideHeroImageOnDetail`
- Optional shared extras also supported: `author`, `hidden`, `redirectUrl`

## Event-specific expectations
- `eventDate` must be ISO `YYYY-MM-DD` when present.
- Only add `eventDate` when the source/body explicitly provides the event date.
- Hidden + redirect shadow records are already used in this family and are a valid current pattern.

## Verification
```bash
npm run test -- tests/src/lib/publications/event-publication-records.test.mjs
npm run test -- tests/events-mdx-routing-and-preview.test.mjs
npm run test -- tests/events-imported-ja-corpus.test.mjs
```
