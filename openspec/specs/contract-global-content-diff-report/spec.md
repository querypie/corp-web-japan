# Global Content Diff Report Contract

## Purpose

Define the standalone production contract for reporting every production-published QueryPie Global item that is not verifiably present in `corp-web-japan`.

## Current implementation references

- `.github/workflows/global-content-diff-report.yml`
- `.github/workflows/ignore-global-content-diff.yml`
- `scripts/global-content-diff-report/**`
- `tests/global-content-diff-report/**`
- `.github/content-sync/baseline.json`
- `.github/content-sync/ignore.json`

## Requirements

### Requirement: Production-only Global inventory

The report SHALL build its Global inventory only from source families exported by `scripts/global-content-diff-report/source-family-map.mjs`. A record SHALL be included only when current production list evidence contains its normalized canonical URL and sitemap evidence also exists when required for that family.

#### Scenario: Published record is included

- **GIVEN** a supported Global source record
- **AND** its canonical URL has the required live production evidence
- **WHEN** the report builds its inventory
- **THEN** the record SHALL be included

#### Scenario: Unsupported or unpublished record is excluded

- **GIVEN** an unsupported source or a record without the required production evidence
- **WHEN** the report builds its inventory
- **THEN** the record SHALL NOT be included

### Requirement: Composite identity

The report SHALL use `${sourceSection}:${sourceId}` as the canonical identity. Equal numeric IDs in different source sections SHALL remain distinct.

#### Scenario: Cross-section collision stays distinct

- **GIVEN** `documentation:cnt_000001` and `news:cnt_000001`
- **WHEN** identities are computed
- **THEN** they SHALL remain two records

### Requirement: Baseline-only Japan-present mappings

A Global identity SHALL count as Japan-present only when `.github/content-sync/baseline.json` contains a valid mapping and the exact mapped MDX file exists under the supported `src/content/<targetFamily>/` root. Missing mapped files SHALL remain mapping-drift evidence and SHALL NOT count as present. No pull-request state or marker SHALL contribute a mapping.

#### Scenario: Existing baseline target counts as present

- **GIVEN** a valid baseline record
- **AND** its exact target MDX file exists
- **WHEN** the Japan inventory is built
- **THEN** that identity SHALL count as present

#### Scenario: Missing baseline target becomes mapping drift

- **GIVEN** a valid baseline record
- **AND** its exact target MDX file is missing
- **WHEN** the Japan inventory is built
- **THEN** the identity SHALL NOT count as present
- **AND** the expected path SHALL appear in mapping-drift evidence

### Requirement: Complete difference results

The report SHALL compute `Global-only = production-published Global identities - verified Japan-present identities`. A current ignore record SHALL set status `Ignored`; every other Global-only item SHALL use `Untracked`. Ignore records SHALL annotate rather than suppress items.

#### Scenario: Ignored item remains visible

- **GIVEN** a Global-only identity with an active ignore record
- **WHEN** the diff is computed
- **THEN** the item SHALL be included with status `Ignored`

### Requirement: Auditable links

Every item SHALL show a plain-text title, an explicitly labeled production-evidenced HTTPS original link, and a GitHub source-folder link pinned to the reported 40-character Global SHA. Source paths SHALL remain confined to `corp-web-v2/src/content/**`.

#### Scenario: Operator inspects an item

- **GIVEN** a report item
- **WHEN** Slack payloads are built
- **THEN** its original and pinned source links SHALL be present
- **AND** invalid SHAs, non-HTTPS URLs, or out-of-root paths SHALL stop delivery

### Requirement: Deterministic grouping and pagination

Items SHALL be deterministic. Slack SHALL group `Untracked` before `Ignored`, then use target-family order, newest date first, and composite identity. Multipart payloads SHALL show `Part N of M`; status titles SHALL use text only.

#### Scenario: Multipart output is stable

- **GIVEN** enough items for multiple payloads
- **WHEN** payloads are generated
- **THEN** no identity SHALL be omitted or duplicated
- **AND** each payload SHALL show its part number

### Requirement: Read-only standalone report workflow

The report workflow SHALL use GitHub-hosted execution and repository read permission only. It SHALL NOT create or mutate branches, commits, issues, pull requests, or ignore decisions.

#### Scenario: Report workflow runs

- **GIVEN** a scheduled or manual report run
- **WHEN** the job starts
- **THEN** it SHALL request `contents: read`
- **AND** it SHALL perform no repository mutation

### Requirement: Weekday schedule and manual execution

The report workflow SHALL define cron `0 1 * * 1-5` and `workflow_dispatch`.

#### Scenario: Maintainer inspects triggers

- **WHEN** the workflow is inspected
- **THEN** both triggers SHALL be present

### Requirement: Zero state and fail-closed behavior

A zero-difference run SHALL send a compact success payload. Unsafe inventory, mapping, payload, or delivery failures SHALL fail closed; already delivered parts remain visible and SHALL remain visibly incomplete through `Part N of M`. The workflow SHALL attempt a compact failure notification.

#### Scenario: Delivery fails

- **GIVEN** report delivery cannot complete
- **WHEN** failure handling runs
- **THEN** a partial report SHALL NOT be represented as complete
- **AND** a compact failure notification SHALL be attempted

### Requirement: Direct manual Ignore PR workflow

Slack SHALL label each key `Composite identity` and link to `.github/workflows/ignore-global-content-diff.yml`. The manual workflow SHALL accept exactly `^(documentation|news):cnt_\d+$`, reject bare IDs, run the standalone CLI in `--dry-run` mode, select exactly one live `Untracked` item, and derive its canonical and evidence URLs rather than accepting a URL input.

The workflow SHALL append one sorted `.github/content-sync/ignore.json` record with reason code `other`, actor, and UTC timestamp. It SHALL create branches under the identity-specific prefix `global-content-diff-ignore/${sourceSection}-${sourceId}` with a unique `${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}` suffix. It SHALL place an exact trusted `global-content-diff-ignore:v1` marker containing the composite identity in the PR body.

The workflow SHALL completely enumerate every open pull request with the paginated GitHub REST API. A reusable PR SHALL have a head repository equal to `GITHUB_REPOSITORY` after case normalization, the identity-specific branch prefix in either the legacy exact-prefix format or the unique run-suffixed format, and the exact trusted marker. Title SHALL NOT participate in identity matching. Fork PRs, unsupported branch formats, missing or incorrect markers, and malformed PR records SHALL NOT be reused; malformed pagination envelopes SHALL fail closed. Zero reusable open PRs SHALL create one normal PR for human review on the unique current-run branch. Exactly one reusable open PR SHALL be reused only after live `Untracked` validation succeeds. Two or more reusable open PRs SHALL fail closed. The workflow SHALL NOT merge automatically.

#### Scenario: Valid Untracked identity has no matching open PR

- **GIVEN** one exact live `Untracked` report item
- **AND** zero reusable open PRs match its same-repository branch prefix and exact trusted marker
- **WHEN** the workflow runs
- **THEN** it SHALL append the decision
- **AND** open one normal human-reviewed PR containing the exact trusted marker and production evidence URL
- **AND** the PR branch SHALL end with the current GitHub run ID and run attempt

#### Scenario: Valid Untracked identity has one matching open PR

- **GIVEN** exactly one same-repository open PR contains the exact trusted marker and composite identity
- **AND** the identity still resolves to exactly one live `Untracked` report item
- **WHEN** the workflow runs
- **THEN** it SHALL reuse that PR
- **AND** SHALL NOT append another decision, create another PR, or merge the existing PR

#### Scenario: Identity has multiple matching open PRs

- **GIVEN** two or more same-repository open PRs contain the exact trusted marker and composite identity
- **WHEN** the workflow runs
- **THEN** it SHALL fail closed after live validation
- **AND** SHALL NOT change the manifest, create a PR, or merge any PR

#### Scenario: Invalid or stale identity is submitted

- **GIVEN** a bare ID, missing item, duplicate item, or item not marked `Untracked`
- **WHEN** validation runs
- **THEN** the workflow SHALL fail without changing the manifest

#### Scenario: Matching PR lacks the trusted marker

- **GIVEN** an open PR has a similar title or branch but lacks the exact `global-content-diff-ignore:v1` marker containing the composite identity
- **WHEN** matching runs
- **THEN** that PR SHALL NOT be reused

#### Scenario: Candidate PR is not reusable

- **GIVEN** an open PR comes from a fork, uses another identity or an unsupported branch format, or has malformed PR data
- **WHEN** matching runs
- **THEN** that PR SHALL NOT count as reusable

#### Scenario: Reusable PR title was edited

- **GIVEN** an open same-repository PR uses the identity-specific legacy or run-suffixed branch format and contains the exact trusted marker
- **AND** its title was edited
- **WHEN** matching runs
- **THEN** the PR SHALL remain reusable

### Requirement: No interactive Ignore actions

The Slack report SHALL expose no Ignore button, n8n action, mutation endpoint, or automatic merge.

#### Scenario: Operator receives the report

- **WHEN** the message is inspected
- **THEN** ignore handling SHALL remain in the separate manual GitHub Actions workflow
