import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDirectIgnoreBranch,
  classifyReusableDirectIgnorePullRequests,
  findReusableDirectIgnorePullRequests,
} from "../../scripts/global-content-diff-report/direct-ignore-pr.mjs";

const identity = "news:cnt_000173";
const repository = "querypie/corp-web-japan";
const marker = '<!-- global-content-diff-ignore:v1 {"sourceSection":"news","sourceId":"cnt_000173","sourceIdentity":"news:cnt_000173"} -->';

function pullRequest(overrides = {}) {
  return {
    title: "Ignore Global-only content news:cnt_000173",
    body: marker,
    html_url: "https://github.com/querypie/corp-web-japan/pull/17",
    head: {
      ref: "global-content-diff-ignore/news-cnt_000173-123456-2",
      repo: { full_name: "QueryPie/Corp-Web-Japan" },
    },
    ...overrides,
  };
}

test("matches edited-title same-repository PR with a unique run branch and exact marker", () => {
  const matches = findReusableDirectIgnorePullRequests({
    pages: [[pullRequest({ title: "Maintainer edited this title" })]],
    repository,
    sourceIdentity: identity,
  });

  assert.deepEqual(matches, [{
    url: "https://github.com/querypie/corp-web-japan/pull/17",
    headRefName: "global-content-diff-ignore/news-cnt_000173-123456-2",
  }]);
});

test("supports the legacy deterministic identity branch", () => {
  const pr = pullRequest();
  pr.head.ref = "global-content-diff-ignore/news-cnt_000173";
  assert.equal(findReusableDirectIgnorePullRequests({ pages: [[pr]], repository, sourceIdentity: identity }).length, 1);
});

test("rejects fork, wrong marker, wrong identity branch, and malformed PR data", () => {
  const fork = pullRequest();
  fork.head.repo.full_name = "contributor/corp-web-japan";
  const wrongMarker = pullRequest({ body: marker.replace(":v1", ":v2") });
  const wrongBranch = pullRequest();
  wrongBranch.head.ref = "global-content-diff-ignore/news-cnt_000174-123456-2";
  const unsupportedBranch = pullRequest();
  unsupportedBranch.head.ref = "global-content-diff-ignore/news-cnt_000173-custom";

  const matches = findReusableDirectIgnorePullRequests({
    pages: [[fork, wrongMarker, wrongBranch, unsupportedBranch, null, {}, { head: { ref: 42 } }]],
    repository,
    sourceIdentity: identity,
  });
  assert.deepEqual(matches, []);
});

test("rejects malformed paginated responses and invalid matching inputs", () => {
  for (const pages of [{}, [[] , {}]]) {
    assert.throws(
      () => findReusableDirectIgnorePullRequests({ pages, repository, sourceIdentity: identity }),
      /paginated GitHub pull request arrays/,
    );
  }
  assert.throws(
    () => findReusableDirectIgnorePullRequests({ pages: [[]], repository: "", sourceIdentity: identity }),
    /repository is required/,
  );
  assert.throws(
    () => findReusableDirectIgnorePullRequests({ pages: [[]], repository, sourceIdentity: "cnt_000173" }),
    /Invalid source_identity/,
  );
});

test("classifies zero, one, and duplicate reusable pull requests", () => {
  assert.deepEqual(classifyReusableDirectIgnorePullRequests([]), { kind: "create", match: null, count: 0 });
  const match = { url: "https://example.test/pr/1", headRefName: "branch" };
  assert.deepEqual(classifyReusableDirectIgnorePullRequests([match]), { kind: "reuse", match, count: 1 });
  assert.deepEqual(classifyReusableDirectIgnorePullRequests([match, match]), { kind: "duplicate", match: null, count: 2 });
  assert.throws(() => classifyReusableDirectIgnorePullRequests(null), /matches must be an array/);
});

test("builds an exact safe unique branch and validates run coordinates", () => {
  assert.equal(
    buildDirectIgnoreBranch({ sourceIdentity: identity, runId: "123456", runAttempt: "2" }),
    "global-content-diff-ignore/news-cnt_000173-123456-2",
  );
  for (const invalid of ["", "0", "-1", "1.5", "abc", " 2", 2] ) {
    assert.throws(
      () => buildDirectIgnoreBranch({ sourceIdentity: identity, runId: invalid, runAttempt: "1" }),
      /run ID/,
    );
    assert.throws(
      () => buildDirectIgnoreBranch({ sourceIdentity: identity, runId: "1", runAttempt: invalid }),
      /run attempt/,
    );
  }
});
