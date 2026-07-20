import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { runReviewCycle } from "../../scripts/global-documentation-sync/review-cycle.mjs";

const schemaVersion = "global-documentation-sync/v1";

test("corrects every review finding and reruns all reviewers in fresh processes", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "review-cycle-"));
  const targetRepo = path.join(root, "target");
  const reportsDir = path.join(root, "reports");
  const sourceHtmlPath = path.join(root, "source.html");
  const targetMdxPath = path.join(targetRepo, "src/content/blog/1-one.mdx");
  const targetAssetRoot = path.join(targetRepo, "public/blog/1");
  await mkdir(targetAssetRoot, { recursive: true });
  await mkdir(path.dirname(targetMdxPath), { recursive: true });
  await mkdir(reportsDir, { recursive: true });
  await writeFile(sourceHtmlPath, "<p>source</p>");
  const candidate = { schemaVersion, artifactType: "candidate", runId: "r", sourceId: "cnt_1", sourceHash: `sha256:${"a".repeat(64)}`, sourceCategory: "blogs", targetFamily: "blog", targetId: 1, sourceLocale: "ja", sourceHtmlPath, targetMdxPath, targetAssetRoot, targetRoute: "/blog/1/one", meta: { id: "one" }, assets: [], externalMedia: [], production: {} };
  const candidatePath = path.join(reportsDir, "candidate.json");
  await writeFile(candidatePath, JSON.stringify(candidate));
  let writerCalls = 0;
  let fidelityCalls = 0;
  const runProcess = async ({ role }) => {
    if (role === "writer") {
      writerCalls += 1;
      return JSON.stringify({ mdx: `---\nheroImageSrc: /blog/1/thumbnail.png\n---\n\n${writerCalls}`, generationReport: { schemaVersion, artifactType: "generation-report", runId: "r", sourceId: "cnt_1", targetFiles: [targetMdxPath], inventories: {}, intentionalTransformations: [] } });
    }
    if (role === "fidelity") fidelityCalls += 1;
    const blocking = role === "fidelity" && fidelityCalls === 1;
    return JSON.stringify({ schemaVersion, artifactType: `${role}-review`, runId: "r", sourceId: "cnt_1", verdict: blocking ? "revise" : "pass", findings: blocking ? [{ severity: "minor", location: "body", message: "drift", suggestion: "fix" }] : [] });
  };
  const result = await runReviewCycle({ piBin: "pi", provider: "p", model: "m", targetRepo, candidatePath, reportsDir, runProcess });
  assert.equal(result.attempts, 2);
  assert.equal(writerCalls, 2);
  assert.equal(fidelityCalls, 2);
});
