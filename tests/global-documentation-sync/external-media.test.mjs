import assert from "node:assert/strict";
import test from "node:test";

import { externalMediaIdentity, extractAllowedExternalMedia } from "../../scripts/global-documentation-sync/external-media.mjs";

test("normalizes only approved YouTube and Vimeo embed providers", () => {
  assert.equal(externalMediaIdentity("https://www.youtube.com/watch?v=abc_123"), "youtube:abc_123");
  assert.equal(externalMediaIdentity("https://www.youtube.com/embed/abc_123?si=x"), "youtube:abc_123");
  assert.equal(externalMediaIdentity("https://youtu.be/abc_123"), "youtube:abc_123");
  assert.equal(externalMediaIdentity("https://player.vimeo.com/video/123"), "vimeo:123");
  assert.throws(() => externalMediaIdentity("https://127.0.0.1/admin"), /approved/);
  assert.throws(() => externalMediaIdentity("https://attacker.example/video"), /approved/);
});

test("extracts external media from source iframe/video elements only", () => {
  assert.deepEqual(extractAllowedExternalMedia('<iframe src="https://www.youtube.com/watch?v=abc"></iframe><a href="https://attacker.example">x</a>'), [{ url: "https://www.youtube.com/watch?v=abc", identity: "youtube:abc" }]);
});
