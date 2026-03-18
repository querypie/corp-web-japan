# AI Staff Japan Website Guide

## 1. Project Overview

This repository contains the Japan-facing **AI Staff** website.
The current stack is:

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- npm

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

---

## 2. Codex CLI Setup

This project is designed to work well with **Codex CLI + oh-my-codex (OMX)**.

### 2.1 Install Codex CLI

Based on the official OpenAI setup flow:

```bash
npm install -g @openai/codex
codex --login
```

References:

- Codex CLI getting started: https://help.openai.com/en/articles/11096431-openai-codex-ci-getting-started
- Sign in with ChatGPT: https://help.openai.com/en/articles/11381614

Upgrade:

```bash
codex --upgrade
```

---

## 3. oh-my-codex / OMX Setup

This repository assumes OMX workflows and skill-based execution are available.

Recommended commands:

```bash
omx setup --force --verbose --scope user
omx doctor
```

If you want project-local setup instead:

```bash
omx setup --force --verbose --scope project
omx doctor
```

After setup, confirm:

- `AGENTS.md` exists
- `~/.codex` or `./.codex` is configured
- `~/.agents/skills` or `./.agents/skills` is available
- `.omx/` state directories can be used

---

## 4. Skill Setup / Management

### 4.1 Basic Paths

- Codex skills: `~/.codex/skills`
- OMX / agent skills: `~/.agents/skills`
- Project-local skills: `./.agents/skills`

### 4.2 OpenAI Skill Installation

List installable skills:

```bash
python ~/.codex/skills/.system/skill-installer/scripts/list-skills.py
```

Example install:

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo openai/skills \
  --path skills/.curated/<skill-name>
```

After installation, restarting Codex is recommended.

### 4.3 OMX Skill Management

Use the skill workflow for local skill management.

Examples:

- `/skill list`
- `/skill add <name>`
- `/skill edit <name>`
- `/skill remove <name>`

---

## 5. Repository Setup and Run

### 5.1 Install Dependencies

```bash
npm install
```

### 5.2 Environment Variables

Start from:

```bash
cp .env.local.example .env.local
```

The repository currently includes:

- `.env.local.example`
- `.env.local`

Keep secrets in local env files only.
Do not commit real credentials.

### 5.3 Development Server

```bash
npm run dev
```

Default local URL:

- `http://localhost:3000`

---

## 6. Main Development Commands

```bash
npm run dev          # local development server
npm run build        # production build
npm run start        # serve production build locally
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript check
node --test tests/*.test.mjs
```

Recommended verification before committing:

```bash
npm run lint
npx tsc --noEmit
node --test tests/*.test.mjs
```

Recommended verification before deployment:

```bash
npm run build
```

---

## 7. Development Rules

### 7.1 Copy Changes

Prefer editing `src/content/` instead of hardcoding strings directly inside components whenever possible.

### 7.2 UI Changes

- shared UI: `src/components/ui/`
- layout: `src/components/layout/`
- composed landing sections: `src/components/sections/`
- route entry points: `src/app/**`

### 7.3 Validation

- run lint and typecheck after changes
- run tests when changing structure or logic
- check the real browser when changing layout, spacing, or visual hierarchy

---

## 8. Chikako Mode

If the user says `"Chikako"`, enter Chikako mode immediately.

### Purpose

Chikako mode is for copywriting and content updates.
By default, treat Chikako requests as copy-editing tasks.

### Default Rule

Unless the user explicitly requests code changes, do not modify code, layout, styling, spacing, components, interactions, structure, or visual design.
Only update copy and text content.

Do not make unrelated edits.
Do not refactor implementation.
Do not adjust design for convenience.
Do not make opportunistic improvements outside the requested copy scope.

### Copy Editing Rule

Prefer updating source content files over inline strings whenever possible.
Keep the existing design and implementation unchanged.
Preserve current UI behavior.

If a requested copy change cannot be completed without changing code or design, stop and ask for confirmation before proceeding.

### Pull Request Rule

If the user says they want Chikako to open a PR, perform the full Git workflow automatically in this repository:

1. create a new branch
2. make the requested copy changes
3. run the relevant checks
4. create a commit
5. push the branch
6. open a pull request

Do not ask for step-by-step confirmation unless credentials, permissions, or repository access are missing.

### Safety Rule

Do not change design unless the user explicitly asks for a design change.
Do not change code unless the user explicitly asks for a code change.
When a request is ambiguous, choose the smallest copy-only change.

---

## 9. Recommended Workflow

1. read `AGENTS.md` first
2. identify whether the task is copy, layout, or implementation
3. update `src/content/` first when the task is text-oriented
4. update `src/components/` or `src/app/` only when implementation changes are required
5. run:

```bash
npm run lint
npx tsc --noEmit
node --test tests/*.test.mjs
```

6. verify visually in the browser when UI changed
7. run `npm run build` before deployment candidates

---

## 10. Notes

- Repository-specific execution rules live in [AGENTS.md](./AGENTS.md)
- The current Korean guide remains available in [README_ko.md](./README_ko.md)
