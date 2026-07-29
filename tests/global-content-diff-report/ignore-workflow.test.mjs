import assert from "node:assert/strict";
import test from "node:test";

import { assertIgnoreAppendAllowed } from "../../scripts/global-content-diff-report/ignore-workflow.mjs";

test("Direct Ignore rejects an existing composite identity", () => {
  assert.throws(() => assertIgnoreAppendAllowed({
    values: [{ sourceSection: "news", sourceId: "cnt_000212" }],
    sourceSection: "news",
    sourceId: "cnt_000212",
    sourceCanonicalUrl: "https://www.querypie.com/en/news/news-212",
  }), /already ignored: news\/cnt_000212/);
});

test("Direct Ignore preserves safe legacy-row handling", () => {
  assert.throws(() => assertIgnoreAppendAllowed({
    values: [{ sourceId: "cnt_000051", sourceCanonicalUrl: "https://www.querypie.com/en/events/event" }],
    sourceSection: "documentation",
    sourceId: "cnt_000051",
    sourceCanonicalUrl: "https://www.querypie.com/en/events/event",
  }), /already ignored: documentation\/cnt_000051/);
  assert.throws(() => assertIgnoreAppendAllowed({
    values: [{ sourceId: "cnt_000212" }],
    sourceSection: "news",
    sourceId: "cnt_000212",
    sourceCanonicalUrl: "https://www.querypie.com/en/news/news-212",
  }), /legacy ignore row cannot be resolved safely/);
  assert.doesNotThrow(() => assertIgnoreAppendAllowed({
    values: [{ sourceId: "cnt_000212", sourceCategory: "manuals" }],
    sourceSection: "news",
    sourceId: "cnt_000212",
    sourceCanonicalUrl: "https://www.querypie.com/en/news/news-212",
  }));
});
