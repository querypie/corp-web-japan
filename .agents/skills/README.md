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
- `lost-parity-commit-recovery`
  - Path: `.agents/skills/lost-parity-commit-recovery/SKILL.md`
  - Purpose: recover previously implemented UI/parity fixes that later disappeared from the current branch or merged tree by combining session recall, unreachable-commit forensics, ancestry checks, and latest-structure reapplication
- `mdx-refactoring-formatting`
  - Path: `.agents/skills/mdx-refactoring-formatting/SKILL.md`
  - Purpose: normalize MDX formatting as an independent cross-cutting skill covering 80-column prose wrapping, indentation cleanup, and 2-space raw HTML table indentation
  - Scope: formatting-only MDX refactors for route-adjacent legal/policy content and other existing MDX files

## QueryPie Japan webpage migration skill stack (MECE)

These five skills are the repo-local webpage migration stack for `querypie.com/ja/**` pages.
Use them by phase so responsibilities stay mutually exclusive and collectively exhaustive.

1. Source-of-truth phase
- `querypie-ja-source-triangulation`
  - Path: `.agents/skills/querypie-ja-source-triangulation/SKILL.md`
  - Purpose: determine the correct source of truth and final target shape by reconciling `../corp-web-contents`, `../corp-web-app`, and the live rendered page
  - Use when: you still need to decide what the migrated page should be

2. First implementation phase
- `querypie-ja-preview-route-implementation`
  - Path: `.agents/skills/querypie-ja-preview-route-implementation/SKILL.md`
  - Purpose: implement a new local `/t/**` preview route once the target shape is already settled
  - Use when: the page does not exist locally yet and you are creating the first preview route implementation

3. Existing preview follow-up phase
- `querypie-ja-preview-route-parity`
  - Path: `.agents/skills/querypie-ja-preview-route-parity/SKILL.md`
  - Purpose: bring an already-existing `/t/**` preview route up to live parity
  - Use when: the preview route exists already, but still contains placeholder or simplified structure that needs a parity pass
  - Browser-rendering guide: `docs/querypie-ja-preview-render-parity.md`
  - Includes: page-family-specific heuristics for `/t/services/{aip,acp,fde}`

4. Cross-cutting route authoring support
- `static-page-route-local-authoring`
  - Path: `.agents/skills/static-page-route-local-authoring/SKILL.md`
  - Purpose: keep static marketing routes readable by making `page.tsx` the primary authoring surface and extracted sections UI-only under `src/components/sections/**`
  - Use when: copy/composition ownership needs to remain route-local during any migration phase

5. Cross-cutting visual parity support
- `querypie-preview-root-rem-parity`
  - Path: `.agents/skills/querypie-preview-root-rem-parity/SKILL.md`
  - Purpose: preserve visual parity when the source QueryPie page uses a 15px root and corp-web-japan keeps a 16px root
  - Use when: typography/spacing needs to be reconstructed from token intent rather than copied from computed px values

6. Cross-cutting MDX formatting support
- `mdx-refactoring-formatting`
  - Path: `.agents/skills/mdx-refactoring-formatting/SKILL.md`
  - Purpose: keep adjacent `content.mdx` and other existing MDX files readable with 80-column prose wrapping, indentation cleanup, and 2-space raw HTML table indentation
  - Use when: the route shape is already settled and the remaining work is MDX formatting/refactoring rather than migration or content design

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
- Use the migration skills only when the task is actually a corp-web-contents / querypie.com migration, not ordinary day-2 MDX maintenance.
- For a new `querypie.com/ja/**` page migration, load in this order when needed:
  1. `querypie-ja-source-triangulation`
  2. `querypie-ja-preview-route-implementation`
  3. `static-page-route-local-authoring`
  4. `querypie-preview-root-rem-parity`
- For an existing `/t/**` preview route that needs to be finished, replace step 2 with `querypie-ja-preview-route-parity`.
- If the settled implementation uses adjacent MDX such as `src/app/t/<route>/content.mdx`, also load `mdx-refactoring-formatting` for wrapping and indentation cleanup.
- For new publication work, do not put post-specific assets under `public/assets/...`; use the route-aligned per-post asset root instead.
- Keep this index aligned with the actual skill directories.
