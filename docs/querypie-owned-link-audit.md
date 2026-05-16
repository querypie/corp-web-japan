# QueryPie-owned external link audit reference

This document converts issue #521 into a durable repository reference for
QueryPie-owned absolute URL review. Use it to quickly answer these questions:

- Which source files still link to `https://www.querypie.com/ja/...`?
- Which source files still link to `https://www.querypie.com` or another
  QueryPie-owned host?
- Is a link likely a migration defect, an intentional product/docs/app link, or
  historical content that should not be bulk-edited?
- What must be refreshed when this document is updated again?

Third-party external links are out of scope here and are tracked separately in
issue #522.

## Current baseline

- Repository: `querypie/corp-web-japan`
- Source baseline: `origin/main` at `247c20f107862b61d2cb25bf6f9639b98c3402d0`
- Refreshed at: `2026-05-15 07:05 UTC`
- Verification type: static source scan only; no local build, browser run, or
  live HTTP validation was performed for this document update.
- Parent issue: https://github.com/querypie/corp-web-japan/issues/521

Recent main changes reflected in this snapshot:

- PR #523 kept the ACP preview integration link local.
- PR #525 replaced homepage legacy QueryPie content links with local content
  links.
- PR #529 replaced the remaining blog-to-whitepaper legacy content links with
  local whitepaper routes.

## Scan scope

Included:

- Tracked files under `src/**`.
- Implementation and content extensions: `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`,
  `.cjs`, `.css`, and `.mdx`.
- Literal `http://` or `https://` references whose host is `querypie.com`,
  `querypie.ai`, or a subdomain of either domain.

Excluded:

- `docs/**`, `.agents/**`, `.github/**`, `tests/**`, generated output, caches,
  and package-manager files.
- Third-party external URLs. See issue #522 for that audit.
- Relative internal links such as `/blog/...`, `/whitepapers/...`, and
  `/contact-us?...`.

## Current summary

| Metric | Count |
| --- | ---: |
| Scanned source files | 439 |
| QueryPie-owned URL occurrences | 108 |
| Files containing QueryPie-owned URLs | 57 |
| Distinct QueryPie-owned URLs | 48 |
| Distinct QueryPie-owned hosts | 8 |
| QueryPie-owned occurrences in code files | 46 |
| QueryPie-owned occurrences in MDX files | 62 |

Host breakdown:

| Host | Occurrences | Review meaning |
| --- | ---: | --- |
| `docs.querypie.com` | 48 | Product documentation host; usually intentional when the target is product docs. |
| `www.querypie.com` | 22 | Legacy public site host; highest migration priority when the path is `/ja/**`. |
| `app.querypie.com` | 18 | Product app host; usually intentional app/action CTA. |
| `www.querypie.ai` | 12 | Current Japan public site host; prefer relative links for same-site navigation unless the context is a quoted/company-information block. |
| `aip-docs.app.querypie.com` | 4 | Product documentation/app host; usually intentional. |
| `trust.querypie.com` | 2 | Trust Center host; usually intentional. |
| `dl.querypie.com` | 1 | QueryPie download host; review only as a download/security dependency. |
| `querypie.ai` | 1 | Current site origin in `src/lib/site-url.ts`; intentional. |

Migration-priority breakdown:

| Category | Occurrences | Current status |
| --- | ---: | --- |
| Legacy `www.querypie.com/ja/**` | 13 | Only redirect route files remain; no MDX/content body occurrences remain in this snapshot. |
| `www.querypie.com` non-`/ja` | 9 | Locale catch-all redirects, missing-path forwarding base, and historical privacy-policy text. |
| Current `querypie.ai` / `www.querypie.ai` | 13 | Mostly company-information blocks in blog/news/event MDX plus the canonical site URL helper. |
| QueryPie subdomains | 73 | Docs/app/trust/download destinations; generally not local-route migration defects. |

## Quick status: `querypie.com/ja` links

Current status: content-link replacement is effectively complete for
`www.querypie.com/ja/**` MDX/content references. The remaining entries are route
redirect shims that intentionally point old local paths back to the legacy
corporate site.

Quick verification command:

```bash
grep -R "https://www.querypie.com/ja" -n src \
  --include='*.ts' --include='*.tsx' --include='*.mdx'
```

Expected current result: only the 10 route files below.

| Local route file | Current external target | Local replacement candidate | Completion note |
| --- | --- | --- | --- |
| `src/app/platform/ai/aihub/route.ts` | `https://www.querypie.com/ja/solutions/aip` | `/t/platforms/aip`, later `/platforms/aip` | Legacy redirect still external. Replace only when public route policy is settled. |
| `src/app/platform/ai/aip/route.ts` | `https://www.querypie.com/ja/solutions/aip` | `/t/platforms/aip`, later `/platforms/aip` | Legacy redirect still external. |
| `src/app/platform/ai/aip/fde-services/route.ts` | `https://www.querypie.com/ja/solutions/aip/fde-services` | `/t/services/fde`, later `/services/fde` | Legacy redirect still external. |
| `src/app/platform/security/database-access-controller/route.ts` | `https://www.querypie.com/ja/solutions/acp/database-access-controller` | `/t/platforms/acp/database-access-controller`, later `/platforms/acp/database-access-controller` | Legacy redirect still external. |
| `src/app/platform/security/kubernetes-access-controller/route.ts` | `https://www.querypie.com/ja/solutions/acp/kubernetes-access-controller` | `/t/platforms/acp/kubernetes-access-controller`, later `/platforms/acp/kubernetes-access-controller` | Legacy redirect still external. |
| `src/app/platform/security/system-access-controller/route.ts` | `https://www.querypie.com/ja/solutions/acp/system-access-controller` | `/t/platforms/acp/system-access-controller`, later `/platforms/acp/system-access-controller` | Legacy redirect still external. |
| `src/app/platform/security/web-access-controller/route.ts` | `https://www.querypie.com/ja/solutions/acp/web-access-controller` | `/t/platforms/acp/web-access-controller`, later `/platforms/acp/web-access-controller` | Legacy redirect still external. |
| `src/app/services/acp/route.ts` | `https://www.querypie.com/ja/solutions/acp` | `/t/platforms/acp`, later `/platforms/acp` | Legacy redirect still external. |
| `src/app/services/aip/route.ts` | `https://www.querypie.com/ja/solutions/aip` | `/t/platforms/aip`, later `/platforms/aip` | Legacy redirect still external. |
| `src/app/services/fde/route.ts` | `https://www.querypie.com/ja/solutions/aip/fde-services` | `/t/services/fde`, later `/services/fde` | Legacy redirect still external. |

Do not rewrite these automatically just because preview `/t/**` routes exist.
The current repository policy is that promoted public routes should remove the
matching `/t/**` endpoints only at final release, and canonical route decisions
should be confirmed before implementation.

## Quick status: `querypie.com` non-`/ja` links

Quick verification command:

```bash
grep -R "https://www.querypie.com" -n src \
  --include='*.ts' --include='*.tsx' --include='*.mdx' |
  grep -v "https://www.querypie.com/ja" || true
```

Current non-`/ja` entries:

| File | Current URL | Current status |
| --- | --- | --- |
| `src/app/ja/[[...path]]/route.ts` | `https://www.querypie.com` | Old `/ja/**` catch-all redirect base. Intentional compatibility unless the catch-all strategy changes. |
| `src/app/ko/[[...path]]/route.ts` | `https://www.querypie.com` | Old `/ko/**` catch-all redirect base. Intentional compatibility unless the catch-all strategy changes. |
| `src/lib/querypie-content-redirect.ts` | `https://www.querypie.com` | Missing-path allowlist redirect base. Intentional for approved querypie.com fallback categories. |
| `src/content/privacy-policy/2023-08-25.mdx` | `https://www.querypie.com/ko/demo-request` | Historical privacy-policy text. Do not bulk-rewrite without legal/versioned-document approval. |
| `src/content/privacy-policy/2023-09-22.mdx` | `https://www.querypie.com/ko/demo-request` | Historical privacy-policy text. Do not bulk-rewrite without legal/versioned-document approval. |
| `src/content/privacy-policy/2024-06-07.mdx` | `https://www.querypie.com/ko/demo-request` | Historical privacy-policy text. Do not bulk-rewrite without legal/versioned-document approval. |

The privacy-policy files contain repeated Markdown link occurrences on adjacent
lines. Count occurrences separately, but treat each versioned document as one
review decision.

## Quick status: current `querypie.ai` self-links

Quick verification command:

```bash
grep -R -E "https://(www\\.)?querypie.ai" -n src \
  --include='*.ts' --include='*.tsx' --include='*.mdx'
```

Current status:

- `src/lib/site-url.ts` defines the canonical site origin as
  `https://querypie.ai`; this is intentional.
- Blog/news company-information blocks for Mitoco Buddy announcements still use
  `https://www.querypie.ai/ja` or `https://www.querypie.ai/ja/`. These are
  quoted company-profile style links, not ordinary same-site navigation.
- Event MDX cooperation/sponsor references use `https://www.querypie.ai/ja` or
  `https://www.querypie.ai`. Review only if the event content policy changes;
  do not bulk-rewrite as route migration.

Prefer relative links only when the link is authored as site navigation or a CTA
inside the current site. Preserve absolute `querypie.ai` URLs when they are part
of imported press/news/event company-information text unless the content owner
explicitly asks for normalization.

## QueryPie-owned subdomains

These are external absolute URLs but not legacy public-site migration targets.

| Host | Current examples | Status |
| --- | --- | --- |
| `docs.querypie.com` | `src/app/api-docs.html/route.ts`, ACP preview learn-more links, glossary/manual MDX related items and CTAs | Product documentation destination. Usually keep. |
| `aip-docs.app.querypie.com` | AIP manual related items and CTA links | Product documentation destination. Usually keep. |
| `app.querypie.com` | Plan CTA buttons, internal demo CTA, whitepaper CTA buttons | Product app destination. Usually keep unless a local contact/download route is explicitly required. |
| `trust.querypie.com` | Certifications page and home security section | Trust Center destination. Usually keep. |
| `dl.querypie.com` | ACP Community install command in manuals | Direct download/install dependency. Review only for security/download-policy reasons. |

## Fast verification checklist

Use this checklist when checking whether issue #521 is still complete or whether
a new PR reintroduced stale links.

1. Re-run the scan from latest `origin/main`.
2. Confirm `https://www.querypie.com/ja` appears only in the 13 known redirect
   route files above.
3. Confirm no `src/content/**/*.mdx` file contains `https://www.querypie.com/ja`.
4. Confirm `www.querypie.com` non-`/ja` entries are limited to catch-all redirect
   infrastructure plus historical privacy-policy versions, unless a new intended
   exception is documented here.
5. Confirm same-site `querypie.ai` links are either the site origin helper,
   imported company-information text, or an explicitly intentional absolute URL.
6. Confirm QueryPie subdomain links are docs/app/trust/download destinations, not
   accidental substitutes for local marketing/resource pages.
7. If a link is changed, run a narrow grep proving the old URL is gone and the
   new route exists in `src/app/**` or the relevant MDX content record.

## How to update this document

When rewriting or refreshing this document:

1. Start from the latest `origin/main` in a non-main worktree.
2. Capture the exact baseline SHA and UTC refresh time.
3. Re-run the static scan over tracked `src/**` files with the scope above.
4. Update all count tables, not just the changed row.
5. Re-run the quick verification commands in the three status sections.
6. If `www.querypie.com/ja/**` appears outside the known redirect route files,
   add it to the status table and classify it as:
   - already fixed by local route replacement,
   - still needs local replacement,
   - intentionally preserved, or
   - blocked by route-policy/content-owner decision.
7. Keep `querypie.com/ja` migration findings separate from QueryPie docs/app
   hosts. Do not mark `docs.querypie.com`, `app.querypie.com`,
   `trust.querypie.com`, or `dl.querypie.com` as defects merely because they are
   absolute URLs.
8. Do not rewrite historical privacy-policy URLs without explicit legal or
   versioned-document approval.
9. Keep issue #522 and this document separate: issue #522 is for third-party
   external links; this document is only for QueryPie-owned hosts.
10. If this document is updated by a PR that should replace issue #521, include
    an auto-closing keyword in the PR body so the issue closes on merge.

Minimal scan script:

```bash
git fetch origin --prune
git worktree add .worktrees/querypie-owned-link-audit-refresh \
  -b docs/querypie-owned-link-audit-refresh origin/main
cd .worktrees/querypie-owned-link-audit-refresh
python3 - <<'PY'
import re
import subprocess
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

exts = {'.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.mdx'}
url_re = re.compile(r"https?://[^\s\]\\)\}\"'<>`]+")
files = subprocess.check_output(['git', 'ls-files', 'src'], text=True).splitlines()
records = []

for file_name in files:
    path = Path(file_name)
    if path.suffix not in exts:
        continue
    text = path.read_text(errors='ignore')
    for match in url_re.finditer(text):
        url = match.group(0).rstrip('.,;:')
        parsed = urlparse(url)
        host = parsed.netloc.lower().split('@')[-1].split(':')[0]
        if not (
            host == 'querypie.com'
            or host.endswith('.querypie.com')
            or host == 'querypie.ai'
            or host.endswith('.querypie.ai')
        ):
            continue
        line = text.count('\n', 0, match.start()) + 1
        records.append((file_name, line, url, host, parsed.path))

print('scanned source files:', len([f for f in files if Path(f).suffix in exts]))
print('occurrences:', len(records))
print('files with URLs:', len({r[0] for r in records}))
print('distinct URLs:', len({r[2] for r in records}))
print('host counts:')
for host, count in Counter(r[3] for r in records).most_common():
    print(f'  {host}: {count}')

print('\nwww.querypie.com/ja entries:')
for file_name, line, url, host, path in records:
    if host == 'www.querypie.com' and path.startswith('/ja/'):
        print(f'{file_name}:{line}: {url}')
PY
```

## Done criteria for issue #521

Issue #521 can be considered replaced by this document when:

- This document exists under `docs/` and is linked from the resolving PR.
- The current `www.querypie.com/ja/**` status is captured from latest
  `origin/main`.
- The current `www.querypie.com` non-`/ja` status is captured from latest
  `origin/main`.
- The document explains which remaining entries are intentionally external and
  which entries still require route-policy decisions before they can be changed.
- The document includes a repeatable scan/update procedure.
- The resolving PR body includes `Closes #521`, so GitHub closes the issue when
  the PR is merged.
