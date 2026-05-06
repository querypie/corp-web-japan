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
- `preview-root-rem-parity`
  - Path: `.agents/skills/preview-root-rem-parity/SKILL.md`
  - Purpose: preserve visual parity when importing `querypie.com/ja/**` or `querypie.com/en/**` pages into corp-web-japan even though the source site can use a 15px html root while corp-web-japan keeps a 16px root
  - Typography rule: do not blindly copy computed px values from the source page; recover the rem/token intent first, then rebuild for the 16px-root preview environment
- `use-case-mdx-migration`
  - Path: `.agents/skills/use-case-mdx-migration/SKILL.md`
  - Purpose: migrate `../corp-web-contents` use-case entries into the local corp-web-japan MDX publication system with `/t/use-cases` preview and `/use-cases/:id/:slug` canonical detail routes
  - Asset rule: keep use-case thumbnails and use-case-specific assets under `public/use-cases/<id>/...`
- `aip-demo-mdx-migration`
  - Path: `.agents/skills/aip-demo-mdx-migration/SKILL.md`
  - Purpose: migrate `../corp-web-contents` AIP demo entries into the local corp-web-japan MDX publication system with `/t/demo/aip` preview and `/demo/aip/:id/:slug` canonical detail routes
  - Asset rule: keep AIP demo thumbnails and demo-specific assets under `public/demo/aip/<id>/...`
- `acp-demo-mdx-migration`
  - Path: `.agents/skills/acp-demo-mdx-migration/SKILL.md`
  - Purpose: migrate `../corp-web-contents` ACP demo entries into the local corp-web-japan MDX publication system with `/t/demo/acp` preview and `/demo/acp/:id/:slug` canonical detail routes
  - Asset rule: keep ACP demo thumbnails and demo-specific assets under `public/demo/acp/<id>/...`
- `resource-list-sidebar-pattern`
  - Path: `.agents/skills/resource-list-sidebar-pattern/SKILL.md`
  - Purpose: maintain corp-web-japan resource-list pages while keeping hero/CTA authoring route-local, centralizing only repeated sidebar markup, handling preview/public sidebar link differences, and preserving sticky behavior

Usage notes:

- Load the matching skill before adding or editing publication content.
- Use `blog-posting` for `src/content/blog/*.mdx` work.
- Use `whitepaper-posting` for `src/content/whitepapers/*.mdx` work.
- Use `static-page-route-local-authoring-refactor` for repetitive refactors that move static marketing-page authoring into `src/app/**/page.tsx`.
- Use `page-migration-preview-route` when migrating an upstream or external page into a local `/t/...` preview route first.
- Use `preview-root-rem-parity` whenever the source page lives under `querypie.com/ja/**` or `querypie.com/en/**` and the imported UI design needs typography/spacing parity under corp-web-japan's 16px root environment.
- Use `use-case-mdx-migration` when migrating use-case detail content from `../corp-web-contents` into local MDX-backed preview/list/detail routes.
- Use `aip-demo-mdx-migration` when migrating AIP demo detail content from `../corp-web-contents` into local MDX-backed preview/list/detail routes.
- Use `acp-demo-mdx-migration` when migrating ACP demo detail content from `../corp-web-contents` into local MDX-backed preview/list/detail routes.
- Use `resource-list-sidebar-pattern` when refactoring resource-list pages, sidebar composition, sticky behavior, or preview-vs-public sidebar link sets.
- For new publication work, do not put post-specific assets under `public/assets/...`; use the route-aligned per-post asset root instead.
- Keep this index aligned with the actual skill directories.
