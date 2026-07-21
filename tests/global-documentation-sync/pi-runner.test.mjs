import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { buildPiInvocations, runPiInvocations } from "../../scripts/global-documentation-sync/pi-runner.mjs";

const candidate = {
  schemaVersion: "global-documentation-sync/v1",
  artifactType: "candidate",
  runId: "run-1",
  sourceId: "cnt_1",
  sourceHash: `sha256:${"a".repeat(64)}`,
  sourceCategory: "blogs",
  targetFamily: "blog",
  targetId: 1,
  sourceLocale: "ja",
  sourceHtmlPath: "/source/ja.html",
  targetMdxPath: "/target/src/content/blog/1-example.mdx",
  targetAssetRoot: "/target/public/blog/1",
  targetRoute: "/blog/1/example",
  meta: { id: "example", contentType: "content" },
  assets: [],
  externalMedia: [],
  sourceSection: "documentation",
  resolvedSourceLabel: null,
  resolvedRedirectUrl: null,
  production: { canonicalUrl: "https://www.querypie.com/en/blog/example", listed: true, listUrl: "https://www.querypie.com/en/documentation", sitemap: true },
};

test("builds four isolated headless Pi calls with no tools", () => {
  const calls = buildPiInvocations({
    piBin: "pi",
    provider: "provider",
    model: "model",
    targetRepo: "/target",
    reportsDir: "/reports",
    candidate,
    sourceHtml: "<p>source</p>",
    targetMdx: "---\nid: 1\n---\n",
  });
  assert.equal(calls.length, 4);
  assert.deepEqual(calls.map((call) => call.role), ["writer", "fidelity", "japanese-editorial", "contract"]);
  for (const call of calls) {
    assert.equal(call.command, "pi");
    assert.ok(call.args.includes("--print"));
    assert.ok(call.args.includes("--no-session"));
    assert.ok(call.args.includes("--approve"));
    assert.ok(call.args.includes("--no-tools"));
    assert.ok(!call.args.includes("--tools"));
    assert.ok(!call.prompt.includes("/reports/") || call.role === "writer");
  }
});

test("writer correction prompt pins quoted id and promises only actionable corrections", () => {
  const calls = buildPiInvocations({
    piBin: "pi",
    provider: "provider",
    model: "model",
    targetRepo: "/target",
    reportsDir: "/reports",
    candidate: {
      ...candidate,
      targetFamily: "news",
      targetId: 9,
      targetRoute: "/news/9/example",
      resolvedSourceLabel: "公式発表",
      resolvedRedirectUrl: "https://media.example/news-one",
      production: {
        canonicalUrl: "https://www.querypie.com/ja/news/example",
        listed: true,
        listUrl: "https://www.querypie.com/ja/news",
        sitemap: false,
      },
      meta: { id: "example", contentType: "outlink" },
    },
    sourceHtml: "<p>source</p>",
    targetMdx: "---\nid: 9\n---\n",
    correctionFindings: [
      { review: "fidelity-review", severity: "minor", location: "body", message: "drift", suggestion: "fix" },
    ],
  });
  const writer = calls.find((call) => call.role === "writer");
  assert.ok(writer);
  assert.match(writer.prompt, /quoted YAML string equal to String\(candidate\.targetId\)/);
  assert.match(writer.prompt, /id: "19"/);
  assert.match(writer.prompt, /never emit an unquoted or numeric id/);
  assert.match(writer.prompt, /Resolve all 1 supplied actionable findings one by one/);
  assert.match(writer.prompt, /including every minor-or-higher item/);
  assert.match(writer.prompt, /resolve every supplied actionable finding, including minor findings/);
  assert.doesNotMatch(writer.prompt, /including minor and note findings/);
  assert.match(writer.prompt, /News[\s\S]*must not contain author/);
  assert.match(writer.prompt, /resolvedSourceLabel/);
  assert.match(writer.prompt, /resolvedRedirectUrl/);
});


test("japanese editorial prompt reserves note for non-actionable observations", () => {
  const calls = buildPiInvocations({
    piBin: "pi",
    provider: "provider",
    model: "model",
    targetRepo: "/target",
    reportsDir: "/reports",
    candidate,
    sourceHtml: "<p>source</p>",
    targetMdx: "---\nid: \"1\"\n---\n",
  });
  const editorial = calls.find((call) => call.role === "japanese-editorial");
  assert.ok(editorial);
  assert.match(editorial.prompt, /translationese wording that has a concrete correction as actionable minor or higher/);
  assert.match(editorial.prompt, /reserve note only for non-actionable observations that require no text change/);
  assert.match(editorial.prompt, /isolated wording described as merely やや or 少し awkward is still minor when a concrete correction exists/);
  assert.doesNotMatch(editorial.prompt, /actionable note/);
});

test("applies no-tools stdout envelopes only to allocated paths", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pi-envelope-"));
  const targetRepo = path.join(root, "target");
  const reportsDir = path.join(root, "reports");
  const sourceHtmlPath = path.join(root, "source.html");
  const targetMdxPath = path.join(targetRepo, "src/content/blog/1-example.mdx");
  const targetAssetRoot = path.join(targetRepo, "public/blog/1");
  await mkdir(targetAssetRoot, { recursive: true });
  await mkdir(path.dirname(targetMdxPath), { recursive: true });
  await mkdir(reportsDir, { recursive: true });
  await writeFile(sourceHtmlPath, "<h1>見出し</h1><p>本文</p>");
  const value = { ...candidate, sourceHtmlPath, targetMdxPath, targetAssetRoot };
  const candidatePath = path.join(reportsDir, "candidate.json");
  await writeFile(candidatePath, JSON.stringify(value));
  const review = (artifactType) => ({
    schemaVersion: value.schemaVersion, artifactType, runId: value.runId,
    sourceId: value.sourceId, verdict: "pass", findings: [],
  });
  const outputs = {
    writer: {
      mdx: "---\nid: 1\nslug: example\ntitle: テスト\ndescription: テスト\ndate: 2026-01-01\nheroImageSrc: /blog/1/thumbnail.png\nrelatedIds: []\n---\n\n# 見出し\n\n本文\n",
      generationReport: {
        schemaVersion: value.schemaVersion, artifactType: "generation-report",
        runId: value.runId, sourceId: value.sourceId,
        targetFiles: [targetMdxPath], inventories: { headings: [], figures: [], captions: [], links: [] },
        intentionalTransformations: [],
      },
    },
    fidelity: review("fidelity-review"),
    "japanese-editorial": review("japanese-editorial-review"),
    contract: review("contract-review"),
  };
  await runPiInvocations({
    piBin: "pi", provider: "provider", model: "model", targetRepo,
    candidatePath, reportsDir,
    runProcess: async ({ role }) => JSON.stringify(outputs[role]),
  });
  assert.match(await readFile(targetMdxPath, "utf8"), /# 見出し/);
  for (const name of ["generation-report", "fidelity-review", "japanese-editorial-review", "contract-review"]) {
    assert.equal(JSON.parse(await readFile(path.join(reportsDir, `${name}.json`), "utf8")).sourceId, value.sourceId);
  }
  await assert.rejects(() => runPiInvocations({
    piBin: "pi", provider: "provider", model: "model", targetRepo,
    candidatePath, reportsDir,
    runProcess: async ({ role }) => role === "writer" ? "not-json" : JSON.stringify(outputs[role]),
  }), /strict JSON/);
});
