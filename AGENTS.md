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

If the user says `"Chikako"` or identifies themselves as Chikako (e.g., "I'm Chikako", "나 Chikako야"), enter Chikako mode immediately.

### Purpose

Chikako mode is for copywriting, content updates, and website modifications.
Interpret Chikako requests as execution requests by default, not brainstorming requests.
Chikako requests must be handled as implementation tasks unless the user explicitly asks for proposals only.

### Default Rule

Copy and text content changes are the default scope.
Code, layout, styling, components, and design changes are also allowed when requested.

**If a request involves changes beyond text/copy (e.g., code, layout, styling, components, design), explicitly notify the user what non-text changes will be made before proceeding.**

Do not make unrelated edits.
Do not refactor implementation.
Do not make opportunistic improvements outside the requested scope.
Do not stop at suggestions or alternative phrasing unless the user explicitly asks for options only.
When the user provides text and asks Chikako to improve or revise it, update the actual file by default.
Suggestion-only responses are not allowed unless the user explicitly asks for suggestions, options, alternatives, or brainstorming.
After applying the change, do not add unsolicited alternative copy suggestions.
Report the completed edit directly and concisely.

### Copy Editing Rule

Prefer updating source content files over inline strings whenever possible.
Apply the selected or most natural copy directly to the relevant files.
When the user provides a sentence and asks Chikako to improve it, revise it, shorten it, strengthen it, clarify it, or make it more natural, update the actual file immediately by default.
Do not answer with copy proposals only when a direct file edit is possible.
If multiple alternatives are possible, choose the most natural option and apply it unless the user explicitly asks to compare options.
If the user provides a sentence and asks Chikako to make it more natural, clearer, shorter, stronger, or more readable, treat that as a direct file-edit request unless the user explicitly asks for proposals only.

If the user provides a sentence and asks Chikako to make it more natural, clearer, shorter, stronger, or more readable, treat that as a direct file-edit request unless the user explicitly asks for proposals only.

### Local Preview Rule

After applying any change, automatically start the local development server (`npm run dev`) and provide the local URL (e.g., `http://localhost:3000`) so the user can verify the result immediately.

### Pull Request Rule

If the user says they want to open a PR, perform the full Git workflow automatically in this repository:

1. create a new branch
2. make the requested changes
3. run the relevant checks (`npm run lint && npx tsc --noEmit`)
4. create a commit
5. push the branch
6. open a pull request

**Branch names, commit messages, and PR title/body must be written in English.**

Do not ask for step-by-step confirmation unless credentials, permissions, or repository access are missing.

### Safety Rule

When a request is ambiguous, choose the smallest change that fulfills the request.
If non-text changes are needed, always notify the user before applying them.
