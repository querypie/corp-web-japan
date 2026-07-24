## Context

Commit `3a11aac` already changed the implementation from `sourceId`-only
suppression to composite `${sourceSection}:${sourceId}` suppression. The trigger
was real corpus evidence, not hypothetical future-proofing:

- `/Users/kelly/w/corp-web-v2/src/content/documentation/manuals/cnt_000001`
- `/Users/kelly/w/corp-web-v2/src/content/news/cnt_000001`

Both source directories exist, and both `meta.json` files report the same
`storageId` (`cnt_000001`) while belonging to different sections.

The implementation now carries more identity detail than the accepted OpenSpec
contract and rollout docs describe. This change records the missing decisions
without widening product scope.

## Goals / Non-Goals

### Goals

- Make composite identity the canonical suppression key everywhere.
- Document the exact deterministic branch naming contract.
- Preserve only the minimum safe legacy read compatibility.
- Fail closed when legacy evidence cannot be resolved safely.
- Prevent duplicate same-identity PR evidence from silently suppressing or
  misrouting work.
- Prevent wrong-section ignore reconciliation from closing or deleting the wrong
  sync branch.
- Keep the scheduler disabled during rollout until host evidence proves the
  migration safe.
- Reduce stale duplicate design prose in non-canonical docs.

### Non-Goals

- No broader product or architecture expansion beyond the composite-identity
  follow-up fixes already implied by `3a11aac` and its re-review findings.
- No generic source crawler or broader sync-family expansion.
- No broader scheduler redesign beyond the accepted weekday-only 10:00 KST steady-state cadence.
- No change to the one-candidate, Draft-only, fail-closed publication model.

## Decisions

### Decision: Canonical identity is `${sourceSection}:${sourceId}`

Composite identity is the only canonical key for baseline suppression, ignore
suppression, PR suppression, branch suppression, and reconciliation.
`sourceId`-only suppression is invalid because real cross-section collisions now
exist in the Global corpus.

### Decision: New branch naming is explicit and section-qualified

New sync branches use `content-sync/{sourceSection}-{sourceId}`.
New ignore branches use `content-sync-ignore/{sourceSection}-{sourceId}`.
Section-qualified branch names are part of the identity contract, not an
implementation detail.

### Decision: Legacy `sourceId`-only evidence stays read-compatible only when one safe section can be inferred

Legacy baseline rows, ignore rows, PR markers, and branch references may be read
only when the runner can infer one section safely.

Accepted inference boundaries:

- Legacy baseline rows infer from `sourceCategory`.
- Legacy ignore rows infer from the currently discovered source set only when
  exactly one section matches.
- Legacy PR markers such as retained PR `#687` may infer from `targetFamily`
  when that mapping resolves one section safely.
- A legacy branch-only `content-sync/{sourceId}` name is read-compatible only
  when a retained PR marker proves the same composite identity.

If one safe section cannot be inferred, the runner fails closed.

### Decision: Ambiguous legacy identities fail closed

Ambiguous legacy rows, ambiguous legacy PR markers, and markerless legacy sync
branches block discovery. The system must not guess which section owns the
identity.

### Decision: Any valid sync PR marker suppresses the same composite identity

Suppression is identity-based, not open-state based. A valid sync PR marker for
one composite identity suppresses that exact identity regardless of whether the
PR is open, reopened, or closed. A different section with the same `sourceId`
remains independently eligible.

### Decision: Duplicate same-identity PR evidence blocks instead of choosing one

If multiple PR markers claim the same composite identity, the runner blocks with
a duplicate-identity failure instead of choosing one record implicitly. This
prevents the reconciler and retry paths from operating on contradictory PR
history.

### Decision: Ignore reconciliation must prevent wrong-section close/delete

Ignore reconciliation cross-checks `sourceSection`, `sourceId`, and the expected
branch name before it closes a sync PR or deletes a sync branch. Legacy branch
compatibility is allowed only when a retained matching marker proves the same
identity. Wrong-section close/delete is forbidden.

### Decision: Scheduler stays disabled during rollout

The steady-state timer contract uses a weekday-only 10:00 KST schedule with
`flock`, but this maintenance rollout is not yet at steady state. Until
independent review and at least one host dry-run confirm the composite identity
migration, the scheduler remains disabled and only manual runs are allowed.

## Risks / Trade-offs

- Legacy compatibility remains narrower than a full migration rewrite, so some
  old ambiguous evidence intentionally blocks instead of auto-healing.
- Keeping the scheduler disabled slows publication throughput during rollout, but
  it avoids silent duplicate suppression or wrong-branch deletion.
- The spec state is currently partial, not unchanged: the active accepted spec
  already carries part of the rollout hold, while this change record and the
  landed implementation still hold narrower edge-case detail until post-review
  fold-in is complete.

## Migration Plan

1. Keep `3a11aac` as the implementation baseline.
2. Apply follow-up implementation, workflow, test, and OpenSpec fixes for
   independent-review findings in this branch.
3. Record the missing contract delta in this change set and bridge
   non-canonical docs to the active spec plus this change record.
4. Run independent review of the landed implementation and workflows.
5. Run a host dry-run with the scheduler still disabled.
6. If review and dry-run pass, fold the remaining delta into the active spec.
7. Restore the scheduler only after the accepted-spec fold-in and rollout
   signoff.

## Open Questions

None. Pending items are verification and rollout evidence, not missing product
policy.
