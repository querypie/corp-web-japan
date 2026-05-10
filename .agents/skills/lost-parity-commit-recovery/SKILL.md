---
name: lost-parity-commit-recovery
description: Recover visual/parity fixes that were previously implemented but later disappeared from the current branch or main history, by combining session recall, unreachable-commit forensics, ancestry checks, and latest-structure reapplication.
---

# Lost parity commit recovery

Use this when a user says some UI/parity detail was definitely fixed before, but the current branch, main branch, or deployed preview has regressed to an older state.

Typical signals:
- "분명히 이거 고쳤던 기억이 있는데 다시 돌아갔다"
- PR body/review notes mention a fix, but the current code does not contain it
- a route-local refactor or branch rewrite seems to have dropped a later visual fix
- current stage/preview rendering matches an older implementation shape rather than the later intended one

This is especially useful in `corp-web-japan` after preview-route parity work, route-local refactors, PR branch rewrites, or force-pushes.

## Core idea

Do not guess the missing fix from memory.
Treat it as a source-control forensics problem first, then a latest-structure reapplication problem.

The goal is to answer three questions in order:
1. What exact later fix existed?
2. Why is it absent from the current branch/main/deploy?
3. How do we reapply the *final intended result* onto the current file structure with the smallest safe diff?

## Workflow

### 1. Confirm the current broken state in both code and rendering
Check both:
- the current source files
- the current rendered page (stage / preview / live as appropriate)

For UI issues, gather browser evidence with DOM geometry and class/computed-style inspection.

Examples:
- inspect the current component/route file that renders the broken section
- inspect the deployed page with browser DOM measurements (`getBoundingClientRect()`, class names, computed styles)

Do not skip this step.
You need a concrete description of the current wrong state before chasing old commits.

### 2. Search prior session memory first
Use `session_search` when the issue sounds like a previously completed fix.

Search with concrete keywords from the visual symptom and likely Tailwind/classnames.
Examples:
- page/route name
- section name
- user wording like `flag border`, `timeline divider`, `LinkedIn icon`
- distinctive classes like `self-start`, `w-fit`, `leading-none`

Why this matters:
- the earlier session summary may already name the exact commit intent, classnames, or causal explanation
- sometimes the final fix was described in the PR body or the session summary even if it never survived merge

### 3. Find candidate historical commits from current history
Search normal reachable history first:

```bash
git log --oneline --all --grep='<topic>'
git log -S '<distinctive class or string>' --oneline -- <paths...>
git log -G '<regex>' --oneline --all -- <paths...>
```

Good anchors:
- exact class strings
- image names / section labels
- commit subjects from PRs or session summaries

### 4. If the expected fix is still missing, inspect unreachable commits
This is the key recovery step when a branch was rewritten, a PR head changed, or a refactor was merged from the wrong tree.

Use:

```bash
git fsck --full --unreachable
```

Then inspect unreachable commits for relevant subjects:

```bash
for c in $(git fsck --full --unreachable 2>/dev/null | awk '/unreachable commit/ {print $3}'); do
  git show --quiet --format='%H %s' "$c"
done | grep '<topic>'
```

This often reveals:
- small follow-up commits that were pushed once but later dropped from the final PR head
- TEMP SQUASH commits
- detached-worktree commits
- branch-rewrite casualties

### 5. Prove whether the fix was actually excluded from the merged PR/tree
Do not stop at finding a candidate commit.
Verify whether that commit is in the ancestry of the current branch or merged commit.

Use:

```bash
git merge-base --is-ancestor <fix-commit> <merged-or-current-commit>; echo $?
```

Interpretation:
- `0` = the fix commit is an ancestor
- `1` = the fix commit is **not** an ancestor

This is the cleanest way to prove:
- "the fix existed but was not part of the final merged tree"

Also inspect the parent/base of the currently merged refactor commit:

```bash
git rev-list --parents -n 1 <commit>
git show <base-commit>:<path>
```

This lets you show whether the final merged refactor was built on a tree that still contained the older UI state.

### 6. Recover the *final intended result*, not every historical intermediate step
Once you identify the useful commits, inspect them in order and classify them:
- original broken/base implementation
- intermediate simplification commits
- final parity/stability commit(s)

Examples of final-result clues:
- the commit that adds `self-start w-fit leading-none` after an earlier fixed-size frame attempt
- the commit that moves a divider from each row into the outer timeline container
- the commit that returns a social icon to the same row as the text block instead of a full-width footer row

Do not mechanically replay every old commit onto the new branch.
Instead:
- reconstruct only the final desired state
- ignore superseded intermediate steps

### 7. Reapply onto the *current* file structure, not the old one
Often the old fix lived in a route file, but the current code has been route-localized or extracted into a shared section component.

So after identifying the final intended behavior:
- open the current implementation files
- map the old diff to the current ownership boundary
- patch the current component/module that now owns that layout

Example pattern:
- old fix lived in `src/app/t/about-us/page.tsx`
- current code moved the same markup into `src/components/sections/about-us.tsx`
- reapply the final layout semantics there instead of trying to resurrect the old route-level code literally

### 8. Add regression checks for the recovered details
If the problem was caused by a refactor dropping narrow layout semantics, add a focused structure regression test.

Good assertions include:
- required classnames that encode the recovered layout contract
- negative assertions against the known regressed pattern

Examples:
- assert the flag wrapper includes `w-fit self-start leading-none`
- assert the old `h-[35px] w-[35px] rounded-[4px]` square badge is absent
- assert the timeline uses the outer `border-l` container rather than a per-row second-column border
- assert the leader card uses `flex items-start justify-between` for text + LinkedIn alignment

This is especially important when the regression came from a large route-local refactor whose existing tests covered only coarse structure.

## Recovery heuristics

### A. Trust deployed rendering + ancestry proof over PR prose
A PR body can claim a fix was made even when the final merged tree no longer contains it.
Use current code, deployed DOM, and ancestry checks as the source of truth.

### B. Unreachable commits are not noise
In branch-rewrite / force-push workflows, unreachable commits can be the only surviving record of a dropped fix.
Search them deliberately.

### C. Session summaries are often faster than raw reflogs
If the earlier work happened in Hermes, `session_search` may tell you the exact fix direction (`self-start`, `w-fit`, `leading-none`, etc.) before you dig through raw commit objects.

### D. Reapply semantics, not literal old files
When current code ownership moved, the correct recovery is usually a translation from old route-level markup into new shared primitives/components.

## Recommended commands

```bash
# 1. Current state
git show HEAD:<path>

# 2. Session recall
# use session_search tool with concrete keywords

# 3. Reachable history search
git log -S '<string>' --oneline -- <paths...>
git log -G '<regex>' --oneline --all -- <paths...>

# 4. Unreachable commit discovery
git fsck --full --unreachable
for c in $(git fsck --full --unreachable 2>/dev/null | awk '/unreachable commit/ {print $3}'); do
  git show --quiet --format='%H %s' "$c"
done | grep '<topic>'

# 5. Ancestry proof
git merge-base --is-ancestor <fix-commit> <current-or-merged-commit>; echo $?

# 6. Inspect old final-result diff
git show <fix-commit> -- <path>
```

## Done criteria

You are done when:
- you can name the exact missing fix and why it disappeared
- you verified that the old fix commit is not in the current merge ancestry when applicable
- the current implementation contains the recovered final-result semantics in the correct modern file(s)
- a focused regression test guards the recovered detail
- the branch/PR is updated with only the intended recovery scope
