# Reliable GA4 Lead and Navigation Tracking and Legal-Page Crawling

## Purpose

Make the existing Google Analytics 4 integration record successful lead submissions and client-side route changes reliably, while allowing Google to read the existing `noindex` directives on legal pages.

## Scope

This change covers three findings from the Google Analytics and Google Search Console audit:

1. Emit a GA4 `generate_lead` event after a successful contact or gated-content submission.
2. Prevent duplicate App Router page views while preserving the previous URL as the referrer for manually tracked client-side navigations.
3. Remove legal-page paths from `robots.txt` so crawlers can read their page-level `noindex` metadata.

The corresponding GA4 property configuration is also part of the change:

- Register `generate_lead` as a key event.
- Disable Enhanced Measurement browser-history page changes because the application owns post-load route-change tracking.

## Non-goals

- Consent Mode and cookie-consent behavior are explicitly out of scope.
- Existing GA4 key events are not removed or renamed.
- Legal pages remain excluded from the sitemap and remain `noindex`/`nofollow`.
- No new analytics provider, dependency, server-side Measurement Protocol integration, or data warehouse pipeline is introduced.
- Existing form validation, submission endpoints, notifications, unlock behavior, and redirects do not change.

## Current Behavior

- The production layout loads GA4 with `gtag('config', 'G-DGKPWV2DP2')`, which sends the initial page view.
- A client tracker sends `page_view` on later App Router navigation and skips its first render. Those events do not currently include the previous page URL.
- GA4 Enhanced Measurement also has browser-history page changes enabled, creating two potential owners for SPA navigation tracking.
- Contact and gated-content forms do not send a successful-lead event.
- `/privacy-policy` and `/terms-of-service` are disallowed in `robots.txt` even though the pages already declare `noindex`, preventing crawlers from consistently reading that directive.

## Design

### 1. Shared GA4 event boundary

Add a small client-safe analytics helper under the existing analytics code area. It will expose an explicit function for the standard GA4 `generate_lead` event.

The helper will:

- Do nothing when `window` or `window.gtag` is unavailable.
- Catch and suppress exceptions thrown by `gtag` so analytics can never interrupt a successful form result or redirect.
- Send only non-personal context needed to distinguish the conversion surface.
- Never send names, email addresses, phone numbers, company names, free-form messages, or other submitted form values.
- Keep the event name and parameter contract centralized so the forms do not construct raw `gtag` calls independently.

The event payload will use this contract:

```ts
type LeadSurface = "contact_us" | "gated_content" | "whitepaper_download";

{
  event: "generate_lead";
  parameters: {
    lead_surface: LeadSurface;
  };
}
```

No monetary `value` or `currency` will be sent because the site has no defensible lead valuation model in scope.

### 2. Success-only lead emission

Each applicable client flow will invoke the helper only after its existing submission request returns a successful response:

- Contact-us form: after `/contact-us/submit` succeeds and before the success UI is shown.
- Inline gated publication: after `/api/gating-form/unlock` succeeds and before content is unlocked.
- Whitepaper download gate: after the normal user-submitted unlock succeeds and before redirecting to the download URL.

The following paths must not emit `generate_lead`:

- Client-side validation failures.
- Non-OK server responses.
- Network errors.
- Initial render, successful content loading, or ordinary navigation.
- Preview-mode automatic whitepaper unlocks that occur without a user form submission.
- Any content rendered as initially unlocked without a successful form submission.

One successful HTTP response produces one event from that client submission attempt. A successful submission through the shared `ResourcePostGated` component emits `gated_content` regardless of which publication route renders it; merely rendering that component in an initially unlocked state emits nothing. No retry queue or persistent deduplication is added.

### 3. Single-owner App Router navigation tracking

Keep the current initial-page model:

- GA4 `config` sends the initial document page view.
- The client tracker skips its first render while storing the initial absolute URL as the previous URL.

For later App Router navigation, the client tracker will send one manual `page_view` containing:

- `page_title`: the current document title.
- `page_location`: the current absolute URL.
- `page_path`: current pathname plus query string.
- `page_referrer`: the previous absolute URL held in a ref.
- `send_to`: the existing measurement ID.

After sending, the tracker updates its stored previous URL to the current URL. Hash-only changes are not separately tracked because the tracker is driven by pathname and search-parameter changes.

The GA4 data stream's Enhanced Measurement browser-history page-change option will be disabled. Enhanced Measurement may continue handling unrelated measurements; only history-based page changes are disabled. This leaves the application as the single owner of post-load App Router page views while retaining GA4's initial page view.

### 4. Legal-page crawl policy

Remove `/privacy-policy` and `/terms-of-service` from the generated `robots.txt` disallow list. Keep:

- The page metadata `robots.index = false` and `robots.follow = false`.
- Their intentional omission from `src/app/sitemap.ts`.

This lets Google crawl the pages, read the `noindex` directive, and exclude them from search results without reporting them as blocked by `robots.txt`.

## External Configuration

The implementation will update the audited GA4 property and web data stream using authenticated Google Analytics Admin APIs:

- Property: `properties/538139625`
- Web stream: `properties/538139625/dataStreams/14897427772`
- Measurement ID: `G-DGKPWV2DP2`

The changes are limited to:

- Creating the `generate_lead` key event if it does not already exist.
- Setting Enhanced Measurement `pageChangesEnabled` to `false` if it is currently enabled.

Both operations must be idempotent: inspect the current state first, change only the missing setting, and verify the resulting state afterward. Existing key events and other Enhanced Measurement settings remain unchanged.

## Error Handling

- Analytics availability must never block a successful form result or redirect.
- A missing `gtag` function is treated as a no-op, and any exception thrown by an available `gtag` function is suppressed.
- Existing form error handling remains authoritative; analytics introduces no new user-visible errors.
- If the GA4 Admin update cannot be completed due to credentials or permissions, code changes may proceed, but the final report and PR must call out the remaining configuration gap rather than claiming single-owner navigation tracking is complete.

## Testing and Verification

Implementation follows test-driven development:

1. Add failing focused tests for the analytics helper payload and no-op behavior.
2. Add or update focused tests proving each form emits only after success and that preview unlock does not emit.
3. Update tracker tests to require `page_referrer` and preserved initial-page skipping.
4. Update SEO and launch-readiness tests to require crawlable legal pages while retaining their `noindex` metadata and sitemap exclusion.
5. Implement the smallest changes required to pass those tests.
6. Run the focused analytics, form, routing, and SEO tests.
7. Run `npm run test:ci` and `npm run build` because the change affects production analytics, metadata, and routing output.
8. Read back the GA4 Admin settings to verify `generate_lead` is a key event and browser-history page changes are disabled.

Hosted-preview verification may confirm rendered metadata and `robots.txt`, but production-only GA loading means the GA event network behavior must be verified through tests and, when practical, production diagnostics after deployment.

## Rollout and Safety

- Keep the code diff narrowly limited to analytics helpers/integration points, the page-view tracker, robots configuration, and their tests.
- Apply the GA4 Admin changes after the code contract is ready and verify them independently.
- Do not alter consent behavior or existing form payloads.
- Do not merge the pull request as part of this task.

## Acceptance Criteria

- Successful contact, inline gated-content, and normal whitepaper-download submissions each emit one `generate_lead` event with only `lead_surface` context.
- Failed submissions and preview auto-unlocks emit no lead event.
- The initial page view remains GA4-config-owned, and each later App Router navigation produces one application-owned page view with the previous absolute URL in `page_referrer`.
- GA4 Enhanced Measurement browser-history page changes are disabled and `generate_lead` is registered as a key event.
- `/privacy-policy` and `/terms-of-service` are crawlable in `robots.txt`, retain `noindex`/`nofollow`, and remain absent from the sitemap.
- Focused tests, `npm run test:ci`, and `npm run build` pass, or any unavailable verification is explicitly reported.
