# Global Documentation to Japan Publication Sync Design

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

- `.github/content-sync/baseline.json` records Global source IDs already
  represented in Japan before automation begins.
- `.github/content-sync/ignore.json` records explicit permanent exclusions and
  reasons.
- Pull request bodies contain a machine-readable JSON marker with provenance,
  target family, run ID, and generated branch.

Any open, merged, or closed pull request for a source ID blocks automatic
regeneration, even when its source hash changes. A maintainer must explicitly
apply the `content-sync:retry` label or remove an ignore entry to retry it. This
ensures rejected or cancelled items do not return automatically.

The initial scheduler opens at most one new Draft pull request per run.

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

The CLI does not translate or make editorial decisions.

### Agent Orchestration Skill

A thin repo-local `global-documentation-sync` skill owns the agent workflow. It
must load `mdx-publication-operations` and then the narrowest existing family
skill. It must not copy or redefine family frontmatter contracts already held by
those skills.

The skill owns:

- Choosing `ja.html` when present
- Translating `en.html` only when Japanese source is unavailable
- Converting source HTML semantics into maintainable MDX
- Applying the category-specific Japan presentation pattern
- Rewriting internal routes and download behavior
- Selecting evidence-based related content
- Producing a provenance and intentional-deviation report

### Fresh Reviewers

Each generated item receives two independent reviews before a pull request is
opened:

1. Content parity review: omissions, additions, meaning, Japanese naturalness,
   dates, names, numbers, product terminology, headings, lists, tables, code,
   callouts, captions, and CTAs
2. Repository contract review: frontmatter, route, links, assets, effective Open
   Graph image, gating, downloads, and family-specific tests

Any Critical or Major finding blocks the pull request until corrected and
reviewed again.

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
terminology, Japan-market phrasing, and preservation of factual claims. The job
does not invent claims, dates, event details, author identities, or download
assets.

## Link and Asset Rules

The generated item must:

- Place all item-specific assets under `public/<family>/<target-id>/...`.
- Use a route-aligned PNG as the effective Open Graph image.
- Preserve or localize meaningful alt text and captions.
- Verify every referenced local asset exists.
- Rewrite Global internal publication links to canonical Japan routes when a
  corresponding local publication exists.
- Preserve valid external HTTPS links.
- Apply the repository contact-us query-prefill contract when relevant.
- Use the existing family-specific PDF and gating flow.
- Fail closed when a required asset or download cannot be resolved.

## Pull-request Contract

Branch names are deterministic:

```text
content-sync/<source-id>-<source-slug>
```

Each pull request:

- Is Draft
- Contains one Global source item
- Lists source URL, source ID, source hash, locale used, target family, target
  route, validation commands, reviewer results, and intentional deviations
- Includes a fenced or HTML-commented machine-readable JSON marker
- Uses an English title and body according to repository policy
- Is never merged by the automation

## Error Handling and Concurrency

The runtime allows only one active sync job. A local Linux deployment uses
`flock`; a container scheduler uses an equivalent non-overlap guard.

Network operations use bounded retries with backoff. Git push and pull-request
creation are never blindly retried without checking the deterministic branch and
pull-request marker first.

An item failure does not create a partial pull request. The job preserves a
redacted structured report containing discovery evidence, skip or failure
reason, changed files, reviewer summaries, and test output.

## Validation

Every generated item runs the narrowest family tests from its family skill.
Blog pilot validation is:

```bash
npm run test -- tests/blog-list-server-source.test.mjs
npm run test -- tests/blog-publication-cache.test.mjs
npm run test -- tests/blog-canonical-slug-routing.test.mjs
npm run test -- tests/blog-mdx-rendering-architecture.test.mjs
```

Mixed-family changes, route behavior changes, metadata changes, or automation
release candidates additionally run:

```bash
npm run test:ci
npm run build
```

The deterministic CLI has focused tests for discovery normalization, public
predicates, category mapping, source identity, baseline and ignore handling,
pull-request marker parsing, closed-PR suppression, and one-item-per-run limits.

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

The pilot generates the MDX and assets, runs both fresh reviews and the Blog
tests, and presents the final diff and quality report. It does not push, open a
pull request, or install scheduler infrastructure. This isolates content quality
from automation quality.

Pilot acceptance requires:

- No unresolved Critical or Major reviewer findings
- No omitted source sections, images, links, or factual data except documented
  intentional adaptation
- Natural Japanese and consistent product terminology
- Valid family frontmatter and canonical route
- All referenced assets present under the route-aligned asset root
- Effective Open Graph image is PNG
- All required Blog tests pass

## Runtime Deployment

AWS Lambda is not supported because its 900-second maximum execution time is
unsafe for variable-duration agent, asset, test, build, and Git operations.

Deployment order:

1. Run and approve the local quality pilot.
2. Measure runtime, disk use, API usage, and failure modes.
3. If an existing managed Linux host is available, run the same CLI using a
   `systemd` timer and `flock`.
4. If new AWS infrastructure is required, package the same CLI and skills as an
   ECS Fargate task invoked once daily by EventBridge Scheduler.

The runtime choice does not change prompts, family skills, validation, or pull-
request behavior.

## Security

- Use a read-only credential for `corp-web-v2`.
- Use a separate least-privilege credential for branch push and pull-request
  creation in `corp-web-japan`.
- Do not grant merge or production deployment permission.
- Store model and GitHub credentials in host-protected credentials or AWS
  Secrets Manager, never in repository files or logs.
- Redact credentials and signed URLs from retained reports.
- Run source checkout read-only and target changes in an isolated worktree.

## Rollout

1. Complete and review this design.
2. Write the implementation plan.
3. Execute the local `cnt_000211` quality pilot.
4. Review the pilot diff and reports with a human maintainer.
5. Implement deterministic discovery and decision records.
6. Add the thin orchestration skill and CLI validation.
7. Run local end-to-end dry runs with a one-item cap.
8. Deploy the same command to the chosen daily runtime.
9. Keep Draft pull requests and a one-item-per-run cap until maintainers approve
   broader operation.
