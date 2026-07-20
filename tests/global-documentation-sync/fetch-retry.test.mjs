import assert from "node:assert/strict";
import test from "node:test";

import { fetchTextWithRetry } from "../../scripts/global-documentation-sync/fetch-retry.mjs";

test("retries only timeout, network, 429, and 5xx failures", async () => {
  let calls = 0;
  const result = await fetchTextWithRetry("https://example.com", { fetchImpl: async () => { calls += 1; return calls === 1 ? new Response("busy", { status: 503 }) : new Response("ok"); }, sleep: async () => {} });
  assert.equal(result, "ok");
  assert.equal(calls, 2);
  calls = 0;
  await assert.rejects(() => fetchTextWithRetry("https://example.com", { fetchImpl: async () => { calls += 1; return new Response("missing", { status: 404 }); }, sleep: async () => {} }), /HTTP 404/);
  assert.equal(calls, 1);
});
