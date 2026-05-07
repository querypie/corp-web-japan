# Repo-local AI agent skills

This repository keeps checked-in agent skills under `.agents/skills/`.

Canonical layout:

- `.agents/skills/<skill-name>/SKILL.md`

Current skills:

- `mdx-publication-operations`
  - Path: `.agents/skills/mdx-publication-operations/SKILL.md`
  - Purpose: the shared reference for all public MDX publication families in this repo
  - Scope: common frontmatter rules, add/edit workflows, gating, list hiding, redirect shadow records, and current family support limits
- `blog-posting`
  - Path: `.agents/skills/blog-posting/SKILL.md`
  - Purpose: thin wrapper for blog-specific paths, fields, and checks
- `whitepaper-posting`
  - Path: `.agents/skills/whitepaper-posting/SKILL.md`
  - Purpose: thin wrapper for whitepaper-specific paths, fields, gating, and checks
- `news-posting`
  - Path: `.agents/skills/news-posting/SKILL.md`
  - Purpose: thin wrapper for news-specific paths, fields, and checks
- `events-posting`
  - Path: `.agents/skills/events-posting/SKILL.md`
  - Purpose: thin wrapper for event-specific paths, fields, and checks
- `use-case-posting`
  - Path: `.agents/skills/use-case-posting/SKILL.md`
  - Purpose: thin wrapper for use-case-specific paths, fields, and checks
- `aip-demo-posting`
  - Path: `.agents/skills/aip-demo-posting/SKILL.md`
  - Purpose: thin wrapper for AIP demo-specific paths, fields, and checks
- `acp-demo-posting`
  - Path: `.agents/skills/acp-demo-posting/SKILL.md`
  - Purpose: thin wrapper for ACP demo-specific paths, fields, and checks
- `introduction-deck-posting`
  - Path: `.agents/skills/introduction-deck-posting/SKILL.md`
  - Purpose: thin wrapper for introduction-deck-specific paths, fields, and current limits
- `glossary-posting`
  - Path: `.agents/skills/glossary-posting/SKILL.md`
  - Purpose: thin wrapper for glossary-specific paths, fields, and current limits
- `manuals-posting`
  - Path: `.agents/skills/manuals-posting/SKILL.md`
  - Purpose: thin wrapper for manuals-specific paths, fields, and current limits
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

- For any public MDX content maintenance task, load `mdx-publication-operations` first.
- Then load the narrowest family wrapper that matches the target content root.
- Use `blog-posting` for `src/content/blog/*.mdx`.
- Use `whitepaper-posting` for `src/content/whitepapers/*.mdx`.
- Use `news-posting` for `src/content/news/*.mdx`.
- Use `events-posting` for `src/content/events/*.mdx`.
- Use `use-case-posting` for `src/content/use-cases/*.mdx`.
- Use `aip-demo-posting` for `src/content/demo/aip/*.mdx`.
- Use `acp-demo-posting` for `src/content/demo/acp/*.mdx`.
- Use `introduction-deck-posting` for `src/content/introduction-deck/*.mdx`.
- Use `glossary-posting` for `src/content/glossary/*.mdx`.
- Use `manuals-posting` for `src/content/manuals/*.mdx`.
- Use the migration skills only when the task is actually a corp-web-contents migration, not ordinary day-2 MDX maintenance.
- For new publication work, do not put post-specific assets under `public/assets/...`; use the route-aligned per-post asset root instead.
- Keep this index aligned with the actual skill directories.
