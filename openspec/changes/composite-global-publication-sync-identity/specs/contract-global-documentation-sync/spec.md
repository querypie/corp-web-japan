## MODIFIED Requirements

### Requirement: Stable composite identity and suppression

The automation SHALL use `${sourceSection}:${sourceId}` as the canonical
identity for baseline, ignore, pull-request, branch, retry, and reconciliation
suppression.

New sync branches SHALL use `content-sync/{sourceSection}-{sourceId}`. New
ignore branches SHALL use `content-sync-ignore/{sourceSection}-{sourceId}`.

Legacy `sourceId`-only baseline rows, ignore rows, PR markers, and branch names
MAY remain read-compatible only when one section can be inferred safely.
Accepted legacy inference MAY use `sourceCategory`, the currently discovered
source set, or a retained PR marker's `targetFamily` when that mapping resolves
one section unambiguously. Retained legacy PR marker `#687` is one such
read-compatible case. Ambiguous legacy identities and markerless legacy sync
branches SHALL block instead of guessing.

A valid sync PR marker in any PR state SHALL suppress that exact composite
identity. A different `sourceSection` with the same `sourceId` SHALL remain
eligible. If multiple PR markers claim the same composite identity, discovery
SHALL fail closed with a duplicate-identity block.

#### Scenario: duplicate `sourceId` remains eligible across sections

- GIVEN Global contains `documentation/manuals/cnt_000001` and
  `news/cnt_000001`
- AND baseline suppression already covers `documentation:cnt_000001`
- WHEN discovery evaluates `news:cnt_000001`
- THEN the News record SHALL remain independently eligible
- AND `sourceId` alone SHALL NOT suppress it

#### Scenario: retained legacy PR marker proves one section safely

- GIVEN a retained legacy sync PR marker without `sourceSection`
- AND its `targetFamily` resolves exactly one section
- WHEN discovery evaluates the same `sourceId`
- THEN the runner MAY suppress only that inferred composite identity
- AND it SHALL NOT suppress another section that shares the same `sourceId`

#### Scenario: ambiguous legacy identity blocks

- GIVEN a legacy sync branch `content-sync/cnt_000001`
- AND no retained marker proves whether it belongs to Documentation or News
- WHEN discovery evaluates that duplicated `sourceId`
- THEN discovery SHALL fail closed with an ambiguous-legacy-identity block

#### Scenario: duplicate PR markers claim the same composite identity

- GIVEN multiple PR markers claim the same `${sourceSection}:${sourceId}`
- WHEN discovery loads PR suppression state
- THEN discovery SHALL block instead of picking one PR implicitly

### Requirement: Owner-controlled ignore flow

Ignore reconciliation SHALL cross-check `sourceSection`, `sourceId`, and the
expected branch name before it closes a sync PR or deletes a sync branch.
Legacy branch deletion SHALL be allowed only when a retained matching PR marker
proves the same composite identity. The reconciler SHALL NOT close or delete a
PR/branch for a different section that happens to share the same `sourceId`.

#### Scenario: wrong-section close/delete is prevented

- GIVEN an ignore decision for `documentation:cnt_000001`
- AND a News sync PR exists for `news:cnt_000001`
- WHEN reconciliation validates the ignore marker and source PR marker
- THEN it SHALL refuse to close the News PR or delete the News branch
- AND only the cross-checked matching Documentation identity MAY be reconciled

### Requirement: Production schedule and concurrency

The steady-state production host SHALL use timezone `Asia/Seoul`, and its timer
SHALL run daily at 10:00 KST with a randomized delay of no more than ten
minutes plus persistent catch-up behavior.

During the composite-identity rollout, however, the scheduler SHALL remain
disabled until independent review and at least one host dry-run confirm the
landed migration. Manual runs MAY continue under the existing non-overlapping
`flock` boundary.

#### Scenario: rollout hold keeps the scheduler disabled

- GIVEN composite-identity migration has landed but rollout verification is not
  complete
- WHEN operators prepare host validation
- THEN the production scheduler SHALL remain disabled
- AND only manual guarded runs MAY execute until rollout evidence is accepted
