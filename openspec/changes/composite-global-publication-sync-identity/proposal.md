## Why

Commit `3a11aac` migrated Global publication sync identity from `sourceId` only
to the composite `${sourceSection}:${sourceId}`. That change was necessary
because Global already contains a real cross-section collision:
`documentation/manuals/cnt_000001` and `news/cnt_000001` both exist in the
source repository. SourceId-only suppression is therefore invalid and can hide a
still-eligible source from a different section.

The landed implementation also tightened legacy compatibility and ignore
reconciliation behavior, but the active OpenSpec contract and related docs do
not yet capture every accepted edge case consistently. Current docs still leave
ambiguity around legacy PR marker inference, PR-state suppression scope,
duplicate same-identity blocking, wrong-section close/delete prevention, and the
rollout-time scheduler hold.

## What Changes

- Add a change record for the composite sync identity follow-up.
- Capture the durable identity rule as canonical
  `${sourceSection}:${sourceId}`.
- Record the explicit deterministic branch names
  `content-sync/{sourceSection}-{sourceId}` and
  `content-sync-ignore/{sourceSection}-{sourceId}`.
- Clarify legacy read compatibility for retained `sourceId`-only baseline,
  ignore, PR-marker, and branch evidence, including legacy PR `#687` inference.
- Require ambiguous legacy identities to fail closed.
- Require valid sync PR markers in any PR state to suppress the same composite
  identity, and require duplicate same-identity PR markers to block.
- Require ignore reconciliation to prevent wrong-section PR close/delete.
- Record that the production scheduler stays disabled during rollout until the
  independent review and host dry-run are complete.
- Bridge stale or duplicated design/rollout claims in repo docs back to the
  canonical OpenSpec contract and this change record.

## Capabilities

### New Capabilities

- Explicit OpenSpec coverage for composite source identity collision handling.
- Explicit legacy read-compatibility contract for `sourceId`-only evidence.
- Explicit fail-closed protection when multiple PR records claim the same
  composite identity.
- Explicit rollout-time scheduler hold for this maintenance sequence.

### Modified Capabilities

- Existing suppression rules now key on composite identity instead of
  `sourceId` alone.
- Existing ignore reconciliation now requires section-safe branch deletion.
- Existing operational docs now defer temporary rollout gating details to this
  change record instead of restating them as stable design facts.

## Impact

- This branch includes follow-up workflow, test, and documentation fixes on top
  of commit `3a11aac`; it is not docs-only.
- The implementation state is partial-but-landed: core composite-identity
  behavior already exists across discovery, baseline, git/PR,
  ignore/reconciliation, production-run, and regression tests, while this
  branch closes independent-review findings around hostile legacy markers,
  Slack source display, and rollout-document drift.
- Pending work remains operational, not architectural: independent review,
  host dry-run with the scheduler still disabled, and scheduler restore only
  after rollout evidence is accepted.
