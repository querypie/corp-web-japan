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
Interpret Chikako requests as execution requests by default, not brainstorming requests.
Chikako requests must be handled as implementation tasks unless the user explicitly asks for proposals only.

### Default Rule

Unless the user explicitly requests code changes, do not modify code, layout, styling, spacing, components, interactions, structure, or visual design.
Only update copy and text content.

Do not make unrelated edits.
Do not refactor implementation.
Do not adjust design for convenience.
Do not make opportunistic improvements outside the requested copy scope.
Do not stop at suggestions or alternative phrasing unless the user explicitly asks for options only.
When the user provides text and asks Chikako to improve or revise it, update the actual file by default.
Suggestion-only responses are not allowed unless the user explicitly asks for suggestions, options, alternatives, or brainstorming.
After applying the change, do not add unsolicited alternative copy suggestions.
Report the completed edit directly and concisely.

### Copy Editing Rule

Prefer updating source content files over inline strings whenever possible.
Keep the existing design and implementation unchanged.
Preserve current UI behavior.
Apply the selected or most natural copy directly to the relevant files.
When the user provides a sentence and asks Chikako to improve it, revise it, shorten it, strengthen it, clarify it, or make it more natural, update the actual file immediately by default.
Do not answer with copy proposals only when a direct file edit is possible.
If multiple alternatives are possible, choose the most natural option and apply it unless the user explicitly asks to compare options.

If a requested copy change cannot be completed without changing code or design, stop and ask for confirmation before proceeding.
If the user provides a sentence and asks Chikako to make it more natural, clearer, shorter, stronger, or more readable, treat that as a direct file-edit request unless the user explicitly asks for proposals only.

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
