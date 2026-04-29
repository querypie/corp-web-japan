---
name: blog-posting
description: Add a new local blog posting to corp-web-japan from the current MDX-backed publication system.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [blog, mdx, content, publishing, corp-web-japan]
---

# Add a blog posting in corp-web-japan

Use this skill when the task is to add a new blog article to the local MDX-backed blog system in this repository.

## What this repository currently does

- Local blog content source lives in `src/content/blog/*.mdx`.
- The blog index reads list items from `src/lib/publications/blog-publication-records.ts` via `listBlogPublicationItems()`.
- Canonical blog detail routes are `/blog/:id/:slug`.
- `/blog/:id` must redirect to the canonical slug route.
- The detail loader is `src/lib/publications/get-publication-post.ts`.
- Author metadata is resolved from `src/content/authors/ja.yaml` via `src/lib/authors/resolve-authors.ts`.
- Hero/list thumbnails normally live at `/assets/image/blog/<id>/thumbnail.png` under `public/assets/image/blog/<id>/thumbnail.png`.

## Required frontmatter

Each new blog file must be an MDX file in `src/content/blog/` with frontmatter shaped like this:

```mdx
---
id: "30"
slug: "example-slug"
title: "記事タイトル"
description: "一覧とメタデータに使う説明文"
date: "2026年4月29日"
heroImageSrc: "/assets/image/blog/30/thumbnail.png"
author: "brant"
relatedIds:
  - "29"
  - "28"
---
```

Notes:
- `id` must be a string and must be unique.
- Use the next available numeric filename and `id`, for example `src/content/blog/30.mdx`.
- `slug` becomes the canonical route suffix.
- `author` is optional in the loader, but use it when a matching author exists in `src/content/authors/ja.yaml`.
- `relatedIds` should list existing local blog IDs as strings.
- `heroImageSrc` should point at the public thumbnail path for that post.

## Recommended workflow

### 1. Inspect the current highest blog id

Check the existing files under `src/content/blog/` and pick the next numeric id.

### 2. Inspect nearby examples

Read at least one or two recent blog MDX files such as:
- `src/content/blog/28.mdx`
- `src/content/blog/29.mdx`

Match the current frontmatter and body style.

### 3. Add the thumbnail asset

Create or copy the thumbnail to:
- `public/assets/image/blog/<id>/thumbnail.png`

Keep the public URL aligned with frontmatter:
- `/assets/image/blog/<id>/thumbnail.png`

### 4. Add the MDX file

Create:
- `src/content/blog/<id>.mdx`

Requirements:
- include the required frontmatter
- write normal MDX body content
- prefer existing publication components/patterns already used in current blog posts
- keep inline links and markup compatible with the current MDX renderer in `src/lib/publications/mdx/renderer.ts`

### 5. Author handling

If the requested author already exists in `src/content/authors/ja.yaml`, use that id in frontmatter.

If the author does not exist:
- add a new entry to `src/content/authors/ja.yaml`
- place the profile image under `public/crew/<filename>`
- use `profileImage: crew/<filename>` in the YAML entry

Do not use the old `crew/authors/...` path pattern for new author YAML values.

### 6. Route/list expectations

No manual list registration should be needed if the file follows the current conventions.

The current system auto-derives:
- blog list items from `src/lib/publications/blog-publication-records.ts`
- detail page content from `src/lib/publications/get-publication-post.ts`

However, always verify that:
- the new file is discoverable by the directory scan
- the new route shape remains `/blog/<id>/<slug>`

## Verification checklist

Run the lightest relevant checks first:

```bash
npm run test -- tests/blog-list-server-source.test.mjs
npm run test -- tests/blog-publication-cache.test.mjs
npm run test -- tests/blog-canonical-slug-routing.test.mjs
npm run test -- tests/blog-mdx-rendering-architecture.test.mjs
```

If author data or profile images changed, also run:

```bash
npm run test -- tests/author-profile-image-paths.test.mjs
```

If the change affects broader metadata or publication rendering, run:

```bash
npm run test:ci
```

For deployment-sensitive or larger publication changes, also run:

```bash
npm run build
```

## Common pitfalls

- Forgetting to use a string `id` in frontmatter
- Reusing an existing numeric id
- Adding a thumbnail file but mismatching the `heroImageSrc` path
- Using an author id that does not exist in `src/content/authors/ja.yaml`
- Introducing old-style manual blog arrays instead of relying on the current directory-scanned loader
- Changing route patterns away from `/blog/:id/:slug`

## Minimal task summary

When asked to add a blog posting:
1. choose the next blog id
2. add `public/assets/image/blog/<id>/thumbnail.png`
3. add `src/content/blog/<id>.mdx`
4. update `src/content/authors/ja.yaml` only if a new author is needed
5. run the targeted blog tests
6. run broader verification only if the scope warrants it
