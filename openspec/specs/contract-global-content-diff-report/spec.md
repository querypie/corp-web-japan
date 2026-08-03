# Global Content Diff Report Contract

## Purpose

Define the standalone production contract for reporting every production-published QueryPie Global item that is not verifiably present in `corp-web-japan`.

## Current implementation references

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

- **GIVEN** a supported source record without the required production evidence
- **WHEN** the report builds its inventory
- **THEN** the record SHALL NOT be included

### Requirement: Latest menu and data families fail closed

Every operation SHALL compare latest Global public content menu categories, managed Global `src/content` roots, Japan public menu paths, Japan target content roots, and `SOURCE_FAMILIES` before report generation. Every actual category directory under managed Global `src/content/demo` and `src/content/documentation` roots SHALL have an explicit descriptor. Demo descriptors SHALL map `use-cases` to `src/content/use-cases`, `acp-features` to `src/content/demo/acp`, and `aip-features` to `src/content/demo/aip`. A descriptor MAY mark a menu family source root optional only while that Global source directory does not exist.

#### Scenario: Latest Global code adds a content root

- **GIVEN** latest Global `main` contains a category directory under a managed content root
- **AND** no `SOURCE_FAMILIES` descriptor owns that directory
- **WHEN** preflight runs
- **THEN** it SHALL fail with the unmapped source root
- **AND** report generation and Slack delivery SHALL stop

#### Scenario: Optional empty menu family remains explicit

- **GIVEN** the Global menu defines AIP Features
- **AND** `src/content/demo/aip-features` does not yet exist
- **WHEN** source-root preflight runs
- **THEN** the explicit optional descriptor SHALL preserve menu parity without inventing inventory
- **AND** creation of that directory SHALL automatically make its production-evidenced records eligible

#### Scenario: Nested Japan demo target is valid

- **GIVEN** a demo descriptor maps to `demo/acp` or `demo/aip`
- **AND** an exact mapped MDX exists below `src/content/<targetFamily>`
- **WHEN** baseline authority is validated
- **THEN** the nested target path SHALL be accepted without weakening path confinement

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
- **AND** intentional exclusion SHALL still require owner review before an Ignore PR

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

### Requirement: Local-only execution and explicit delivery

Global reconciliation and report delivery SHALL run only through the repo-local `.agents/skills/global-content-operations/SKILL.md`. No scheduled or manually dispatched Global report GitHub Actions workflow SHALL exist. The skill SHALL fetch both latest `main` snapshots, update and validate tracking manifests, then build a final local preview.

A one-time local initializer SHALL read the Slack bot token and test/production channel IDs from the documented 1Password item and store them in the main checkout’s gitignored `.env.local` for reuse across worktrees. Later sends SHALL use `chat.postMessage` without repeated 1Password requests, store returned message references in a gitignored local history, and support deletion of the latest destination-specific send through `chat.delete`. Credentials SHALL never be printed or committed. Every delivery SHALL send the exact final payload to test first. Production SHALL require separate explicit user approval of that test draft, latest-main revalidation, and byte-identical payload; any change SHALL require a new test draft.

#### Scenario: Operator runs local reconciliation

- **GIVEN** the operator invokes `global-content-operations`
- **WHEN** reconciliation completes
- **THEN** the skill SHALL show the AI review, tracking changes, final counts, and exact Block Kit preview
- **AND** the preview SHALL use `Global Content Review` and one default-collapsed card builder for Match pending, Matched today, Needs review, and Ignored items
- **AND** every card SHALL contain the same title, family/date/identity, result, status, and site-link fields
- **AND** Match pending SHALL mean AI-equivalent but not merged, while Matched SHALL require latest-main baseline validation
- **AND** final payload construction SHALL reject pending items so Slack receives no unmerged match
- **AND** it SHALL deliver a test draft first and wait for separate explicit approval before production delivery

### Requirement: Zero state and fail-closed behavior

A zero-difference run SHALL build a compact success payload. Unsafe inventory, mapping, payload, or delivery failures SHALL fail closed; already delivered multipart sections remain visible and SHALL remain visibly incomplete through `Part N of M`.

#### Scenario: Delivery fails

- **GIVEN** an explicitly approved local delivery cannot complete
- **WHEN** delivery fails
- **THEN** a partial report SHALL NOT be represented as complete
- **AND** the local operation SHALL report the failure without retrying another destination

### Requirement: Skill-driven Ignore PR preparation

Ignore handling SHALL be initiated only through the repo-local `.agents/skills/global-content-ignore/SKILL.md`, not GitHub Actions automation or Ignore-specific CI. The skill SHALL use a fresh read-only report, require full Composite identities, select only current `Untracked` items, and create at most one normal human-reviewed PR. It SHALL NOT auto-merge.

The skill SHALL fail closed when a selected item has mapping drift or any `possibleJapanMatches`; those identities require a reviewed baseline/content reconciliation PR. Date-based bulk requests SHALL resolve in Asia/Tokyo, list explicit exclusions, and use no saved Slack snapshot as authority.

#### Scenario: Agent prepares intentional exclusions

- **GIVEN** an owner supplies exact or date-based Global-only exclusions
- **WHEN** the skill resolves a fresh report
- **THEN** it SHALL list the selected and excluded Composite identities before mutation
- **AND** it SHALL add only validated selected `Untracked` identities to `.github/content-sync/ignore.json`
- **AND** it SHALL open a normal human-reviewed PR without auto-merge

#### Scenario: Candidate or mapping-drift item is selected

- **GIVEN** a selected Global-only item has candidate evidence or mapping drift
- **WHEN** the skill evaluates Ignore eligibility
- **THEN** it SHALL not modify `ignore.json` for that item
- **AND** it SHALL direct the operator to baseline/content reconciliation

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
- **THEN** Ignore handling SHALL remain a repo-local skill and normal PR workflow
