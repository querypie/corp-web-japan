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


### Requirement: Diagnostic-only Possible Japan matches

The report SHALL attach `possibleJapanMatches` only as diagnostic evidence for Global-only items. Candidate evidence SHALL NOT change baseline authority, Japan-present membership, `globalPublished`, `japanPresent`, `globalOnly`, family counts, or the two allowed item statuses `Untracked` and `Ignored`. A zero-candidate result SHALL mean only that no deterministic candidate was found; it SHALL NOT be represented as proof that Japan content is absent.

#### Scenario: Candidate evidence does not change authority

- **GIVEN** a production-published Global item with no valid baseline target
- **AND** the candidate scanner finds one or more possible Japan MDX matches
- **WHEN** the report computes the diff
- **THEN** the item SHALL remain Global-only
- **AND** its status SHALL remain either `Untracked` or `Ignored` according to Ignore records only
- **AND** report counts SHALL remain identical to the baseline-only diff result

#### Scenario: Zero candidates are not absence proof

- **GIVEN** a live `Untracked` item has an empty `possibleJapanMatches` array
- **WHEN** an operator reviews the item
- **THEN** the report SHALL NOT claim that no Japan content exists
- **AND** intentional exclusion SHALL still require owner review before Direct Ignore

### Requirement: Exact candidate signals preserve source identity

Possible Japan matches SHALL scan only raw Japan MDX files in the mapped target family and SHALL be produced only from these exact, auditable signals:

- `exact-slug`: the Global `meta.id` field SHALL equal the Japan frontmatter `slug` field exactly, and both SHALL satisfy the safe kebab-slug contract.
- `exact-source-url`: a normalized Global canonical or external source URL SHALL equal an absolute HTTPS URL found in the raw Japan MDX source.
- `exact-original-title-and-date`: the normalized original Global English title SHALL occur in the normalized raw Japan MDX source, and the Global ISO date SHALL equal the Japan frontmatter ISO date after conversion to `YYYY-MM-DD`.

Candidate text normalization SHALL perform Unicode NFC normalization, trim leading and trailing whitespace, and collapse whitespace runs to one ASCII space, with no punctuation removal, case folding, partial matching, transliteration, token similarity, or semantic scoring. Candidate URL extraction SHALL preserve quoted `href`/`src` HTTPS values, Markdown and autolink HTTPS destinations, and bare HTTPS tokens with legal internal comma and balanced parentheses intact; only syntax delimiters, unmatched closing delimiters, and trailing prose punctuation around unquoted tokens MAY be trimmed, and HTML `&amp;` in extracted URLs SHALL be decoded before URL normalization. Candidate URL normalization SHALL accept HTTPS only, remove fragments, lowercase the hostname, normalize a trailing slash away except at the root, sort query entries by key then value, remove only the explicit tracking allowlist (`utm_*`, `guccounter`, `guce_referrer`, `guce_referrer_sig`), and preserve all other query parameters, including identity-bearing query parameters such as `no=169`.

Each candidate evidence object SHALL contain the Japan target path, numeric target ID, target slug, and a sorted non-empty list of matched signal names. Every matching candidate SHALL be preserved and sorted by target path; multiple candidates, including repeated slugs across distinct valid target records, SHALL remain diagnostic and the scanner SHALL NOT select a winner. A scanner I/O error, malformed frontmatter or target record, unsafe target path, duplicate `targetFamily:targetId`, or duplicate target path SHALL fail closed before delivery.

The report SHALL render Slack evidence using the label `Possible Japan match` with escaped candidate paths and signal names. It SHALL show at most three candidates per item and, when more exist, SHALL show the exact omitted count without selecting a winner.

#### Scenario: Identity-bearing query is preserved

- **GIVEN** a Global source URL includes a query parameter that identifies the article
- **AND** a Japan MDX source contains a similar URL with a different identity-bearing query value
- **WHEN** candidate matching evaluates `exact-source-url`
- **THEN** those URLs SHALL NOT match
- **AND** only allowlisted tracking parameters MAY be removed

#### Scenario: Exact title and date match raw MDX

- **GIVEN** a Global item's normalized original English title occurs in normalized raw Japan MDX
- **AND** its ISO date equals that file's frontmatter date at `YYYY-MM-DD` precision
- **WHEN** candidate matching evaluates `exact-original-title-and-date`
- **THEN** that Japan target SHALL be retained as candidate evidence

#### Scenario: Multiple candidates remain visible

- **GIVEN** multiple valid Japan targets match one or more exact signals
- **WHEN** candidate evidence is built
- **THEN** every candidate SHALL be preserved in target-path order
- **AND** each candidate SHALL contain target path, target ID, target slug, and sorted signal names
- **AND** no candidate SHALL be selected automatically

#### Scenario: Candidate scan fails closed

- **GIVEN** Japan candidate input has an I/O failure, malformed record, unsafe path, duplicate family-and-ID identity, or duplicate path
- **WHEN** the candidate index is built or validated
- **THEN** report generation SHALL fail before Slack delivery

#### Scenario: Slack shows bounded candidate evidence

- **GIVEN** a Global-only item has more than three possible Japan matches
- **WHEN** Slack payloads are built
- **THEN** the item SHALL include `Possible Japan match` evidence
- **AND** the evidence SHALL include no more than three escaped target paths and exact signal names
- **AND** the exact omitted count SHALL be shown without selecting a winner

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

Slack SHALL label each key `Composite identity` but SHALL NOT embed Direct Ignore workflow instructions; `.github/content-sync/README.md` owns the operator procedure. The manual workflow SHALL accept exactly `^(documentation|news):cnt_\d+$`, reject bare IDs, run the standalone CLI in `--dry-run` mode, select exactly one live `Untracked` item, and derive its canonical and evidence URLs rather than accepting a URL input.

Direct Ignore SHALL be used only for an owner-approved intentional exclusion from Japan publication. An `Untracked` item selected or potentially intended for publication SHALL NOT be added to `.github/content-sync/ignore.json`; it follows the separate AI/Codex normal content PR plus baseline mapping path.

Direct Ignore SHALL use the shared `assessIgnoreEligibility` decision function before mutation. It SHALL deny identities with mapping drift or any `possibleJapanMatches`; it SHALL fail closed on malformed candidate evidence, missing or duplicate live items, non-`Untracked` status, or an active base Ignore row. No force, candidate-skip, batch, or manual bypass input SHALL exist.

The workflow SHALL append one sorted `.github/content-sync/ignore.json` record with reason code `other`, actor, and UTC timestamp. It SHALL create branches under the identity-specific prefix `global-content-diff-ignore/${sourceSection}-${sourceId}` with a unique `${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}` suffix. It SHALL place an exact trusted `global-content-diff-ignore:v1` marker containing the composite identity in the PR body.

CI SHALL run the Ignore-manifest validator for a pull request that changes `.github/content-sync/ignore.json` and for every `workflow_dispatch` run, but SHALL NOT run it for a `push` event on `main`. Pull-request validation SHALL read the base Ignore manifest from the pull request base SHA. Dispatched validation on the generated Ignore branch SHALL read it from `origin/main`. The validator job's actual result SHALL be a dependency of the exact `CI result` job. CI permissions SHALL remain `contents: read` and `pull-requests: read`.

The workflow SHALL completely enumerate every open pull request with the paginated GitHub REST API. A reusable PR SHALL have a head repository equal to `GITHUB_REPOSITORY` after case normalization, the identity-specific branch prefix in either the legacy exact-prefix format or the unique run-suffixed format, and the exact trusted marker. Title SHALL NOT participate in identity matching. Fork PRs, unsupported branch formats, missing or incorrect markers, and malformed PR records SHALL NOT be reused; malformed pagination envelopes SHALL fail closed. Zero reusable open PRs SHALL create one normal PR for human review on the unique current-run branch. Exactly one reusable open PR SHALL be reused only after live `Untracked` validation succeeds. Two or more reusable open PRs SHALL fail closed. The workflow SHALL NOT merge automatically. When the workflow creates a PR with `GITHUB_TOKEN`, it SHALL dispatch `ci.yml` on the generated branch so the normal required CI surface can validate the Ignore change.


#### Scenario: Candidate identity is denied before mutation

- **GIVEN** one exact live `Untracked` report item has one or more `possibleJapanMatches`
- **WHEN** Direct Ignore validation runs
- **THEN** `assessIgnoreEligibility` SHALL deny the identity
- **AND** the workflow SHALL NOT change `.github/content-sync/ignore.json`, create a branch, commit, or open a PR
- **AND** remediation SHALL point to a normal baseline/content PR

#### Scenario: Mapping drift identity is denied before mutation

- **GIVEN** one exact live `Untracked` report item also appears in mapping-drift evidence
- **WHEN** Direct Ignore validation runs
- **THEN** `assessIgnoreEligibility` SHALL deny the identity
- **AND** the workflow SHALL NOT append an Ignore row
- **AND** remediation SHALL be to restore or correct the baseline/content mapping in a normal PR

#### Scenario: Hand-edited Ignore PR cannot bypass eligibility

- **GIVEN** a human-edited PR adds or reactivates an active Ignore row
- **WHEN** pull-request CI validates the changed Ignore manifest
- **THEN** the validator SHALL assess the row through `assessIgnoreEligibility` with base Ignore decisions
- **AND** candidate or mapping-drift evidence SHALL deny the PR validation

#### Scenario: Bot-created Ignore PR receives CI

- **GIVEN** Direct Ignore creates a PR branch using `GITHUB_TOKEN`
- **WHEN** the PR is created
- **THEN** the workflow SHALL dispatch `ci.yml` for that generated branch
- **AND** the `workflow_dispatch` run SHALL execute the Ignore-manifest validator rather than skip it
- **AND** the validator SHALL compare against the Ignore manifest from `origin/main`
- **AND** its actual result SHALL contribute to exact `CI result`

#### Scenario: Main push does not validate Ignore additions

- **GIVEN** `ci.yml` runs for a `push` event on `main`
- **WHEN** job conditions are evaluated
- **THEN** the Ignore-manifest validator SHALL be skipped

#### Scenario: Valid Untracked identity has no matching open PR

- **GIVEN** one exact live `Untracked` report item
- **AND** zero reusable open PRs match its same-repository branch prefix and exact trusted marker
- **WHEN** the workflow runs
- **THEN** it SHALL append the decision
- **AND** open one normal human-reviewed PR containing the exact trusted marker and production evidence URL
- **AND** the PR branch SHALL end with the current GitHub run ID and run attempt

#### Scenario: Publishable Untracked identity is not ignored

- **GIVEN** one exact live `Untracked` report item
- **AND** an operator selects it for Japan publication or it may be intended for Japan publication
- **WHEN** the operator chooses the handling path
- **THEN** the item SHALL NOT be dispatched through Direct Ignore
- **AND** the item SHALL NOT be added to `.github/content-sync/ignore.json`
- **AND** it SHALL follow the separate AI/Codex normal content PR plus baseline mapping path

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


### Requirement: Report tooling does not produce content

The report tooling SHALL NOT translate Global content, author Japan MDX, generate or stage assets, stage or commit content changes, open Draft PRs, or open normal content PRs. Selecting an `Untracked` item for publication SHALL be a separate human/AI-assisted authoring process in `corp-web-japan` that uses the repository publication skills, creates a normal human-reviewed content PR, and includes the exact `.github/content-sync/baseline.json` mapping in that same PR.

#### Scenario: Operator selects an Untracked item for publication

- **GIVEN** an `Untracked` Global-only item in the report
- **WHEN** an operator decides to publish it in Japan
- **THEN** the report tooling SHALL NOT translate, author, stage, commit, or open a Draft/content PR
- **AND** the operator SHALL use a separate human/AI-assisted publication workflow to create reviewed MDX and assets
- **AND** the normal content PR SHALL include the exact baseline mapping that makes the item Japan-present after merge

### Requirement: No interactive Ignore actions

The Slack report SHALL expose no Ignore button, n8n action, mutation endpoint, or automatic merge.

#### Scenario: Operator receives the report

- **WHEN** the message is inspected
- **THEN** ignore handling SHALL remain in the separate manual GitHub Actions workflow
