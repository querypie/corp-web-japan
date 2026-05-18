import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../helpers/source-readers.mjs";

const analyticsPath = "src/components/analytics/google-analytics.tsx";
const trackerPath = "src/components/analytics/google-analytics-page-view-tracker.tsx";
const layoutPath = "src/app/layout.tsx";

test("root layout loads the production-only Google Analytics component once", () => {
  assert.equal(sourceExists(analyticsPath), true, `${analyticsPath} should exist`);
  assert.equal(sourceExists(trackerPath), true, `${trackerPath} should exist`);

  const layoutSource = readSource(layoutPath);

  assert.match(layoutSource, /import \{ GoogleAnalytics \} from "@\/components\/analytics\/google-analytics";/);
  assert.match(layoutSource, /<body className="font-sans antialiased">\s*<GoogleAnalytics \/>\s*\{children\}/s);
});

test("Google Analytics uses the hardcoded GA4 measurement ID and loads only in production", () => {
  const analyticsSource = readSource(analyticsPath);

  assert.match(analyticsSource, /import Script from "next\/script";/);
  assert.match(analyticsSource, /import isProduction from "@\/lib\/is-production";/);
  assert.match(analyticsSource, /const GA_MEASUREMENT_ID = "G-DGKPWV2DP2";/);
  assert.match(analyticsSource, /if \(!isProduction\(\)\) \{\s*return null;\s*\}/s);
  assert.match(analyticsSource, /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=\$\{GA_MEASUREMENT_ID\}/);
  assert.match(analyticsSource, /strategy="afterInteractive"/);
  assert.match(analyticsSource, /gtag\('config', '\$\{GA_MEASUREMENT_ID\}'\);/);
  assert.match(analyticsSource, /<Suspense fallback=\{null\}>\s*<GoogleAnalyticsPageViewTracker measurementId=\{GA_MEASUREMENT_ID\} \/>\s*<\/Suspense>/s);
  assert.doesNotMatch(analyticsSource, /process\.env/);
});

test("Google Analytics page-view tracker sends only App Router navigation page_view events after the initial load", () => {
  const trackerSource = readSource(trackerPath);

  assert.match(trackerSource, /^"use client";/m);
  assert.match(trackerSource, /usePathname/);
  assert.match(trackerSource, /useSearchParams/);
  assert.match(trackerSource, /useRef\(false\)/);
  assert.match(trackerSource, /hasTrackedInitialPageView\.current = true;\s*return;/s);
  assert.match(trackerSource, /gtag\("event", "page_view", \{/);
  assert.match(trackerSource, /page_title: document\.title/);
  assert.match(trackerSource, /page_location: window\.location\.href/);
  assert.match(trackerSource, /page_path: pagePath/);
  assert.match(trackerSource, /send_to: measurementId/);
});
