import assert from "node:assert/strict";
import test from "node:test";

import { loadAllPullRequests } from "../../scripts/global-documentation-sync/github-state.mjs";

test("loads and normalizes every paginated PR page", async () => {
  const pages = [[{ number: 1, state: "closed", merged_at: null, body: "a", head: { ref: "one" }, labels: [], html_url: "u1" }], [{ number: 2, state: "closed", merged_at: "date", body: "b", head: { ref: "two" }, labels: [{ name: "x" }], html_url: "u2" }]];
  const calls = [];
  const records = await loadAllPullRequests({ githubRepo: "owner/repo", cwd: "/repo", execute: async (command, args) => { calls.push([command, args]); return JSON.stringify(pages); } });
  assert.equal(records.length, 2);
  assert.equal(records[1].state, "MERGED");
  assert.ok(calls[0][1].includes("--paginate"));
  assert.ok(calls[0][1].includes("--slurp"));
});
