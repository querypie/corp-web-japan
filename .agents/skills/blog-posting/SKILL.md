---
name: blog-posting
description: Thin wrapper for blog MDX work in corp-web-japan. Load the shared mdx-publication-operations skill first, then apply the blog-specific paths, fields, and checks.
version: 2.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [blog, mdx, content, publishing, corp-web-japan]
---

# Blog MDX wrapper

Always load `.agents/skills/mdx-publication-operations/SKILL.md` first.
This wrapper only adds the blog-specific contract.

## Use this for
- add a new blog post
- edit an existing `src/content/blog/*.mdx` file
- hide a blog post from `/blog`
- create a redirect-backed blog shadow record

## Blog-specific contract
- Content root: `src/content/blog/*.mdx`
- Canonical detail route: `/blog/:id/:slug`
- ID-only route: `/blog/:id`
- List route: `/blog`
- Asset root: `public/blog/<id>/...`
- Records loader: `src/lib/publications/blog/records.ts`
- Detail loader: `src/lib/publications/blog/get-post.ts`
- Related field: `relatedIds`
- Optional supported frontmatter beyond the shared base: `author`, `hidden`, `redirectUrl`

## Blog-specific expectations
- Use `src/content/authors/ja.yaml` for author ids when applicable.
- Keep all blog-specific assets under `public/blog/<id>/...`.
- Do not put new blog assets under `public/assets/...`.
- Blog list cards resolve to local canonical detail routes.

## Minimum workflow
1. Follow the shared MDX publication skill.
2. Inspect nearby blog examples in `src/content/blog/`.
3. Edit or add `src/content/blog/<id>-<slug>.mdx`.
4. Keep `heroImageSrc` route-aligned, e.g. `/blog/<id>/thumbnail.png`.
5. If needed, use:
   - `hidden: true` to remove from `/blog` while keeping detail resolution
   - `hidden: true` + `redirectUrl` for a redirect shadow record
6. Run the blog checks.

## Verification
```bash
npm run test -- tests/blog-list-server-source.test.mjs
npm run test -- tests/blog-publication-cache.test.mjs
npm run test -- tests/blog-canonical-slug-routing.test.mjs
npm run test -- tests/blog-mdx-rendering-architecture.test.mjs
```

If author data changed:
```bash
npm run test -- tests/author-profile-image-paths.test.mjs
```
