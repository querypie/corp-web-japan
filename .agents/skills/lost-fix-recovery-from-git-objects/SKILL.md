---
name: lost-fix-recovery-from-git-objects
description: Recover a corp-web-japan fix that was described in a PR or remembered by the user but is missing from latest main because the final merged tree came from a different branch lineage.
---

# Lost fix recovery from git objects

Use this when the user says a UI/content fix definitely existed before, but the current `main`/stage/live code shows an older regressed state.

Typical symptom:
- a PR body or human memory says a fix landed
- current source and deployed output do not contain that fix
- the final merged PR tree may have come from a rewritten branch or different ancestry than the remembered fix commits

## When to use

Trigger this workflow when all of these are true:
- the current rendered page is demonstrably wrong in the browser
- current `main` source matches that wrong state
- there is evidence that a correct intermediate implementation existed earlier

Especially useful for corp-web-japan preview/parity follow-up work.

## Workflow

1. Verify the current broken state first
- inspect the exact deployed URL in the browser
- inspect the current source file on latest `main`
- confirm the browser-rendered state matches current source, not just memory

2. Reconstruct the expected fix from multiple evidence sources
- search prior sessions with `session_search`
- inspect the relevant PR body with `gh pr view <number> --json body,files,headRefOid`
- inspect the merged commit and current file content
- if the PR description mentions classes/props not present in the merged code, treat that as a branch-lineage mismatch candidate

3. Trace the commit history by content, not only by branch names
- use `git log -S '<unique class or string>' -- ...`
- use `git log -G '<regex>' -- ...`
- inspect historical versions with `git show <commit>:path/to/file`
- identify the sequence of commits that introduced the correct behavior

4. If the fix is not in main ancestry, inspect unreachable commits
- run:
  - `git fsck --no-reflogs --unreachable --full`
- then scan unreachable commits for likely subjects:
  - `for c in $(git fsck --full --unreachable 2>/dev/null | awk '/unreachable commit/ {print $3}'); do git show --quiet --format='%H %s' $c; done | rg '<keyword>'`
- this is the key recovery step when a branch was rewritten or a different tree became the final PR head

5. Prove the ancestry mismatch explicitly
- use `git merge-base --is-ancestor <candidate-fix-commit> <merged-pr-head>`
- if false, the remembered fix existed but was not part of the final merged lineage
- capture both commit chains in the investigation notes/PR body so the recovery rationale is clear

6. Restore only the intended behavior into latest main
- do not cherry-pick the old orphan commit blindly
- port only the minimal semantic fix into the current file/layout structure
- prefer the current extracted/shared component location if the code was refactored later

7. Add a regression test for the exact recovered contract
- if the regression is a class/markup contract, add a small structure test
- assert the restored behavior is present
- assert the old regressed pattern is absent

For example:
- assert the new `w-fit self-start leading-none` wrapper exists
- assert the old `h-[35px] w-[35px] rounded-[4px]` badge wrapper does not exist

8. Open a focused PR
- explain the user-visible regression
- explain that the original fix existed in orphan/non-merged lineage
- explain that this PR restores the lost behavior on top of latest main

## Practical commands

Current-state confirmation:
```bash
git show origin/main:path/to/file | sed -n 'start,endp'
```

Search by content:
```bash
git log -S 'h-[35px] w-[35px]' --oneline -- path/to/file
git log -G 'self-start|w-fit|leading-none' --oneline --all -- path/to/file
```

Scan unreachable commits:
```bash
for c in $(git fsck --full --unreachable 2>/dev/null | awk '/unreachable commit/ {print $3}'); do
  git show --quiet --format='%H %s' $c
 done | rg 'about-us|flag|<keyword>'
```

Check ancestry:
```bash
git merge-base --is-ancestor <candidate-fix> <merged-head>; echo $?
```

## Done criteria
- current deployed/source regression is reproduced and understood
- the missing fix is located in reachable or unreachable history, or otherwise proven by prior-session evidence
- the ancestry mismatch is explicitly confirmed when relevant
- the intended behavior is minimally restored in latest main structure
- a regression test prevents the old pattern from silently returning

## Pitfalls
- trusting the PR body without checking the final merged tree
- assuming a remembered fix must still be in branch ancestry
- cherry-picking old commits directly into a refactored file when a minimal re-port is safer
- restoring the old code shape instead of the old behavior
- reopening a large parity/refactor scope when only one lost contract needs to be restored
