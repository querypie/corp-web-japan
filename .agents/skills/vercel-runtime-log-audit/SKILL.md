---
name: vercel-runtime-log-audit
description: Use when auditing corp-web-japan Vercel Runtime Logs or running the scheduled wiki-report cron workflow; load this thin repo-local index, then follow the canonical ops document and Korean report template.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [vercel, runtime-logs, operations, corp-web-japan, wiki-report]
    related_skills: [github-wiki-editing]
---

# Vercel runtime log audit

This is a thin repo-local trigger/index skill. It intentionally does not duplicate the cron workflow, Vercel query sequence, classification taxonomy, verification checklist, or report template.

## Source of truth

- Canonical cron workflow and Vercel log-collection procedure: `ops/vercel-runtime-log-wiki-report-cron.md`
- Canonical Korean report template: `.agents/skills/vercel-runtime-log-audit/references/korean-wiki-report-template.md`

If this skill is loaded for the scheduled `corp-web-japan` Runtime Log wiki report, read the canonical ops document first and execute that procedure. Use the template file above when writing the Korean wiki report.

## When to load

Load this skill for:

- recurring Hermes cron runs that create or update `corp-web-japan` Runtime Log wiki reports
- production Runtime Log audits for `404`, `307`, `308`, `500`, `502`, `503`, `504`, or `--level error`
- operational wiki summaries based on Vercel logs

## Non-duplication rule

Do not add detailed Vercel commands, report tables, sidebar workflow, or failure-handling checklists to this skill. Update the source-of-truth files instead.
