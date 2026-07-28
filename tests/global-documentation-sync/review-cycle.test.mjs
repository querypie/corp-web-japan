import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { runReviewCycle } from "../../scripts/global-documentation-sync/review-cycle.mjs";

const schemaVersion = "global-documentation-sync/v1";

async function setupReviewCycleFixture(prefix = "review-cycle-") {
  const root = await mkdtemp(path.join(os.tmpdir(), prefix));
  const targetRepo = path.join(root, "target");
  const reportsDir = path.join(root, "reports");
  const sourceHtmlPath = path.join(root, "source.html");
  const targetMdxPath = path.join(targetRepo, "src/content/blog/1-one.mdx");
  const targetAssetRoot = path.join(targetRepo, "public/blog/1");
  await mkdir(targetAssetRoot, { recursive: true });
  await mkdir(path.dirname(targetMdxPath), { recursive: true });
  await mkdir(reportsDir, { recursive: true });
  await writeFile(sourceHtmlPath, "<p>source</p>");
  const candidate = {
    schemaVersion,
    artifactType: "candidate",
    runId: "r",
    sourceId: "cnt_1",
    sourceHash: `sha256:${"a".repeat(64)}`,
    sourceCategory: "blogs",
    sourceSection: "documentation",
    targetFamily: "blog",
    targetId: 1,
    sourceLocale: "ja",
    sourceHtmlPath,
    targetMdxPath,
    targetAssetRoot,
    targetRoute: "/blog/1/one",
    meta: { id: "one", contentType: "content" },
    assets: [],
    externalMedia: [],
    production: {
      canonicalUrl: "https://www.querypie.com/en/blog/one",
      listed: true,
      listUrl: "https://www.querypie.com/en/documentation",
      sitemap: true,
    },
  };
  const candidatePath = path.join(reportsDir, "candidate.json");
  await writeFile(candidatePath, JSON.stringify(candidate));
  return { targetRepo, reportsDir, targetMdxPath, candidatePath };
}

test("gives an initial minor exactly one best-effort correction and then succeeds when minor remains", async () => {
  const { targetRepo, reportsDir, targetMdxPath, candidatePath } = await setupReviewCycleFixture();
  let writerCalls = 0;
  let fidelityCalls = 0;
  const writerPrompts = [];
  const writerCorrectionPayloads = [];
  const runProcess = async ({ role, prompt }) => {
    if (role === "writer") {
      writerCalls += 1;
      writerPrompts.push(prompt);
      writerCorrectionPayloads.push(JSON.parse(prompt.match(/DATA=(\{[\s\S]+\})$/)[1]).correctionFindings);
      return JSON.stringify({ mdx: `---\nheroImageSrc: /blog/1/thumbnail.png\n---\n\n${writerCalls}`, generationReport: { schemaVersion, artifactType: "generation-report", runId: "r", sourceId: "cnt_1", targetFiles: [targetMdxPath], inventories: {}, intentionalTransformations: [] } });
    }
    if (role === "fidelity") fidelityCalls += 1;
    const findings = role === "fidelity" && fidelityCalls === 1
      ? [{ severity: "minor", location: "body", message: "first minor", suggestion: "fix" }, { severity: "note", location: "title", message: "style note", suggestion: "ignore" }]
      : role === "fidelity" && fidelityCalls === 2
        ? [{ severity: "minor", location: "summary", message: "second minor", suggestion: "leave advisory" }]
        : [{ severity: "note", location: "title", message: "style note", suggestion: "ignore" }];
    return JSON.stringify({ schemaVersion, artifactType: `${role}-review`, runId: "r", sourceId: "cnt_1", verdict: "pass", findings });
  };
  const result = await runReviewCycle({ piBin: "pi", provider: "p", model: "m", targetRepo, candidatePath, reportsDir, runProcess });
  assert.equal(result.attempts, 2);
  assert.equal(writerCalls, 2);
  assert.equal(fidelityCalls, 2);
  assert.equal(writerCorrectionPayloads[0].length, 0);
  assert.deepEqual(writerCorrectionPayloads[1], [{ review: "fidelity-review", severity: "minor", location: "body", message: "first minor", suggestion: "fix" }]);
  assert.match(writerPrompts[1], /supplied actionable findings/);
  assert.doesNotMatch(writerPrompts[1], /note findings/);
  assert.deepEqual(result.reviews.find((review) => review.artifactType === "fidelity-review")?.findings, [{ severity: "minor", location: "summary", message: "second minor", suggestion: "leave advisory" }]);
});

test("default review budget allows a fifth-review major to reach the sixth writer", async () => {
  const { targetRepo, reportsDir, targetMdxPath, candidatePath } = await setupReviewCycleFixture("review-cycle-six-attempts-");
  const writerCorrectionPayloads = [];
  let fidelityCalls = 0;
  const runProcess = async ({ role, prompt }) => {
    if (role === "writer") {
      writerCorrectionPayloads.push(JSON.parse(prompt.match(/DATA=(\{[\s\S]+\})$/)[1]).correctionFindings);
      return JSON.stringify({ mdx: "---\nheroImageSrc: /blog/1/thumbnail.png\n---\n", generationReport: { schemaVersion, artifactType: "generation-report", runId: "r", sourceId: "cnt_1", targetFiles: [targetMdxPath], inventories: {}, intentionalTransformations: [] } });
    }
    if (role === "fidelity") {
      fidelityCalls += 1;
      const findings = fidelityCalls <= 4
        ? [{ severity: "major", location: `body-${fidelityCalls}`, message: `blocking ${fidelityCalls}`, suggestion: `fix ${fidelityCalls}` }]
        : fidelityCalls === 5
          ? [{ severity: "major", location: "body", message: "fifth review finding", suggestion: "apply on sixth write" }]
          : [];
      return JSON.stringify({ schemaVersion, artifactType: "fidelity-review", runId: "r", sourceId: "cnt_1", verdict: findings.length ? "revise" : "pass", findings });
    }
    return JSON.stringify({ schemaVersion, artifactType: `${role}-review`, runId: "r", sourceId: "cnt_1", verdict: "pass", findings: [] });
  };

  const result = await runReviewCycle({ piBin: "pi", provider: "p", model: "m", targetRepo, candidatePath, reportsDir, runProcess });
  assert.equal(result.attempts, 6);
  assert.equal(writerCorrectionPayloads.length, 6);
  assert.deepEqual(writerCorrectionPayloads[5].at(-1), { review: "fidelity-review", severity: "major", location: "body", message: "fifth review finding", suggestion: "apply on sixth write" });
});

test("persistent major after the sixth review fails with only current blocking findings", async () => {
  const { targetRepo, reportsDir, targetMdxPath, candidatePath } = await setupReviewCycleFixture("review-cycle-sixth-review-fail-");
  let writerCalls = 0;
  let fidelityCalls = 0;
  const runProcess = async ({ role }) => {
    if (role === "writer") {
      writerCalls += 1;
      return JSON.stringify({ mdx: "---\nheroImageSrc: /blog/1/thumbnail.png\n---\n", generationReport: { schemaVersion, artifactType: "generation-report", runId: "r", sourceId: "cnt_1", targetFiles: [targetMdxPath], inventories: {}, intentionalTransformations: [] } });
    }
    if (role === "fidelity") {
      fidelityCalls += 1;
      const findings = fidelityCalls === 6
        ? [{ severity: "major", location: "body-6", message: "current blocker", suggestion: "fix current blocker" }]
        : [{ severity: "major", location: `body-${fidelityCalls}`, message: `old blocker ${fidelityCalls}`, suggestion: `fix old blocker ${fidelityCalls}` }];
      return JSON.stringify({ schemaVersion, artifactType: "fidelity-review", runId: "r", sourceId: "cnt_1", verdict: "revise", findings });
    }
    return JSON.stringify({ schemaVersion, artifactType: `${role}-review`, runId: "r", sourceId: "cnt_1", verdict: "pass", findings: [] });
  };

  await assert.rejects(
    () => runReviewCycle({ piBin: "pi", provider: "p", model: "m", targetRepo, candidatePath, reportsDir, runProcess }),
    (error) => {
      assert.match(error.message, /review correction limit reached after 5 correction attempts/);
      assert.match(error.message, /current blocker/);
      assert.doesNotMatch(error.message, /old blocker 1/);
      return true;
    }
  );
  assert.equal(writerCalls, 6);
});

test("co-occurring minor is sent once and blocking history still accumulates uniquely across attempts", async () => {
  const { targetRepo, reportsDir, targetMdxPath, candidatePath } = await setupReviewCycleFixture("review-cycle-accumulate-");
  const writerCorrectionPayloads = [];
  const majorA = { severity: "major", location: "title", message: "A", suggestion: "fix A" };
  const majorB = { severity: "major", location: "body", message: "B", suggestion: "fix B" };
  const minorA = { severity: "minor", location: "summary", message: "minor A", suggestion: "fix minor A" };
  const minorB = { severity: "minor", location: "caption", message: "minor B", suggestion: "fix minor B" };
  let fidelityCalls = 0;
  const runProcess = async ({ role, prompt }) => {
    if (role === "writer") {
      writerCorrectionPayloads.push(JSON.parse(prompt.match(/DATA=(\{[\s\S]+\})$/)[1]).correctionFindings);
      return JSON.stringify({ mdx: "---\nheroImageSrc: /blog/1/thumbnail.png\n---\n", generationReport: { schemaVersion, artifactType: "generation-report", runId: "r", sourceId: "cnt_1", targetFiles: [targetMdxPath], inventories: {}, intentionalTransformations: [] } });
    }
    if (role === "fidelity") {
      fidelityCalls += 1;
      const findings = fidelityCalls === 1 ? [majorA, majorA, minorA] : fidelityCalls === 2 ? [majorB, minorB] : [];
      return JSON.stringify({ schemaVersion, artifactType: "fidelity-review", runId: "r", sourceId: "cnt_1", verdict: findings.some(({ severity }) => severity === "major") ? "revise" : "pass", findings });
    }
    return JSON.stringify({ schemaVersion, artifactType: `${role}-review`, runId: "r", sourceId: "cnt_1", verdict: "pass", findings: [] });
  };

  const result = await runReviewCycle({ piBin: "pi", provider: "p", model: "m", targetRepo, candidatePath, reportsDir, runProcess, maximumCorrectionRounds: 2 });
  assert.equal(result.attempts, 3);
  assert.deepEqual(writerCorrectionPayloads, [
    [],
    [{ review: "fidelity-review", ...majorA }, { review: "fidelity-review", ...minorA }],
    [{ review: "fidelity-review", ...majorA }, { review: "fidelity-review", ...majorB }],
  ]);
});
