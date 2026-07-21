# Global Documentation Sync Contract

## Purpose

Define the production contract for discovering one eligible QueryPie Global Documentation or News record, generating and validating one Japan publication, opening one Draft pull request, and recording an explicit owner ignore decision.

## Requirements

### Requirement: Exact supported source-family map

The automation SHALL support only the exact source-family descriptors exported by `scripts/global-documentation-sync/source-family-map.mjs`.

| Source section | Source category | Production list URL | Target family | Target route |
| --- | --- | --- | --- | --- |
| documentation | blogs | `https://www.querypie.com/en/documentation` | `blog` | `/blog` |
| documentation | white-papers | `https://www.querypie.com/en/documentation` | `whitepapers` | `/whitepapers` |
| documentation | voc | `https://www.querypie.com/en/documentation` | `use-cases` | `/use-cases` |
| documentation | manuals | `https://www.querypie.com/en/documentation` | `manuals` | `/manuals` |
| documentation | events | `https://www.querypie.com/en/documentation` | `events` | `/events` |
| documentation | glossary | `https://www.querypie.com/en/documentation` | `glossary` | `/glossary` |
| documentation | introduction | `https://www.querypie.com/en/documentation` | `introduction-deck` | `/introduction-deck` |
| news | news | `https://www.querypie.com/en/news` | `news` | `/news` |

News SHALL be treated as a separate `/en/news` source section, not a Documentation category.

#### Scenario: Descriptor map is loaded

- **WHEN** the runner resolves source-family support
- **THEN** it SHALL use only the accepted descriptor map above
- **AND** it SHALL route News through the dedicated `news` target family

### Requirement: Production source eligibility

The automation SHALL use the checked-out `corp-web-v2` repository as the content and asset source of truth. Content-family records SHALL be eligible only when their exact normalized canonical URL is present in both the production sitemap and the family production list. News outlink records SHALL use `/en/news` list evidence only and SHALL record `production.sitemap` as `false`. Source-owned assets SHALL resolve through real paths inside the Global repository's `public/**` tree. The automation SHALL NOT download publication assets from production HTTP endpoints.

#### Scenario: Canonical source is eligible

- **GIVEN** a published Global record whose exact canonical URL appears in both required production surfaces
- **AND** every declared local asset resolves inside Global `public/**`
- **WHEN** discovery runs
- **THEN** the record MAY become a candidate

#### Scenario: Production evidence disagrees

- **GIVEN** a record missing from either required production surface
- **WHEN** discovery runs
- **THEN** the automation SHALL NOT publish it

#### Scenario: News outlink has list evidence only

- **GIVEN** a News record with `contentType: outlink`
- **AND** its exact canonical URL appears in `/en/news`
- **WHEN** discovery runs
- **THEN** the automation MAY accept it without sitemap evidence
- **AND** it SHALL record `production.sitemap` as `false`

### Requirement: Stable composite identity and suppression

The automation SHALL use the composite identity `${sourceSection}:${sourceId}` as the primary identity for baseline, ignore, pull-request, and branch deduplication. This supersedes the legacy `sourceId`-only rule because Global currently has real cross-section collisions such as `documentation/manuals/cnt_000001` and `news/cnt_000001`. New markers, baseline rows, ignore rows, and branch names SHALL include `sourceSection`. Legacy baseline or ignore rows MAY omit `sourceSection` only when the runner can infer one unique section safely; ambiguous legacy identities and markerless sync branches SHALL block. Canonical URLs SHALL remain audit snapshots and URL-drift evidence, not primary keys. One run SHALL select no more than one candidate and SHALL create no more than one Draft pull request.

#### Scenario: Source is already represented

- **GIVEN** a composite source identity present in baseline, a valid ignore decision, a sync pull-request marker, or an active deterministic sync branch
- **WHEN** discovery runs
- **THEN** that same composite identity SHALL be suppressed
- **AND** a different `sourceSection` with the same `sourceId` SHALL remain eligible

#### Scenario: Ignore URL drifts

- **GIVEN** an ignore decision whose recorded canonical URL differs from the current canonical URL for the same composite source identity
- **WHEN** discovery runs
- **THEN** the automation SHALL block for owner review instead of silently ignoring the source

### Requirement: Isolated AI generation and review

Pi writer and reviewer processes SHALL run fresh with `--no-tools`. Pi SHALL return structured output only; deterministic Node processes SHALL own filesystem and Git mutation. Fidelity, Japanese editorial, and publication-contract reviews SHALL be independent. A correction loop SHALL stop after five attempts and fail closed when actionable findings remain.

#### Scenario: Review findings remain unresolved

- **GIVEN** a candidate with a critical, major, or minor actionable finding after the fifth correction attempt
- **WHEN** the review cycle ends
- **THEN** no commit, push, or pull request SHALL be created
- **AND** failure artifacts SHALL record the unresolved findings

### Requirement: News publication contract

Synced News output SHALL remain one-way from Global to Japan. News publications SHALL NOT contain author frontmatter. News `resolvedSourceLabel` SHALL resolve deterministically to `公式発表` for `content` records and `メディア掲載` for `outlink` records, and generated News frontmatter `sourceLabel` SHALL equal that value exactly. News `resolvedRedirectUrl` SHALL equal the normalized external HTTPS URL for outlink records, and generated News frontmatter `redirectUrl` SHALL equal that value exactly for outlink records and SHALL be omitted for content records.

#### Scenario: News content record is generated

- **GIVEN** a News source record with `contentType: content`
- **WHEN** the writer produces Japan MDX
- **THEN** the output SHALL omit `author`
- **AND** SHALL set `sourceLabel` to `公式発表`
- **AND** SHALL omit `redirectUrl`

#### Scenario: News outlink record is generated

- **GIVEN** a News source record with `contentType: outlink`
- **WHEN** the writer produces Japan MDX
- **THEN** the output SHALL omit `author`
- **AND** SHALL set `sourceLabel` to `メディア掲載`
- **AND** SHALL set `redirectUrl` exactly to the normalized external HTTPS URL

### Requirement: Publication validation gate

Before a Draft pull request is created, the automation SHALL validate the generated publication contract, source-allocated assets, `npm run test:ci`, `next build`, and browser QA at desktop and mobile viewports. Git staging SHALL contain exactly the allocated MDX and asset paths.

#### Scenario: Every gate passes

- **GIVEN** a generated candidate with no actionable review findings
- **WHEN** contract validation, full CI, build, and both browser viewports pass
- **THEN** the automation SHALL create one commit on `content-sync/{sourceSection}-{sourceId}`
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

The owner SHALL initiate ignore handling through the `Ignore Global publication sync PR` workflow using the generated sync pull-request number. The workflow SHALL validate the open Draft PR and machine marker, update the sorted ignore manifest on `content-sync-ignore/{sourceSection}-{sourceId}`, open an ignore pull request, and enable squash auto-merge. It SHALL NOT push directly to protected `main`.

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
- **AND** only the cross-checked matching sync branch (`content-sync/{sourceSection}-{sourceId}` for new runs, or the retained legacy `content-sync/{sourceId}` branch when a legacy PR marker proves the same identity) SHALL be deleted

### Requirement: Production schedule and concurrency

The production host SHALL use timezone `Asia/Seoul`. The systemd timer SHALL run daily at 10:00 KST with a randomized delay of no more than ten minutes and persistent catch-up behavior. `flock` SHALL prevent overlapping runs.

#### Scenario: Daily timer fires

- **GIVEN** the timer is enabled and active
- **WHEN** the daily 10:00 KST schedule plus randomized delay is reached
- **THEN** exactly one service execution SHALL acquire the automation lock

### Requirement: Durable sanitized production evidence ledger

When `EVIDENCE_ISSUE_NUMBER` is configured together with `DURABLE_EVIDENCE_REQUIRED=1`, every terminal production outcome (`draft_pr_created`, `no_candidate`, or `failed`) SHALL publish one sanitized durable evidence comment to the public `querypie/corp-web-japan` issue `#688`. If the run has a Draft PR, the automation SHALL also publish the same sanitized evidence comment to that PR.

The durable evidence comment SHALL stay at or under 60 KB and SHALL include a machine marker, run ID, source ID when known, terminal status, pull-request URL when present, the deployed target Git commit, short-timeout Tencent host metadata, final fidelity/Japanese/contract review JSON details, validation command names and exit codes, browser viewport/status/findings, and a SHA-256 plus size manifest for every file in the run report directory.

The durable evidence comment SHALL exclude embedded raw report bodies such as `raw-*`, generated/candidate body drafts, credentials, and webhooks while still applying the existing secret redaction rules and still listing those files in the manifest.

Durable evidence publishing is the Spot recovery boundary. Local raw reports SHALL remain on the host for up to seven days only and SHALL NOT be treated as durable storage. If durable evidence publishing fails, the production service SHALL fail closed and SHALL NOT delete or merge any Draft PR. Retrying the same retained run SHALL be idempotent by checking for the durable marker before posting a new comment.

#### Scenario: Spot run publishes public sanitized ledger

- **GIVEN** a production run reaches any terminal state
- **AND** durable evidence publishing is required
- **WHEN** the terminal gate completes
- **THEN** issue `#688` SHALL receive one sanitized ledger comment
- **AND** any existing Draft PR for that run SHALL receive the same sanitized comment
- **AND** the comment SHALL stay within the size limit and omit embedded raw secrets

#### Scenario: Durable evidence publish fails after Draft PR creation

- **GIVEN** a run has already pushed a branch and opened a Draft PR
- **AND** durable evidence publishing is required
- **WHEN** comment publication fails
- **THEN** the service SHALL exit failed
- **AND** the existing Draft PR and branch SHALL remain untouched
- **AND** rerunning the same retained run SHALL reuse the durable marker to avoid duplicate comments

## Operational retention

Failed automation worktrees older than seven days are eligible for automation-owned cleanup. Run reports SHALL remain under `REPORTS_ROOT/<run-id>/` for diagnosis and SHALL be removed by the production host's `systemd-tmpfiles` `mM:7d` policy seven days after their last modification. Reading a report SHALL NOT extend retention. The Node runner SHALL NOT delete report directories. Durable storage MUST be configured separately when evidence must survive Spot VM reclamation.
