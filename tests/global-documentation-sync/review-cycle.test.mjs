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

test("corrects every actionable review finding and ignores note-only findings in correction mode", async () => {
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
    const blocking = role === "fidelity" && fidelityCalls === 1;
    return JSON.stringify({ schemaVersion, artifactType: `${role}-review`, runId: "r", sourceId: "cnt_1", verdict: blocking ? "revise" : "pass", findings: blocking ? [{ severity: "minor", location: "body", message: "drift", suggestion: "fix" }, { severity: "note", location: "title", message: "style note", suggestion: "ignore" }] : [{ severity: "note", location: "title", message: "style note", suggestion: "ignore" }] });
  };
  const result = await runReviewCycle({ piBin: "pi", provider: "p", model: "m", targetRepo, candidatePath, reportsDir, runProcess });
  assert.equal(result.attempts, 2);
  assert.equal(writerCalls, 2);
  assert.equal(fidelityCalls, 2);
  assert.equal(writerCorrectionPayloads[0].length, 0);
  assert.deepEqual(writerCorrectionPayloads[1], [{ review: "fidelity-review", severity: "minor", location: "body", message: "drift", suggestion: "fix" }]);
  assert.match(writerPrompts[1], /supplied actionable findings/);
  assert.doesNotMatch(writerPrompts[1], /note findings/);
  assert.equal(result.reviews.every((review) => review.findings.every((finding) => finding.severity === "note" || finding.severity === "minor")), true);
});

test("correction mode accumulates unique actionable findings across attempts while success depends on current unresolved findings", async () => {
  const { targetRepo, reportsDir, targetMdxPath, candidatePath } = await setupReviewCycleFixture("review-cycle-accumulate-");
  const writerCorrectionPayloads = [];
  const findingA = { severity: "minor", location: "title", message: "A", suggestion: "fix A" };
  const findingB = { severity: "minor", location: "body", message: "B", suggestion: "fix B" };
  let fidelityCalls = 0;
  const runProcess = async ({ role, prompt }) => {
    if (role === "writer") {
      writerCorrectionPayloads.push(JSON.parse(prompt.match(/DATA=(\{[\s\S]+\})$/)[1]).correctionFindings);
      return JSON.stringify({ mdx: "---\nheroImageSrc: /blog/1/thumbnail.png\n---\n", generationReport: { schemaVersion, artifactType: "generation-report", runId: "r", sourceId: "cnt_1", targetFiles: [targetMdxPath], inventories: {}, intentionalTransformations: [] } });
    }
    if (role === "fidelity") {
      fidelityCalls += 1;
      const findings = fidelityCalls === 1 ? [findingA, findingA] : fidelityCalls === 2 ? [findingB] : [];
      return JSON.stringify({ schemaVersion, artifactType: "fidelity-review", runId: "r", sourceId: "cnt_1", verdict: findings.length ? "revise" : "pass", findings });
    }
    return JSON.stringify({ schemaVersion, artifactType: `${role}-review`, runId: "r", sourceId: "cnt_1", verdict: "pass", findings: [] });
  };

  const result = await runReviewCycle({ piBin: "pi", provider: "p", model: "m", targetRepo, candidatePath, reportsDir, runProcess, maximumAttempts: 3 });
  assert.equal(result.attempts, 3);
  assert.deepEqual(writerCorrectionPayloads, [
    [],
    [{ review: "fidelity-review", ...findingA }],
    [{ review: "fidelity-review", ...findingA }, { review: "fidelity-review", ...findingB }],
  ]);
});
