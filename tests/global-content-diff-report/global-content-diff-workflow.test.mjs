import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { runCli } from "../../scripts/global-content-diff-report/cli.mjs";
import { SOURCE_FAMILIES } from "../../scripts/global-content-diff-report/source-family-map.mjs";

const workflowPath = path.resolve(".github/workflows/global-content-diff-report.yml");
const ignoreWorkflowPath = path.resolve(".github/workflows/ignore-global-content-diff.yml");
const cliPath = path.resolve("scripts/global-content-diff-report/cli.mjs");
const ciWorkflowPath = path.resolve(".github/workflows/ci.yml");
const contractPath = path.resolve("openspec/specs/contract-global-content-diff-report/spec.md");
const operatorGuidePath = path.resolve(".github/content-sync/README.md");

async function withTempRepos(run) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "global-content-diff-cli-"));
  const globalRepo = path.join(tempRoot, "global");
  const targetRepo = path.join(tempRoot, "target");
  await Promise.all(SOURCE_FAMILIES.map(({ relativeRoot }) => mkdir(path.join(globalRepo, relativeRoot), { recursive: true })));
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

test("workflow is independent, read-only, scheduled for weekdays at 10 KST, and manually runnable", async () => {
  const source = await readFile(workflowPath, "utf8");
  assert.match(source, /cron: ["']0 1 \* \* 1-5["']/);
  assert.match(source, /workflow_dispatch:/);
  assert.match(source, /runs-on: ubuntu-latest/);
  assert.match(source, /contents: read/);
  assert.doesNotMatch(source, /pull-requests: read/);
  assert.match(source, /name: Checkout Japan repository[\s\S]*?with:[\s\S]*?ref: main/);
  assert.match(source, /name: Checkout Global repository[\s\S]*?repository: querypie\/corp-web-v2[\s\S]*?ref: main[\s\S]*?persist-credentials: false/);
  assert.match(source, /GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL/);
  assert.match(source, /if: failure\(\)/);
  assert.match(source, /Global content diff report failed/);
  assert.doesNotMatch(source, /CONTENT_SYNC_SLACK_WEBHOOK_URL|ALERT_WEBHOOK_URL/);
  assert.doesNotMatch(source, /GH_TOKEN/);
  assert.doesNotMatch(source, /pull_request_target|git push|gh pr create|n8n|<@/);

  const cliSource = await readFile(cliPath, "utf8");
  assert.doesNotMatch(cliSource, /loadAllPullRequests|loadPullRequests|github-state\.mjs|githubRepo|prRecords/);
});

test("manual ignore workflow validates composite identity, derives URL from live Untracked dry-run report, and opens a human PR", async () => {
  const source = await readFile(ignoreWorkflowPath, "utf8");

  assert.match(source, /name: Ignore Global-only content/);
  assert.match(source, /workflow_dispatch:[\s\S]*inputs:[\s\S]*source_identity:[\s\S]*required: true[\s\S]*type: string/);
  const inputBlock = source.match(/workflow_dispatch:[\s\S]*?permissions:/)?.[0] || source;
  assert.doesNotMatch(inputBlock, /source_url|SOURCE_URL_INPUT|canonical_url|url/i);
  assert.match(source, /permissions:[\s\S]*contents: write[\s\S]*pull-requests: write/);
  assert.match(source, /runs-on: ubuntu-latest/);
  assert.match(source, /timeout-minutes: (?:[3-9]|1\d)/);
  assert.match(source, /name: Checkout Japan repository[\s\S]*?with:[\s\S]*?ref: main[\s\S]*?path: japan/);
  assert.match(source, /name: Find existing ignore pull request/);
  assert.match(source, /gh pr list --repo "\$GITHUB_REPOSITORY" --state open --limit 1000 --json title,body,headRefName,url,isCrossRepository/);
  assert.match(source, /const trustedMarker = `<!-- global-content-diff-ignore:v1 /);
  assert.match(source, /const branchPrefix = `content-sync-ignore\/\$\{sourceIdentity\.replace\(":", "-"\)\}`;/);
  assert.match(source, /pr\?\.isCrossRepository === false/);
  assert.match(source, /pr\.headRefName === branchPrefix \|\| pr\.headRefName\.startsWith\(`\$\{branchPrefix\}-`\)/);
  assert.match(source, /pr\.title === title \|\| String\(pr\.body \|\| ""\)\.includes\(trustedMarker\)/);
  assert.match(source, /match_count=\$\{matches\.length\}/);
  assert.match(source, /Expected at most one open ignore PR/);
  assert.match(source, /Existing ignore PR already open/);
  assert.match(source, /name: Checkout Global repository[\s\S]*?repository: querypie\/corp-web-v2[\s\S]*?ref: main[\s\S]*?path: global[\s\S]*?persist-credentials: false/);
  const findExisting = workflowStepIndex(source, "Find existing ignore pull request");
  const globalCheckout = workflowStepIndex(source, "Checkout Global repository");
  const dryRun = workflowStepIndex(source, "Build live dry-run report");
  const validateLive = workflowStepIndex(source, "Validate live Untracked item");
  const validateMultiplicity = workflowStepIndex(source, "Validate existing pull request count");
  const reuseExisting = workflowStepIndex(source, "Reuse existing ignore pull request");
  const appendDecision = workflowStepIndex(source, "Append ignore decision");
  const createPull = workflowStepIndex(source, "Create ignore pull request");
  assert.deepEqual([
    findExisting,
    globalCheckout,
    dryRun,
    validateLive,
    validateMultiplicity,
    reuseExisting,
    appendDecision,
    createPull,
  ], [
    findExisting,
    globalCheckout,
    dryRun,
    validateLive,
    validateMultiplicity,
    reuseExisting,
    appendDecision,
    createPull,
  ].toSorted((left, right) => left - right));
  for (const stepName of ["Checkout Global repository", "Build live dry-run report", "Validate live Untracked item", "Validate existing pull request count"]) {
    assert.doesNotMatch(workflowStepBlock(source, stepName), /\n\s+if:/);
  }
  const duplicateCheckBlock = workflowStepBlock(source, "Validate existing pull request count");
  const reuseBlock = workflowStepBlock(source, "Reuse existing ignore pull request");
  const appendBlock = workflowStepBlock(source, "Append ignore decision");
  const createBlock = workflowStepBlock(source, "Create ignore pull request");
  assert.match(duplicateCheckBlock, /\[ "\$matches" -gt 1 \]/);
  assert.doesNotMatch(reuseBlock, /\[ "\$matches" -gt 1 \]|Expected at most one open ignore PR/);
  assert.match(reuseBlock, /if: steps\.find_existing_ignore_pr\.outputs\.match_count == '1'/);
  assert.match(appendBlock, /if: steps\.find_existing_ignore_pr\.outputs\.match_count == '0'/);
  assert.match(createBlock, /if: steps\.find_existing_ignore_pr\.outputs\.match_count == '0'/);
  assert.match(source, /\^\(documentation\|news\):cnt_\\d\+\$/);
  assert.match(source, /GH_TOKEN: \$\{\{ github\.token \}\}/);
  assert.match(source, /global-content-diff-report\/cli\.mjs[\s\S]*--dry-run/);
  assert.match(source, /matchingItems\.length !== 1/);
  assert.match(source, /item\.status !== "Untracked"/);
  assert.match(source, /normalizeUrl\(item\.sourceUrl\)/);
  assert.match(source, /sourceEvidenceUrl: item\.sourceUrl/);
  assert.match(createBlock, /source_evidence_url=\$\(jq -r \.sourceEvidenceUrl "\$RUNNER_TEMP\/ignore-item\.json"\)/);
  assert.match(createBlock, /ignore_body=\$\(printf 'Ignore Global-only content source\.[\s\S]*?- Source: %s[\s\S]*?"\$source_evidence_url"/);
  assert.match(source, /assertIgnoreAppendAllowed/);
  assert.match(source, /reasonCode: "other"/);
  assert.match(source, /Ignored by owner from Global-only content report\./);
  assert.match(source, /addedBy: process\.env\.GITHUB_ACTOR/);
  assert.match(source, /new Date\(\)\.toISOString\(\)/);
  assert.match(source, /values\.sort\(\(left, right\) => String\(left\?\.sourceId \|\| ""\)\.localeCompare\(String\(right\?\.sourceId \|\| ""\)\) \|\| String\(left\?\.sourceSection \|\| ""\)\.localeCompare\(String\(right\?\.sourceSection \|\| ""\)\)\);/);
  assert.match(source, /branch="content-sync-ignore\/\$\{source_identity\/:\/-\}-\$\{GITHUB_RUN_ID\}-\$\{GITHUB_RUN_ATTEMPT\}"/);
  assert.match(source, /gh pr create/);
  assert.match(source, /global-content-diff-ignore:v1/);
  assert.match(source, /scripts\/global-content-diff-report\/ignore-workflow\.mjs/);
  assert.doesNotMatch(source, /global-documentation-sync-ignore:v1|scripts\/global-documentation-sync\/ignore-workflow\.mjs/);
  assert.doesNotMatch(source, /gh pr merge|--auto|auto-merge|pull_request_target|n8n/);
});

test("manual ignore workflow rejects bare cnt source IDs before report selection", async () => {
  const source = await readFile(ignoreWorkflowPath, "utf8");

  assert.match(source, /SOURCE_IDENTITY:/);
  assert.match(source, /Invalid source_identity/);
  assert.doesNotMatch(source, /\^cnt_\\d\+\$/);
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
            return '<url><loc>https://www.querypie.com/en/blog/global-blog</loc></url>';
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

test("delivery contract acknowledges visible partial multipart delivery", async () => {
  const source = await readFile(contractPath, "utf8");
  assert.match(source, /already delivered parts remain visible/);
  assert.match(source, /compact failure notification/);
  assert.doesNotMatch(source, /send only a compact failure notification/);
  assert.doesNotMatch(source, /roll(?:ed)? back/);
});

test("operator guide documents the manual Ignore PR workflow", async () => {
  const source = await readFile(operatorGuidePath, "utf8");
  assert.match(source, /Composite identity/);
  assert.match(source, /source_identity/);
  assert.match(source, /actions\/workflows\/ignore-global-content-diff\.yml/);
  assert.match(source, /does not auto-merge/);
  assert.match(source, /next report moves the item from `Untracked` to `Ignored`/);
});

test("CI cross_cutting scope includes independent workflow and CLI paths", async () => {
  const source = await readFile(ciWorkflowPath, "utf8");
  assert.match(source, /cross_cutting:[\s\S]*- '\.github\/workflows\/global-content-diff-report\.yml'/);
  assert.match(source, /cross_cutting:[\s\S]*- '\.github\/workflows\/ignore-global-content-diff\.yml'/);
  assert.match(source, /cross_cutting:[\s\S]*- 'scripts\/global-content-diff-report\/\*\*'/);
});
