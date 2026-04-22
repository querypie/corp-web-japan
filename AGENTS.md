# Repository Guidelines

This file is the working guide for AI agents such as Codex, Claude Code, and similar tools.
Humans can read it too, but it exists to support agent execution, safety, and consistency.

## Shared principles

These principles apply to both humans and AI agents.

- Keep changes small, focused, and easy to review.
- Prefer structured content in `src/content/` over inline copy when possible.
- Keep docs, implementation, and tests aligned.
- Verify changes with the lightest command that proves correctness.
- If something is ambiguous, choose the smallest change that satisfies the request.

## Before you work

1. Read `README.md` for project context.
2. Identify whether the task is copy, layout, UI, or implementation work.
3. Check whether a relevant Skill applies, and load it before doing the work.
4. Confirm the active branch and worktree before editing.
5. Prefer a new worktree for branch-isolated work.

## Skill discovery

At the start of every user turn in this repository:

1. Discover available skills from these sources, in order:
   - Session-provided skill list, if present
   - `skills/` directory in this repository (`skills/<name>/SKILL.md`)
   - `$CODEX_HOME/skills/.system/` for built-in system skills
2. Build a short in-memory registry with:
   - `name`
   - `description`
   - `path to SKILL.md`
3. Match the user task against that registry.
4. Load only the minimum `SKILL.md` and linked files needed.

## Trigger rules

- If the user names a skill explicitly, use that skill.
- If the task clearly matches a skill description, use that skill even without an explicit name.
- If multiple skills match, use the minimum set and state the execution order briefly.
- Do not carry skill activation across turns unless re-triggered.

## Work rules

- Use a worktree for branch-isolated work.
- Make the smallest change that satisfies the request.
- Keep docs and implementation aligned.
- Prefer source content files over inline strings for copy changes.
- Do not make unrelated edits or opportunistic refactors.
- Verify the result before finishing.

## Copy / content tasks

- For copy updates, edit the actual file by default.
- Prefer `src/content/` instead of hardcoding strings in components when possible.
- Do not change design, layout, or implementation unless the user explicitly asks.
- If a requested copy change would require a code or design change, stop and ask for confirmation.

## UI / implementation tasks

- Follow surrounding file style and existing component patterns.
- Keep pages thin: route files should compose content and shared sections, while reusable logic stays in `src/lib/` or `src/components/`.
- Use the existing stack and conventions already present in the repo.
- Notify the user before any non-text change if the request did not explicitly include it.
- Apply cursor semantics consistently in UX work: interactive controls such as buttons, clickable cards, disclosure triggers, and menu toggles should show `cursor-pointer`, while static text, headings, and other non-interactive copy should keep the default arrow cursor unless editing or text selection is intentional.
- Prefer enforcing the cursor affordance contract in global CSS for standard semantics (`a[href]`, `button:not(:disabled)`, `summary`, `[role="button"]`, form text inputs, and editable text) so `.tsx` markup stays minimal and the browser behavior stays consistent.
- When a UI surface mixes controls and text, verify the cursor in the browser so hover behavior matches the interaction model (pointer for controls, arrow for titles and body copy).

## Verification

- Run the relevant checks before considering the work complete.
- Use `npm run test:ci` for PR-style verification when applicable.
- Run `npm run build` when the change affects production rendering or deployment candidates.
- Check the real browser when layout, spacing, or visual hierarchy changes.

## Pull request workflow

If the user wants a PR, perform the full workflow automatically:

1. create a new branch
2. make the requested changes
3. run the relevant checks (`npm run test:ci`)
4. create a commit
5. push the branch
6. open a pull request

Branch names, commit messages, and PR title/body must be written in English.
Do not ask for step-by-step confirmation unless credentials, permissions, or repository access are missing.

## Local preview

After applying any change, start the local development server with `npm run dev` and share the local URL so the user can verify the result immediately.

## Chikako mode

If the user says `"Chikako"` or identifies themselves as Chikako, enter Chikako mode immediately.

### Purpose

Chikako mode is for copywriting and content updates.
Interpret Chikako requests as execution requests by default, not brainstorming requests.
Chikako requests must be handled as implementation tasks unless the user explicitly asks for proposals only.

### Default rule

Copy and text content changes are the default scope.
Code, layout, styling, components, and design changes are allowed when requested.

If a request involves changes beyond text/copy, explicitly notify the user what non-text changes will be made before proceeding.
Do not make unrelated edits.
Do not refactor implementation.
Do not make opportunistic improvements outside the requested scope.
Do not stop at suggestions or alternative phrasing unless the user explicitly asks for options only.
When the user provides text and asks Chikako to improve or revise it, update the actual file by default.
Suggestion-only responses are not allowed unless the user explicitly asks for suggestions, options, alternatives, or brainstorming.
After applying the change, do not add unsolicited alternative copy suggestions.
Report the completed edit directly and concisely.

### Copy editing rule

Prefer updating source content files over inline strings whenever possible.
Apply the selected or most natural copy directly to the relevant files.
When the user provides a sentence and asks Chikako to improve it, revise it, shorten it, strengthen it, clarify it, or make it more natural, update the actual file immediately by default.
Do not answer with copy proposals only when a direct file edit is possible.
If multiple alternatives are possible, choose the most natural option and apply it unless the user explicitly asks to compare options.
If the user provides a sentence and asks Chikako to make it more natural, clearer, shorter, stronger, or more readable, treat that as a direct file-edit request unless the user explicitly asks for proposals only.

### Safety rule

When a request is ambiguous, choose the smallest change that fulfills the request.
If non-text changes are needed, always notify the user before applying them.
