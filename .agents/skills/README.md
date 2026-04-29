# Repo-local AI agent skills

This repository keeps checked-in agent skills under `.agents/skills/`.

Canonical layout:

- `.agents/skills/<skill-name>/SKILL.md`

Current skills:

- `blog-posting`
  - Path: `.agents/skills/blog-posting/SKILL.md`
  - Purpose: add a new local blog post to the MDX-backed blog system
- `whitepaper-posting`
  - Path: `.agents/skills/whitepaper-posting/SKILL.md`
  - Purpose: add a new local whitepaper post to the MDX-backed whitepaper system, including optional gating

Usage notes:

- Load the matching skill before adding or editing publication content.
- Use `blog-posting` for `src/content/blog/*.mdx` work.
- Use `whitepaper-posting` for `src/content/whitepapers/*.mdx` work.
- Keep this index aligned with the actual skill directories.
