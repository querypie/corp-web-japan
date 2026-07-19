import assert from "node:assert/strict";
import test from "node:test";

import { assessPageMetrics, publicationRoute } from "../../scripts/global-documentation-sync/browser-qa.mjs";

test("fails closed on broken media or horizontal overflow", () => {
  assert.deepEqual(assessPageMetrics({ clientWidth: 390, scrollWidth: 391, images: [] }).status, "failed");
  assert.deepEqual(assessPageMetrics({ clientWidth: 390, scrollWidth: 390, images: [{ complete: true, naturalWidth: 0, naturalHeight: 0, width: 100, height: 100 }] }).status, "failed");
  assert.deepEqual(assessPageMetrics({ clientWidth: 390, scrollWidth: 390, images: [{ complete: true, naturalWidth: 100, naturalHeight: 50, width: 330, height: 165 }] }).status, "passed");
});

test("builds canonical local publication routes for every family", () => {
  const expected = {
    blog: "/blog/7/slug", whitepapers: "/whitepapers/7/slug", events: "/events/7/slug",
    manuals: "/manuals/7/slug", glossary: "/glossary/7/slug", "use-cases": "/use-cases/7/slug",
    "introduction-deck": "/introduction-deck/7/slug",
  };
  for (const [family, route] of Object.entries(expected)) assert.equal(publicationRoute({ targetFamily: family, targetId: 7, meta: { id: "slug" } }), route);
});
