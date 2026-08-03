import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../helpers/source-readers.mjs";
import { sendGenerateLeadEvent } from "../../../../src/lib/google-analytics-events.ts";

const analyticsPath = "src/components/analytics/google-analytics.tsx";
const trackerPath = "src/components/analytics/google-analytics-page-view-tracker.tsx";
const layoutPath = "src/app/layout.tsx";
const contactUsFormPath = "src/components/sections/contact-us/form.tsx";
const gatedContentPath = "src/components/sections/publication/gated-content.tsx";
const whitepaperDownloadGatePagePath = "src/components/sections/whitepapers/download-gate-page.tsx";

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
  assert.match(trackerSource, /const previousPageLocation = useRef<string \| null>\(null\)/);
  assert.match(
    trackerSource,
    /hasTrackedInitialPageView\.current = true;\s*previousPageLocation\.current = window\.location\.href;\s*return;/s,
  );
  assert.match(trackerSource, /const currentPageLocation = window\.location\.href/);
  assert.match(trackerSource, /gtag\("event", "page_view", \{/);
  assert.match(trackerSource, /page_title: document\.title/);
  assert.match(trackerSource, /page_location: currentPageLocation/);
  assert.match(trackerSource, /page_path: pagePath/);
  assert.match(trackerSource, /page_referrer: previousPageLocation\.current/);
  assert.match(trackerSource, /send_to: measurementId/);

  const tryIndex = findSourceIndex(trackerSource, /try\s*\{/);
  const pageViewIndex = findSourceIndex(trackerSource, /gtag\("event", "page_view", \{/);
  const catchIndex = findSourceIndex(
    trackerSource,
    /\} catch \{\s*\/\/ Analytics must never block App Router navigation\.\s*\}/s,
  );
  const finallyIndex = findSourceIndex(
    trackerSource,
    /\} finally \{\s*previousPageLocation\.current = currentPageLocation;\s*\}/s,
  );

  assert.ok(tryIndex < pageViewIndex, "page_view should be sent inside the try block");
  assert.ok(pageViewIndex < catchIndex, "analytics exceptions should be suppressed after the send attempt");
  assert.ok(catchIndex < finallyIndex, "previousPageLocation should update in finally after catch");
});

test("generate_lead helper sends a success-only lead surface event", () => {
  const originalWindow = globalThis.window;
  const calls = [];

  try {
    globalThis.window = {
      gtag: (...args) => {
        calls.push(args);
      },
    };

    sendGenerateLeadEvent("contact_us");

    assert.deepEqual(calls, [
      ["event", "generate_lead", { lead_surface: "contact_us" }],
    ]);
  } finally {
    globalThis.window = originalWindow;
  }
});

test("generate_lead helper waits for the analytics callback before completing", () => {
  const originalWindow = globalThis.window;
  const calls = [];
  let completionCount = 0;

  try {
    globalThis.window = {
      gtag: (...args) => {
        calls.push(args);
      },
      setTimeout,
      clearTimeout,
    };

    sendGenerateLeadEvent("whitepaper_download", {
      onComplete: () => {
        completionCount += 1;
      },
      timeoutMs: 50,
    });

    assert.equal(completionCount, 0);
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], "event");
    assert.equal(calls[0][1], "generate_lead");
    assert.equal(calls[0][2].lead_surface, "whitepaper_download");
    assert.equal(calls[0][2].event_timeout, 50);
    assert.equal(typeof calls[0][2].event_callback, "function");

    calls[0][2].event_callback();
    calls[0][2].event_callback();

    assert.equal(completionCount, 1);
  } finally {
    globalThis.window = originalWindow;
  }
});

test("generate_lead helper completes after a short fallback timeout", async () => {
  const originalWindow = globalThis.window;

  try {
    globalThis.window = {
      gtag: () => {},
      setTimeout,
      clearTimeout,
    };

    await new Promise((resolve, reject) => {
      const failureTimeout = setTimeout(() => {
        reject(new Error("generate_lead completion fallback did not run"));
      }, 100);

      sendGenerateLeadEvent("whitepaper_download", {
        onComplete: () => {
          clearTimeout(failureTimeout);
          resolve();
        },
        timeoutMs: 10,
      });
    });
  } finally {
    globalThis.window = originalWindow;
  }
});

test("generate_lead helper is a no-op when gtag is missing", () => {
  const originalWindow = globalThis.window;

  try {
    globalThis.window = {};

    assert.doesNotThrow(() => sendGenerateLeadEvent("contact_us"));
  } finally {
    globalThis.window = originalWindow;
  }
});

test("generate_lead helper suppresses gtag exceptions", () => {
  const originalWindow = globalThis.window;

  try {
    globalThis.window = {
      gtag: () => {
        throw new Error("gtag unavailable");
      },
    };

    assert.doesNotThrow(() => sendGenerateLeadEvent("contact_us"));
  } finally {
    globalThis.window = originalWindow;
  }
});

test("lead generation events are imported and sent only after confirmed submission success", () => {
  const contactUsSource = readSource(contactUsFormPath);
  const gatedContentSource = readSource(gatedContentPath);
  const whitepaperSource = readSource(whitepaperDownloadGatePagePath);
  const expectedImport = /import \{ sendGenerateLeadEvent \} from "@\/lib\/google-analytics-events";/;

  assert.match(contactUsSource, expectedImport);
  assert.match(gatedContentSource, expectedImport);
  assert.match(whitepaperSource, expectedImport);

  const previewEffectStart = whitepaperSource.indexOf("useEffect(() => {");
  const normalSubmitStart = whitepaperSource.indexOf("async function handleSubmit", previewEffectStart);

  assert.notEqual(previewEffectStart, -1, "whitepaper preview useEffect should exist");
  assert.notEqual(normalSubmitStart, -1, "whitepaper normal submit handler should exist");

  assertSuccessOrder(
    contactUsSource,
    /if \(!response\.ok \|\| !json\?\.success\) \{/,
    /sendGenerateLeadEvent\("contact_us"\);/,
    /setSubmitState\(\{ status: "success" \}\);/,
  );
  assertSuccessOrder(
    gatedContentSource,
    /if \(!response\.ok \|\| !result\?\.success\) \{/,
    /sendGenerateLeadEvent\("gated_content"\);/,
    /setUnlocked\(true\);/,
  );
  assertSuccessOrder(
    whitepaperSource.slice(normalSubmitStart),
    /if \(!response\.ok \|\| !result\?\.success\) \{/,
    /sendGenerateLeadEvent\("whitepaper_download", \{/,
    /window\.location\.assign\(downloadHref\);/,
  );
  assert.match(
    whitepaperSource.slice(normalSubmitStart),
    /sendGenerateLeadEvent\("whitepaper_download", \{\s*onComplete: \(\) => \{\s*window\.location\.assign\(downloadHref\);\s*\},\s*\}\);/s,
  );
  assert.doesNotMatch(
    whitepaperSource.slice(previewEffectStart, normalSubmitStart),
    /sendGenerateLeadEvent/,
  );
});

test("whitepaper download form stays locked while analytics completion is pending", () => {
  const whitepaperSource = readSource(whitepaperDownloadGatePagePath);
  const normalSubmitStart = whitepaperSource.indexOf("async function handleSubmit");
  const normalSubmitEnd = whitepaperSource.indexOf("\n  return (", normalSubmitStart);
  const normalSubmitSource = whitepaperSource.slice(normalSubmitStart, normalSubmitEnd);

  assert.doesNotMatch(
    normalSubmitSource,
    /finally \{\s*setSubmitting\(false\);\s*\}/s,
    "confirmed submissions must stay locked until analytics completion starts navigation",
  );
  assert.match(
    normalSubmitSource,
    /if \(!response\.ok \|\| !result\?\.success\) \{\s*setErrorMessage\([\s\S]*?\);\s*setSubmitting\(false\);\s*return;\s*\}/,
    "unsuccessful responses should unlock the form",
  );
  assert.match(
    normalSubmitSource,
    /\} catch \{\s*setErrorMessage\([\s\S]*?\);\s*setSubmitting\(false\);\s*\}/,
    "request failures should unlock the form",
  );
});

function assertSuccessOrder(source, unsuccessfulGuardPattern, eventPattern, successPattern) {
  const unsuccessfulGuardIndex = findSourceIndex(source, unsuccessfulGuardPattern);
  const eventIndex = findSourceIndex(source, eventPattern);
  const successIndex = findSourceIndex(source, successPattern);

  assert.ok(
    unsuccessfulGuardIndex < eventIndex,
    `${eventPattern} should run after the unsuccessful response early return guard`,
  );
  assert.ok(
    eventIndex < successIndex,
    `${eventPattern} should run before the existing success behavior`,
  );
}

function findSourceIndex(source, pattern) {
  const match = source.match(pattern);

  assert.ok(match?.index !== undefined, `${pattern} should exist`);

  return match.index;
}
