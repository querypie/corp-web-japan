import assert from "node:assert/strict";
import test from "node:test";

import {
  parseGitHubPullRequestList,
  planIgnoredSyncPullRequestReconciliation,
} from "../../scripts/global-documentation-sync/ignore-reconcile.mjs";

const activeIgnoreManifest = [
  {
    sourceSection: "news",
    sourceId: "cnt_000181",
    sourceCanonicalUrl: "https://itbusinesstoday.com/tech/ai/terrasky-and-querypie-ai-unveil-mitoco-buddy-for-work",
    reasonCode: "other",
    reason: "Ignored by owner from sync Draft PR.",
    addedBy: "owner",
    addedAt: "2026-07-22T02:13:22Z",
  },
];

function syncMarker(marker) {
  return `<!-- global-documentation-sync:v1 ${JSON.stringify(marker)} -->`;
}

function openDraftPullRequest({
  number = 697,
  body = syncMarker({
    sourceSection: "news",
    sourceId: "cnt_000181",
    targetFamily: "news",
    targetId: 181,
    runId: "run-697",
    branch: "content-sync/news-cnt_000181",
  }),
  headRefName = "content-sync/news-cnt_000181",
  state = "OPEN",
  isDraft = true,
  isCrossRepository = false,
} = {}) {
  return { number, body, headRefName, state, isDraft, isCrossRepository };
}

test("fallback planner closes and deletes the exact ignored #699/#697 sync branch", () => {
  const plan = planIgnoredSyncPullRequestReconciliation({
    ignoreManifest: activeIgnoreManifest,
    pullRequests: [openDraftPullRequest()],
  });

  assert.deepEqual(plan, {
    actions: [{
      pullRequestNumber: 697,
      branchToDelete: "content-sync/news-cnt_000181",
      sourceSection: "news",
      sourceId: "cnt_000181",
      identity: "news:cnt_000181",
    }],
  });
});

test("fallback planner skips wrong-section identities even when sourceId matches", () => {
  const plan = planIgnoredSyncPullRequestReconciliation({
    ignoreManifest: [{ ...activeIgnoreManifest[0], sourceSection: "documentation" }],
    pullRequests: [openDraftPullRequest()],
  });

  assert.deepEqual(plan, { actions: [] });
});

test("fallback planner keeps legacy #687 branch compatibility when ignored", () => {
  const plan = planIgnoredSyncPullRequestReconciliation({
    ignoreManifest: [{ ...activeIgnoreManifest[0], sourceId: "cnt_000212" }],
    pullRequests: [openDraftPullRequest({
      number: 687,
      headRefName: "content-sync/cnt_000212",
      body: syncMarker({
        sourceId: "cnt_000212",
        targetFamily: "news",
        targetId: 212,
        runId: "run-687",
        branch: "content-sync/cnt_000212",
      }),
    })],
  });

  assert.deepEqual(plan, {
    actions: [{
      pullRequestNumber: 687,
      branchToDelete: "content-sync/cnt_000212",
      sourceSection: "news",
      sourceId: "cnt_000212",
      identity: "news:cnt_000212",
    }],
  });
});

test("fallback planner skips non-open, non-Draft, and cross-repo sync PRs", () => {
  const plan = planIgnoredSyncPullRequestReconciliation({
    ignoreManifest: activeIgnoreManifest,
    pullRequests: [
      openDraftPullRequest({ state: "CLOSED" }),
      openDraftPullRequest({ number: 698, isDraft: false }),
      openDraftPullRequest({ number: 699, isCrossRepository: true }),
    ],
  });

  assert.deepEqual(plan, { actions: [] });
});

test("fallback planner fails closed on malformed or duplicate sync markers", () => {
  assert.throws(() => planIgnoredSyncPullRequestReconciliation({
    ignoreManifest: activeIgnoreManifest,
    pullRequests: [openDraftPullRequest({ body: "not-a-marker" })],
  }), /missing global-documentation-sync marker/);

  assert.throws(() => planIgnoredSyncPullRequestReconciliation({
    ignoreManifest: activeIgnoreManifest,
    pullRequests: [openDraftPullRequest({
      body: `${syncMarker({
        sourceSection: "news",
        sourceId: "cnt_000181",
        targetFamily: "news",
        targetId: 181,
        runId: "run-697",
        branch: "content-sync/news-cnt_000181",
      })}\n${syncMarker({
        sourceSection: "news",
        sourceId: "cnt_000181",
        targetFamily: "news",
        targetId: 181,
        runId: "run-698",
        branch: "content-sync/news-cnt_000181",
      })}`,
    })],
  }), /duplicate global-documentation-sync marker/);
});

test("fallback planner fails closed on duplicate ignored identity matches", () => {
  assert.throws(() => planIgnoredSyncPullRequestReconciliation({
    ignoreManifest: activeIgnoreManifest,
    pullRequests: [
      openDraftPullRequest({ number: 697 }),
      openDraftPullRequest({ number: 698 }),
    ],
  }), /ambiguous ignored sync identity: news:cnt_000181/);
});

test("planner JSON parser accepts gh pr list payloads", () => {
  const parsed = parseGitHubPullRequestList(JSON.stringify([
    openDraftPullRequest(),
  ]));
  assert.equal(parsed[0].number, 697);
  assert.equal(parsed[0].headRefName, "content-sync/news-cnt_000181");
  assert.throws(() => parseGitHubPullRequestList("{}"), /GitHub PR list response must be an array/);
});
