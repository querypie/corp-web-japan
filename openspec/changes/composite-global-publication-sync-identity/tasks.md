## 1. Contract

- [x] Create `proposal.md`, `design.md`, `tasks.md`, and the focused
      change-local spec delta under
      `openspec/changes/composite-global-publication-sync-identity/`.
- [x] Capture the evidence that duplicate `cnt_000001` exists in both Global
      Documentation manuals and Global News, proving `sourceId`-only suppression
      is invalid.
- [x] Review the active spec plus docs modified by commit `3a11aac` and bridge
      stale duplicate design/rollout claims back to canonical OpenSpec sources.

## 2. Implementation

- [x] Commit `3a11aac` migrated sync identity handling from `sourceId` only to
      canonical composite `${sourceSection}:${sourceId}` across discovery,
      baseline, sync markers, branch naming, ignore flows, and tests.
- [x] Commit `3a11aac` landed explicit deterministic branch names:
      `content-sync/{sourceSection}-{sourceId}` and
      `content-sync-ignore/{sourceSection}-{sourceId}`.
- [x] Commit `3a11aac` preserved legacy read compatibility for retained
      `sourceId`-only baseline/ignore/PR/branch evidence only when one safe
      section can be inferred, including legacy PR `#687` handling.
- [x] Commit `3a11aac` blocks duplicate same-identity PR evidence and guards
      wrong-section close/delete during ignore reconciliation.
- [x] Complete an independent review of the implementation through `8ed24be`
      before restoring unattended execution. The final independent review
      returned `READY` after legacy retry, legacy ignore deduplication, workflow
      fail-closed inference, and explicit checked-in manifest backfill fixes.

## 3. Verification

- [x] Commit `3a11aac` added or updated regression coverage in:
      - `tests/global-documentation-sync/baseline.test.mjs`
      - `tests/global-documentation-sync/discovery.test.mjs`
      - `tests/global-documentation-sync/git-pr.integration.test.mjs`
      - `tests/global-documentation-sync/git-pr.test.mjs`
      - `tests/global-documentation-sync/ignore-workflow.test.mjs`
      - `tests/global-documentation-sync/prepare.test.mjs`
      - `tests/global-documentation-sync/production-run.test.mjs`
      - `tests/global-documentation-sync/sync-identity.test.mjs`
- [x] Run an independent review pass focused on composite-identity suppression,
      legacy inference, duplicate same-identity blocking, and wrong-section
      close/delete prevention. Final result: `READY`.
- [x] Run one server dry-run with the scheduler still disabled and capture host
      evidence that the candidate/PR suppression path behaves correctly.
      Run `composite-review-20260721T171749Z` skipped legacy Draft PR `#687`
      (`news:cnt_000212`), selected `news:cnt_000181`, reserved target ID `20`,
      passed generated-contract, full CI, build, and desktop/mobile browser QA,
      and recorded `committed: false`, `pushed: false`, and no PR URL. GitHub had
      no `content-sync/news-cnt_000181` branch or pull request after the run.
- [ ] Restore the scheduler only after the user approves the reviewed migration
      and the existing Draft PR `#687` content corrections are complete.

## 4. Spec / Implementation Drift Check

- [x] Record the current drift: `3a11aac` implementation now covers composite
      identity details that the active spec and rollout docs did not describe
      fully.
- [x] Fold the accepted composite-identity delta into
      `openspec/specs/contract-global-documentation-sync/spec.md` and remove
      contradictory rollout guidance from the historical News design/plan.
- [x] Record the pre-rollout drift-check result here: implementation, workflows,
      checked-in baseline/ignore manifests, active OpenSpec, and operator docs
      agree on `${sourceSection}:${sourceId}`; scheduler restore intentionally
      remains pending user approval.

## 5. OpenSpec Cleanup

- [x] Run a duplicate phrase scan for identity/rollout claims across `docs/` and
      `openspec/`.
- [x] Run `git diff --check` for this implementation/workflow/test/OpenSpec
      follow-up change.
- [ ] After the active spec absorbs this delta, reduce any leftover duplicate
      historical design prose to a short bridge and archive the temporary change
      record when appropriate.
