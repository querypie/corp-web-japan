# Vercel Runtime Log wiki report cron job

This document defines the self-contained Hermes cron prompt for publishing the recurring `corp-web-japan` Vercel production Runtime Log report to the `querypie/corp-web-japan` GitHub wiki.

The document lives in this repository because the job is operationally tied to the `corp-web-japan` Vercel project and the `corp-web-japan.wiki` reporting surface. The prompt is intentionally self-contained so a fresh Hermes cron session can run it without relying on the chat context that created the job.

## Recommended cron configuration

Recommended schedule:

```text
0 */3 * * *
```

This runs every three hours, up to eight times per KST calendar day. The report is still a daily report: each run should create or update the same KST-day wiki page with the currently accessible Runtime Log evidence. This cadence reduces the risk of losing early-day log entries because Vercel Runtime Logs are only reliably accessible for the most recent 24 hours in the current environment.

Recommended job name:

```text
corp-web-japan daily Vercel runtime log wiki report
```

Recommended toolsets:

```text
terminal,file
```

Recommended attached skills:

```text
vercel-runtime-log-audit
github-wiki-editing
```

Optional helper skill for job creation or later job maintenance:

```text
hermes-agent
```

`hermes-agent` is useful when creating or editing the Hermes cron job itself. The recurring job's core execution depends on `vercel-runtime-log-audit` and `github-wiki-editing`, both of which are checked into this repository under `.agents/skills/`.

## Creating the job

### Preferred: create with skill attachments

When using the Hermes tool/API, create the cron job with:

- schedule: `0 */3 * * *`
- name: `corp-web-japan daily Vercel runtime log wiki report`
- prompt: the full `Cron job prompt` section below
- skills:
  - `vercel-runtime-log-audit`
  - `github-wiki-editing`
- enabled_toolsets:
  - `terminal`
  - `file`

### CLI fallback

If creating from the CLI, create the job first and then paste or edit in the prompt.

```bash
hermes cron create '0 */3 * * *'
hermes cron edit <job-id>
```

If the CLI path cannot attach skills directly, the prompt below still includes the required operational details. The job still needs `terminal` and `file` tools available in the cron session.

## Cron job prompt

Use the following content as the cron job prompt.

```text
You are running an autonomous scheduled operational reporting task in a fresh Hermes cron session. Do not ask the user questions. Complete the task as far as the current environment allows, verify the result, and clearly report blockers if credentials or external services are unavailable.

Task: create or update a GitHub wiki report for querypie/corp-web-japan based on Vercel production runtime logs for the corp-web-japan project.

Skill loading requirement:
- First try to load and follow these skills in this order:
  1. vercel-runtime-log-audit
  2. github-wiki-editing
- These skills are expected to be available as repo-local checked-in skills at:
  - `.agents/skills/vercel-runtime-log-audit/SKILL.md`
  - `.agents/skills/github-wiki-editing/SKILL.md`
- If the Hermes skills tool cannot load repo-local skills by name, read those `SKILL.md` files directly from the repository working directory and follow them.
- If a skill is still unavailable, continue using the embedded instructions in this prompt. Do not stop only because a skill could not be loaded.
- Use the loaded skills for command pitfalls and verification details, but the concrete task scope in this prompt takes precedence.

Execution constraints:
- This job is autonomous. Do not ask clarifying questions.
- Do not fabricate log results, wiki commits, or push status.
- Use tools to inspect the live environment; do not rely on memory for current time, file state, git state, Vercel auth, or GitHub auth.
- Keep command output bounded. Use timeouts for broad log collection and change strategy if a Vercel query hangs or returns unsupported-option errors.
- Never print secret values. It is OK to print whether an environment variable is set.

Primary repositories and paths:
- Product repository: querypie/corp-web-japan
- Local product repository path, if present: /Users/jk/workspace/corp-web-japan
- Local wiki repository path, preferred if present: /Users/jk/workspace/corp-web-japan.wiki
- Wiki remote fallback: https://github.com/querypie/corp-web-japan.wiki.git
- Wiki target: querypie/corp-web-japan GitHub wiki
- Vercel project: corp-web-japan
- Vercel scope/team: querypie
- Vercel environment: production
- Reference report format: https://github.com/querypie/corp-web-japan/wiki/Vercel-Runtime-Log---May-20

Critical Vercel runtime-log constraint:
- Vercel runtime logs are only reliably accessible for the most recent 24 hours in this environment.
- Do not attempt to reconstruct older full-day reports outside the accessible 24-hour window.
- If the job is delayed or starts after the intended reporting day has partly fallen outside the recent-24h window, document the actual accessible window and do not claim full-day coverage.
- Because of this constraint, the job runs every three hours and updates the current KST calendar-day report incrementally up to eight times per day.
- Treat the report as a same-day rolling daily report until the day ends. Do not create a separate page for each run.
- If a completed prior calendar-day report is required in the future, a separate log archival job must collect the data before it expires. This task does not do that.

Required report page naming:
- Use the existing wiki naming convention from the reference page.
- For a single KST date, create/update: `Vercel Runtime Log - Mon D`, e.g. `Vercel Runtime Log - May 20`.
- The wiki file name should follow the existing wiki file convention, e.g. `Vercel-Runtime-Log---May-20.md`.
- If the accessible window crosses two KST dates because the job was delayed, use a clear date range title such as `Vercel Runtime Log - May 20 through May 21`, and state the exact actual data range.

Required high-level workflow:
1. Confirm the current time in KST using the system clock.
   - Example: `TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M:%S %Z'`
   - Japan and Korea are both UTC+09:00; label report times as KST.
2. Determine the intended reporting window:
   - The job runs every three hours, but the report is daily. For each run, update the page for the current KST calendar date.
   - For the current KST day, report from 00:00:00 through the audit time when that full window is still accessible.
   - If current KST day start is more than 24 hours behind the runtime-log query point, use only the recent accessible 24-hour window and label it honestly.
   - Use ISO timestamps with explicit `+09:00` offset for Vercel queries when supported.
3. Verify prerequisites:
   - `command -v vercel`
   - `vercel whoami`
   - `printf 'VERCEL_TOKEN=%s\n' "${VERCEL_TOKEN:+set}"`
   - `printf 'VERCEL_TEAM_ID=%s\n' "${VERCEL_TEAM_ID:+set}"`
   - `command -v git`
   - `command -v gh`
   - `gh auth status`
4. Prepare the wiki repository:
   - Prefer the existing local clone at `/Users/jk/workspace/corp-web-japan.wiki` if it exists.
   - If it does not exist, clone `https://github.com/querypie/corp-web-japan.wiki.git` into a stable local path such as `/Users/jk/workspace/corp-web-japan.wiki` if possible, otherwise a temp path.
   - In the wiki repo, run `git status --short --branch` before editing.
   - If unrelated local wiki changes exist, do not overwrite them. Report the blocker unless they can be safely isolated.
   - Fetch and rebase/pull the wiki default branch before editing. Verify the actual branch name; do not assume it is `master` without checking.
   - Do not edit wiki files inside the product repository. GitHub wiki is a separate git repository.
5. Collect product repository context if available:
   - If `/Users/jk/workspace/corp-web-japan` exists, fetch `origin main`, read the current `origin/main` SHA and subject, and include them in the report as context.
   - Do not infer runtime-log findings from code inspection alone.
6. Collect Vercel logs for `corp-web-japan` production.
7. Write or update the wiki report markdown using the repository template at `.agents/skills/vercel-runtime-log-audit/references/korean-wiki-report-template.md`.
8. Update `_Sidebar.md` in the wiki repository so the report page link is visible in the wiki navigation. Preserve existing sidebar structure and add the dated runtime-log page near adjacent Vercel Runtime Log reports.
   - This is required when creating a new dated page.
   - If updating an existing same-day page, verify that `_Sidebar.md` already contains the page link; add it if missing.
9. Commit and push the wiki repository.
10. Verify the pushed wiki state.
11. Final response must include:
    - wiki page title and file path
    - committed wiki SHA
    - pushed branch name
    - exact reporting window and KST audit time
    - whether 5xx were found
    - any blockers or limitations

Vercel log collection requirements:
- First run `vercel logs --help` and verify the supported historical query syntax in the current CLI version.
- Start with a small existence check:
  `vercel logs --project corp-web-japan --environment production --since 24h --json --no-branch --scope querypie --limit 50`
- Ignore non-JSON progress lines such as `Fetching project ...` and parse only JSON lines.
- Deduplicate rows by `id`, `requestId`, or the most stable available identifier.
- Treat broad log samples as sampled top-sets, not authoritative full traffic totals.
- Vercel CLI/API can repeat rows or plateau around a limited number of unique rows; explicitly document this if observed.
- `--level error` can include non-5xx rows such as `responseStatusCode: 200`; always filter client-side for response/status code beginning with `5` before reporting 5xx counts.
- If a query reaches a hard cap such as 1000 rows, report `>=1000` or `capped at 1000`, not exactly 1000.

Required status-specific queries:
Run explicit status checks for:
- `307`
- `308`
- `404`
- `500`
- `502`
- `503`
- `504`

Preferred CLI pattern, adjusted for the chosen window:

```bash
vercel logs --project corp-web-japan --environment production \
  --since '<WINDOW_START_ISO_WITH_OFFSET>' \
  --until '<WINDOW_END_ISO_WITH_OFFSET>' \
  --status-code 404 \
  --json --no-branch --scope querypie --limit 1000
```

Also run:

```bash
vercel logs --project corp-web-japan --environment production \
  --since '<WINDOW_START_ISO_WITH_OFFSET>' \
  --until '<WINDOW_END_ISO_WITH_OFFSET>' \
  --level error \
  --json --no-branch --scope querypie --limit 1000
```

Then client-side filter that result to actual 5xx statuses only.

Fallback query strategy:
- If `--status-code` is unsupported or unreliable in the current CLI, try `--search 'status:404'` for 404-like samples and use explicit integer status checks where supported.
- Do not use `--status-code 5xx` unless `vercel logs --help` and a probe prove it is accepted. Some Vercel paths require comma-separated integers only.
- If only live tailing by URL/deployment ID is supported, fall back to the direct Vercel request-log API if credentials allow it.
- For direct request-log API, explicitly filter `environment=production`; unfiltered project queries can be polluted by preview traffic.
- If neither CLI nor API can access historical logs, do not write a fake wiki report. Return a blocker summary with the exact failing prerequisite/query.

Recommended local parsing approach:
- Use a short Python helper or shell pipeline to execute each query, combine stdout/stderr, keep lines beginning with `{`, parse JSON, dedupe, and summarize.
- Normalize status fields from `responseStatusCode`, `statusCode`, or equivalent.
- Normalize path fields from `requestPath`, `path`, `uri`, or structured JSON embedded in `message` when available.
- For messages like `[runtime-404] {...}` and `[runtime-missing-redirect] {...}`, parse the trailing JSON object when possible to extract `requestedPath`, `redirectTarget`, `host`, `referer`, and `userAgent`.

Classification guidance:
- Scanner/probe noise examples include WordPress paths, `/.env*`, `/.git/*`, `/.ssh/*`, `/appsettings.json`, `/actuator/env`, `/api/config`, `/api/env`, `/secrets.json`, `/.well-known/traffic-advice`, `/xmlrpc.php`, `/wp-*`, `/cgi-bin/*`, `/swagger.json`, `/openapi.json`, `/runtime-config.js`, and similar config/secret/exploit probes.
- Do not recommend redirects for scanner/probe noise by default.
- Repeated application/content paths, canonicalization failures, or stale public route families may be actionable.
- Runtime logs do not capture every user-visible 404. Edge/static 404s may be absent from runtime logs. State this limitation if 404 volume is low or absent.
- If manual live checks are performed after log collection, record the check time and keep those checks in a separate section so they do not pollute log-derived counts.
- If a path-specific 404 looks like a malformed content URL with extra title text appended, inspect current production HTML/sitemap/repo content only if needed and classify whether current in-site emission is reproduced. Do not default to redirects for one-off external/cached malformed hits.

Report language and style:
- Write the wiki report in Korean. This is mandatory even though this repository document is written in English.
- Keep technical terms such as Vercel, Runtime Log, HTTP, 5xx, 404, `production`, command snippets, and route paths as-is.
- Avoid leftover English section labels except where the existing wiki convention intentionally uses English product/technical names.
- Use markdown links for wiki references.
- Keep multiline runtime messages collapsed to one line in tables/lists.
- Frame the report as an operational snapshot, not a source-of-truth metrics system.

Required report template:
- Use `.agents/skills/vercel-runtime-log-audit/references/korean-wiki-report-template.md` as the single source of truth for the Korean report structure.
- Do not maintain a second embedded copy of the report template in this cron prompt. If the report format changes, update that template file and keep this prompt pointing to it.

Wiki update requirements:
- Before editing, read the existing target page if it exists.
- The report is daily even though the cron job runs every three hours. Preserve and update the same current-day page during the day instead of creating per-run pages.
- Update `_Sidebar.md` in the same commit when creating a new dated report.
- When updating an existing same-day report, verify `_Sidebar.md` already exposes that report link; if it does not, add it in the same commit.
- Commit message format:
  `docs: add Vercel runtime log report for {YYYY-MM-DD}`
  or
  `docs: update Vercel runtime log report for {YYYY-MM-DD}`
- Push the wiki repo default branch.
- Verify push with:
  - `git status --short --branch`
  - `git log -1 --oneline`
  - `git ls-remote origin refs/heads/<wiki-branch>`

Failure handling:
- If Vercel auth is unavailable or invalid, do not fabricate a report. Write a concise final response explaining the auth blocker and the prerequisite that failed.
- If GitHub auth is unavailable or invalid, do not fabricate a wiki update. Report the exact `gh auth status` or git push failure.
- If the wiki repo has unrelated local changes, do not overwrite them. Report the dirty files and stop unless you can isolate your changes safely.
- If GitHub wiki push fails because the remote advanced, fetch and rebase the wiki branch, resolve only your report/sidebar changes, then push again.
- If the report page can be written locally but cannot be pushed, report the local file path and exact push error.
- If Vercel logs return no rows, distinguish between `no logs in the accessible window` and `query/auth/tool failure` using the prerequisite and small existence-check evidence.
- If the task cannot complete, final response should be a blocker report, not a partial success claim.
```

## Maintenance notes

- Source of truth split:
  - `ops/vercel-runtime-log-wiki-report-cron.md` owns cron schedule, job configuration, and execution procedure.
  - `.agents/skills/vercel-runtime-log-audit/references/korean-wiki-report-template.md` owns the Korean wiki report structure.
  - `.agents/skills/*/SKILL.md` files are thin trigger/index wrappers and should not duplicate the detailed procedure or report template.
- The every-three-hours schedule is part of the data-integrity contract. It lets the daily wiki page be updated up to eight times per day while reducing the risk of losing early-day logs to the recent-24h access limit.
- If Vercel changes `vercel logs` behavior, update the query instructions here only after confirming `vercel logs --help` and a small successful probe query.
- If the wiki report format changes, update only `.agents/skills/vercel-runtime-log-audit/references/korean-wiki-report-template.md` and keep this document as a reference to that template.
