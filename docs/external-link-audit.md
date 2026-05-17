# External link audit reference

This document converts issue #522 into a durable repository reference for
external URL review. Use it to quickly decide whether a URL that appears in
implemented pages, shared code, or MDX content is intentional, stale, or likely
wrong.

## Current baseline

- Repository: `querypie/corp-web-japan`
- Source baseline: `origin/main` at `f3382958b0ce8c89c93d04ccf689606bc13f1948`
- Refreshed at: `2026-05-17 13:50:51 UTC`
- Verification type: static source scan only; no local build, browser run, or
  live HTTP validation was performed for this document update.
- Parent issue: https://github.com/querypie/corp-web-japan/issues/522

## Scope

Included:

- Tracked files under `src/**`.
- Implementation and content extensions: `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`,
  `.cjs`, `.css`, and `.mdx`.
- Literal `http://` or `https://` references in code, frontmatter, MDX body, and
  JSX.

Excluded:

- `docs/**`, `.agents/**`, `.github/**`, `tests/**`, generated output, caches,
  and package-manager files.
- `node_modules/**` and package registry URLs such as
  `https://www.npmjs.com/package/...`.
- Relative internal links such as `/blog/...`, `/whitepapers/...`, and
  `/contact-us?...`.

QueryPie-owned hosts are tracked separately and are not counted as third-party
cleanup targets here:

- `docs.querypie.com`
- `www.querypie.com`
- `app.querypie.com`
- `aip-docs.app.querypie.com`
- `trust.querypie.com`
- `dl.querypie.com`
- `querypie.ai`
- `www.querypie.ai`

## Current summary

| Metric | Count |
| --- | ---: |
| Scanned source files | 446 |
| External URL occurrences, excluding npm package registry URLs | 912 |
| Third-party URL occurrences | 816 |
| Files containing third-party URLs | 159 |
| Distinct third-party URLs | 513 |
| Distinct third-party hosts | 251 |
| Third-party occurrences in code files | 38 |
| Third-party occurrences in MDX content | 778 |

Third-party references are mostly content citations. Treat the code references
and CTA-like MDX links as the first review priority.

| Category | Occurrences | Review meaning |
| --- | ---: | --- |
| Vendor, news, or general reference | 492 | Usually citation/reference; check only when it acts like a CTA or source-of-truth link. |
| Social/media | 110 | Check embed availability, external navigation intent, and fallback behavior. |
| Legal/privacy authority | 63 | Usually legal notice support; review separately from marketing links. |
| Technical docs/source reference | 60 | Usually citation or documentation support; check freshness when user-facing. |
| Event/form/demo service | 44 | High priority because registrations and event pages expire. |
| Research/citation | 34 | Usually content citation; validate only when source quality is in question. |
| URL shortener | 13 | High priority; prefer final destination URLs or document why the shortener must remain. |

## Code and page references

These are third-party URL references in non-MDX files. Page routes should be
reviewed before content citations because they are more likely to affect live UI,
CTA behavior, embeds, or shared components.

| File | Route / surface | Count | Hosts | Current status |
| --- | --- | ---: | --- | --- |
| `src/app/about-us/page.tsx` | `/about-us` | 6 | `www.linkedin.com` | Leadership profile links. Intentional external social links if profiles are current. |
| `src/app/internal/sections/page.tsx` | `/internal/sections` | 6 | `www.youtube.com` | Internal demo only. Contains placeholder-like YouTube IDs; do not treat as public page links, but avoid copying them to production pages. |
| `src/app/page.tsx` | `/` | 1 | `www.youtube.com` | Home page embedded YouTube video. Validate exact video availability when changing home media. |
| `src/app/solutions/ai-crew/page.tsx` | `/solutions/ai-crew` | 5 | `youtu.be` | AI Crew use-case video links. Validate as public page media links. |
| `src/app/platforms/acp/database-access-controller/page.tsx` | `/platforms/acp/database-access-controller` | 1 | `www.youtube.com` | Public ACP child-page embed. Validate exact video availability when changing page media. |
| `src/app/platforms/acp/kubernetes-access-controller/page.tsx` | `/platforms/acp/kubernetes-access-controller` | 1 | `www.youtube.com` | Public ACP child-page embed. Validate exact video availability when changing page media. |
| `src/app/platforms/acp/system-access-controller/page.tsx` | `/platforms/acp/system-access-controller` | 1 | `www.youtube.com` | Public ACP child-page embed. Validate exact video availability when changing page media. |
| `src/components/layout/site-footer.tsx` | Site footer | 5 | `kr.linkedin.com`, `www.youtube.com`, `x.com`, `www.facebook.com`, `www.instagram.com` | Shared social links. Review as site-wide navigation, not page-specific content. |
| `src/components/sections/acp/service-page.tsx` | ACP shared section | 1 | `www.youtube.com` | Shared ACP media embed; check routes importing this component before changing. |
| `src/components/sections/ai-crew/use-cases-section.tsx` | AI Crew section component | 2 | `img.youtube.com`, `www.youtube.com` | Dynamic YouTube thumbnail/embed templates based on `videoId`; scanner sees partial template strings. Validate by checking page-provided video IDs. |
| `src/components/sections/aip/thumbnail-youtube.tsx` | AIP shared media component | 1 | `www.youtube.com` | Shared AIP media embed; check routes importing this component before changing. |
| `src/components/sections/internal-demo/use-case-showcase.tsx` | Internal demo section component | 2 | `img.youtube.com`, `www.youtube.com` | Dynamic YouTube thumbnail/embed templates for internal demo cards. |
| `src/components/sections/mcp-gateway/section.tsx` | MCP gateway section | 1 | `www.w3.org` | SVG namespace value. Not an external navigation or fetch dependency. |
| `src/components/sections/publication/share-buttons.tsx` | Publication share buttons | 3 | `www.facebook.com`, `twitter.com`, `www.linkedin.com` | Intentional outbound share endpoints. Keep encoded current page URL behavior intact. |
| `src/components/ui/brand-gradient-cta-button.tsx` | Shared CTA primitive | 1 | `www.w3.org` | SVG namespace value. Not an external navigation or fetch dependency. |
| `src/lib/forms/server/slack-notification.ts` | Server-side contact form integration | 1 | `slack.com` | Backend Slack API endpoint. Operational dependency; do not rewrite as a content link. |

## QueryPie-owned external hosts

These hosts are external absolute URLs but owned by QueryPie. They are not
third-party cleanup targets, but they may still require route-policy review when
local replacements exist.

| Host | Occurrences | Review note |
| --- | ---: | --- |
| `docs.querypie.com` | 48 | Product documentation host. Keep when the target is product docs, not local marketing content. |
| `www.querypie.com` | 9 | Legacy/current corporate site host. Check whether the local site now owns the page before leaving absolute links. |
| `app.querypie.com` | 19 | Product app host. Usually intentional app CTA. |
| `www.querypie.ai` | 12 | Current Japan site host. Prefer relative links when linking within the same site. |
| `aip-docs.app.querypie.com` | 4 | Product docs/app host. |
| `trust.querypie.com` | 2 | Trust center host. Usually intentional external trust destination. |
| `dl.querypie.com` | 1 | QueryPie download host. |
| `querypie.ai` | 1 | Current Japan site host. Prefer relative links when same-site. |

## Highest-density third-party files

High counts do not automatically mean a problem. Most of these are research,
legal, or citation-heavy MDX files. Use this table to prioritize bulk review.

| File | Type | Third-party occurrences | Main hosts |
| --- | --- | ---: | --- |
| `src/content/whitepapers/20-beyond-mcp-to-mcps.mdx` | MDX | 64 | `www.cloudflare.com`, `aws.amazon.com`, `en.wikipedia.org`, `modelcontextprotocol.io` |
| `src/content/whitepapers/17-ai-autonomous-access-control.mdx` | MDX | 44 | `docs.aws.amazon.com`, `www.wiz.io`, `genai.owasp.org`, `www.paloaltonetworks.com` |
| `src/content/whitepapers/23-rag-security-querypie-builds-the-bridge.mdx` | MDX | 35 | `learn.microsoft.com`, `doi.org`, `aws.amazon.com`, `www.openpolicyagent.org` |
| `src/content/whitepapers/16-next-step-mcp-pam.mdx` | MDX | 32 | `docs.aws.amazon.com`, `aws.amazon.com`, `www.ibm.com`, `www.youtube.com` |
| `src/content/whitepapers/18-uncovering-mcp-security.mdx` | MDX | 30 | `arxiv.org`, `www.researchgate.net`, `www.preprints.org`, `www.anthropic.com` |
| `src/content/privacy-policy/2025-09-08.mdx` | MDX | 25 | `www.salesforce.com`, `auth0.com`, `www.atlassian.com`, `workspace.google.com` |
| `src/content/whitepapers/15-redefining-pam-for-the-mcp-era.mdx` | MDX | 23 | `www.microsoft.com`, `medium.com`, `thehackernews.com`, `www.anthropic.com` |
| `src/content/privacy-policy/2025-07-28.mdx` | MDX | 22 | `www.salesforce.com`, `workspace.google.com`, `www.atlassian.com`, `auth0.com` |
| `src/content/privacy-policy/2025-06-10.mdx` | MDX | 21 | `workspace.google.com`, `www.salesforce.com`, `www.atlassian.com`, `instruqt.com` |
| `src/content/privacy-policy/2025-07-15.mdx` | MDX | 21 | `www.salesforce.com`, `workspace.google.com`, `www.atlassian.com`, `auth0.com` |

## Domains to review first

| Host | Occurrences | Category | Files | First observed file |
| --- | ---: | --- | ---: | --- |
| `www.youtube.com` | 89 | Social/media | 83 | `src/app/internal/sections/page.tsx` |
| `bit.ly` | 13 | URL shortener | 1 | `src/content/blog/13-what-businesses-can-learn-from-sentiment-analysis.mdx` |
| `air.co.jp` | 10 | Event/form/demo service | 7 | `src/content/events/16-air-company-querypie-zerotrust-webinar.mdx` |
| `instruqt.com` | 10 | Event/form/demo service | 5 | `src/content/privacy-policy/2024-11-29.mdx` |
| `us02web.zoom.us` | 9 | Event/form/demo service | 9 | `src/content/events/20-air-company-querypie-mcp-webinar.mdx` |
| `monday.com` / `forms.monday.com` | 7+ | Event/form/demo service | multiple | Event/form CTA dependencies |
| `www.linkedin.com` | 11 | Social/media | 5 | `src/app/about-us/page.tsx` |
| `www.kopico.go.kr`, `privacy.kisa.or.kr`, `www.spo.go.kr`, `www.simpan.go.kr`, `ecrm.cyber.go.kr` | 53 | Legal/privacy authority | multiple privacy-policy versions | Legal/privacy notices; review with legal context. |

## Likely wrong or high-risk references

This section is intentionally conservative. It identifies references that deserve
manual review, not confirmed defects.

| Pattern | Current examples | Why it is risky | Preferred action |
| --- | --- | --- | --- |
| URL shorteners | `src/content/blog/13-what-businesses-can-learn-from-sentiment-analysis.mdx` lines 76-88 use `bit.ly` | Final destination is opaque, can expire, and is hard to audit. | Replace with final destination URLs, or document why the shortener is required. |
| AI/source tracking parameters | `src/content/whitepapers/24-ai-transformation-japan.mdx` and `25-ai-transformation-japan.mdx` contain `utm_source=chatgpt.com` URLs | Looks like generated-source residue rather than intentional canonical citation. | Remove tracking parameters or replace with canonical source URLs after content review. |
| Placeholder video IDs | `src/app/internal/sections/page.tsx` uses `dQw4w9WgXcQ` and `oHg5SJYRHA0` | Acceptable only in internal demos; wrong if copied to public pages. | Keep internal-only or replace before public reuse. |
| Event registration dependencies | `src/content/events/*` references `us02web.zoom.us` and `air.co.jp` | Event registration pages expire or close. | For past events, decide whether detail pages should keep archive links, remove registration CTAs, or link to a local event summary. |
| External form services | `monday.com` / `forms.monday.com` references | Third-party form state can drift from local CTA expectations. | Check whether the local contact-us flow or a QueryPie-owned form should be used instead. |
| Example unsafe domain | `src/content/whitepapers/8-secure-login-token-management.mdx` includes `https://vulerable-shop.com/api/purchase` | It appears to be an intentionally vulnerable/example domain, but the spelling itself looks suspicious. | Confirm it is intentionally illustrative; if not, replace with a reserved example domain. |
| Dynamic YouTube templates | `src/components/sections/ai-crew/use-cases-section.tsx` and `src/components/sections/internal-demo/use-case-showcase.tsx` | Static regex scanners report partial template URLs. | Validate by checking the actual `videoId` values provided by the page or fixture. |
| SVG namespace URLs | `http://www.w3.org/2000/svg` in SVG strings | Not an outbound navigation or fetch link. | Leave as-is; do not count as a broken external content reference. |

## Review decision checklist

When a new or existing external URL is questioned, classify it with this order:

1. Is it a QueryPie-owned host?
   - If yes, decide whether the local site has a canonical relative route now.
   - Prefer relative same-site links for `querypie.ai` pages.
   - Keep `docs.querypie.com`, `trust.querypie.com`, and `app.querypie.com` when
     they intentionally leave the marketing site.
2. Is it in code or shared UI?
   - Code/page links are higher priority than citation-heavy MDX references.
   - Check the public route or component importers before rewriting shared
     component URLs.
3. Is it a CTA, form, registration, download, or app action?
   - These must be current and intentional.
   - Prefer local `/contact-us` with stable query parameters when the action is a
     contact-form prefill.
   - Prefer local gated publication routes when the content is locally managed.
4. Is it a citation/reference link?
   - Preserve if it supports the article and the source remains credible.
   - Remove tracking parameters that are not part of the canonical citation.
5. Is it a shortener or expiring event link?
   - Treat as high-risk until the final destination and business intent are
     confirmed.
6. Is it legal/privacy content?
   - Do not bulk-rewrite with marketing-link rules.
   - Keep public authority/vendor processing links if they are part of a legal
     notice and still valid.
7. Is it an internal demo route?
   - Internal demos may contain placeholders, but they must not be treated as
     production content or copied into public pages without validation.

## How to refresh this document

1. Start from the latest `origin/main` in a non-main worktree.
2. Re-run a static scan over tracked `src/**` files with the same scope above.
3. Update the baseline SHA, refresh time, summary counts, code/page table, top
   hosts, high-density files, and high-risk references.
4. Keep this document factual. Do not mark a URL as broken unless it was checked
   directly with HTTP/browser validation.
5. Keep QueryPie-owned hosts separate from third-party hosts.
6. Do not add `docs/**`, `.agents/**`, `.github/**`, `tests/**`, lockfiles, or
   dependency URLs back into the audit scope unless issue #522 is explicitly
   reopened with a broader repository-documentation scope.
7. If a PR updates this document as the issue-resolution artifact, use a PR body
   closing keyword only when the issue should close on merge.

Minimal scan command shape:

```bash
git fetch origin --prune
git worktree add .worktrees/docs-external-link-audit-refresh \
  -b docs/external-link-audit-refresh origin/main
cd .worktrees/docs-external-link-audit-refresh
python3 - <<'PY'
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

exts = {'.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.mdx'}
owned_hosts = {
    'docs.querypie.com',
    'www.querypie.com',
    'app.querypie.com',
    'aip-docs.app.querypie.com',
    'trust.querypie.com',
    'dl.querypie.com',
    'querypie.ai',
    'www.querypie.ai',
}
url_re = re.compile(r'https?://[^\s\]\\)\}"\'<>]+')
records = []

for path in Path('src').rglob('*'):
    if not path.is_file() or path.suffix not in exts:
        continue
    text = path.read_text(errors='ignore')
    for match in url_re.finditer(text):
        url = match.group(0).rstrip('.,;:')
        parsed = urlparse(url)
        host = parsed.netloc.lower().split('@')[-1].split(':')[0]
        if host == 'www.npmjs.com' and parsed.path.startswith('/package/'):
            continue
        line = text.count('\n', 0, match.start()) + 1
        owned = (
            host in owned_hosts
            or host.endswith('.querypie.com')
            or host.endswith('.querypie.ai')
        )
        records.append((str(path), line, url, host, owned))

third_party = [record for record in records if not record[4]]
print('all external URL occurrences:', len(records))
print('third-party URL occurrences:', len(third_party))
print('files with third-party URLs:', len({record[0] for record in third_party}))
print('distinct third-party URLs:', len({record[2] for record in third_party}))
print('distinct third-party hosts:', len({record[3] for record in third_party}))
print('\nTop hosts:')
for host, count in Counter(record[3] for record in third_party).most_common(40):
    print(f'{count:4} {host}')
print('\nTop files:')
for file, count in Counter(record[0] for record in third_party).most_common(40):
    print(f'{count:4} {file}')
PY
```

After refreshing, run at least:

```bash
git diff --check -- docs/external-link-audit.md
git diff -- docs/external-link-audit.md
```

For a docs-only update, local build/test is not required unless the update also
changes code, routing, or MDX rendering behavior.
