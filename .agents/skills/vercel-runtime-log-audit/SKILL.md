---
name: vercel-runtime-log-audit
description: Use when auditing corp-web-japan Vercel production runtime logs, especially for recurring wiki reports, 404/3xx/5xx summaries, and operational snapshots.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [vercel, runtime-logs, operations, corp-web-japan, wiki-report]
    related_skills: [github-wiki-editing]
---

# Vercel runtime log audit

Use this repo-local skill when a task needs to inspect `corp-web-japan` Vercel Runtime Logs or produce the scheduled Korean wiki report documented in `ops/vercel-runtime-log-wiki-report-cron.md`.

## When to load

Load this skill for:

- recurring Hermes cron runs that create or update `corp-web-japan` runtime-log wiki reports
- production Runtime Log audits for `404`, `307`, `308`, `500`, `502`, `503`, `504`, or `--level error`
- questions about whether Vercel Runtime Logs show app/runtime-visible failures
- operational wiki summaries based on Vercel logs

## Required constraints

- The target Vercel project is `corp-web-japan`.
- The target environment is `production` unless the user explicitly asks otherwise.
- In the current environment, Vercel Runtime Logs are only reliably accessible for the most recent 24 hours.
- Do not claim full-day coverage if part of the intended KST day has fallen outside the accessible 24-hour window.
- Treat daily scheduled reports as operational snapshots, not source-of-truth analytics totals.
- Always state the actual accessible log window used in the report.

## Recommended query sequence

1. Confirm prerequisites and current CLI behavior:

```bash
command -v vercel
vercel whoami
vercel logs --help
```

2. Start with a bounded sample so you know logs exist and can see current output shape:

```bash
vercel logs --project corp-web-japan --environment production --since 24h --json --no-branch --limit 50
```

3. Run explicit status checks for the recurring report:

```bash
vercel logs --project corp-web-japan --environment production --since 24h --status-code 307 --json --no-branch --limit 1000
vercel logs --project corp-web-japan --environment production --since 24h --status-code 308 --json --no-branch --limit 1000
vercel logs --project corp-web-japan --environment production --since 24h --status-code 404 --json --no-branch --limit 1000
vercel logs --project corp-web-japan --environment production --since 24h --status-code 500 --json --no-branch --limit 1000
vercel logs --project corp-web-japan --environment production --since 24h --status-code 502 --json --no-branch --limit 1000
vercel logs --project corp-web-japan --environment production --since 24h --status-code 503 --json --no-branch --limit 1000
vercel logs --project corp-web-japan --environment production --since 24h --status-code 504 --json --no-branch --limit 1000
vercel logs --project corp-web-japan --environment production --since 24h --level error --json --no-branch --limit 1000
```

4. If the CLI supports ISO windows and the current-day start is still within the recent-24h window, use explicit KST timestamps from the current KST day start through audit time.

## Parsing rules

- Parse only JSON lines. Ignore progress lines such as `Fetching project ...` or `Fetching logs...`.
- Dedupe by `id` when present. For direct API rows, dedupe by `requestId`.
- Do not treat `--level error` as a 5xx count. Filter client-side for status fields starting with `5`.
- If a query returns exactly the requested cap such as 1000 rows, report it as capped evidence, not an exact total.
- Prefer explicit integer status checks over wildcard status filters unless the current CLI help and a probe prove wildcard status filters work.

## Classification guidance

Classify repeated 404-like paths into actionable and noise buckets.

Common scanner/noise patterns:

- WordPress/exploit probes such as `/wp-admin`, `/wp-login.php`, `/xmlrpc.php`
- secret/config probes such as `/.env`, `/.git/config`, `/config.json`, `/runtime-config.js`
- generic API probes such as `/api/health`, `/health`, `/swagger.json`, `/openapi.json`
- `.well-known` discovery probes, `llms.txt`, and other bot discovery paths

Potentially actionable patterns:

- repeated current site paths that look like renamed or malformed content routes
- broken internal navigation candidates with real referers
- repeated 5xx signatures from the same deployment or exception message
- custom `[runtime-404]` / `[runtime-missing-redirect]` messages with structured JSON evidence

When runtime messages contain structured JSON after a prefix such as `[runtime-404]`, parse that JSON and extract `requestedPath`, `host`, `referer`, `userAgent`, and any redirect target fields.

## Korean wiki report template

For Korean operational reports, use the linked template:

- `.agents/skills/vercel-runtime-log-audit/references/korean-wiki-report-template.md`

Keep technical terms such as Vercel, Runtime Log, HTTP, `production`, command snippets, and route paths as-is, but write the report body and section labels in Korean unless the wiki convention intentionally keeps a technical English term.

## Verification checklist

- [ ] `vercel logs --help` was checked for current CLI capabilities.
- [ ] The report states the actual KST audit time and accessible log window.
- [ ] Status-specific checks include `307`, `308`, `404`, `500`, `502`, `503`, `504`, and `--level error`.
- [ ] `--level error` rows were filtered client-side before counting 5xx.
- [ ] Counts are described as sampled or capped where Vercel output limits prevent exact totals.
- [ ] Scanner/noise patterns are separated from actionable route or runtime issues.
- [ ] The wiki report is written in Korean.
- [ ] `github-wiki-editing` is loaded before committing/pushing the wiki update.
