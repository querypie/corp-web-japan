# Global Documentation to Japan Publication Sync Design

> Historical design record. The accepted production contract is
> [`openspec/specs/contract-global-documentation-sync/spec.md`](../../../openspec/specs/contract-global-documentation-sync/spec.md).
> When this document conflicts with the accepted OpenSpec or current runtime,
> OpenSpec is authoritative.

## Objective

Build a once-daily agent job that detects newly published items across the full
QueryPie Global Documentation collection, adapts them to the corresponding
`corp-web-japan` MDX family, validates the result, and opens one Draft pull
request per item. The job stops after opening the pull request. It never merges,
deploys, or republishes an existing item automatically.

The first delivery is a local quality pilot using
`cnt_000211` (`ai-work-os-enterprise-intelligence`). Automation infrastructure
is added only after the pilot demonstrates acceptable content quality, runtime,
and failure behavior.

## Scope

Source repository:

- `querypie/corp-web-v2`
- Structured content under `src/content/documentation/**/cnt_*/`
- Public site at `https://www.querypie.com/en/documentation`

Target repository:

- `querypie/corp-web-japan`
- MDX publication families under `src/content/**`
- Public site at `https://querypie.ai/resources` and family-specific routes

Supported source-to-target mapping:

| Global category | Japan family | Target root |
| --- | --- | --- |
| `introduction` | Introduction deck | `src/content/introduction-deck` |
| `glossary` | Glossary | `src/content/glossary` |
| `manuals` | Manuals | `src/content/manuals` |
| `white-papers` | Whitepapers | `src/content/whitepapers` |
| `blogs` | Blog | `src/content/blog` |
| `voc` | Use cases | `src/content/use-cases` |
| `events` | Events | `src/content/events` |

## Non-goals

- Automatically merging or deploying generated pull requests
- Updating an already imported Japan publication when the Global source changes
- Replacing Japan-only publications
- Making the Japan `/resources` index mirror Global category placement
- Running translation or Git operations directly inside n8n
- Supporting AWS Lambda
- Building a database, dashboard, API service, or multi-worker queue before
  throughput requires one

## Source-of-truth Rules

Production determines whether an item is public. The Global repository provides
stable identity and structured source material.

A normal content item is eligible only when all of the following are true:

1. Its canonical detail URL appears in the production sitemap.
2. It appears in the rendered Global Documentation list.
3. Its Global `meta.json` has `status: "published"`.
4. Its content type is `content`.
5. The selected locale body exists.

An outlink item is eligible when all of the following are true:

1. It appears in the rendered Global Documentation list.
2. Its Global `meta.json` has `status: "published"`.
3. Its content type is `outlink`.
4. Its `externalUrl` is a valid HTTPS URL.

Outlinks are not required to appear in the sitemap because the Global sitemap
intentionally excludes them. Any other disagreement between production and the
repository fails closed for that item.

Locale selection is deterministic: choose `ja.html` when it exists and is
non-empty; otherwise choose non-empty `en.html`; otherwise mark the item
ineligible. The selected locale is fixed before identity and hash calculation.

## Stable Identity and Provenance

Each candidate uses the Global storage ID as its primary identity. URL, category,
and hash are recorded as provenance rather than used independently as identity.

```json
{
  "sourceRepository": "querypie/corp-web-v2",
  "sourceId": "cnt_000211",
  "sourceCategory": "blogs",
  "sourceSlug": "ai-work-os-enterprise-intelligence",
  "canonicalUrl": "https://www.querypie.com/en/blog/ai-work-os-enterprise-intelligence",
  "sourceLanguage": "ja",
  "sourceHash": "sha256:..."
}
```

The source hash covers normalized `meta.json`, the selected locale HTML, and an
ordered manifest of referenced source assets. It supports audit and manual retry
decisions. It does not cause an automatic update PR for an already handled
source ID.

## Idempotency and Decision Records

The job checks records in this order:

1. Initial baseline manifest
2. Explicit ignore manifest
3. Existing Japan content mapping
4. Existing open, merged, or closed sync pull requests
5. Existing deterministic remote branch

Repository state:

- `.github/content-sync/baseline.json` is a source-ID-sorted array of records
  containing `sourceId`, `sourceCategory`, `sourceSlug`, `targetFamily`,
  `targetId`, and `targetSlug`. It is generated once, rejects duplicate source or
  target identities, and is manually reviewed before scheduling is enabled.
- `.github/content-sync/ignore.json` is a source-ID-sorted array containing
  immutable-key `sourceId`, audit snapshot `sourceCanonicalUrl`, `reasonCode`,
  `reason`, `addedBy`, and `addedAt`. Optional `expiresAt` supports temporary
  decisions. Ignore lookup always uses `sourceId`; canonical URL drift blocks
  the run for human review rather than silently changing the decision target.
- Pull request bodies contain a machine-readable JSON marker with provenance,
  target family, target ID, run ID, and generated branch.

Any open, merged, or closed pull request for a source ID blocks scheduled
regeneration, even when its source hash changes. Scheduled runs never consume
retry labels. A maintainer may run `--retry <source-id>` only after applying the
`content-sync:retry` label to that source's latest closed, unmerged pull request.
The manual retry reuses the same deterministic branch and reopens that pull
request; it never creates a second pull request. If the branch cannot be restored
or the pull request cannot be reopened, retry fails closed and requires human
cleanup. This ensures rejected or cancelled items do not return automatically.

Target numeric IDs are allocated above the maximum ID found in current `main`
content, every sync pull-request marker including closed pull requests, and
every remote `content-sync/<source-id>` branch. Historical and branch-only IDs
therefore remain reserved and cannot collide with an unmerged Draft. If any
sync branch has no associated pull request, the scheduler reports
`blocked_branch_only` and allocates no new candidate until that branch is
resumed or removed. The initial scheduler opens at most one new Draft pull
request per run.

## Components

### Deterministic Sync CLI

A single Node.js CLI owns:

- Sitemap and Documentation-list discovery
- Global repository metadata lookup
- Public eligibility checks
- Category mapping
- Source identity and hash calculation
- Baseline, ignore, Japan-content, pull-request, and branch deduplication
- Worktree lifecycle
- Asset inventory and existence checks
- Family-aware validation command selection
- Commit, push, and Draft pull-request creation
- Structured logs and final run summary

The CLI does not translate or make editorial decisions. It communicates with the
agent and reviewers through validated JSON artifacts:

1. `candidate.json`: immutable source evidence, selected locale, identity,
   allocated target ID, and asset/link inventory
2. `generation-report.json`: target files, source-to-target heading/figure/link
   mappings, intentional transformations, and validation requests
3. `fidelity-review.json`: severity-ranked omissions, additions, and factual
   parity findings from a fresh reviewer
4. `japanese-editorial-review.json`: severity-ranked Japanese naturalness,
   terminology, register, and readability findings from a different fresh
   reviewer
5. `contract-review.json`: severity-ranked repository-contract findings from a
   third fresh reviewer
6. `validation-results.json`: exact deterministic commands and exit codes
7. `browser-results.json`: desktop/mobile screenshots, rendered media geometry,
   response checks, and overflow findings
8. `run-summary.json`: final status, exit code, timings, commands, and pull
   request URL when created

Missing or invalid artifacts, or any reviewer finding with severity `critical`
or `major`, exits non-zero before commit or push.

### Agent Orchestration Skill

A thin repo-local `global-documentation-sync` skill owns the agent workflow. It
must load `mdx-publication-operations` and then the narrowest existing family
skill. It must not copy or redefine family frontmatter contracts already held by
those skills.

Pi writer and reviewer processes run with `--no-tools`. The runner places
immutable candidate/source/target data in each prompt, requires one strict JSON
stdout envelope, validates identity and schema, then atomically writes only the
allocated MDX and report paths. Source content therefore cannot invoke a
filesystem, shell, Git, or network tool.

The skill owns:

- Choosing `ja.html` when present
- Translating `en.html` only when Japanese source is unavailable
- Converting source HTML semantics into maintainable MDX
- Removing source-only `style` and `data-*` attributes, flattening paragraph
  wrappers inside lists, and rendering figures through existing MDX patterns
- Keeping one caption when a source figure caption is immediately repeated as an
  identical paragraph, and recording that deduplication as an intentional
  formatting transformation rather than an omission
- Applying the category-specific Japan presentation pattern
- Rewriting internal routes and download behavior
- Resolving named authors by exact name against `src/content/authors/ja.yaml`;
  unresolved named authors fail closed instead of falling back or being invented
- Preserving mapped source related items; when source related IDs are empty, the
  target relation list remains empty rather than being inferred
- Producing a provenance report with complete source-to-target inventories for
  headings, figures, captions, links, files, frontmatter, and intentional
  deviations

### Fresh Reviewers

Each generated item receives three independent reviews before a pull request is
opened. The writer cannot approve its own output, every reviewer starts a fresh
Pi session, and no reviewer reads another reviewer's conclusions:

1. Fidelity review: omissions, additions, meaning, dates, names, numbers,
   headings, lists, tables, code, callouts, captions, links, and CTAs
2. Japanese editorial review: naturalness, translation calques, register,
   readability, terminology, punctuation, notation consistency, and repetitive
   AI-like phrasing
3. Repository contract review: frontmatter, route, links, assets, effective Open
   Graph image, gating, downloads, and family-specific tests

Any Critical or Major finding blocks the pull request until corrected and all
affected reviews run again. The correction loop is bounded and fails closed
rather than accepting unresolved findings. The Japanese reviewer must load
`japanese-publication-editorial-review`; the writer may use the same skill as an
authoring checklist but cannot replace the independent review.

## Category Adaptation

Long-form families usually preserve the Global Japanese body while changing the
rendering format:

- Blog
- Whitepapers
- Glossary
- VOC to use cases
- Events

Introduction decks and manuals use Japan-specific guide-page patterns rather
than literal body copies:

- Introduction decks preserve Japan gating and `downloadCta` placement.
- Manuals convert Global outlinks into local Japanese guide wrappers with the
  corresponding Japanese documentation URL.

Family-specific rules always come from the existing target family skill and
loader implementation. Resource families must not receive unsupported
`hidden`, `redirectUrl`, or author fields. `relatedIds` and `relatedItems` must
not be interchanged.

## Translation and Content Quality

Locale priority:

1. Reuse Global `ja.html` and adapt structure without unnecessary rewriting.
2. If Japanese source is unavailable, translate `en.html` and record
   `sourceLanguage: "en"`.

English fallback adds a stricter Japanese review covering naturalness,
terminology, Japan-market phrasing, and preservation of factual claims. Every
output, including frontmatter, prose, alt text, and captions, is scanned for
unresolved Korean characters; any residue fails review unless the report names
an intentional proper noun. The reviewer also rejects awkward translation
calques and inconsistent numbering or terminology. The job does not invent
claims, dates, event details, author identities, related content, or download
assets.

## Link and Asset Rules

The generated item must:

- Place all item-specific assets under `public/<family>/<target-id>/...`.
- Convert the card/hero thumbnail to `thumbnail.png`; article figures may remain
  WebP when supported by the existing renderer.
- Use a route-aligned PNG as the effective Open Graph image.
- Preserve or localize meaningful alt text and captions.
- Verify every referenced local asset exists.
- Rewrite Global internal publication links to canonical Japan routes when a
  corresponding local publication exists.
- Copy declared root-relative Global media/file links, including assets currently
  under `/documentation/**` or `/news/**`, into the target item's asset root and
  rewrite the link to the local public path. Resolve resources only from the
  checked-out Global repository's `public/**` root with realpath containment.
  If the source file is unavailable there, fail closed; do not download a
  production-only fallback.
- Preserve valid external HTTPS links.
- Apply the repository contact-us query-prefill contract when relevant.
- Use the existing family-specific PDF and gating flow when that family defines
  one; a Blog file link remains an ordinary local file link and must not invent a
  Whitepaper gating flow.
- Require the generation report to list every source href and asset path beside
  its target href, target path, or intentional omission.
- Fail closed when a required asset or download cannot be resolved.

## Pull-request Contract

Branch names depend only on stable source identity:

```text
content-sync/<source-id>
```

A source slug change cannot create another branch for the same source ID.

Each pull request:

- Is Draft
- Contains one Global source item
- Lists source URL, source ID, source hash, locale used, target family, target
  route, validation commands, reviewer results, and intentional deviations
- Includes a fenced or HTML-commented machine-readable JSON marker
- Uses an English title and body according to repository policy
- Is never merged by the automation

## Error Handling and Concurrency

The runtime allows only one active sync job. The supported deployment uses a
`systemd` timer to start an ephemeral, non-interactive Pi process and `flock`
around the complete Linux-host execution. Pi loads the checked-in orchestration
and Japanese editorial skills explicitly, calls an external model provider, and
exits after the run; no agent daemon is required. Failure to acquire the lock
exits successfully with status `skipped_locked`; it never starts another
worktree.

Each run uses a run-ID-specific worktree and never reuses a failed worktree.
Clean skips and successful runs remove their worktrees after reports are
persisted. Failed worktrees are retained for seven days for diagnosis and then
removed by the same CLI. Branches are never force-pushed automatically.

Network reads use three attempts with exponential backoff and jitter, a
per-request timeout, and retries limited to timeout, connection failure, HTTP
429, and HTTP 5xx. Git push and pull-request creation are never blindly retried
without checking the stable branch and pull-request marker first.

If push succeeds but pull-request creation fails, the remote branch becomes a
reported `blocked_branch_only` state. Scheduled runs do not regenerate, create
an alternate branch, or allocate another target ID while any such branch exists.
After inspection, a maintainer may invoke
`--resume-branch-only <source-id>`, which revalidates the existing branch and
retries pull-request creation without regenerating content. This command does
not require a pull-request label because no pull request exists. If the branch
is invalid, the maintainer deletes it; the next scheduled run may then generate
the source again. Push conflicts, pull-request HTTP 422 responses, and stale
state always refetch the branch and pull-request list, then either skip an
already recorded source or fail closed.

An item failure does not create a partial pull request. Every stdout line is
JSON containing a shared run ID. Reports are written under a host-protected
retention directory; `journald` retains service logs and a `systemd` `OnFailure`
unit sends the failure summary to the configured team alert channel. A normal
no-candidate run exits zero with `status: "no_candidate"`; a failed run exits
non-zero. Reports include discovery evidence, skip or failure reason, changed
files, reviewer summaries, and test output with secrets and signed URLs
redacted.

## Validation

Every generated item runs the narrowest current family tests. Executable paths
and package scripts in the checked-out target repository are authoritative when
a family skill's verification snippet has drifted; implementation must correct
that skill documentation in the same change. Blog pilot validation is:

```bash
node --test \
  tests/blog/list-server-source.test.mjs \
  tests/blog/publication-cache.test.mjs \
  tests/blog/canonical-slug-routing.test.mjs \
  tests/blog/mdx-rendering-architecture.test.mjs
npm run test:publications
```

Mixed-family changes, route behavior changes, metadata changes, or automation
release candidates additionally run:

```bash
npm run test:ci
npm run build
```

The deterministic CLI has focused tests for discovery normalization, locale and
public predicates, category mapping, source identity, target-ID reservation,
baseline and ignore schemas, pull-request marker parsing, retry authorization,
closed-PR suppression, branch-only state, retryable network failures, worktree
cleanup, report-schema validation, secret redaction, and one-item-per-run limits.

## Local Quality Pilot

The pilot source is:

- Storage ID: `cnt_000211`
- Slug: `ai-work-os-enterprise-intelligence`
- Category: `blogs`
- Selected locale: `ja.html`
- Source body size: approximately 25 KB
- Source assets: thumbnail, PDF link, and multiple article images

The pilot runs in an isolated worktree. It calculates the next available target
blog ID at execution time; as of the design baseline, blog ID `31` is already
occupied, so the expected pilot ID is `32`.

The pilot generates the MDX and assets, runs all three fresh reviews, the Blog
tests, a production build, and desktop/mobile browser media checks, then
presents the final diff and quality report. It does not push, open a
pull request, or install scheduler infrastructure. This isolates content quality
from automation quality.

Pilot acceptance requires:

- No unresolved Critical or Major reviewer findings
- A complete source-to-target inventory for headings, figures, captions, links,
  files, frontmatter, and intentional transformations
- No omitted source sections, images, links, or factual data except documented
  intentional adaptation
- Source duplicate-caption paragraphs removed only when they normalize exactly
  to the retained figure caption
- Natural Japanese and consistent product terminology
- No unresolved Korean text in frontmatter, prose, alt text, or captions
- Source author `Sam Kim` resolved to existing author ID `sam`
- The source Blog PDF copied locally and represented in the link inventory
- Empty source `relatedIds` preserved as no inferred target relations
- Valid family frontmatter and canonical route
- All referenced assets present under the route-aligned asset root
- Effective Open Graph image is PNG
- All required Blog tests and the production build pass
- Desktop and mobile browser checks show no broken/zero-sized media or horizontal
  overflow; local PDFs and media endpoints return successful compatible MIME
  responses

## Runtime Deployment

AWS Lambda is not supported because its 900-second maximum execution time is
unsafe for variable-duration agent, asset, test, build, and Git operations.

Deployment order:

1. Run and approve the local quality pilot.
2. Measure runtime, disk use, API usage, and failure modes.
3. Run the same CLI on a managed Linux host using a `systemd` timer and `flock`.

ECS Fargate is not part of this implementation. It requires a separate durable
lock and operational design and may replace the Linux host later without
changing prompts, family skills, validation, or pull-request behavior.

## Security

- Global HTML, metadata, and linked source files are untrusted data. Pi runs
  with `--no-tools`; only the deterministic CLI may write, after strict stdout
  JSON, identity, schema, and allocated-path validation.
- Dry-run mode rejects commit, push, pull-request, and remote-branch operations
  before invoking any implementation that could perform them.
- Use a read-only credential for `corp-web-v2` with repository contents read
  access only.
- Use a separate least-privilege GitHub App or fine-grained credential for
  `corp-web-japan` with repository contents write and pull-request write access.
- Do not grant merge or production deployment permission.
- Store model and GitHub credentials in host-protected credentials or AWS
  Secrets Manager, never in repository files or logs.
- Redact credentials and signed URLs from retained reports.
- Give the source checkout read-only repository credentials and limit host-side
  mutation to deterministic `fetch`/`reset`; Pi receives source text as prompt
  data and has no filesystem tools. Keep target changes in an isolated worktree.

## Rollout

1. Complete and review this design.
2. Write the implementation plan.
3. Execute the local `cnt_000211` quality pilot.
4. Review the pilot diff and reports with a human maintainer.
5. Implement deterministic discovery and decision records.
6. Add the thin orchestration skill and CLI validation.
7. Run local end-to-end dry runs with a one-item cap.
8. Deploy the same command to the managed Linux host.
9. Keep Draft pull requests and a one-item-per-run cap until maintainers approve
   broader operation.
