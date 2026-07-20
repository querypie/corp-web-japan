# Global Documentation Sync Contract

## Purpose

Define the production contract for discovering one eligible QueryPie Global Documentation record, generating and validating one Japan publication, opening one Draft pull request, and recording an explicit owner ignore decision.

## Requirements

### Requirement: Production source eligibility

The automation SHALL use the checked-out `corp-web-v2` repository as the content and asset source of truth. A content record SHALL be eligible only when its exact normalized canonical URL is present in both the production sitemap and the Global Documentation list. Source-owned assets SHALL resolve through real paths inside the Global repository's `public/**` tree. The automation SHALL NOT download publication assets from production HTTP endpoints.

#### Scenario: Canonical source is eligible

- **GIVEN** a published Global record whose exact canonical URL appears in both required production surfaces
- **AND** every declared local asset resolves inside Global `public/**`
- **WHEN** discovery runs
- **THEN** the record MAY become a candidate

#### Scenario: Production evidence disagrees

- **GIVEN** a record missing from either required production surface
- **WHEN** discovery runs
- **THEN** the automation SHALL NOT publish it

### Requirement: Stable identity and suppression

The automation SHALL use Global `sourceId` values as the primary identity for baseline, ignore, pull-request, and branch deduplication. Canonical URLs SHALL be audit snapshots and URL-drift evidence, not primary keys. One run SHALL select no more than one candidate and SHALL create no more than one Draft pull request.

#### Scenario: Source is already represented

- **GIVEN** a source ID present in baseline, a valid ignore decision, an existing Japan record, a sync pull-request marker, or an active deterministic sync branch
- **WHEN** discovery runs
- **THEN** the source SHALL be suppressed

#### Scenario: Ignore URL drifts

- **GIVEN** an ignore decision whose recorded canonical URL differs from the current canonical URL for the same source ID
- **WHEN** discovery runs
- **THEN** the automation SHALL block for owner review instead of silently ignoring the source

### Requirement: Isolated AI generation and review

Pi writer and reviewer processes SHALL run fresh with `--no-tools`. Pi SHALL return structured output only; deterministic Node processes SHALL own filesystem and Git mutation. Fidelity, Japanese editorial, and publication-contract reviews SHALL be independent. A correction loop SHALL stop after five attempts and fail closed when actionable findings remain.

#### Scenario: Review findings remain unresolved

- **GIVEN** a candidate with a critical, major, or minor actionable finding after the fifth correction attempt
- **WHEN** the review cycle ends
- **THEN** no commit, push, or pull request SHALL be created
- **AND** failure artifacts SHALL record the unresolved findings

### Requirement: Publication validation gate

Before a Draft pull request is created, the automation SHALL validate the generated publication contract, source-allocated assets, `npm run test:ci`, `next build`, and browser QA at desktop and mobile viewports. Git staging SHALL contain exactly the allocated MDX and asset paths.

#### Scenario: Every gate passes

- **GIVEN** a generated candidate with no actionable review findings
- **WHEN** contract validation, full CI, build, and both browser viewports pass
- **THEN** the automation SHALL create one commit on `content-sync/{sourceId}`
- **AND** SHALL open one Draft pull request
- **AND** SHALL NOT merge or deploy it

#### Scenario: Any gate fails

- **GIVEN** any failed review, validation, build, browser, or Git allocation gate
- **WHEN** the production run exits
- **THEN** the run SHALL fail closed before remote publication mutation

### Requirement: Runtime observability and failure notification

Each production run SHALL atomically maintain `run-status.json` with the run ID, source ID when known, state, stage, update time, and active Pi role, attempt, and PID when applicable. The systemd service SHALL have a one-hour hard timeout. Failure and timeout notifications SHALL mention the configured owner and include the run ID, stage, host, report path, and redacted reason.

#### Scenario: A Pi process is active

- **WHEN** a writer or reviewer process starts
- **THEN** `run-status.json` and the journal SHALL identify its role, attempt, and PID

#### Scenario: The service fails or times out

- **WHEN** the systemd service exits unsuccessfully or exceeds one hour
- **THEN** the failure reporter SHALL send the configured Slack alert
- **AND** SHALL retain redacted failure evidence for diagnosis

### Requirement: Draft pull-request notification

A same-repository Draft pull request on `content-sync/**` SHALL trigger a Slack notification containing the reviewer mention, source identity, title, and pull-request URL. Fork pull requests and unrelated branches SHALL NOT access the Slack webhook.

#### Scenario: Generated Draft PR opens

- **WHEN** a same-repository generated Draft pull request opens or reopens
- **THEN** one Slack notification SHALL be sent

### Requirement: Owner-controlled ignore flow

The owner SHALL initiate ignore handling through the `Ignore Global Documentation sync PR` workflow using the generated sync pull-request number. The workflow SHALL validate the open Draft PR and machine marker, update the sorted ignore manifest on `content-sync-ignore/{sourceId}`, open an ignore pull request, and enable squash auto-merge. It SHALL NOT push directly to protected `main`.

After the ignore pull request merges, the reconciler SHALL validate its ignore marker, close the matching source Draft pull request, and delete its source branch. Reconciliation SHALL be idempotent. Duplicate ignore dispatches SHALL fail closed without creating another decision. Reconciliation SHALL run after successful CI when merge is immediate, after an approval when approval delays auto-merge, and through manual dispatch for recovery.

#### Scenario: Owner ignores a sync PR

- **GIVEN** an open generated Draft pull request with a valid source marker
- **WHEN** the owner dispatches the ignore workflow with its PR number
- **THEN** an ignore pull request SHALL be created with a machine-readable link to the source PR
- **AND** auto-merge SHALL be enabled subject to repository rules

#### Scenario: Ignore decision merges

- **GIVEN** a merged ignore pull request with a valid marker
- **WHEN** the reconciler runs
- **THEN** the matching source Draft pull request SHALL be closed
- **AND** `content-sync/{sourceId}` SHALL be deleted

### Requirement: Production schedule and concurrency

The production host SHALL use timezone `Asia/Seoul`. The systemd timer SHALL run daily at 10:00 KST with a randomized delay of no more than ten minutes and persistent catch-up behavior. `flock` SHALL prevent overlapping runs.

#### Scenario: Daily timer fires

- **GIVEN** the timer is enabled and active
- **WHEN** the daily 10:00 KST schedule plus randomized delay is reached
- **THEN** exactly one service execution SHALL acquire the automation lock

## Operational retention

Failed automation worktrees older than seven days are eligible for automation-owned cleanup. Run reports remain under `REPORTS_ROOT/<run-id>/` for diagnosis; host-level retention or durable storage MUST be configured separately because report-directory rotation is not implemented by the Node runner.
