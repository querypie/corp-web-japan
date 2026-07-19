# Global Documentation Sync production-readiness audit

Date: 2026-07-19

## Objective

Detect newly published Global Documentation records, produce faithful Japanese
MDX publications with owned resources, block unsafe or low-quality output, and
create at most one Draft pull request per daily run. Preserve all historical
accept/reject decisions and never merge or deploy automatically.

## Prompt-to-artifact checklist

| Requirement | Implementation | Evidence |
| --- | --- | --- |
| Production-first discovery | Exact normalized URL intersection across sitemap and `/en/documentation`; published Global metadata required | `live-discovery.mjs`, `discovery.mjs`, discovery tests |
| All Documentation families | Seven explicit source-to-target mappings and family Skills | `lib.mjs`, orchestration Skill, core tests |
| Stable identity and dedupe | `storageId`, 98-record baseline, ignore manifest, Japan content, all paginated PRs, remote branches | `.github/content-sync/*`, `github-state.mjs`, baseline/discovery tests |
| Closed/rejected suppression | Closed PR blocks automatic regeneration; explicit retry label required | `authorizeClosedRetry()`, Git/PR tests |
| Full safe retry | Same branch/PR, fixed target identity, stale slug cleanup, complete generation/review/test/build/browser pipeline, Draft restoration | `retry-run.mjs`, `publishRetry()`, prepare and Git integration tests |
| Branch-only recovery | Exact remote commit match, retained identity/blocking review checks, fresh contract/CI/build/browser validation artifact | `resumeBranchOnly()`, `revalidate-branch.mjs`, Git/PR tests |
| Owned resources only | Global realpath boundary, byte hashes, signatures, dimensions, route-local provenance, no production download fallback | asset inspection and generated-validation modules/tests |
| Video embeds | Source-derived YouTube/Vimeo identities only; HTTPS and live response checked in browser | `external-media.mjs`, browser QA and tests |
| Large-file policy | Reject only Git-host-incompatible files at 100 MiB; no arbitrary 25 MiB gate | asset inspection tests |
| Japanese generation | Pi headless one-shot writer; shared and family publication Skills; deterministic author/frontmatter contract | `pi-runner.mjs`, Skills, runtime tests |
| Independent review | Three fresh no-tools Pi processes; writer alone receives correction findings; bounded correction loop | `review-cycle.mjs`, Pi runner tests |
| Writer filesystem boundary | Pi receives `--no-tools`; strict JSON envelope; deterministic realpath/atomic writer owns all writes | `pi-runner.mjs`, Pi runner tests |
| Fail closed | Critical/major finding, identity mismatch, invalid marker, branch-only state, asset/provenance failure, test/build/browser failure all stop publication | validators, production runner, recovery tests |
| Draft PR only | Isolated deterministic branch, one commit, push, `gh pr create --draft`; no merge/deploy command | `git-pr.mjs`, actual local bare-Git integration test |
| Dry-run safety | No commit, push, PR, or remote branch mutation | dry-run assertions and release E2E summary |
| Daily Linux operation | systemd oneshot/timer, flock, dedicated checkouts/worktree root, failure unit/webhook, least-privilege service | `ops/global-documentation-sync/*`, runtime tests |
| Current-main safety | Dedicated clean `main` checkouts must equal `origin/main` before discovery | runner shell and preflight |
| Observability and redaction | Versioned artifacts, attempt history, run/failure summaries, 0600 sensitive files, secret-like source rejection | artifact references, redaction tests |

## Release evidence

Current-code, real Pi no-tools E2E:

- Reports: `/tmp/global-doc-sync-pilot/release-e2e-reports`
- Source: `cnt_000051` (event with source-approved YouTube media)
- Source hash: `sha256:3bec046ec6f72462bdf8091a129ced6abcbcacb7430ad25763607cc3c51b07a3`
- Result: `dry_run_passed`
- Mutations: `committed=false`, `pushed=false`, `pullRequestUrl=null`
- Reviews: fidelity pass, contract pass, Japanese editorial minor-only findings
- Validation: generated contract, 69 publication test files, Next production build
- Browser: 1440x900 and 390x844 passed; image/video provenance and responses checked
- Complete changed-file inventory includes MDX, PNG hero, and source WebP
- Attempt-specific raw and structured artifacts retained

Repository validation:

- `node --check scripts/global-documentation-sync/*.mjs`
- `node --test tests/global-documentation-sync/*.test.mjs` -> 38/38 passed
- `npm run test:ci` -> lint 0 errors, typecheck passed, 171 test files passed
- `next build` -> passed
- Actual local bare-Git transaction test proved deterministic branch push, Draft PR
  command, same-branch retry, same-PR reopen/edit, and no merge command.
- No `content-sync/*` branch was created on the real remote by dry-run E2E.

## Release boundary

The implementation and checked-in systemd assets are production-ready. Host
installation, environment secrets, and timer enablement are deployment actions,
not performed from this development worktree. The runtime preflight intentionally
fails until the dedicated host satisfies the documented requirements.
