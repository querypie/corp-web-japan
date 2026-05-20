---
name: github-wiki-editing
description: Use when editing the querypie/corp-web-japan GitHub wiki through its separate wiki git repository, including dated operational reports and _Sidebar.md navigation updates.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [github, wiki, markdown, operations, corp-web-japan]
    related_skills: []
---

# GitHub wiki editing

Use this repo-local skill when a task needs to create or update pages in the `querypie/corp-web-japan` GitHub wiki.

GitHub wikis are separate git repositories. Do not edit wiki pages inside the main `corp-web-japan` product repository.

## When to load

Load this skill for:

- scheduled Vercel Runtime Log report pages
- updates to `querypie/corp-web-japan.wiki`
- `_Sidebar.md` navigation edits
- operational runbooks or wiki reports that must be committed and pushed to the wiki repository

## Core workflow

1. Confirm GitHub CLI authentication with the token environment unset:

```bash
env -u GITHUB_TOKEN gh auth status -h github.com
```

2. Locate or clone the wiki repository.

Preferred local clone if present:

```text
../corp-web-japan.wiki
```

Fallback remote pattern:

```text
https://github.com/querypie/corp-web-japan.wiki.git
```

Use a dedicated clone/workdir for wiki edits. Verify the wiki branch name after cloning; GitHub wiki repos commonly use `master`.

3. Check wiki worktree state before editing:

```bash
git status --short --branch
git remote -v
```

If unrelated local edits exist, isolate or stop before modifying the target page.

4. Pull the latest wiki state before editing:

```bash
git fetch origin --prune
git pull --rebase origin master
```

If the wiki branch is not `master`, use the actual checked-out branch.

5. Read the target page before changing it.

Common filename rules:

- Wiki page `Vercel Runtime Log - May 20` -> `Vercel-Runtime-Log---May-20.md`
- `_Sidebar.md` controls the custom wiki sidebar/navigation.

6. Edit the report page and `_Sidebar.md` as needed.

For scheduled Runtime Log reports:

- create or update the same dated page for the current KST day
- do not create a separate page per cron run
- when creating a new dated report, add the page link to `_Sidebar.md` in the same commit
- when updating an existing same-day report, verify `_Sidebar.md` already exposes the link and add it if missing
- keep existing sidebar structure and place the dated Runtime Log report near adjacent Vercel Runtime Log reports

7. Verify markdown before committing.

Check for:

- expected page title
- Korean report section labels when the report is Korean
- correct wiki page link in `_Sidebar.md`
- no stale link to a renamed/deleted page
- no accidental line-number prefixes copied from file-reading tools

8. Commit and push the wiki repository:

```bash
git status --short
git add <report-page>.md _Sidebar.md
git commit -m "docs: update Vercel runtime log report for YYYY-MM-DD"
git push origin HEAD
```

9. Verify the push:

```bash
git status --short --branch
git log -1 --oneline
git ls-remote origin refs/heads/<wiki-branch>
```

GitHub REST repository/ref endpoints for `.wiki` repositories can return `404` even when a normal git push succeeded. Prefer git remote verification.

## Cwd and repository pitfalls

- If your shell is inside the wiki clone, `gh` commands may infer `querypie/corp-web-japan.wiki` instead of `querypie/corp-web-japan`.
- When you need product repo PR or source data, pass `--repo querypie/corp-web-japan` explicitly or run from the product repo worktree.
- Use absolute paths when editing wiki files from automation so you do not accidentally edit the product repo or a stale clone.
- If `git push` is rejected because the wiki remote advanced, fetch and rebase onto the wiki remote branch; do not force-push the wiki unless explicitly authorized.

## Verification checklist

- [ ] Wiki repository, not product repository, was edited.
- [ ] The wiki clone was updated from origin before editing.
- [ ] Target report page was created or updated.
- [ ] `_Sidebar.md` exposes the report page link.
- [ ] Report language and formatting match the task requirements.
- [ ] Wiki commit was pushed successfully.
- [ ] Push was verified with git status/log/ls-remote.
