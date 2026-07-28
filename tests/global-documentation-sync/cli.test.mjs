import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { finalize } from "../../scripts/global-documentation-sync/cli.mjs";

const schemaVersion = "global-documentation-sync/v1";

async function setupFinalizeFixture() {
  const reportsDir = await mkdtemp(path.join(os.tmpdir(), "global-doc-finalize-"));
  const candidate = {
    schemaVersion,
    artifactType: "candidate",
    runId: "run-1",
    sourceId: "cnt_1",
    startedAt: "2026-07-28T01:03:32.162Z",
    sourceHash: `sha256:${"a".repeat(64)}`,
    sourceCategory: "blogs",
    sourceSection: "documentation",
    targetFamily: "blog",
    targetId: 1,
    sourceLocale: "ja",
    sourceHtmlPath: "/source/ja.html",
    targetMdxPath: "/target/src/content/blog/1-example.mdx",
    targetAssetRoot: "/target/public/blog/1",
    heroImagePath: "/target/public/blog/1/thumbnail.png",
    targetRoute: "/blog/1/example",
    meta: { id: "example", contentType: "content" },
    assets: [{ targetPath: "/target/public/blog/1/example.png" }],
    externalMedia: [],
    production: { canonicalUrl: "https://www.querypie.com/en/blog/example", listed: true, listUrl: "https://www.querypie.com/en/documentation", sitemap: true },
  };
  const review = (artifactType, findings = [], verdict = "pass") => ({ schemaVersion, artifactType, runId: candidate.runId, sourceId: candidate.sourceId, verdict, findings });
  await mkdir(reportsDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(reportsDir, "candidate.json"), JSON.stringify(candidate)),
    writeFile(path.join(reportsDir, "generation-report.json"), JSON.stringify({ schemaVersion, artifactType: "generation-report", runId: candidate.runId, sourceId: candidate.sourceId, targetFiles: [candidate.targetMdxPath, candidate.heroImagePath, candidate.assets[0].targetPath], inventories: {}, intentionalTransformations: [] })),
    writeFile(path.join(reportsDir, "validation-results.json"), JSON.stringify({ schemaVersion, artifactType: "validation-results", runId: candidate.runId, sourceId: candidate.sourceId, results: [{ command: "npm run test:ci", code: 0 }, { command: "npm run build", code: 0 }] })),
    writeFile(path.join(reportsDir, "browser-results.json"), JSON.stringify({ schemaVersion, artifactType: "browser-results", runId: candidate.runId, sourceId: candidate.sourceId, results: [{ viewport: "desktop", status: "passed", findings: [] }, { viewport: "mobile", status: "passed", findings: [] }] })),
    writeFile(path.join(reportsDir, "fidelity-review.json"), JSON.stringify(review("fidelity-review"))),
    writeFile(path.join(reportsDir, "japanese-editorial-review.json"), JSON.stringify(review("japanese-editorial-review"))),
    writeFile(path.join(reportsDir, "contract-review.json"), JSON.stringify(review("contract-review"))),
  ]);
  return { reportsDir, review };
}

test("finalize accepts pass reviews with minor findings but rejects blocking or revise verdicts", async () => {
  const { reportsDir, review } = await setupFinalizeFixture();
  await writeFile(path.join(reportsDir, "japanese-editorial-review.json"), JSON.stringify(review("japanese-editorial-review", [{ severity: "minor", location: "body", message: "advisory", suggestion: "optional" }])));
  const summary = await finalize({ reportsDir });
  assert.equal(summary.status, "dry_run_passed");
  assert.deepEqual(summary.reviews.find((item) => item.type === "japanese-editorial-review"), { type: "japanese-editorial-review", verdict: "pass", findings: 1 });
  assert.equal(JSON.parse(await readFile(path.join(reportsDir, "run-summary.json"), "utf8")).status, "dry_run_passed");

  await writeFile(path.join(reportsDir, "contract-review.json"), JSON.stringify(review("contract-review", [{ severity: "major", location: "frontmatter", message: "blocking", suggestion: "fix" }], "pass")));
  await assert.rejects(() => finalize({ reportsDir }), /contract-review has unresolved blocking findings/);

  await writeFile(path.join(reportsDir, "contract-review.json"), JSON.stringify(review("contract-review")));
  await writeFile(path.join(reportsDir, "fidelity-review.json"), JSON.stringify(review("fidelity-review", [], "revise")));
  await assert.rejects(() => finalize({ reportsDir }), /fidelity-review has unresolved blocking findings/);
});
