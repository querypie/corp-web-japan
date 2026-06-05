# platform-preview-toggle

## Purpose

This spec defines the platform-level Preview Toggle capability used by the QueryPie AI Japan website for non-production review and test workflows.

Preview Toggle is not a public website feature. It is a reviewer/developer aid that lets non-production users switch selected navigation and gated-content behavior into preview mode without changing canonical public route implementation.

## Current implementation references

- `src/lib/preview-navigation.ts`
- `src/lib/is-production.ts`
- `src/app/api/preview-navigation/route.ts`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-header-client.tsx`
- `src/components/layout/preview-mode-toggle.tsx`
- `src/components/layout/site-footer.tsx`
- `src/components/sections/resource-category-sidebar.tsx`
- `src/components/sections/demo-category-sidebar.tsx`
- `src/app/api/gating-form/preview-unlock/route.ts`
- `src/app/whitepapers/[id]/[slug]/page.tsx`
- `src/app/whitepapers/[id]/[slug]/pdf/page.tsx`
- `src/app/introduction-deck/[id]/[slug]/page.tsx`
- `src/app/internal/whitepaper-gating-form/page.tsx`
- `tests/preview-navigation-path-helper.test.mjs`
- `tests/footer-preview-navigation.test.mjs`
- `tests/whitepaper-gating-source.test.mjs`
- `tests/src/app/api/gating-form/preview-unlock/route.test.mjs`

## Requirements

### Requirement: non-production availability

Preview Toggle SHALL be available only outside production. Production detection SHALL use the deployment-target signal from `src/lib/is-production.ts`, currently `VERCEL_TARGET_ENV=production`. When production is detected, the preview toggle control SHALL NOT be shown and preview navigation SHALL be treated as disabled even if a stale preview cookie exists. The preview-navigation API SHALL force the preview-navigation cookie to the disabled value when called in production.

#### Scenario: non-production users can see the toggle

- GIVEN the app is running without `VERCEL_TARGET_ENV=production`
- WHEN `SiteHeader` reads Preview Toggle state
- THEN `showToggle` is true
- AND `SiteHeaderClient` renders the Preview Toggle control in the header actions

#### Scenario: production users cannot enable preview navigation

- GIVEN the app is running with `VERCEL_TARGET_ENV=production`
- AND the request has `querypie-preview-navigation=on`
- WHEN `getPreviewNavigationState` evaluates the cookie
- THEN `showToggle` is false
- AND `enabled` is false
- WHEN `/api/preview-navigation` is called
- THEN the response sets `querypie-preview-navigation=off`

### Requirement: preview-navigation state cookie

Preview Toggle state SHALL be persisted in the `querypie-preview-navigation` cookie. The only enabled cookie value SHALL be `on`; missing, `off`, or any other value SHALL be treated as disabled. The `/api/preview-navigation` endpoint SHALL accept a JSON payload with `enabled: true` to set the cookie to `on`; all other payload states SHALL set it to `off`. The cookie SHALL be scoped to `/`, use `sameSite: "lax"`, be readable by client code, be marked `secure`, and have a one-year max age.

#### Scenario: explicit enabled payload turns preview navigation on

- GIVEN the app is running outside production
- WHEN the client posts `{ "enabled": true }` to `/api/preview-navigation`
- THEN the response body reports `{ "ok": true, "enabled": true }`
- AND the response sets `querypie-preview-navigation=on`

#### Scenario: non-true payload turns preview navigation off

- GIVEN the app is running outside production
- WHEN the client posts `{ "enabled": false }`, invalid JSON, or a payload without `enabled: true`
- THEN the response body reports `{ "ok": true, "enabled": false }`
- AND the response sets `querypie-preview-navigation=off`

### Requirement: header Preview Toggle control

When the toggle is visible, the site header SHALL render a compact Preview Toggle control in the header action area next to the contact CTA. The control SHALL reflect the current server-derived preview-navigation state, use `aria-pressed` for the pressed state, and expose accessible labels for enabling and disabling preview mode navigation. The client control SHALL optimistically update its visual state, post the new state to `/api/preview-navigation`, refresh the router after a successful update, and revert with a status error message if the update fails.

#### Scenario: user toggles preview navigation from off to on

- GIVEN Preview Toggle is visible
- AND preview navigation is currently disabled
- WHEN the user clicks the Preview Toggle button
- THEN the control optimistically changes to the enabled state
- AND the client posts `{ "enabled": true }` to `/api/preview-navigation`
- AND a successful response triggers a router refresh so server components re-read the cookie

#### Scenario: API failure reverts the optimistic state

- GIVEN Preview Toggle is visible
- WHEN the user clicks the Preview Toggle button
- AND `/api/preview-navigation` fails or returns a non-OK response
- THEN the control restores the previous enabled/disabled state
- AND it renders a polite status message telling the user that preview mode could not be updated

### Requirement: preview path helper

The preview-navigation path helper SHALL preserve canonical paths when preview navigation is disabled. When preview navigation is enabled, it SHALL prefix eligible canonical paths with `/t`. The helper SHALL NOT rewrite `/` and SHALL NOT double-prefix paths that already start with `/t/`.

#### Scenario: enabled preview navigation rewrites canonical paths

- GIVEN preview navigation is enabled
- WHEN the helper receives `/platforms/aip`
- THEN it returns `/t/platforms/aip`
- WHEN it receives `/services/fde`
- THEN it returns `/t/services/fde`

#### Scenario: helper preserves root and existing preview paths

- GIVEN preview navigation is enabled
- WHEN the helper receives `/`
- THEN it returns `/`
- WHEN it receives `/t/platforms/aip`
- THEN it returns `/t/platforms/aip`

#### Scenario: disabled preview navigation preserves public paths

- GIVEN preview navigation is disabled
- WHEN the helper receives `/platforms/aip` or `/services/fde`
- THEN it returns the original path unchanged

### Requirement: navigation surfaces consume server preview state

Server-rendered navigation surfaces SHALL read `querypie-preview-navigation` through `getPreviewNavigationState` and pass or apply the resulting enabled state. Header navigation MAY use the preview path helper to point eligible links to `/t/...` while preview navigation is enabled. Footer navigation SHALL keep public demo links on rolled-out canonical public routes, but SHALL add preview-only internal links when preview navigation is enabled.

#### Scenario: header receives preview state from server cookies

- GIVEN a request includes `querypie-preview-navigation=on`
- AND the app is not production
- WHEN `SiteHeader` renders
- THEN it passes `previewModeEnabled={true}` to `SiteHeaderClient`
- AND it passes `showPreviewModeToggle={true}`

#### Scenario: footer exposes internal links only in preview mode

- GIVEN preview navigation is enabled
- WHEN `SiteFooter` renders
- THEN it includes an `Internal` footer column
- AND that column links to `Internal Hub`, `Whitepaper Gating Form`, `MDX List`, `Events`, and `Load More`
- WHEN preview navigation is disabled or production-hidden
- THEN the `Internal` footer column is not rendered

#### Scenario: footer demo links remain canonical after public rollout

- GIVEN preview navigation is enabled
- WHEN `SiteFooter` renders the demo column
- THEN the demo links for use cases, AIP demo, and ACP demo remain `/use-cases`, `/demo/aip`, and `/demo/acp`
- AND they are not rewritten with the preview path helper

### Requirement: category sidebars may expose preview-only categories

Resource and demo category sidebars SHALL read Preview Toggle state when no explicit `links` prop is provided. Resource category sidebar links SHALL include the Events category only when preview navigation is enabled. Demo category sidebar links MAY keep the same public and preview link sets when all demo categories are already rolled out publicly.

#### Scenario: resource sidebar includes Events in preview mode

- GIVEN no explicit sidebar links are supplied
- AND preview navigation is enabled
- WHEN `ResourceCategorySidebar` renders
- THEN the sidebar includes `イベント` with `/events`

#### Scenario: resource sidebar omits Events in public mode

- GIVEN no explicit sidebar links are supplied
- AND preview navigation is disabled
- WHEN `ResourceCategorySidebar` renders
- THEN the sidebar does not include the Events category

### Requirement: gated publication preview unlock

Preview Toggle SHALL support non-production reviewer access to gated publication content without submitting the normal external gating form. Gated publication detail pages SHALL treat enabled preview navigation as initially unlocked in addition to the standard per-content gating cookie. The whitepaper PDF gate page SHALL receive `autoUnlock={true}` when preview navigation is enabled. The preview unlock API SHALL be unavailable in production, SHALL require a non-empty `contentKey`, SHALL set the same gating cookie used by the standard gating flow, and SHALL NOT call external form submission side effects.

#### Scenario: gated detail page is initially unlocked in preview mode

- GIVEN preview navigation is enabled
- AND a whitepaper or introduction deck post has gated content
- WHEN the detail page renders
- THEN `post.gating.initiallyUnlocked` is true even if the standard gating cookie is absent

#### Scenario: gated detail page still honors the standard unlock cookie

- GIVEN preview navigation is disabled
- AND the request has the standard gating cookie for the post content key
- WHEN the detail page renders
- THEN `post.gating.initiallyUnlocked` is true

#### Scenario: PDF gate auto-unlocks in preview mode

- GIVEN preview navigation is enabled
- AND the user visits a whitepaper PDF gate route
- WHEN `WhitepaperDownloadGatePage` renders
- THEN it receives `autoUnlock={true}`

#### Scenario: preview unlock API is blocked in production

- GIVEN the app is running with `VERCEL_TARGET_ENV=production`
- WHEN a request posts to `/api/gating-form/preview-unlock`
- THEN the API returns 403
- AND no preview gating cookie is issued

#### Scenario: preview unlock API sets a gated-content cookie without external side effects

- GIVEN the app is running outside production
- AND the request includes a non-empty `contentKey`
- WHEN a request posts to `/api/gating-form/preview-unlock`
- THEN the API returns `{ "success": true }`
- AND it sets the cookie named by `buildGatingCookieName(contentKey)`
- AND it does not call the standard external gating form submission helper
