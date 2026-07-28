import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { runCli } from "../../scripts/global-content-diff-report/cli.mjs";
import { SOURCE_FAMILIES } from "../../scripts/global-documentation-sync/source-family-map.mjs";

const workflowPath = path.resolve(".github/workflows/global-content-diff-report.yml");
const ciWorkflowPath = path.resolve(".github/workflows/ci.yml");
const contractPath = path.resolve("openspec/specs/contract-global-content-diff-report/spec.md");

async function withTempRepos(run) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "global-content-diff-cli-"));
  const globalRepo = path.join(tempRoot, "global");
  const targetRepo = path.join(tempRoot, "target");
  await mkdir(globalRepo, { recursive: true });
  await mkdir(targetRepo, { recursive: true });
  try {
    return await run({ globalRepo, targetRepo });
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

function descriptorFor(category) {
  const descriptor = SOURCE_FAMILIES.find((value) => value.sourceCategory === category);
  if (!descriptor) throw new Error(`missing descriptor: ${category}`);
  return descriptor;
}

async function writeGlobalSource(globalRepo, {
  sourceId,
  category,
  slug,
  dateIso = "2026-01-01",
  title = { en: slug },
}) {
  const descriptor = descriptorFor(category);
  const directory = path.join(globalRepo, descriptor.relativeRoot, sourceId);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "meta.json"), `${JSON.stringify({
    storageId: sourceId,
    id: slug,
    section: descriptor.sourceSection === "news" ? "news" : undefined,
    categorySlug: category,
    status: "published",
    contentType: "content",
    dateIso,
    title,
  }, null, 2)}\n`);
  await writeFile(path.join(directory, "ja.html"), `<p>${slug}</p>`);
}

async function writeManifest(targetRepo, name, records) {
  const directory = path.join(targetRepo, ".github/content-sync");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, `${name}.json`), `${JSON.stringify(records, null, 2)}\n`);
}

function buildSitemapXml() {
  return [
    "https://www.querypie.com/en/blog/global-blog",
    "https://www.querypie.com/en/news/global-news",
  ].map((url) => `<url><loc>${url}</loc></url>`).join("");
}

function buildProductionListHtmlByUrl() {
  return {
    "https://www.querypie.com/en/documentation": '<a href="https://www.querypie.com/en/blog/global-blog">global-blog</a>',
    "https://www.querypie.com/en/news": '<a href="https://www.querypie.com/en/news/global-news">global-news</a>',
  };
}

test("workflow is independent, read-only, scheduled for weekdays at 10 KST, and manually runnable", async () => {
  const source = await readFile(workflowPath, "utf8");
  assert.match(source, /cron: ["']0 1 \* \* 1-5["']/);
  assert.match(source, /workflow_dispatch:/);
  assert.match(source, /runs-on: ubuntu-latest/);
  assert.match(source, /contents: read/);
  assert.match(source, /pull-requests: read/);
  assert.match(source, /name: Checkout Japan repository[\s\S]*?with:[\s\S]*?ref: main/);
  assert.match(source, /name: Checkout Global repository[\s\S]*?repository: querypie\/corp-web-v2[\s\S]*?ref: main/);
  assert.match(source, /GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL/);
  assert.match(source, /if: failure\(\)/);
  assert.match(source, /Global content diff report failed/);
  assert.doesNotMatch(source, /CONTENT_SYNC_SLACK_WEBHOOK_URL|ALERT_WEBHOOK_URL/);
  assert.doesNotMatch(source, /pull_request_target|git push|gh pr create|n8n|<@/);
});

test("CLI dry-run emits complete JSON without requiring or calling Slack", async () => {
  await withTempRepos(async ({ globalRepo, targetRepo }) => {
    await writeGlobalSource(globalRepo, { sourceId: "cnt_000001", category: "blogs", slug: "global-blog" });
    await writeGlobalSource(globalRepo, { sourceId: "cnt_000002", category: "news", slug: "global-news" });
    await writeManifest(targetRepo, "baseline", []);
    await writeManifest(targetRepo, "ignore", []);

    let stdout = "";
    const result = await runCli([
      "--global-repo", globalRepo,
      "--target-repo", targetRepo,
      "--dry-run",
    ], {
      fetchText: async (url) => {
        if (url === "https://www.querypie.com/sitemap.xml") return buildSitemapXml();
        return buildProductionListHtmlByUrl()[url] || "";
      },
      loadPullRequests: async () => [],
      execute: (command, args, cwd) => {
        assert.equal(command, "git");
        assert.deepEqual(args, ["rev-parse", "HEAD"]);
        assert.ok([globalRepo, targetRepo].includes(cwd));
        return cwd === globalRepo ? "globalsha\n" : "targetsha\n";
      },
      sendSlack: async () => {
        throw new Error("dry-run must not call Slack");
      },
      stdout: {
        write(chunk) {
          stdout += chunk;
        },
      },
    });

    const output = JSON.parse(stdout);
    assert.equal(output.report.counts.globalOnly, output.report.items.length);
    assert.ok(output.payloads.length >= 1);
    assert.equal(result.report.counts.globalOnly, result.report.items.length);
    assert.ok(result.payloads.length >= 1);
    assert.equal(result.mode, "dry-run");
    assert.equal(result.metadata.globalSha, "globalsha");
    assert.equal(result.metadata.japanSha, "targetsha");
  });
});

test("CLI rejects empty or unrelated HTTP 200 production evidence", async () => {
  for (const evidence of ["", "<html><title>Just a moment...</title><p>challenge</p></html>"]) {
    await withTempRepos(async ({ globalRepo, targetRepo }) => {
      await writeGlobalSource(globalRepo, { sourceId: "cnt_000001", category: "blogs", slug: "global-blog" });
      await writeGlobalSource(globalRepo, { sourceId: "cnt_000002", category: "news", slug: "global-news" });
      await writeManifest(targetRepo, "baseline", []);
      await writeManifest(targetRepo, "ignore", []);

      await assert.rejects(
        () => runCli([
          "--global-repo", globalRepo,
          "--target-repo", targetRepo,
          "--dry-run",
        ], {
          fetchText: async () => evidence,
          loadPullRequests: async () => [],
          execute: () => "sha\n",
          stdout: { write() {} },
        }),
        /production (sitemap|list) evidence does not contain a recognized Global source URL/,
      );
    });
  }
});

test("delivery contract acknowledges visible partial multipart delivery", async () => {
  const source = await readFile(contractPath, "utf8");
  assert.match(source, /already delivered parts remain visible/);
  assert.match(source, /compact failure notification/);
  assert.doesNotMatch(source, /send only a compact failure notification/);
  assert.doesNotMatch(source, /roll(?:ed)? back/);
});

test("CI cross_cutting scope includes independent workflow and CLI paths", async () => {
  const source = await readFile(ciWorkflowPath, "utf8");
  assert.match(source, /cross_cutting:[\s\S]*- '\.github\/workflows\/global-content-diff-report\.yml'/);
  assert.match(source, /cross_cutting:[\s\S]*- 'scripts\/global-content-diff-report\/\*\*'/);
});
