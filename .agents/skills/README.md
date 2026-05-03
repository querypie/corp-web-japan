# Repo-local AI agent skills

This repository keeps checked-in agent skills under `.agents/skills/`.

Canonical layout:

- `.agents/skills/<skill-name>/SKILL.md`

Current skills:

- `blog-posting`
  - Path: `.agents/skills/blog-posting/SKILL.md`
  - Purpose: add a new local blog post to the MDX-backed blog system
  - Asset rule: keep the blog thumbnail and every blog-specific referenced file under `public/blog/<id>/...`
- `whitepaper-posting`
  - Path: `.agents/skills/whitepaper-posting/SKILL.md`
  - Purpose: add a new local whitepaper post to the MDX-backed whitepaper system, including optional gating
  - Asset rule: keep the whitepaper thumbnail and every whitepaper-specific referenced file under `public/whitepapers/<id>/...`
- `static-page-route-local-authoring-refactor`
  - Path: `.agents/skills/static-page-route-local-authoring-refactor/SKILL.md`
  - Purpose: refactor a static marketing route so `page.tsx` becomes the primary readable authoring surface and old giant content/wrapper layers are removed safely
  - Scope: route-local authoring refactors for pages such as top page, solution pages, and static preview pages
- `page-migration-preview-route`
  - Path: `.agents/skills/page-migration-preview-route/SKILL.md`
  - Purpose: migrate a `querypie.com/ja` page or another external marketing page into a local preview route under `/t/*`
  - Asset rule: keep preview-page assets under route-aligned `public/<route-family>/...`, not under `public/t/...` and not under generic `public/assets/...`
- `use-case-mdx-migration`
  - Path: `.agents/skills/use-case-mdx-migration/SKILL.md`
  - Purpose: migrate `../corp-web-contents` use-case entries into the local corp-web-japan MDX publication system with `/t/use-cases` preview and `/use-cases/:id/:slug` canonical detail routes
  - Asset rule: keep use-case thumbnails and use-case-specific assets under `public/use-cases/<id>/...`
- `aip-demo-mdx-migration`
  - Path: `.agents/skills/aip-demo-mdx-migration/SKILL.md`
  - Purpose: migrate `../corp-web-contents` AIP demo entries into the local corp-web-japan MDX publication system with `/t/demo/aip` preview and `/demo/aip/:id/:slug` canonical detail routes
  - Asset rule: keep AIP demo thumbnails and demo-specific assets under `public/demo/aip/<id>/...`

Usage notes:

- Load the matching skill before adding or editing publication content.
- Use `blog-posting` for `src/content/blog/*.mdx` work.
- Use `whitepaper-posting` for `src/content/whitepapers/*.mdx` work.
- Use `static-page-route-local-authoring-refactor` for repetitive refactors that move static marketing-page authoring into `src/app/**/page.tsx`.
- Use `page-migration-preview-route` when migrating an upstream or external page into a local `/t/...` preview route first.
- Use `use-case-mdx-migration` when migrating use-case detail content from `../corp-web-contents` into local MDX-backed preview/list/detail routes.
- Use `aip-demo-mdx-migration` when migrating AIP demo detail content from `../corp-web-contents` into local MDX-backed preview/list/detail routes.
- For new publication work, do not put post-specific assets under `public/assets/...`; use the route-aligned per-post asset root instead.
- Keep this index aligned with the actual skill directories.
