# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` contains routes and API endpoints.
- `src/components/` contains reusable layout, section, and UI components.
- `src/content/` should be preferred for structured copy changes instead of inline strings.
- `src/lib/` contains shared logic and helpers.
- `tests/` contains verification scripts and tests.

## Build, Test, and Development Commands
- `npm run dev` — start the local Next.js development server.
- `npm run build` — create the production build.
- `npm run start` — serve the built app locally.
- `npm run lint` — run ESLint.
- `npx tsc --noEmit` — run strict TypeScript checks.

Run `npm run lint && npx tsc --noEmit` before opening a PR when applicable.

## Coding Style & Naming Conventions
- Use TypeScript, React, and Tailwind conventions already present in the repo.
- Follow the surrounding file style and existing component patterns.
- Use `PascalCase` for React components, `camelCase` for helpers/constants, and kebab-case for route folders.
- Keep pages thin: route files should compose content and shared sections, while reusable logic stays in `src/lib/` or `src/components/`.

## Chikako Mode

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
