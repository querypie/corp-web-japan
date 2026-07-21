import assert from "node:assert/strict";
import test from "node:test";

import {
  branchFor,
  ignoreBranchFor,
  parseIgnoreBranch,
  parseSyncBranch,
  parseSyncMarker,
  resolveLegacySourceSection,
  serializeSyncMarker,
  sourceIdentityKey,
} from "../../scripts/global-documentation-sync/sync-identity.mjs";

test("builds composite identities and explicit branch names", () => {
  assert.equal(sourceIdentityKey({ sourceSection: "documentation", sourceId: "cnt_000001" }), "documentation:cnt_000001");
  assert.equal(branchFor("documentation", "cnt_000001"), "content-sync/documentation-cnt_000001");
  assert.equal(ignoreBranchFor("news", "cnt_000001"), "content-sync-ignore/news-cnt_000001");
});

test("parses explicit and legacy sync branches", () => {
  assert.deepEqual(parseSyncBranch("content-sync/news-cnt_000212"), {
    kind: "sync",
    branch: "content-sync/news-cnt_000212",
    sourceSection: "news",
    sourceId: "cnt_000212",
    identity: "news:cnt_000212",
    legacy: false,
  });
  assert.deepEqual(parseSyncBranch("content-sync/cnt_000212"), {
    kind: "sync",
    branch: "content-sync/cnt_000212",
    sourceSection: null,
    sourceId: "cnt_000212",
    identity: null,
    legacy: true,
  });
  assert.deepEqual(parseIgnoreBranch("content-sync-ignore/documentation-cnt_000001"), {
    kind: "ignore",
    branch: "content-sync-ignore/documentation-cnt_000001",
    sourceSection: "documentation",
    sourceId: "cnt_000001",
    identity: "documentation:cnt_000001",
    legacy: false,
  });
});

test("legacy PR markers infer sourceSection from targetFamily", () => {
  const legacyNews = parseSyncMarker('<!-- global-documentation-sync:v1 {"sourceId":"cnt_000212","targetFamily":"news","targetId":12,"runId":"r","branch":"content-sync/cnt_000212"} -->');
  assert.equal(legacyNews.sourceSection, "news");
  assert.equal(legacyNews.identity, "news:cnt_000212");
  const legacyDocs = parseSyncMarker('<!-- global-documentation-sync:v1 {"sourceId":"cnt_000001","targetFamily":"manuals","targetId":1,"runId":"r","branch":"content-sync/cnt_000001"} -->');
  assert.equal(legacyDocs.sourceSection, "documentation");
  assert.throws(() => parseSyncMarker('<!-- global-documentation-sync:v1 {"sourceId":"cnt_000001","targetFamily":"manual","targetId":1,"runId":"r","branch":"content-sync/cnt_000001"} -->'), /unsupported target family: manual/);
  const explicit = serializeSyncMarker({
    sourceSection: "news",
    sourceId: "cnt_000212",
    sourceHash: "sha256:test",
    targetFamily: "news",
    targetId: 12,
    runId: "r",
    branch: "content-sync/news-cnt_000212",
  });
  assert.match(explicit, /"sourceSection":"news"/);
});

test("legacy manifest rows resolve section from category or current sources", () => {
  assert.deepEqual(resolveLegacySourceSection({ record: { sourceId: "cnt_000001", sourceCategory: "manuals" }, sources: [] }), { status: "resolved", sourceSection: "documentation" });
  assert.deepEqual(resolveLegacySourceSection({ record: { sourceId: "cnt_000001", sourceCanonicalUrl: "https://www.querypie.com/en/news/news-one" }, sources: [
    { sourceId: "cnt_000001", sourceSection: "documentation", sourceCanonicalUrl: "https://www.querypie.com/en/manual/manual-one" },
    { sourceId: "cnt_000001", sourceSection: "news", sourceCanonicalUrl: "https://www.querypie.com/en/news/news-one" },
  ] }), { status: "resolved", sourceSection: "news" });
  assert.deepEqual(resolveLegacySourceSection({
    record: { sourceId: "cnt_000051" },
    sources: [{ sourceId: "cnt_000051", sourceSection: "documentation", sourceCanonicalUrl: "https://www.querypie.com/en/events/querypie-side-kick-teaser-ko" }],
    allowSourceIdFallback: false,
  }), { status: "missing", sourceId: "cnt_000051" });
});
