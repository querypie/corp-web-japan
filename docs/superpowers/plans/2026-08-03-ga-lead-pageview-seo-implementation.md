# GA4 Lead, Navigation, and Legal-Page SEO Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Record successful lead submissions and accurate App Router navigation in GA4, then let Google crawl legal pages to observe their existing `noindex` directives.

**Architecture:** Add one client-safe lead-event helper and call it only from existing success branches. Keep the GA4 config call as owner of the initial page view, make the existing tracker own later App Router page views with an explicit previous URL, and disable only Enhanced Measurement history-based page changes. Remove legal-page `robots.txt` blocks without changing their metadata or sitemap policy.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Node test runner, Google Analytics Admin API v1alpha.

**Approved spec:** `docs/superpowers/specs/2026-08-03-ga-lead-pageview-seo-design.md`

**External baseline verified on 2026-08-03:** Property `538139625` has key events `purchase`, `close_convert_lead`, and `qualify_lead`, all counted once per event. Stream `14897427772` has Enhanced Measurement enabled and `pageChangesEnabled = true`.

---

## File Structure

- Create `src/lib/google-analytics-events.ts`: own the typed, client-safe `generate_lead` dispatch boundary and suppress analytics failures.
- Modify `src/components/sections/contact-us/form.tsx`: emit `contact_us` only after the existing successful response guard.
- Modify `src/components/sections/publication/gated-content.tsx`: emit `gated_content` only after the existing successful unlock response guard.
- Modify `src/components/sections/whitepapers/download-gate-page.tsx`: emit `whitepaper_download` only in the normal successful submit path, never the preview auto-unlock effect.
- Modify `src/components/analytics/google-analytics-page-view-tracker.tsx`: remember the previous absolute URL and include it as `page_referrer` on later route changes.
- Modify `src/app/robots.ts`: remove legal-page disallow entries while preserving the general allow rule, host, and sitemap.
- Modify `tests/src/components/analytics/google-analytics.test.mjs`: cover the helper, success-only integration placement, preview exclusion, and page-referrer contract.
- Modify `tests/launch-readiness-coverage.test.mjs`: require legal paths to be absent from robots disallow output while remaining absent from the sitemap.
- Modify `tests/seo-metadata.test.mjs`: require crawlable legal paths plus their existing `noindex`/`nofollow` metadata and sitemap exclusion.

## Chunk 1: Application and GA4 Configuration

### Task 1: Add success-only lead event tracking

**Files:**
- Create: `src/lib/google-analytics-events.ts`
- Modify: `src/components/sections/contact-us/form.tsx`
- Modify: `src/components/sections/publication/gated-content.tsx`
- Modify: `src/components/sections/whitepapers/download-gate-page.tsx`
- Test: `tests/src/components/analytics/google-analytics.test.mjs`

- [ ] **Step 1: Write failing helper and integration tests**

Extend `tests/src/components/analytics/google-analytics.test.mjs` with a direct TypeScript import and source checks:

```js
import { sendGenerateLeadEvent } from "../../../../src/lib/google-analytics-events.ts";

test("generate_lead sends only the approved non-PII surface parameter", () => {
  const calls = [];
  const originalWindow = globalThis.window;
  globalThis.window = { gtag: (...args) => calls.push(args) };

  try {
    sendGenerateLeadEvent("contact_us");
    assert.deepEqual(calls, [
      ["event", "generate_lead", { lead_surface: "contact_us" }],
    ]);
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});

test("generate_lead is a no-op when gtag is unavailable or throws", () => {
  const originalWindow = globalThis.window;

  try {
    globalThis.window = {};
    assert.doesNotThrow(() => sendGenerateLeadEvent("gated_content"));

    globalThis.window = { gtag: () => { throw new Error("blocked"); } };
    assert.doesNotThrow(() => sendGenerateLeadEvent("whitepaper_download"));
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});
```

Add source-contract assertions that:

- Each form imports `sendGenerateLeadEvent` from `@/lib/google-analytics-events`.
- `contact_us` appears after the `!response.ok || !json?.success` early return and before `setSubmitState({ status: "success" })`.
- `gated_content` appears after the `!response.ok || !result?.success` early return and before `setUnlocked(true)`.
- `whitepaper_download` appears after the normal unlock success guard and before `window.location.assign(downloadHref)`.
- The bounded whitepaper source slice from `useEffect(() => {` through the character before `async function handleSubmit` contains no `sendGenerateLeadEvent`, proving the preview auto-unlock effect does not emit while excluding the file-level import from this check.

Use this bounded preview check:

```js
const previewEffectStart = whitepaperDownloadGateSource.indexOf("useEffect(() => {");
const handleSubmitStart = whitepaperDownloadGateSource.indexOf("async function handleSubmit");

assert.notEqual(previewEffectStart, -1);
assert.notEqual(handleSubmitStart, -1);
assert.doesNotMatch(
  whitepaperDownloadGateSource.slice(previewEffectStart, handleSubmitStart),
  /sendGenerateLeadEvent/,
);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/src/components/analytics/google-analytics.test.mjs
```

Expected: FAIL because `src/lib/google-analytics-events.ts` does not exist or the required event calls are absent.

- [ ] **Step 3: Implement the minimal client-safe helper**

Create `src/lib/google-analytics-events.ts`:

```ts
export type LeadSurface = "contact_us" | "gated_content" | "whitepaper_download";

type WindowWithGtag = Window & {
  gtag?: (
    command: "event",
    eventName: "generate_lead",
    params: { lead_surface: LeadSurface },
  ) => void;
};

export function sendGenerateLeadEvent(leadSurface: LeadSurface) {
  if (typeof window === "undefined") {
    return;
  }

  const gtag = (window as WindowWithGtag).gtag;

  if (typeof gtag !== "function") {
    return;
  }

  try {
    gtag("event", "generate_lead", { lead_surface: leadSurface });
  } catch {
    // Analytics must never block form success, content unlock, or redirects.
  }
}
```

- [ ] **Step 4: Wire only the three successful user-submission branches**

Add the shared import to all three form components. Insert exactly these calls after their existing unsuccessful-response early returns:

```ts
sendGenerateLeadEvent("contact_us");
setSubmitState({ status: "success" });
```

```ts
sendGenerateLeadEvent("gated_content");
setUnlocked(true);
```

```ts
sendGenerateLeadEvent("whitepaper_download");
window.location.assign(downloadHref);
```

Do not add a call inside the `autoUnlock` effect or any error path. Do not pass form or content values to the helper.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```bash
node --test tests/src/components/analytics/google-analytics.test.mjs
npm run test:forms
npm run test:publications
```

Expected: all commands PASS. Node may print the existing typeless-package warning for direct `.ts` imports; that warning is non-failing and does not justify changing `package.json`.

- [ ] **Step 6: Commit the lead-event slice**

```bash
git add src/lib/google-analytics-events.ts src/components/sections/contact-us/form.tsx src/components/sections/publication/gated-content.tsx src/components/sections/whitepapers/download-gate-page.tsx tests/src/components/analytics/google-analytics.test.mjs
git commit -m "Measure confirmed lead submissions without exposing form data" -m "Constraint: Consent-mode behavior remains out of scope.\nRejected: Send lead events from server endpoints | Adds credentials and duplicate-event risk.\nConfidence: high\nScope-risk: moderate\nDirective: Keep generate_lead success-only and never attach submitted form values.\nTested: Analytics helper tests plus forms and publications suites.\nNot-tested: Production GA4 receipt before deployment.\nCo-Authored-By: Atlas <atlas@jk.agent>"
```

### Task 2: Preserve referrer context for App Router page views

**Files:**
- Modify: `src/components/analytics/google-analytics-page-view-tracker.tsx`
- Test: `tests/src/components/analytics/google-analytics.test.mjs`

- [ ] **Step 1: Write the failing page-referrer source contract**

Update the existing page-view tracker test to require:

```js
assert.match(trackerSource, /const previousPageLocation = useRef<string \| null>\(null\)/);
assert.match(trackerSource, /previousPageLocation\.current = window\.location\.href;\s*return;/s);
assert.match(trackerSource, /const currentPageLocation = window\.location\.href/);
assert.match(trackerSource, /page_referrer: previousPageLocation\.current/);
assert.match(trackerSource, /page_location: currentPageLocation/);
assert.match(trackerSource, /previousPageLocation\.current = currentPageLocation/);
```

Retain the current assertions for initial-render skipping, `page_title`, `page_path`, and `send_to`. Replace the old literal `page_location: window.location.href` assertion with `page_location: currentPageLocation`.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/src/components/analytics/google-analytics.test.mjs
```

Expected: FAIL because the tracker does not yet store or send the previous URL.

- [ ] **Step 3: Implement previous-location tracking**

In `GoogleAnalyticsPageViewTracker`, add:

```ts
const previousPageLocation = useRef<string | null>(null);
```

On the skipped initial render, set `previousPageLocation.current = window.location.href` before returning. For each later route-change effect, capture `const currentPageLocation = window.location.href`, use it for `page_location`, pass `page_referrer: previousPageLocation.current`, and update the ref to `currentPageLocation` after the send attempt. If `gtag` is unavailable, update the ref before returning so a later event never reports a stale multi-navigation referrer.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/src/components/analytics/google-analytics.test.mjs
npm run test:assets-shell
```

Expected: both commands PASS.

- [ ] **Step 5: Commit the navigation slice**

```bash
git add src/components/analytics/google-analytics-page-view-tracker.tsx tests/src/components/analytics/google-analytics.test.mjs
git commit -m "Keep GA4 navigation attribution tied to the previous page" -m "Constraint: The initial page view remains owned by the GA4 config call.\nRejected: Delegate all route changes to Enhanced Measurement | Coverage would depend on a remote setting and compete with existing app tracking.\nConfidence: high\nScope-risk: narrow\nDirective: Keep exactly one owner for post-load App Router page views.\nTested: Focused analytics test and assets-shell suite.\nNot-tested: Production GA network diagnostics before deployment.\nCo-Authored-By: Atlas <atlas@jk.agent>"
```

### Task 3: Let crawlers read legal-page noindex metadata

**Files:**
- Modify: `src/app/robots.ts`
- Modify: `tests/launch-readiness-coverage.test.mjs`
- Modify: `tests/seo-metadata.test.mjs`

- [ ] **Step 1: Write failing SEO contracts**

Replace the assertions that require the legal disallow list with:

```js
assert.doesNotMatch(robots, /\/privacy-policy/);
assert.doesNotMatch(robots, /\/terms-of-service/);
```

In `tests/seo-metadata.test.mjs`, read the privacy metadata implementation separately:

```js
const privacyPolicyMetadataPage = read("src/app/privacy-policy/[slug]/page.tsx");
```

Then retain or add assertions that the legal page sources declare both index and follow as false:

```js
assert.match(termsOfServicePage, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false/s);
assert.match(privacyPolicyMetadataPage, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false/s);
```

Keep the existing assertions that both paths are absent from `src/app/sitemap.ts`.

- [ ] **Step 2: Run SEO tests and verify RED**

Run:

```bash
node --test tests/seo-metadata.test.mjs tests/launch-readiness-coverage.test.mjs
```

Expected: FAIL because `src/app/robots.ts` still contains both paths.

- [ ] **Step 3: Remove only the legal disallow entries**

Change the rules object in `src/app/robots.ts` to:

```ts
rules: {
  userAgent: "*",
  allow: "/",
},
```

Do not edit the legal page metadata or sitemap.

- [ ] **Step 4: Run routing and cross-cutting tests and verify GREEN**

Run:

```bash
node --test tests/seo-metadata.test.mjs tests/launch-readiness-coverage.test.mjs
npm run test:routing-seo
npm run test:cross-cutting
```

Expected: all commands PASS.

- [ ] **Step 5: Commit the crawl-policy slice**

```bash
git add src/app/robots.ts tests/launch-readiness-coverage.test.mjs tests/seo-metadata.test.mjs
git commit -m "Let crawlers observe legal-page noindex directives" -m "Constraint: Legal pages must remain excluded from search and the sitemap.\nRejected: Keep robots disallow alongside noindex | Crawlers cannot reliably read a blocked page directive.\nConfidence: high\nScope-risk: narrow\nDirective: Use page-level noindex, not robots blocking, for these legal pages.\nTested: Focused SEO tests plus routing-seo and cross-cutting suites.\nNot-tested: Search Console recrawl before deployment.\nCo-Authored-By: Atlas <atlas@jk.agent>"
```

### Task 4: Run complete local verification

**Files:**
- Verify only; no planned source changes.

- [ ] **Step 1: Run repository-wide PR verification**

Run sequentially:

```bash
npm run test:ci
npm run build
git diff --check origin/main...HEAD
```

Expected: every command exits 0. If a command fails, fix only failures caused by this branch, rerun the smallest failing command, then rerun the complete sequence.

- [ ] **Step 2: Inspect the final code scope**

Run:

```bash
git status --short --branch
git log --oneline origin/main..HEAD
git diff --name-status origin/main...HEAD
```

Expected: only the approved plan, analytics helper/integration files, page-view tracker, robots file, and related tests are present.

### Task 5: Apply idempotent GA4 Admin configuration

**External resources:**
- Property: `properties/538139625`
- Stream settings: `properties/538139625/dataStreams/14897427772/enhancedMeasurementSettings`
- Official references: [create key event](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/properties.keyEvents/create), [update Enhanced Measurement](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/properties.dataStreams/updateEnhancedMeasurementSettings)

- [ ] **Step 1: Run one idempotent Admin API operation**

Use the existing OAuth token, which has both `analytics.readonly` and `analytics.edit` scopes. Run a one-off Python command from the shell; do not add credentials or an admin script to the repository:

```bash
python3 - <<'PY'
import pickle
from google.analytics.admin_v1alpha import AnalyticsAdminServiceClient
from google.analytics.admin_v1alpha.types import KeyEvent
from google.protobuf.field_mask_pb2 import FieldMask

property_name = "properties/538139625"
settings_name = f"{property_name}/dataStreams/14897427772/enhancedMeasurementSettings"

with open("/Users/jk/.config/ga/token.pickle", "rb") as token_file:
    credentials = pickle.load(token_file)

client = AnalyticsAdminServiceClient(credentials=credentials)
key_events = list(client.list_key_events(parent=property_name))

if not any(event.event_name == "generate_lead" for event in key_events):
    client.create_key_event(
        parent=property_name,
        key_event=KeyEvent(
            event_name="generate_lead",
            counting_method=KeyEvent.CountingMethod.ONCE_PER_EVENT,
        ),
    )

settings = client.get_enhanced_measurement_settings(name=settings_name)
if settings.page_changes_enabled:
    settings.page_changes_enabled = False
    client.update_enhanced_measurement_settings(
        enhanced_measurement_settings=settings,
        update_mask=FieldMask(paths=["page_changes_enabled"]),
    )
PY
```

Expected: the operation exits 0, creates only the missing key event, and updates only `page_changes_enabled`. The API requires `analytics.edit`, and the update mask must use snake case.

- [ ] **Step 2: Read back and assert the resulting state**

List key events and fetch Enhanced Measurement settings again in a fresh read-only process:

```bash
python3 - <<'PY'
import pickle
from google.analytics.admin_v1alpha import AnalyticsAdminServiceClient
from google.analytics.admin_v1alpha.types import KeyEvent

property_name = "properties/538139625"
settings_name = f"{property_name}/dataStreams/14897427772/enhancedMeasurementSettings"

with open("/Users/jk/.config/ga/token.pickle", "rb") as token_file:
    credentials = pickle.load(token_file)

client = AnalyticsAdminServiceClient(credentials=credentials)

assert any(
    event.event_name == "generate_lead"
    and event.counting_method == KeyEvent.CountingMethod.ONCE_PER_EVENT
    for event in client.list_key_events(parent=property_name)
)
assert client.get_enhanced_measurement_settings(
    name=settings_name,
).page_changes_enabled is False
PY
```

Expected: both assertions pass. Do not delete or modify existing key events or any other Enhanced Measurement fields.

### Task 6: Publish the implementation PR

**Files:**
- No new planned files.

- [ ] **Step 1: Rebase and repeat the PR scope gate**

Run:

```bash
git fetch origin --prune
git rebase origin/main
git log --oneline origin/main..HEAD
git diff --name-status origin/main...HEAD
```

Expected: only the approved implementation commits and files appear.

- [ ] **Step 2: Push and open the follow-up PR**

Use the `create-pr` skill. Push `fix/ga-lead-pageview-seo-implementation`, open an English PR against `main`, explain that design PR #807 is merged, and include:

- Success-only `generate_lead` behavior and PII exclusion.
- Page-view ownership and `page_referrer` behavior.
- Legal-page robots/noindex behavior.
- GA4 Admin before/after state.
- `npm run test:ci` and `npm run build` results.

- [ ] **Step 3: Perform one bounded remote status read**

Run:

```bash
implementation_pr_number=$(env -u GITHUB_TOKEN gh pr view --json number --jq .number)
env -u GITHUB_TOKEN gh pr checks "$implementation_pr_number"
```

Expected: report success, failure, pending, or no checks yet accurately. Do not merge, close, or approve the PR.
