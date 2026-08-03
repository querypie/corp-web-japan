---
name: global-content-operations
description: Use when a user asks to periodically reconcile current Global and Japan content, update baseline or Ignore tracking, preview the final report, or send it after explicit approval.
---

# Global Content Operations

Run as a local-only operation on demand. No scheduled or manually dispatched GitHub Actions report exists; reconciliation, preview, and explicit delivery happen in this skill.

## Repository sources and portable bootstrap

- Global source: `git@github.com:querypie/corp-web-v2.git`
- Japan target: `git@github.com:querypie/corp-web-japan.git`

Never assume a user name, home directory, sibling checkout, or fixed local path. Resolve the current Japan repository with Git and validate the current checkout origin against the canonical Japan repository. Reuse a valid Global checkout when one is explicitly available; otherwise clone the canonical Global repository into a temporary or user-cache directory. Fetch `origin/main` for both repositories, create clean detached worktrees from those exact refs, record both full SHAs, and cleanup temporary worktrees/clones when the operation ends. Fail closed on an origin mismatch, fetch failure, dirty authority checkout, or missing supported content roots.

## Latest code and data parity preflight

Before every report, compare the latest Global public menu categories, Global `src/content` roots, Japan public menu paths, Japan `src/content` target roots, and `SOURCE_FAMILIES`. Inspect at least Global `src/features/content/publicPathConfig.ts`, Global `src/content/{demo,documentation,news}`, Japan `src/components/layout/site-header-client.tsx`, and Japan `src/content`. Every public content menu family and every actual Global source root must have an explicit descriptor, production list URL, canonical segment, and Japan target family. Optional descriptors are allowed only for a menu family whose Global source root does not exist yet. The report tooling also fails closed when a new directory appears under a managed Global content root without a descriptor.

If the menu, code, source roots, target roots, manifest schema, or report contract drift, stop before report generation or Slack delivery. Update the mapping, tooling, skill, tests, and OpenSpec through a normal reviewed PR first. Never treat the current `SOURCE_FAMILIES` list as proof that no new data family exists.

## Required order

1. Complete the portable repository bootstrap and latest code/data parity preflight above. Never use a saved Slack report as authority.
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
10. Attach `report.operationsSummary` before building the local Slack preview. Each changed item must include `identity`, `title`, `targetFamily`, `dateIso`, `globalUrl`, `japanUrl` when matched, `target`, `verdict`, `state`, and `action`. `state` is `pending` before baseline PR merge and `matched` only after latest-main validation. Use the title `Global Content Review`. Render `Match pending`, `Matched today`, `Needs review`, and `Ignored` through the same default-collapsed `reviewContainer` and content-card structure: title, family/date/identity, result, status, and site links. Use plain user-facing copy: `Same content`, `Tracking complete`, and `Waiting for merge`; keep `Equivalent` only in the internal AI review table. Show the user this Block Kit preview, the full review table, unresolved items, and final counts.
11. Commit, push, and open normal human-reviewed PRs. **MUST NOT auto-merge.** After merge, fetch latest `main` and rerun the report.
12. Do not send before explicit approval. Build delivery payloads with `{ final: true }`; this MUST reject any `pending` item. `Match pending` appears only in the local preview, never in a Slack delivery. **MUST send the exact final payload to the test channel first. MUST NOT send to production until the user explicitly approves that test draft.** Immediately before production delivery, revalidate both latest `main` SHAs and confirm the production payload is byte-for-byte the approved test payload. If repositories, report data, or payload changed, rebuild and resend the test draft before asking for production approval. A direct production request without a current test draft starts at test delivery; it does not bypass this gate. Reuse the main checkout’s gitignored `.env.local` from every worktree. If Slack API credentials are missing, run `npm run global-content:init` once; this reads `corp-web-japan-global-content-slack` from 1Password and stores the bot token plus test/production channel IDs locally, following the same setup pattern as `~/w/deck`. Never print or commit the values. Send with `chat.postMessage`, not Incoming Webhooks, and record returned `channel`/`ts` in `.tmp/global-content-slack-history.json`.
    - `테스트로 보내` sets destination `test` and uses `GLOBAL_CONTENT_DIFF_TEST_SLACK_CHANNEL_ID`; record it as the current draft.
    - `프로덕션으로 보내` uses `GLOBAL_CONTENT_DIFF_PROD_SLACK_CHANNEL_ID` only after the current test draft is explicitly approved.
    - An unqualified `보내` means test draft delivery. Production always requires a separate explicit approval after the test result is shown.
    - `방금 테스트 메시지 삭제` runs `npm run global-content:delete-last -- test`; production uses `prod`. Deletion uses `chat.delete` and only targets messages recorded by this operation.
    Stop if the bot token, channel ID, or Slack API response is invalid.

## Review table

```text
Identity | Candidate | Signals | Title | Summary | Body | Date/source/media | Conflicts | Verdict
```

Every `Equivalent` baseline row must be traceable to this table. The operations summary must state whether a Global addition matched existing Japan content and whether the action was baseline, Ignore, new MDX, or unresolved.
