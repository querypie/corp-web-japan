---
name: global-content-operations
description: Use when a user asks to periodically reconcile current Global and Japan content, update baseline or Ignore tracking, preview the final report, or send it after explicit approval.
---

# Global Content Operations

Run as a local-only operation on demand. No scheduled or manually dispatched GitHub Actions report exists; reconciliation, preview, and explicit delivery happen in this skill.

## Required order

1. Create a clean dated worktree from the latest `corp-web-japan` `main`. Fetch the latest `corp-web-v2` `main`. Record both full SHAs. Never use a saved Slack report as authority.
2. Build a fresh dry-run from both latest `main` snapshots. Identify current `Untracked` items and content added or changed in the current JST-day Git history.
3. For every `Untracked` item, inspect candidates only within its target family. Deterministic signals nominate candidates; they never establish a baseline mapping.
4. Apply the **Baseline review gate**. AI must compare Global and Japan title, summary, full body, date, slug, source, and media. Record:
   - matching series/article identity;
   - matching outline, claims, examples, products, and conclusion;
   - date/source/media differences and whether they conflict;
   - one-to-one target ownership and existing baseline/Ignore conflicts.
5. Assign exactly one verdict per candidate:
   - `Equivalent`: same publication across locales or repositories;
   - `Different`: related but distinct publication;
   - `Ambiguous`: evidence cannot establish one identity.
6. For a single unambiguous `Equivalent`, remove any active Ignore row for that identity and add the exact `baseline.json` mapping without asking the user to repeat confirmation. For `Different`, leave it `Untracked`. For `Ambiguous` or multiple plausible targets, stop and show evidence.
7. Apply the **Remaining Untracked review gate** only after every `Equivalent` baseline mapping is staged. Show the remaining identities and evidence. The user must explicitly approve every Ignore identity. AI MUST NOT infer or auto-approve Ignore from “no candidate,” age, family, or missing Japan content. Apply approved exclusions through `.agents/skills/global-content-ignore/SKILL.md`; never Ignore a publishable or equivalent item.
8. Apply new-publication requests through `.agents/skills/global-to-japan-publication/SKILL.md`. Do not create duplicate MDX for an equivalent candidate.
9. Validate and update all tracking manifests before generating the final report. Run focused tests, `npm run test:ci`, `git diff --check`, and a new dry-run against the changed worktree.
10. Attach `report.operationsSummary` before building the local Slack preview. Each changed item must include `identity`, `title`, `targetFamily`, `dateIso`, `globalUrl`, `japanUrl` when matched, `target`, `verdict`, and `action`. Use the title `Global Content Review`. Label reconciliation changes as `Today · Synced N` / `Synced today`; label `Review needed` and `Ignored` as current-state counts so time scopes never mix. Render synced, unresolved, and Ignored items through the same default-collapsed content-card structure with explicit site links where available. Show the user this Block Kit preview, the full review table, unresolved items, and final counts.
11. Commit, push, and open normal human-reviewed PRs. **MUST NOT auto-merge.** After merge, fetch latest `main` and rerun the report.
12. Do not send any webhook before explicit send approval. Reuse the main checkout’s gitignored `.env.local` from every worktree. If either webhook variable is missing, run `npm run global-content:init` once; this reads 1Password and stores both values locally, following the same setup pattern as `~/w/deck`. Never print or commit the values. At send time, source `.env.local` and select:
    - test: `GLOBAL_CONTENT_DIFF_TEST_SLACK_WEBHOOK_URL`
    - production: `GLOBAL_CONTENT_DIFF_PROD_SLACK_WEBHOOK_URL`
    `테스트로 보내` uses test; `프로덕션으로 보내` uses production. An unqualified `보내` requires destination confirmation. Stop if the selected value is not a Slack Incoming Webhook URL.

## Review table

```text
Identity | Candidate | Signals | Title | Summary | Body | Date/source/media | Conflicts | Verdict
```

Every `Equivalent` baseline row must be traceable to this table. The operations summary must state whether a Global addition matched existing Japan content and whether the action was baseline, Ignore, new MDX, or unresolved.
