# Global Content Diff Report Contract

## Purpose

Define the read-only production contract for reporting every production-published QueryPie Global item that is not yet verifiably present in `corp-web-japan`.

## Current implementation references

- `.github/workflows/global-content-diff-report.yml`
- `scripts/global-content-diff-report/cli.mjs`
- `scripts/global-content-diff-report/report.mjs`
- `scripts/global-content-diff-report/slack.mjs`
- `scripts/global-documentation-sync/source-family-map.mjs`
- `scripts/global-documentation-sync/discovery.mjs`
- `scripts/global-documentation-sync/sync-identity.mjs`
- `.github/content-sync/baseline.json`
- `.github/content-sync/ignore.json`

## Requirements

### Requirement: Production-only Global inventory

The report SHALL build its Global inventory only from the accepted source families exported by `scripts/global-documentation-sync/source-family-map.mjs`. A Global record SHALL be included only when the current implementation can prove that its normalized canonical URL is production-published by the required live production evidence for that family.

#### Scenario: Listed production record is included

- **GIVEN** a supported Global source record
- **AND** its normalized canonical URL is present in the required production list evidence for its family
- **AND** sitemap evidence also exists when that family requires sitemap evidence
- **WHEN** the report inventory is built
- **THEN** the record SHALL be included in the Global inventory

#### Scenario: Unsupported or unpublished record is excluded

- **GIVEN** a source record outside the accepted source-family map or missing the required production evidence
- **WHEN** the report inventory is built
- **THEN** the record SHALL NOT appear in the Global inventory

### Requirement: Composite identity

The report SHALL use `${sourceSection}:${sourceId}` as the canonical identity for inventory, mapping, and diff decisions. Records from different source sections with the same numeric `sourceId` SHALL remain distinct.

#### Scenario: Cross-section numeric collision stays distinct

- **GIVEN** `documentation:cnt_000001` and `news:cnt_000001`
- **WHEN** the report computes identity
- **THEN** it SHALL treat them as two different records
- **AND** suppressing one SHALL NOT suppress the other

### Requirement: Verified Japan-present mappings

A Global identity SHALL count as Japan-present only when a trusted mapping exists and the mapped target MDX file currently exists in `src/content/**` on the checked-out Japan tree. Trusted mappings SHALL be limited to baseline records and merged Global publication sync PR markers, including the retained legacy read-compatible marker contract.

#### Scenario: Baseline mapping with existing target file counts as present

- **GIVEN** a baseline record for one composite identity
- **AND** the mapped target MDX file exists in the Japan checkout
- **WHEN** the Japan-present inventory is built
- **THEN** that identity SHALL count as Japan-present

#### Scenario: Missing mapped file becomes mapping drift

- **GIVEN** a trusted mapping for one composite identity
- **AND** the mapped target MDX file does not exist in the Japan checkout
- **WHEN** the Japan-present inventory is built
- **THEN** that identity SHALL NOT count as Japan-present
- **AND** the report SHALL classify it as mapping drift

### Requirement: Complete non-suppressed difference results

The report SHALL compute `Global-only = production-published Global identities - verified Japan-present identities`. User-visible status SHALL be `Ignored` only when an active ignore record exists for the composite identity; otherwise status SHALL be `Untracked`. Ignore records and any open, closed-unmerged, or Draft sync PR states SHALL NOT suppress a diff item, and unmerged PR state SHALL NOT affect status.

#### Scenario: Ignored item still appears

- **GIVEN** a production-published Global identity with an active ignore record
- **AND** that identity is not verifiably Japan-present
- **WHEN** the diff is computed
- **THEN** the report SHALL include the item
- **AND** it SHALL mark the status as `Ignored`

#### Scenario: Draft-only item still appears as Untracked

- **GIVEN** a production-published Global identity represented only by an open or closed-unmerged Draft sync PR
- **AND** that identity is not verifiably Japan-present
- **WHEN** the diff is computed
- **THEN** the report SHALL include the item
- **AND** it SHALL mark the status as `Untracked`

### Requirement: Auditable original and source links

Every reported item SHALL show its title as plain text, an explicitly labeled production-evidenced original-domain link, and a GitHub source-folder link pinned to the exact reported Global commit SHA. The source path SHALL remain confined to `corp-web-v2/src/content/**`.

#### Scenario: Operator inspects an item safely

- **GIVEN** a diff item in the final report
- **WHEN** Slack payloads are built
- **THEN** the title SHALL NOT conceal a navigation target
- **AND** `Original · {domain}` SHALL link to the normalized HTTPS source URL
- **AND** `GitHub source` SHALL link to the item's source directory at the reported 40-character Global SHA
- **AND** invalid SHAs, non-HTTPS original URLs, or out-of-root source paths SHALL stop delivery

### Requirement: Deterministic grouping and pagination

Raw diff items SHALL be sorted deterministically by newest date first, then composite identity. Slack output SHALL regroup those items by status first, with `Untracked` containers before `Ignored`, then order items within each status by deterministic target-family order, newest-date-first within each family, and composite identity. Slack SHALL use text-only status container titles and paginate deterministically with explicit `Part N of M` labels when one payload is insufficient.

#### Scenario: Stable grouped multi-payload output

- **GIVEN** raw diff items spanning multiple target families and enough items to exceed one Slack payload
- **WHEN** Slack payloads are built
- **THEN** the payload sequence SHALL be deterministic
- **AND** Slack SHALL regroup items into `Untracked` containers before `Ignored` containers
- **AND** items within each status SHALL use deterministic target-family order
- **AND** newest-date-first order SHALL be preserved within each family
- **AND** each payload SHALL show its `Part N of M` label
- **AND** each status container title SHALL use text only

### Requirement: Read-only permissions and independent workflow

The production workflow SHALL run independently from the Global publication sync workflow. It SHALL use GitHub-hosted execution with repository read permissions only and SHALL NOT create or mutate branches, commits, issues, pull requests, ignore decisions, or external action endpoints.

#### Scenario: Workflow runs read-only

- **GIVEN** the scheduled or manually dispatched report workflow
- **WHEN** the GitHub Actions job starts
- **THEN** it SHALL request read-only repository permissions for the report job inputs
- **AND** it SHALL NOT push Git refs, open pull requests, or invoke interactive ignore handling

### Requirement: Weekday schedule and manual execution

The report workflow SHALL run on weekdays at 10:00 KST and SHALL also support manual `workflow_dispatch` execution.

#### Scenario: Weekday schedule is configured

- **GIVEN** the accepted production workflow definition
- **WHEN** a maintainer inspects it
- **THEN** it SHALL define cron `0 1 * * 1-5`
- **AND** it SHALL define `workflow_dispatch`

### Requirement: Zero state and fail-closed behavior

A zero-difference run SHALL send a compact success payload. The report SHALL fail closed when required checkouts, production evidence, mapping resolution, payload generation, or Slack delivery cannot be completed safely. When multipart delivery fails, already delivered parts remain visible and explicitly incomplete through their `Part N of M` labels; the workflow SHALL attempt a compact failure notification and SHALL NOT represent those parts as a complete report. Slack does not provide rollback of previously delivered webhook payloads.

#### Scenario: No differences remain

- **GIVEN** zero Global-only items after diff computation
- **WHEN** Slack payloads are built
- **THEN** the workflow SHALL send a compact zero-state success payload

#### Scenario: Delivery path fails

- **GIVEN** the report cannot safely complete payload generation or Slack delivery
- **WHEN** the workflow handles the failure
- **THEN** it SHALL fail closed
- **AND** already delivered parts SHALL remain visibly incomplete through `Part N of M`
- **AND** it SHALL attempt a compact failure notification
- **AND** it SHALL NOT present a partial diff as complete output

### Requirement: Manual Ignore PR instructions

The Slack report SHALL label every canonical key as `Composite identity` and include operator instructions that link to `.github/workflows/ignore-global-content-diff.yml`: copy that value, run GitHub Actions `Ignore Global-only content`, paste it into `source_identity`, review and merge the generated PR, then the next report shows `Ignored`.

#### Scenario: Operator sees an untracked item

- **GIVEN** a delivered Slack report payload with one or more Global-only items
- **WHEN** an operator decides to ignore one item
- **THEN** the payload SHALL label the value `Composite identity`
- **AND** the payload SHALL link to the manual Ignore workflow
- **AND** the payload SHALL state that a human reviews and merges the generated PR

### Requirement: Manual Ignore PR workflow

The manual Ignore workflow SHALL be independent from the Draft-PR ignore workflow. It SHALL accept only a `source_identity` input that exactly matches `^(documentation|news):cnt_\d+$`, SHALL reject bare `cnt_*` input, SHALL run the live Global-only report CLI in `--dry-run` mode with `GH_TOKEN`, SHALL select exactly one matching report item, and SHALL require that item to have status `Untracked`. The workflow SHALL derive `sourceSection`, `sourceId`, and `sourceCanonicalUrl` from that live report item and SHALL NOT accept a URL input.

When validation passes, the workflow SHALL append one sorted `.github/content-sync/ignore.json` record using `assertIgnoreAppendAllowed` with `reasonCode` `other`, reason `Ignored by owner from Global-only content report.`, `addedBy` equal to the GitHub actor, and a UTC timestamp. It SHALL create a branch, commit, and normal PR for human review and SHALL NOT merge the PR automatically.

#### Scenario: Bare source ID is submitted

- **GIVEN** manual workflow input `cnt_000177`
- **WHEN** the workflow validates input
- **THEN** it SHALL fail before selecting a report item

#### Scenario: Live report item is already Ignored

- **GIVEN** a composite identity that exists in the live dry-run report
- **AND** the item status is `Ignored`
- **WHEN** the workflow validates the selected item
- **THEN** it SHALL fail without modifying the ignore manifest

#### Scenario: Valid Untracked item is submitted

- **GIVEN** a composite identity that exists exactly once in the live dry-run report
- **AND** the item status is `Untracked`
- **WHEN** the workflow appends the ignore decision
- **THEN** the new ignore record SHALL use the source URL from the live report
- **AND** the workflow SHALL open a normal Ignore PR for human merge

### Requirement: No interactive Ignore actions

The report SHALL remain informational only. It SHALL NOT expose interactive Ignore buttons, n8n actions, mutation endpoints, or any other inline suppression control.

#### Scenario: Operator receives the report

- **GIVEN** a delivered Slack report payload
- **WHEN** an operator inspects the message
- **THEN** the message SHALL contain no Ignore button or other interactive suppression action
- **AND** ignore handling SHALL remain outside this report workflow
