---
name: github-wiki-editing
description: Use when editing the querypie/corp-web-japan GitHub wiki for the scheduled Runtime Log report; load this thin repo-local index, then follow the canonical ops document for wiki workflow and Sidebar requirements.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [github, wiki, markdown, operations, corp-web-japan]
    related_skills: []
---

# GitHub wiki editing

This is a thin repo-local trigger/index skill. It intentionally does not duplicate the wiki clone/pull/edit/commit/push procedure, `_Sidebar.md` requirements, or failure-handling checklist for the scheduled Runtime Log report.

## Source of truth

- Canonical wiki workflow for the scheduled Runtime Log report: `ops/vercel-runtime-log-wiki-report-cron.md`

If this skill is loaded for the scheduled `corp-web-japan` Runtime Log wiki report, read the canonical ops document first and follow its wiki update requirements, including `_Sidebar.md` link exposure.

## When to load

Load this skill for:

- scheduled Vercel Runtime Log report pages in `querypie/corp-web-japan.wiki`
- `_Sidebar.md` navigation updates for those dated report pages
- wiki commit/push verification during the scheduled report workflow

## Non-duplication rule

Do not add the detailed wiki editing sequence or scheduled-report sidebar rules to this skill. Update `ops/vercel-runtime-log-wiki-report-cron.md` instead.
