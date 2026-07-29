import assert from "node:assert/strict";
import test from "node:test";

import { resolveLegacySourceSection, sortSourceRecords, sourceIdentityKey } from "../../scripts/global-content-diff-report/sync-identity.mjs";

test("builds and validates composite source identities", () => {
  assert.equal(sourceIdentityKey({ sourceSection: "documentation", sourceId: "cnt_000001" }), "documentation:cnt_000001");
  assert.equal(sourceIdentityKey({ sourceSection: "news", sourceId: "cnt_000001" }), "news:cnt_000001");
  assert.throws(() => sourceIdentityKey({ sourceSection: "news", sourceId: "1" }), /invalid sourceId/);
});

test("resolves legacy manifest sections from category or exact current source", () => {
  assert.deepEqual(resolveLegacySourceSection({ record: { sourceId: "cnt_000001", sourceCategory: "manuals" }, sources: [] }), { status: "resolved", sourceSection: "documentation" });
  const sources = [
    { sourceId: "cnt_000001", sourceSection: "documentation", sourceCanonicalUrl: "https://www.querypie.com/en/manual/manual-one" },
    { sourceId: "cnt_000001", sourceSection: "news", sourceCanonicalUrl: "https://www.querypie.com/en/news/news-one" },
  ];
  assert.deepEqual(resolveLegacySourceSection({ record: { sourceId: "cnt_000001", sourceCanonicalUrl: sources[1].sourceCanonicalUrl }, sources }), { status: "resolved", sourceSection: "news" });
  assert.deepEqual(resolveLegacySourceSection({ record: { sourceId: "cnt_000001" }, sources }), { status: "ambiguous", sourceId: "cnt_000001" });
});

test("sorts identities by source ID then section", () => {
  const values = [
    { sourceSection: "news", sourceId: "cnt_000002" },
    { sourceSection: "news", sourceId: "cnt_000001" },
    { sourceSection: "documentation", sourceId: "cnt_000001" },
  ].sort(sortSourceRecords);
  assert.deepEqual(values.map(sourceIdentityKey), ["documentation:cnt_000001", "news:cnt_000001", "news:cnt_000002"]);
});
