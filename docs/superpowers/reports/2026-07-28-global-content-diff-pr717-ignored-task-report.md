# PR #717 ignored-task report

Date: 2026-07-28

## RED evidence

Command:

```bash
node --test tests/global-documentation-sync/global-content-diff-report.test.mjs \
  tests/global-documentation-sync/global-content-diff-workflow.test.mjs \
  tests/global-documentation-sync/discovery.test.mjs \
  tests/global-documentation-sync/slack-workflow.test.mjs \
  tests/global-documentation-sync/github-state.test.mjs
```

Result:

- 61 tests run
- 57 passed
- 4 failed
- Failures proved old behavior still exposed `Mapping drift` status and family-first Slack containers.

## GREEN evidence

Command:

```bash
node --test tests/global-documentation-sync/global-content-diff-report.test.mjs \
  tests/global-documentation-sync/global-content-diff-workflow.test.mjs \
  tests/global-documentation-sync/discovery.test.mjs \
  tests/global-documentation-sync/slack-workflow.test.mjs \
  tests/global-documentation-sync/github-state.test.mjs
```

Result:

- 61 tests run
- 61 passed
- 0 failed

## No-send dry-run evidence

Command:

```bash
node scripts/global-content-diff-report/cli.mjs \
  --global-repo /Users/kelly/w/corp-web-v2 \
  --target-repo /Users/kelly/w/corp-web-japan-worktrees/260728-global-content-diff-report \
  --dry-run
```

Summary:

- mode: `dry-run`
- Global published: 69
- Japan present: 106
- Global-only: 12
- Statuses: `Untracked` 6, `Ignored` 6
- Families: `news` 11, `events` 1
- Payloads: 1
- Mapping drift items: 0
