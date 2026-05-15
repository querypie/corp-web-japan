# QueryPie Japan Static Pages Migration Goal Plan

> **For agentic workers:** REQUIRED: Use `/goal` to track this as one
> long-running objective, then use the repo skills named below before each PR.
> Keep checklist state in this document or in the active goal summary. Do not
> mark the goal complete until every required preview route is review-ready for
> later public-route promotion, or explicitly moved to the out-of-scope section
> with a dated rationale.

**Goal:** Complete the migration of remaining `querypie.com/ja/**` static and
widget-backed pages into `corp-web-japan` as `/t/**` preview pages that are
ready for human review and later public-route promotion.

**Recommended `/goal` objective:**

```text
Complete the QueryPie Japan static page migration prep work by making every
remaining querypie.com/ja static or widget-backed page available as a local
corp-web-japan /t/** preview route, preserving source behavior and
browser-rendered parity, so the pages are ready for JK's review before any
public-route promotion.
```

**Architecture:** Keep the implementation scope on `/t/**` preview routes. Do
not remove the `/t` prefix, replace public redirects, update public sitemap
entries, or change public canonicals in this goal. Use `../corp-web-contents`
for authored Japanese content, `../corp-web-app` for behavior/component/CSS
contracts, and the live `https://www.querypie.com/ja/**` page for shipped
rendering. Treat widget pages such as `/plans` differently from ordinary static
marketing pages: preserve upstream component behavior and CSS contract before
applying route-local cleanup.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4,
MDX where route-adjacent long-form content is the clearest source format, npm,
Playwright/browser DevTools for render parity.

---

## Source Of Truth

- Scope reference:
  `https://github.com/querypie/corp-web-japan/wiki/Route-Local-Authoring-ko`
- Local repo guide:
  `AGENTS.md`
- Route-local authoring guide:
  `docs/static-page-route-local-authoring.md`
- Code placement guide:
  `docs/code-location-conventions.md`
- Browser parity guide:
  `docs/browser-render-parity-comparison.md`
- External source repositories:
  `../corp-web-app` and `../corp-web-contents`

At the start of the goal, refresh `origin/main`, reread the wiki page, and
confirm whether any routes below have already been migrated since this document
was written on 2026-05-15.

## Required Skills

Use these skills in this order for source and implementation work:

- `.agents/skills/querypie-ja-source-triangulation/SKILL.md`
- `.agents/skills/querypie-ja-preview-route-implementation/SKILL.md`
- `.agents/skills/querypie-ja-preview-route-parity/SKILL.md` for existing
  `/t/platforms/**`, `/t/services/**`, and `/t/plans` parity follow-up work
- `.agents/skills/static-page-route-local-authoring/SKILL.md`
- `.agents/skills/querypie-preview-root-rem-parity/SKILL.md`
- `.agents/skills/browser-render-parity-comparison/SKILL.md`, then
  `docs/browser-render-parity-comparison.md`
- `.agents/skills/mdx-refactoring-formatting/SKILL.md` only when a route uses
  route-adjacent `content.mdx`

For PR handling, use:

- `/Users/jk/.codex/skills/github-cli-safety-governed/SKILL.md`
- `/Users/jk/.codex/skills/ci-follow-through-governed/SKILL.md`

## Route Inventory

Scope rule: every in-scope page must end as a reviewable `/t/**` preview route.
The public route listed below is only the expected future promotion target for
JK's later review. Do not implement that promotion in this goal.

- Source: `https://www.querypie.com/ja/solutions/aip`
  - Current preview: `/t/platforms/aip`
  - Future promotion candidate: `src/app/platforms/aip/page.tsx`
    (`/platforms/aip`)
  - Public aliases to leave unchanged in this goal: `/solutions/aip`,
    `/services/aip`, `/platform/ai/aip`, `/platform/ai/aihub`
  - Content mapping:
    `../corp-web-contents/pages/solutions/aip/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/aip/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/aip/usage-based-llm`
  - Current preview: `/t/platforms/aip/usage-based-llm`
  - Future promotion candidate:
    `src/app/platforms/aip/usage-based-llm/page.tsx`
    (`/platforms/aip/usage-based-llm`)
  - Public aliases to leave unchanged in this goal:
    `/solutions/aip/usage-based-llm`,
    `/platform/ai/aip/usage-based-llm`
  - Content mapping:
    `../corp-web-contents/pages/solutions/aip/usage-based-llm/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/aip/usage-based-llm/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/aip/mcp-gateway`
  - Current preview: `/t/platforms/aip/mcp-gateway`
  - Future promotion candidate: `src/app/platforms/aip/mcp-gateway/page.tsx`
    (`/platforms/aip/mcp-gateway`)
  - Public aliases to leave unchanged in this goal: `/solutions/aip/mcp-gateway`,
    `/platform/ai/aip/mcp-gateway`
  - Content mapping:
    `../corp-web-contents/pages/solutions/aip/mcp-gateway/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/aip/mcp-gateway/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/aip/integrations`
  - Current preview: `/t/platforms/aip/integrations`
  - Future promotion candidate: `src/app/platforms/aip/integrations/page.tsx`
    (`/platforms/aip/integrations`)
  - Public aliases to leave unchanged in this goal: `/solutions/aip/integrations`,
    `/platform/ai/aip/integrations`
  - Content mapping:
    `../corp-web-contents/pages/solutions/aip/integrations/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/aip/integrations/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/aip/fde-services`
  - Current preview: `/t/services/fde`
  - Future promotion candidate: `src/app/services/fde/page.tsx`
    (`/services/fde`)
  - Public aliases to leave unchanged in this goal: `/solutions/aip/fde-services`,
    `/platform/ai/aip/fde-services`
  - Content mapping:
    `../corp-web-contents/pages/solutions/aip/fde-services/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/aip/fde-services/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/acp`
  - Current preview: `/t/platforms/acp`
  - Future promotion candidate: `src/app/platforms/acp/page.tsx`
    (`/platforms/acp`)
  - Public aliases to leave unchanged in this goal: `/solutions/acp`,
    `/services/acp`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/acp/database-access-controller`
  - Current preview: `/t/platforms/acp/database-access-controller`
  - Future promotion candidate:
    `src/app/platforms/acp/database-access-controller/page.tsx`
    (`/platforms/acp/database-access-controller`)
  - Public aliases to leave unchanged in this goal:
    `/solutions/acp/database-access-controller`,
    `/platform/security/database-access-controller`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/database-access-controller/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/database-access-controller/ja/meta.json`

- Source:
  `https://www.querypie.com/ja/solutions/acp/kubernetes-access-controller`
  - Current preview: `/t/platforms/acp/kubernetes-access-controller`
  - Future promotion candidate:
    `src/app/platforms/acp/kubernetes-access-controller/page.tsx`
    (`/platforms/acp/kubernetes-access-controller`)
  - Public aliases to leave unchanged in this goal:
    `/solutions/acp/kubernetes-access-controller`,
    `/platform/security/kubernetes-access-controller`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/kubernetes-access-controller/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/kubernetes-access-controller/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/acp/system-access-controller`
  - Current preview: `/t/platforms/acp/system-access-controller`
  - Future promotion candidate:
    `src/app/platforms/acp/system-access-controller/page.tsx`
    (`/platforms/acp/system-access-controller`)
  - Public aliases to leave unchanged in this goal:
    `/solutions/acp/system-access-controller`,
    `/platform/security/system-access-controller`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/system-access-controller/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/system-access-controller/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/acp/web-access-controller`
  - Current preview: `/t/platforms/acp/web-access-controller`
  - Future promotion candidate:
    `src/app/platforms/acp/web-access-controller/page.tsx`
    (`/platforms/acp/web-access-controller`)
  - Public aliases to leave unchanged in this goal:
    `/solutions/acp/web-access-controller`,
    `/platform/security/web-access-controller`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/web-access-controller/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/web-access-controller/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/acp/integrations`
  - Current preview: `/t/platforms/acp/integrations`
  - Future promotion candidate: `src/app/platforms/acp/integrations/page.tsx`
    (`/platforms/acp/integrations`)
  - Public aliases to leave unchanged in this goal:
    `/solutions/acp/integrations`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/integrations/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/integrations/ja/meta.json`
  - Note: this route has a preview route but no explicit public redirect route
    on latest main. Do not omit it from completion just because it lacks a
    current `src/app/**/route.ts` redirect.

- Source: `https://www.querypie.com/ja/plans`
  - Current preview: `/t/plans`
  - Future promotion candidate: `src/app/plans/page.tsx` (`/plans`)
  - Public aliases to leave unchanged in this goal: `/pricing`
  - Content mapping: `../corp-web-contents/pages/plans/ja/content.mdx`
  - Behavior and CSS source:
    `../corp-web-app/src/app/ja/plans/page.tsx`,
    `../corp-web-app/src/components/widget/pricing/*`,
    `../corp-web-app/src/components/widget/compare-table/*`
  - Note: treat this as a widget/application-contract page. Text presence and
    generic Tailwind cards are not sufficient completion evidence.

## Execution Model

- [ ] **Step 1: Create the active `/goal`**
  - Use the objective text above.
  - Record the active branch/worktree and the latest `origin/main` SHA.
  - Link this document in the goal summary.

- [ ] **Step 2: Refresh scope**
  - Open the wiki page and compare it with the route inventory above.
  - Run `find src/app/t -maxdepth 5 -name page.tsx | sort`.
  - Run `find src/app -maxdepth 5 \( -name page.tsx -o -name route.ts \) |
    sort`.
  - Update this document if new previews, public pages, or redirects have
    landed since 2026-05-15.

- [ ] **Step 3: Confirm future promotion taxonomy**
  - Keep implementation on `/t/**` routes only.
  - Record the likely future public route for reviewer context, but do not
    create or modify public routes in this goal.
  - If the team chooses `/solutions/**` or existing legacy `/platform/**` paths
    as future public targets, update only the `Future promotion candidate`
    entries before implementation.

- [ ] **Step 4: Split work into PR-sized batches**
  - Suggested PR 1: AIP landing and AIP child pages.
  - Suggested PR 2: FDE services page.
  - Suggested PR 3: ACP landing and ACP child pages.
  - Suggested PR 4: Plans widget page.
  - Each PR must start from latest `origin/main` in its own worktree.

- [ ] **Step 5: Triangulate each page before editing**
  - Read `../corp-web-contents` page content and metadata.
  - Read `../corp-web-app` route/component/CSS behavior where present.
  - Open the live `https://www.querypie.com/ja/**` URL and record shipped
    section order, root font size, heading sizes, wrappers, media dimensions,
    and interactive behavior.

- [ ] **Step 6: Implement or complete `/t/**` preview routes**
  - Do not replace public QueryPie redirects in this goal.
  - Preserve existing `/t/**` implementation only after parity review; do not
    copy stale preview code blindly.
  - Create missing `/t/**` routes only when the inventory says no preview exists.
  - Keep route-specific assets route-aligned under `public/<route-family>/**`.
  - Keep preview metadata non-indexed and canonicalized to the `/t/**` preview
    route.
  - Do not update `src/app/sitemap.ts` for preview-only work unless an existing
    test requires documenting why the preview route is intentionally excluded.
  - Do not rewrite local header/footer or public CTA links away from existing
    public routes unless the change is needed for preview-only navigation inside
    the `/t/**` page family.

- [ ] **Step 7: Preserve redirects and missing-path behavior**
  - Existing public redirects must remain unchanged during preview-readiness
    work unless a route is already a preview route.
  - If a preview page needs internal links to another migrated preview page,
    keep those links under `/t/**`.
  - Leave alias redirect and query-string preservation changes for the later
    promotion PR after JK review.
  - Do not broaden `src/lib/querypie-content-redirect.ts` beyond validated
    allowlist behavior.

- [ ] **Step 8: Add focused tests**
  - Add or update route tests that prove the route renders locally.
  - Add structure tests for route-local authoring boundaries when migrating
    from preview routes.
  - Add widget-contract tests for `/plans`: tab behavior, visible plan sets,
    comparison table structure, and upstream CSS-derived visual contracts.
  - Do not add public alias redirect tests in this goal unless an existing
    preview redirect is intentionally changed.

- [ ] **Step 9: Browser-render parity**
  - Follow `docs/browser-render-parity-comparison.md`.
  - Compare desktop `1440x900` and mobile `390x844` at minimum.
  - Add `320x844` or `360x844` when text wrapping or overflow is risky.
  - Capture screenshots, DOM geometry, computed styles, lazy media status, and
    root font-size evidence.
  - Classify differences as `defect`, `intentional adaptation`,
    `external live artifact`, `environment artifact`, or `needs decision`.
  - Fix all `defect` differences before marking the route done.

- [ ] **Step 10: Verify and ship each PR**
  - Run the narrowest relevant tests while developing.
  - Run `npm run test:ci` before PR creation or update.
  - Run `npm run build` only if a preview PR changes production rendering
    contracts, shared components, metadata conventions, or deployment behavior.
  - Create an English branch name and commit message.
  - Create a PR with a Korean description covering why, what, and impact.
  - Track CI with `env -u GITHUB_TOKEN gh pr checks` and exact-SHA
    `env -u GITHUB_TOKEN gh run list` until complete.

## Completion Criteria

The `/goal` can be marked complete only when all of these are true:

- Every route in the Route Inventory is either implemented as a `/t/**` preview
  route or moved to an explicit out-of-scope section with a dated rationale and
  owner decision.
- No completed `/t/**` route depends on `https://www.querypie.com/ja/**` for
  its primary page body.
- Preview metadata remains non-indexed and canonicalized to the `/t/**` route.
- Public route promotion, public canonical URLs, sitemap entries, and alias
  redirect changes are left untouched for JK's later review and promotion PR.
- Source triangulation notes exist in the relevant PR body or route-specific
  implementation notes.
- Browser-render parity evidence exists for every migrated page family.
- `npm run test:ci` passes for each implementation PR.
- `npm run build` passes for every PR that affects production rendering
  contracts, shared components, metadata conventions, or deployment behavior.
- PR CI is successful or the residual failure is explicitly classified as
  unrelated with exact run/log evidence.

## Out Of Scope Template

Use this only after an explicit decision:

```markdown
### YYYY-MM-DD: <route>

- Decision owner:
- Reason:
- Replacement route, if any:
- Redirect behavior:
- Follow-up issue/PR:
```

---

# QueryPie Japan 정적 페이지 이관 Goal 계획

> **Agentic worker 필수 지침:** 이 작업은 `/goal`로 하나의 장기 목표를
> 만들어 추적한다. 각 PR을 시작하기 전에 아래에 명시한 repo skill을 먼저
> 사용한다. 체크리스트 상태는 이 문서 또는 활성 goal 요약에 유지한다.
> 모든 필수 preview route가 추후 public-route 승격을 리뷰할 수 있는 상태가
> 되거나, 명시적인 owner 결정과 날짜가 있는 out-of-scope 항목으로 이동되기
> 전까지 goal을 완료 처리하지 않는다.

**목표:** 남아 있는 `querypie.com/ja/**` 정적 페이지와 widget-backed
페이지를 `corp-web-japan`의 `/t/**` preview page로 이관하고, 사람이 리뷰한
뒤 public route로 승격할 수 있는 상태로 만든다.

**권장 `/goal` objective:**

```text
Complete the QueryPie Japan static page migration prep work by making every
remaining querypie.com/ja static or widget-backed page available as a local
corp-web-japan /t/** preview route, preserving source behavior and
browser-rendered parity, so the pages are ready for JK's review before any
public-route promotion.
```

**아키텍처:** 이 goal의 구현 범위는 `/t/**` preview route로 제한한다. 이
goal에서는 `/t` prefix 제거, public redirect 교체, public sitemap 수정,
public canonical 변경을 하지 않는다. 작성된 일본어 콘텐츠는
`../corp-web-contents`를 기준으로 삼고, 동작, 컴포넌트, CSS contract는
`../corp-web-app`를 확인한다. 실제 사용자에게 배포된 화면은 live
`https://www.querypie.com/ja/**` 페이지를 브라우저에서 확인한다. `/plans`와
같은 widget page는 일반 static marketing page와 다르게 다루며, route-local
정리보다 upstream component behavior와 CSS contract 보존을 우선한다.

**기술 스택:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4,
route-adjacent long-form content가 가장 명확한 경우의 MDX, npm,
Playwright/browser DevTools 기반 render parity 검증.

## Source Of Truth

- 범위 참조:
  `https://github.com/querypie/corp-web-japan/wiki/Route-Local-Authoring-ko`
- 로컬 repo guide:
  `AGENTS.md`
- Route-local authoring guide:
  `docs/static-page-route-local-authoring.md`
- Code placement guide:
  `docs/code-location-conventions.md`
- Browser parity guide:
  `docs/browser-render-parity-comparison.md`
- 외부 source repository:
  `../corp-web-app`, `../corp-web-contents`

goal을 시작할 때 `origin/main`을 갱신하고, wiki page를 다시 읽고, 아래
route 중 2026-05-15 이후 이미 이관된 항목이 있는지 확인한다.

## 필수 Skills

source 확인과 구현 작업에는 아래 skill을 이 순서로 사용한다.

- `.agents/skills/querypie-ja-source-triangulation/SKILL.md`
- `.agents/skills/querypie-ja-preview-route-implementation/SKILL.md`
- `.agents/skills/querypie-ja-preview-route-parity/SKILL.md`
  - 기존 `/t/platforms/**`, `/t/services/**`, `/t/plans` parity follow-up에
    사용한다.
- `.agents/skills/static-page-route-local-authoring/SKILL.md`
- `.agents/skills/querypie-preview-root-rem-parity/SKILL.md`
- `.agents/skills/browser-render-parity-comparison/SKILL.md`
  - 이후 `docs/browser-render-parity-comparison.md`를 따른다.
- `.agents/skills/mdx-refactoring-formatting/SKILL.md`
  - route-adjacent `content.mdx`를 사용하는 경우에만 사용한다.

PR 처리에는 아래 skill을 사용한다.

- `/Users/jk/.codex/skills/github-cli-safety-governed/SKILL.md`
- `/Users/jk/.codex/skills/ci-follow-through-governed/SKILL.md`

## Route Inventory

범위 규칙: in-scope page는 모두 리뷰 가능한 `/t/**` preview route 상태로
끝나야 한다. 아래 public route는 JK의 추후 리뷰 이후 가능한 승격 후보일
뿐이며, 이 goal에서는 구현하지 않는다.

- Source: `https://www.querypie.com/ja/solutions/aip`
  - Current preview: `/t/platforms/aip`
  - Future promotion candidate: `src/app/platforms/aip/page.tsx`
    (`/platforms/aip`)
  - 이 goal에서 변경하지 않을 public alias: `/solutions/aip`,
    `/services/aip`, `/platform/ai/aip`, `/platform/ai/aihub`
  - Content mapping:
    `../corp-web-contents/pages/solutions/aip/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/aip/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/aip/usage-based-llm`
  - Current preview: `/t/platforms/aip/usage-based-llm`
  - Future promotion candidate:
    `src/app/platforms/aip/usage-based-llm/page.tsx`
    (`/platforms/aip/usage-based-llm`)
  - 이 goal에서 변경하지 않을 public alias:
    `/solutions/aip/usage-based-llm`,
    `/platform/ai/aip/usage-based-llm`
  - Content mapping:
    `../corp-web-contents/pages/solutions/aip/usage-based-llm/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/aip/usage-based-llm/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/aip/mcp-gateway`
  - Current preview: `/t/platforms/aip/mcp-gateway`
  - Future promotion candidate: `src/app/platforms/aip/mcp-gateway/page.tsx`
    (`/platforms/aip/mcp-gateway`)
  - 이 goal에서 변경하지 않을 public alias: `/solutions/aip/mcp-gateway`,
    `/platform/ai/aip/mcp-gateway`
  - Content mapping:
    `../corp-web-contents/pages/solutions/aip/mcp-gateway/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/aip/mcp-gateway/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/aip/integrations`
  - Current preview: `/t/platforms/aip/integrations`
  - Future promotion candidate: `src/app/platforms/aip/integrations/page.tsx`
    (`/platforms/aip/integrations`)
  - 이 goal에서 변경하지 않을 public alias: `/solutions/aip/integrations`,
    `/platform/ai/aip/integrations`
  - Content mapping:
    `../corp-web-contents/pages/solutions/aip/integrations/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/aip/integrations/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/aip/fde-services`
  - Current preview: `/t/services/fde`
  - Future promotion candidate: `src/app/services/fde/page.tsx`
    (`/services/fde`)
  - 이 goal에서 변경하지 않을 public alias: `/solutions/aip/fde-services`,
    `/platform/ai/aip/fde-services`
  - Content mapping:
    `../corp-web-contents/pages/solutions/aip/fde-services/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/aip/fde-services/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/acp`
  - Current preview: `/t/platforms/acp`
  - Future promotion candidate: `src/app/platforms/acp/page.tsx`
    (`/platforms/acp`)
  - 이 goal에서 변경하지 않을 public alias: `/solutions/acp`, `/services/acp`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/acp/database-access-controller`
  - Current preview: `/t/platforms/acp/database-access-controller`
  - Future promotion candidate:
    `src/app/platforms/acp/database-access-controller/page.tsx`
    (`/platforms/acp/database-access-controller`)
  - 이 goal에서 변경하지 않을 public alias:
    `/solutions/acp/database-access-controller`,
    `/platform/security/database-access-controller`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/database-access-controller/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/database-access-controller/ja/meta.json`

- Source:
  `https://www.querypie.com/ja/solutions/acp/kubernetes-access-controller`
  - Current preview: `/t/platforms/acp/kubernetes-access-controller`
  - Future promotion candidate:
    `src/app/platforms/acp/kubernetes-access-controller/page.tsx`
    (`/platforms/acp/kubernetes-access-controller`)
  - 이 goal에서 변경하지 않을 public alias:
    `/solutions/acp/kubernetes-access-controller`,
    `/platform/security/kubernetes-access-controller`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/kubernetes-access-controller/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/kubernetes-access-controller/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/acp/system-access-controller`
  - Current preview: `/t/platforms/acp/system-access-controller`
  - Future promotion candidate:
    `src/app/platforms/acp/system-access-controller/page.tsx`
    (`/platforms/acp/system-access-controller`)
  - 이 goal에서 변경하지 않을 public alias:
    `/solutions/acp/system-access-controller`,
    `/platform/security/system-access-controller`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/system-access-controller/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/system-access-controller/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/acp/web-access-controller`
  - Current preview: `/t/platforms/acp/web-access-controller`
  - Future promotion candidate:
    `src/app/platforms/acp/web-access-controller/page.tsx`
    (`/platforms/acp/web-access-controller`)
  - 이 goal에서 변경하지 않을 public alias:
    `/solutions/acp/web-access-controller`,
    `/platform/security/web-access-controller`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/web-access-controller/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/web-access-controller/ja/meta.json`

- Source: `https://www.querypie.com/ja/solutions/acp/integrations`
  - Current preview: `/t/platforms/acp/integrations`
  - Future promotion candidate: `src/app/platforms/acp/integrations/page.tsx`
    (`/platforms/acp/integrations`)
  - 이 goal에서 변경하지 않을 public alias: `/solutions/acp/integrations`
  - Content mapping:
    `../corp-web-contents/pages/solutions/acp/integrations/ja/content.mdx`,
    `../corp-web-contents/pages/solutions/acp/integrations/ja/meta.json`
  - 참고: 이 route는 preview route가 있지만 latest main 기준 명시적인 public
    redirect route가 없다. 현재 `src/app/**/route.ts` redirect가 없다는
    이유로 완료 범위에서 빠뜨리지 않는다.

- Source: `https://www.querypie.com/ja/plans`
  - Current preview: `/t/plans`
  - Future promotion candidate: `src/app/plans/page.tsx` (`/plans`)
  - 이 goal에서 변경하지 않을 public alias: `/pricing`
  - Content mapping: `../corp-web-contents/pages/plans/ja/content.mdx`
  - Behavior and CSS source:
    `../corp-web-app/src/app/ja/plans/page.tsx`,
    `../corp-web-app/src/components/widget/pricing/*`,
    `../corp-web-app/src/components/widget/compare-table/*`
  - 참고: 이 route는 widget/application-contract page로 취급한다. 텍스트
    존재 여부와 generic Tailwind card만으로는 완료 근거가 충분하지 않다.

## 실행 모델

- [ ] **Step 1: 활성 `/goal` 생성**
  - 위 objective text를 사용한다.
  - 활성 branch/worktree와 최신 `origin/main` SHA를 기록한다.
  - goal summary에 이 문서를 링크한다.

- [ ] **Step 2: 범위 갱신**
  - wiki page를 열고 위 route inventory와 비교한다.
  - `find src/app/t -maxdepth 5 -name page.tsx | sort`를 실행한다.
  - `find src/app -maxdepth 5 \( -name page.tsx -o -name route.ts \) |
    sort`를 실행한다.
  - 2026-05-15 이후 새 preview, public page, redirect가 landing됐다면 이
    문서를 갱신한다.

- [ ] **Step 3: future promotion taxonomy 확인**
  - 구현은 `/t/**` route에만 유지한다.
  - reviewer context를 위해 가능한 future public route를 기록하되, 이
    goal에서는 public route를 만들거나 수정하지 않는다.
  - 팀이 `/solutions/**` 또는 기존 legacy `/platform/**` path를 future
    public target으로 선택하면 구현 전에 `Future promotion candidate` 항목만
    갱신한다.

- [ ] **Step 4: PR 단위로 작업 분리**
  - 권장 PR 1: AIP landing 및 AIP child pages
  - 권장 PR 2: FDE services page
  - 권장 PR 3: ACP landing 및 ACP child pages
  - 권장 PR 4: Plans widget page
  - 각 PR은 최신 `origin/main`에서 별도 worktree로 시작한다.

- [ ] **Step 5: 편집 전 각 page triangulation**
  - `../corp-web-contents`의 page content와 metadata를 읽는다.
  - 필요한 경우 `../corp-web-app`의 route/component/CSS behavior를 읽는다.
  - live `https://www.querypie.com/ja/**` URL을 브라우저에서 열고 shipped
    section order, root font size, heading size, wrapper, media dimension,
    interaction behavior를 기록한다.

- [ ] **Step 6: `/t/**` preview route 구현 또는 완성**
  - 이 goal에서는 public QueryPie redirect를 교체하지 않는다.
  - 기존 `/t/**` 구현은 parity review 후에만 보존한다. stale preview code를
    그대로 복사하지 않는다.
  - inventory상 preview가 없을 때만 누락된 `/t/**` route를 생성한다.
  - route-specific asset은 `public/<route-family>/**` 아래에 route-aligned로
    둔다.
  - preview metadata는 noindex로 유지하고 canonical은 `/t/**` preview route를
    가리키게 한다.
  - preview-only 작업에서는 기존 테스트가 의도적인 제외를 문서화하도록 요구하지
    않는 한 `src/app/sitemap.ts`를 수정하지 않는다.
  - `/t/**` page family 내부 preview navigation에 필요한 경우를 제외하고,
    local header/footer나 public CTA link를 기존 public route에서 바꾸지 않는다.

- [ ] **Step 7: redirect 및 missing-path behavior 보존**
  - preview-readiness 작업 중 기존 public redirect는 변경하지 않는다.
  - preview page가 다른 migrated preview page로 내부 링크해야 하는 경우
    `/t/**` link를 유지한다.
  - alias redirect와 query-string preservation 변경은 JK 리뷰 이후 promotion
    PR로 남긴다.
  - `src/lib/querypie-content-redirect.ts`는 검증된 allowlist behavior 이상으로
    넓히지 않는다.

- [ ] **Step 8: focused test 추가**
  - route가 로컬에서 렌더링됨을 증명하는 route test를 추가하거나 갱신한다.
  - preview route에서 이관할 때 route-local authoring boundary를 검증하는
    structure test를 추가한다.
  - `/plans`는 tab behavior, visible plan set, comparison table structure,
    upstream CSS-derived visual contract를 검증하는 widget-contract test를
    추가한다.
  - 기존 preview redirect를 의도적으로 바꾸는 경우가 아니라면, 이 goal에서는
    public alias redirect test를 추가하지 않는다.

- [ ] **Step 9: browser-render parity**
  - `docs/browser-render-parity-comparison.md`를 따른다.
  - 최소 desktop `1440x900`, mobile `390x844`를 비교한다.
  - text wrapping 또는 overflow 위험이 있으면 `320x844` 또는 `360x844`를
    추가한다.
  - screenshot, DOM geometry, computed style, lazy media status,
    root font-size evidence를 수집한다.
  - 차이는 `defect`, `intentional adaptation`, `external live artifact`,
    `environment artifact`, `needs decision`으로 분류한다.
  - route를 완료 처리하기 전 모든 `defect` 차이를 수정한다.

- [ ] **Step 10: 각 PR 검증 및 제출**
  - 개발 중에는 가장 좁은 관련 테스트를 실행한다.
  - PR 생성 또는 업데이트 전 `npm run test:ci`를 실행한다.
  - preview PR이 production rendering contract, shared component, metadata
    convention, deployment behavior에 영향을 주는 경우에만 `npm run build`를
    실행한다.
  - branch name과 commit message는 영어로 작성한다.
  - PR description은 한국어로 작성하고 why, what, impact를 포함한다.
  - `env -u GITHUB_TOKEN gh pr checks`와 exact-SHA 기준
    `env -u GITHUB_TOKEN gh run list`로 CI 완료까지 추적한다.

## 완료 조건

아래 조건이 모두 충족되어야 `/goal`을 완료 처리할 수 있다.

- Route Inventory의 모든 route가 `/t/**` preview route로 구현되었거나,
  dated rationale과 owner decision이 있는 out-of-scope 항목으로 이동되었다.
- 완료된 `/t/**` route는 primary page body를
  `https://www.querypie.com/ja/**`에 의존하지 않는다.
- Preview metadata는 noindex 상태이고 canonical은 `/t/**` route를 가리킨다.
- Public route promotion, public canonical URL, sitemap entry, alias redirect
  변경은 JK의 추후 리뷰 및 promotion PR을 위해 그대로 남겨둔다.
- source triangulation note가 관련 PR body 또는 route-specific implementation
  note에 존재한다.
- 각 migrated page family에 browser-render parity evidence가 있다.
- 각 implementation PR에서 `npm run test:ci`가 통과한다.
- production rendering contract, shared component, metadata convention,
  deployment behavior에 영향을 주는 모든 PR에서 `npm run build`가 통과한다.
- PR CI가 성공하거나, 남은 실패가 관련 없는 실패임을 exact run/log evidence로
  명시했다.

## Out Of Scope Template

명시적인 결정이 있을 때만 사용한다.

```markdown
### YYYY-MM-DD: <route>

- Decision owner:
- Reason:
- Replacement route, if any:
- Redirect behavior:
- Follow-up issue/PR:
```
