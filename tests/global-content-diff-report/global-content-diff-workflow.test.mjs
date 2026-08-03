import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { runCli } from "../../scripts/global-content-diff-report/cli.mjs";
import { SOURCE_FAMILIES } from "../../scripts/global-content-diff-report/source-family-map.mjs";

const cliPath = path.resolve("scripts/global-content-diff-report/cli.mjs");
const ciWorkflowPath = path.resolve(".github/workflows/ci.yml");
const contractPath = path.resolve("openspec/specs/contract-global-content-diff-report/spec.md");
const supportedTargetFamilies = [...new Set(SOURCE_FAMILIES.map(({ targetFamily }) => targetFamily))];

async function withTempRepos(run) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "global-content-diff-cli-"));
  const globalRepo = path.join(tempRoot, "global");
  const targetRepo = path.join(tempRoot, "target");
  await Promise.all(SOURCE_FAMILIES.map(({ relativeRoot }) => mkdir(path.join(globalRepo, relativeRoot), { recursive: true })));
  await Promise.all(supportedTargetFamilies.map((family) => mkdir(path.join(targetRepo, "src/content", family), { recursive: true })));
  await mkdir(path.join(globalRepo, "src/features/content"), { recursive: true });
  await mkdir(path.join(targetRepo, "src/components/layout"), { recursive: true });
  await writeFile(
    path.join(globalRepo, "src/features/content/publicPathConfig.ts"),
    SOURCE_FAMILIES.map(({ sourceCategory, globalMenuPath }) => `${JSON.stringify(sourceCategory)}: ${JSON.stringify(globalMenuPath)},`).join("\n"),
  );
  await writeFile(
    path.join(targetRepo, "src/components/layout/site-header-client.tsx"),
    SOURCE_FAMILIES.map(({ japanMenuPath }) => `{ href: ${JSON.stringify(japanMenuPath)} },`).join("\n"),
  );
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
    "https://www.querypie.com/en/demo/use-cases/global-use-case",
    "https://www.querypie.com/en/blog/global-blog",
    "https://www.querypie.com/en/news/global-news",
  ].map((url) => `<url><loc>${url}</loc></url>`).join("");
}

function buildProductionListHtmlByUrl() {
  return {
    "https://www.querypie.com/en/demo": '<a href="https://www.querypie.com/en/demo/use-cases/global-use-case">global-use-case</a>',
    "https://www.querypie.com/en/documentation": '<a href="https://www.querypie.com/en/blog/global-blog">global-blog</a>',
    "https://www.querypie.com/en/news": '<a href="https://www.querypie.com/en/news/global-news">global-news</a>',
  };
}

function workflowStepIndex(source, stepName) {
  const index = source.indexOf(`- name: ${stepName}`);
  assert.notEqual(index, -1, `missing workflow step: ${stepName}`);
  return index;
}

function workflowStepBlock(source, stepName) {
  const index = workflowStepIndex(source, stepName);
  const nextIndex = source.indexOf("\n      - name:", index + 1);
  return source.slice(index, nextIndex === -1 ? source.length : nextIndex);
}

test("CLI fails before report generation when latest menu-family parity drifts", async () => {
  await withTempRepos(async ({ globalRepo, targetRepo }) => {
    await writeFile(
      path.join(globalRepo, "src/features/content/publicPathConfig.ts"),
      '"new-family": "/demo/new-family",\n',
    );

    await assert.rejects(
      () => runCli(["--global-repo", globalRepo, "--target-repo", targetRepo, "--dry-run"], {
        fetchText: async () => { throw new Error("production fetch must not start"); },
        stdout: { write() {} },
      }),
      /unmapped Global public content menu path: \/demo\/new-family/,
    );
  });
});

test("CLI dry-run emits complete JSON without requiring or calling Slack", async () => {
  await withTempRepos(async ({ globalRepo, targetRepo }) => {
    await writeGlobalSource(globalRepo, { sourceId: "cnt_000001", category: "blogs", slug: "global-blog" });
    await writeGlobalSource(globalRepo, { sourceId: "cnt_000002", category: "news", slug: "global-news" });
    await writeGlobalSource(globalRepo, { sourceId: "cnt_000003", category: "use-cases", slug: "global-use-case" });
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
      execute: (command, args, cwd) => {
        assert.equal(command, "git");
        assert.deepEqual(args, ["rev-parse", "HEAD"]);
        assert.ok([globalRepo, targetRepo].includes(cwd));
        return cwd === globalRepo ? `${"a".repeat(40)}\n` : `${"b".repeat(40)}\n`;
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
    assert.equal(result.metadata.globalSha, "a".repeat(40));
    assert.equal(result.metadata.japanSha, "b".repeat(40));
  });
});

test("CLI rejects missing sitemap evidence independently per production source list", async () => {
  await withTempRepos(async ({ globalRepo, targetRepo }) => {
    await writeGlobalSource(globalRepo, { sourceId: "cnt_000001", category: "blogs", slug: "global-blog" });
    await writeGlobalSource(globalRepo, { sourceId: "cnt_000002", category: "news", slug: "global-news" });
    await writeGlobalSource(globalRepo, { sourceId: "cnt_000003", category: "use-cases", slug: "global-use-case" });
    await writeManifest(targetRepo, "baseline", []);
    await writeManifest(targetRepo, "ignore", []);

    await assert.rejects(
      () => runCli([
        "--global-repo", globalRepo,
        "--target-repo", targetRepo,
        "--dry-run",
      ], {
        fetchText: async (url) => {
          if (url === "https://www.querypie.com/sitemap.xml") {
            return [
              '<url><loc>https://www.querypie.com/en/demo/use-cases/global-use-case</loc></url>',
              '<url><loc>https://www.querypie.com/en/blog/global-blog</loc></url>',
            ].join("");
          }
          return buildProductionListHtmlByUrl()[url] || "";
        },
        execute: () => "sha\n",
        stdout: { write() {} },
      }),
      /production sitemap evidence does not contain a recognized Global source URL: https:\/\/www\.querypie\.com\/en\/news/,
    );
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

test("delivery contract requires local-only test-first execution and explicit production approval", async () => {
  const source = await readFile(contractPath, "utf8");
  assert.match(source, /Local-only execution and explicit delivery/);
  assert.match(source, /No scheduled or manually dispatched Global report GitHub Actions workflow SHALL exist/);
  assert.match(source, /documented 1Password item/);
  assert.match(source, /Every delivery SHALL send the exact final payload to test first/);
  assert.match(source, /Production SHALL require separate explicit user approval/);
  assert.match(source, /byte-identical payload/);
  assert.match(source, /already delivered multipart sections remain visible/);
  assert.doesNotMatch(source, /cron|workflow_dispatch|GLOBAL_CONTENT_DIFF_PROD_SLACK_WEBHOOK_URL/);
});

test("CI cross_cutting scope includes local Global diff CLI paths", async () => {
  const source = await readFile(ciWorkflowPath, "utf8");
  assert.match(source, /cross_cutting:[\s\S]*- '\.github\/content-sync\/\*\*'/);
  assert.match(source, /cross_cutting:[\s\S]*- 'scripts\/global-content-diff-report\/\*\*'/);
  assert.match(source, /cross_cutting:[\s\S]*- 'tests\/global-content-diff-report\/\*\*'/);
});
