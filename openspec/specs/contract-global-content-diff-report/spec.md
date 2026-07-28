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

The report SHALL compute `Global-only = production-published Global identities - verified Japan-present identities`. Ignore records, open Draft sync PRs, and closed-unmerged Draft sync PRs SHALL remain reportable informational states and SHALL NOT suppress a diff item.

#### Scenario: Ignored item still appears

- **GIVEN** a production-published Global identity with an active ignore record
- **AND** that identity is not verifiably Japan-present
- **WHEN** the diff is computed
- **THEN** the report SHALL include the item
- **AND** it SHALL mark the status as `Ignored`

#### Scenario: Draft-only item still appears

- **GIVEN** a production-published Global identity represented only by an open or closed-unmerged Draft sync PR
- **AND** that identity is not verifiably Japan-present
- **WHEN** the diff is computed
- **THEN** the report SHALL include the item
- **AND** it SHALL mark the status as `Draft open` or `Draft closed`

### Requirement: Original Global URL links

Every reported diff item SHALL retain the original normalized Global HTTPS URL and Slack output SHALL link the item title to that original URL.

#### Scenario: Slack item links to original Global URL

- **GIVEN** a diff item in the final report
- **WHEN** Slack payloads are built
- **THEN** the item title SHALL link to the original Global HTTPS URL
- **AND** the report SHALL fail rather than emitting a non-HTTPS source URL

### Requirement: Deterministic grouping and pagination

Diff items SHALL be sorted deterministically by target family, newest date first within the family, then composite identity. Slack output SHALL group items by target family, use text-only category titles, and paginate deterministically with explicit `Part N of M` labels when one payload is insufficient.

#### Scenario: Stable grouped multi-payload output

- **GIVEN** enough diff items to exceed one Slack payload
- **WHEN** Slack payloads are built
- **THEN** the payload sequence SHALL be deterministic
- **AND** each payload SHALL show its `Part N of M` label
- **AND** each family container title SHALL use text only

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

A zero-difference run SHALL send a compact success payload. The report SHALL fail closed when required checkouts, production evidence, mapping resolution, payload generation, or Slack delivery cannot be completed safely, and it SHALL send a compact failure notification instead of presenting a partial report as complete.

#### Scenario: No differences remain

- **GIVEN** zero Global-only items after diff computation
- **WHEN** Slack payloads are built
- **THEN** the workflow SHALL send a compact zero-state success payload

#### Scenario: Delivery path fails

- **GIVEN** the report cannot safely complete payload generation or Slack delivery
- **WHEN** the workflow handles the failure
- **THEN** it SHALL fail closed
- **AND** it SHALL send only a compact failure notification
- **AND** it SHALL NOT present a partial diff as complete output

### Requirement: No interactive Ignore actions

The report SHALL remain informational only. It SHALL NOT expose interactive Ignore buttons, n8n actions, mutation endpoints, or any other inline suppression control.

#### Scenario: Operator receives the report

- **GIVEN** a delivered Slack report payload
- **WHEN** an operator inspects the message
- **THEN** the message SHALL contain no Ignore button or other interactive suppression action
- **AND** ignore handling SHALL remain outside this report workflow
