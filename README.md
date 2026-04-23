# AI Staff Japan Website

This repository contains the Japan-facing AI Staff website.

README.md is the human-facing guide for understanding the project and getting started.
AI agents should read this file first for context, then follow `AGENTS.md` for working rules.

## Shared principles

These principles apply to both humans and AI agents.

- Keep changes small, focused, and easy to review.
- Prefer structured content in `src/content/` over inline copy when possible.
- Keep docs, implementation, and tests aligned.
- Verify changes with the lightest command that proves correctness.
- If something is ambiguous, choose the smallest change that satisfies the request.

## Project overview

Core directories:

- `src/app/` — routes and API endpoints
- `src/components/` — shared UI, layout, and section components
- `src/content/` — structured copy and CTA source content
- `src/lib/` — shared utilities, integrations, and helper logic
- `src/stores/` — client-side state
- `public/` — static assets
- `tests/` — Node-based verification scripts

Representative files:

- `src/app/page.tsx`
- `src/components/sections/home-page-sections.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`

## Human quick start

1. Read this README for project context.
2. Check `AGENTS.md` if you are an AI agent or if you need repository work rules.
3. Use the structured content under `src/content/` first when updating copy.
4. Run the relevant verification commands before considering a change done.

Useful commands:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:ci
npm run build
```

Recommended verification before committing:

```bash
npm run test:ci
```

Recommended verification before deployment candidates:

```bash
npm run test:ci
npm run build
```

## AI agent setup guide

If you are a Codex, Claude Code, or similar AI agent, use this section to get oriented.

### 1. Install and login

```bash
npm install -g @openai/codex
codex --login
```

### 2. Set up the agent workflow

This repository assumes local skill-based workflows are available.

Recommended commands:

```bash
omx setup --force --verbose --scope user
omx doctor
```

For project-local setup:

```bash
omx setup --force --verbose --scope project
omx doctor
```

### 3. Confirm the expected files and paths

- `AGENTS.md` exists
- `~/.codex` or `./.codex` is configured
- `~/.agents/skills` or `./.agents/skills` is available
- `.omx/` state directories can be used

### 4. Skill paths

- Codex skills: `~/.codex/skills`
- OMX / agent skills: `~/.agents/skills`
- Project-local skills: `./.agents/skills`

### 5. If you need more detail

- Repository work rules live in `AGENTS.md`
- The Korean guide remains available in `README_ko.md`

## Common reference

Both humans and agents should remember:

- `src/content/` is preferred for structured copy changes.
- `npm run test:ci` is the standard verification step before a PR.
- Visual changes should be checked in a real browser.
- Working rules and execution details belong in `AGENTS.md`.

## Environment URLs

- Production URL: [https://querypie.ai](https://querypie.ai)
- Redirect domains: at minimum [https://www.querypie.ai](https://www.querypie.ai) -> [https://querypie.ai](https://querypie.ai)
- Staging URL: [https://stage.querypie.ai](https://stage.querypie.ai)
