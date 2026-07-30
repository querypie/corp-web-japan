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
const rootReadmePath = path.resolve("README.md");
const operatorGuidePath = path.resolve(".github/content-sync/README.md");
const packageReadmePath = path.resolve("scripts/global-content-diff-report/README.md");
const historicalPlanPath = path.resolve("docs/superpowers/plans/2026-07-28-global-content-diff-slack-report.md");
const historicalDesignPath = path.resolve("docs/superpowers/specs/2026-07-28-global-content-diff-slack-report-design.md");
const candidateGuardDesignPath = path.resolve("docs/superpowers/specs/2026-07-30-existing-japan-content-candidate-guard-design.md");
const supportedTargetFamilies = [...new Set(SOURCE_FAMILIES.map(({ targetFamily }) => targetFamily))];

async function withTempRepos(run) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "global-content-diff-cli-"));
  const globalRepo = path.join(tempRoot, "global");
  const targetRepo = path.join(tempRoot, "target");
  await Promise.all(SOURCE_FAMILIES.map(({ relativeRoot }) => mkdir(path.join(globalRepo, relativeRoot), { recursive: true })));
  await Promise.all(supportedTargetFamilies.map((family) => mkdir(path.join(targetRepo, "src/content", family), { recursive: true })));
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

test("workflow is independent, read-only, scheduled for weekdays at 10 JST, and manually runnable", async () => {
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
  assert.match(source, /permissions:[\s\S]*contents: write[\s\S]*pull-requests: write[\s\S]*actions: write/);
  assert.deepEqual([...inputBlock.matchAll(/^      ([a-z_]+):$/gm)].map((match) => match[1]), ["source_identity"]);
  assert.match(source, /runs-on: ubuntu-latest/);
  assert.match(source, /timeout-minutes: (?:[3-9]|1\d)/);
  assert.match(source, /name: Checkout Japan repository[\s\S]*?with:[\s\S]*?ref: main[\s\S]*?path: japan/);
  assert.match(source, /name: Find existing ignore pull request/);
  assert.match(source, /gh api --paginate --slurp/);
  assert.match(source, /repos\/\$GITHUB_REPOSITORY\/pulls\?state=open&per_page=100/);
  assert.doesNotMatch(source, /gh pr list[^\n]*--limit/);
  assert.match(source, /import \{ classifyReusableDirectIgnorePullRequests, findReusableDirectIgnorePullRequests \} from "\.\/scripts\/global-content-diff-report\/direct-ignore-pr\.mjs";/);
  assert.match(source, /findReusableDirectIgnorePullRequests\(\{[\s\S]*?pages,[\s\S]*?repository: process\.env\.GITHUB_REPOSITORY,[\s\S]*?sourceIdentity: process\.env\.SOURCE_IDENTITY/);
  assert.match(source, /classifyReusableDirectIgnorePullRequests\(matches\)/);
  assert.match(source, /match_count=\$\{classification\.count\}/);
  assert.doesNotMatch(source, /const trustedMarker|const expectedBranch|const normalizeRepository|headRepository:|pr\.headRefName ===|String\(pr\.body/);
  assert.match(source, /Expected at most one open ignore PR/);
  assert.match(source, /Existing ignore PR already open/);
  assert.match(source, /name: Checkout Global repository[\s\S]*?repository: querypie\/corp-web-v2[\s\S]*?ref: main[\s\S]*?path: global[\s\S]*?persist-credentials: false/);
  const findExisting = workflowStepIndex(source, "Find existing ignore pull request");
  const globalCheckout = workflowStepIndex(source, "Checkout Global repository");
  const dryRun = workflowStepIndex(source, "Build live dry-run report");
  const validateLive = workflowStepIndex(source, "Validate live Ignore eligibility");
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
  for (const stepName of ["Checkout Global repository", "Build live dry-run report", "Validate live Ignore eligibility", "Validate existing pull request count"]) {
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
  assert.match(source, /GH_TOKEN: \$\{\{ github\.token \}\}/);
  assert.match(source, /global-content-diff-report\/cli\.mjs[\s\S]*--dry-run/);
  assert.match(source, /assessIgnoreEligibility/);
  assert.match(source, /formatIgnoreEligibilityResult/);
  assert.doesNotMatch(source, /matchingItems\.length !== 1|item\.status !== "Untracked"/);
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
  assert.match(createBlock, /GITHUB_RUN_ID: \$\{\{ github\.run_id \}\}/);
  assert.match(createBlock, /GITHUB_RUN_ATTEMPT: \$\{\{ github\.run_attempt \}\}/);
  assert.match(createBlock, /import \{ buildDirectIgnoreBranch \} from "\.\/scripts\/global-content-diff-report\/direct-ignore-pr\.mjs";/);
  assert.match(createBlock, /buildDirectIgnoreBranch\(\{[\s\S]*?sourceIdentity:[\s\S]*?runId: process\.env\.GITHUB_RUN_ID,[\s\S]*?runAttempt: process\.env\.GITHUB_RUN_ATTEMPT/);
  assert.doesNotMatch(createBlock, /branch="global-content-diff-ignore\/\$\{source_identity\/:\/-\}"/);
  assert.doesNotMatch(source, /content-sync-ignore\//);
  assert.match(source, /validate-ignore-pr\.mjs/);
  const eligibilityIndex = source.indexOf("assessIgnoreEligibility");
  const appendIndex = source.indexOf("values.push");
  const validationIndex = source.lastIndexOf("validate-ignore-pr.mjs");
  const pushIndex = source.indexOf("git push");
  assert.ok(eligibilityIndex !== -1 && eligibilityIndex < appendIndex, "eligibility must run before mutation");
  assert.ok(validationIndex > appendIndex && validationIndex < pushIndex, "changed manifest must be validated before push");
  assert.match(createBlock, /gh workflow run ci\.yml --ref "\$branch"/);
  assert.match(source, /gh pr create/);
  assert.match(source, /global-content-diff-ignore:v1/);
  assert.match(source, /scripts\/global-content-diff-report\/ignore-workflow\.mjs/);
  assert.doesNotMatch(source, /gh pr merge|--auto|auto-merge|pull_request_target|n8n/);
});

test("manual ignore workflow rejects bare cnt source IDs before report selection", async () => {
  const source = await readFile(ignoreWorkflowPath, "utf8");

  assert.match(source, /SOURCE_IDENTITY:/);
  assert.match(source, /assessIgnoreEligibility/);
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

test("operator docs distinguish publish authoring from Direct Ignore exclusion", async () => {
  const rootReadme = await readFile(rootReadmePath, "utf8");
  const operatorGuide = await readFile(operatorGuidePath, "utf8");
  const packageReadme = await readFile(packageReadmePath, "utf8");

  assert.match(rootReadme, /\.github\/workflows\/global-content-diff-report\.yml/);
  assert.match(rootReadme, /\.github\/workflows\/ignore-global-content-diff\.yml/);
  assert.match(rootReadme, /\.github\/content-sync\/README\.md/);
  assert.match(rootReadme, /scripts\/global-content-diff-report\/README\.md/);
  assert.match(rootReadme, /openspec\/specs\/contract-global-content-diff-report\/spec\.md/);

  for (const source of [rootReadme, operatorGuide, packageReadme]) {
    assert.match(source, /report-only|inventory signal only|does not translate/);
    assert.match(source, /Possible Japan match/);
    assert.match(source, /diagnostic (?:evidence )?only|diagnostic only|diagnostic evidence/);
    assert.match(source, /baseline authority|baseline remains authoritative/);
    assert.match(source, /status(?:,| and) (?:or )?(?:counts|and counts)|counts or status/);
    assert.match(source, /zero-candidate|zero candidates|zero-candidate result/);
    assert.match(source, /not proof|not .*proof.*absent/);
    assert.match(source, /mdx-publication-operations\/SKILL\.md/);
    assert.match(source, /baseline\.json/);
    assert.match(source, /normal human-reviewed content PR|normal content PR|content\/baseline PR|baseline\/content PR|same content PR/);
    assert.match(source, /Direct Ignore only|intentional exclusions?|owner-approved/);
    assert.match(source, /do not use `ignore\.json` for publishable items|Do not use `ignore\.json` for publishable items|Do not add publishable items to `ignore\.json`/);
  }

  for (const source of [operatorGuide, packageReadme]) {
    assert.match(source, /mappingDrift|mapping drift/);
    assert.match(source, /assessIgnoreEligibility|shared eligibility/);
    assert.match(source, /no force|no .*bypass|There is no force/);
    assert.match(source, /Hand-edited|hand-edited/);
    assert.match(source, /ci\.yml/);
    assert.match(source, /GITHUB_TOKEN/);
    assert.match(source, /stale-branch|stale branch|up to date/);
    assert.match(source, /ruleset|Repository rules/);
  }

  assert.match(operatorGuide, /Composite identity/);
  assert.match(operatorGuide, /source_identity/);
  assert.match(operatorGuide, /actions\/workflows\/ignore-global-content-diff\.yml/);
  assert.match(operatorGuide, /does not auto-merge/);
  assert.match(operatorGuide, /next report moves the item from `Untracked` to `Ignored`/);
  assert.match(operatorGuide, /sync Draft PR is historical context|historical context from earlier planning/);
});

test("OpenSpec forbids report tooling and Direct Ignore from handling publication content", async () => {
  const source = await readFile(contractPath, "utf8");
  assert.match(source, /SHALL NOT translate Global content/);
  assert.match(source, /author Japan MDX/);
  assert.match(source, /generate or stage assets/);
  assert.match(source, /open Draft PRs/);
  assert.match(source, /separate human\/AI-assisted authoring process/);
  assert.match(source, /normal human-reviewed content PR/);
  assert.match(source, /baseline\.json/);
  assert.match(source, /Requirement: Diagnostic-only Possible Japan matches/);
  assert.match(source, /SHALL NOT change baseline authority/);
  assert.match(source, /status SHALL remain either `Untracked` or `Ignored`/);
  assert.match(source, /counts SHALL remain identical/);
  assert.match(source, /zero-candidate result SHALL mean only that no deterministic candidate was found/);
  assert.match(source, /identity-bearing query parameters/);
  assert.match(source, /Possible Japan match/);
  assert.match(source, /Direct Ignore SHALL be used only for an owner-approved intentional exclusion/);
  assert.match(source, /selected or potentially intended for publication SHALL NOT be added to `\.github\/content-sync\/ignore\.json`/);
  assert.match(source, /assessIgnoreEligibility/);
  assert.match(source, /mapping drift or any `possibleJapanMatches`/);
  assert.match(source, /No force, candidate-skip, batch, or manual bypass input SHALL exist/);
  assert.match(source, /Scenario: Candidate identity is denied before mutation/);
  assert.match(source, /Scenario: Mapping drift identity is denied before mutation/);
  assert.match(source, /Scenario: Hand-edited Ignore PR cannot bypass eligibility/);
  assert.match(source, /Scenario: Bot-created Ignore PR receives CI/);
  assert.match(source, /dispatch `ci\.yml`/);
  assert.match(source, /Scenario: Publishable Untracked identity is not ignored/);
  assert.match(source, /SHALL NOT be dispatched through Direct Ignore/);
  assert.match(source, /AI\/Codex normal content PR plus baseline mapping path/);
});

test("historical superpowers docs point to canonical operator guidance and avoid smoke-test Direct Ignore guidance", async () => {
  for (const filePath of [historicalPlanPath, historicalDesignPath]) {
    const source = await readFile(filePath, "utf8");
    assert.match(source, /Historical \/ non-canonical note|Historical \/ non-canonical after implementation/);
    assert.match(source, /openspec\/specs\/contract-global-content-diff-report\/spec\.md/);
    assert.match(source, /\.github\/content-sync\/README\.md/);
    assert.match(source, /scripts\/global-content-diff-report\/README\.md/);
    assert.match(source, /Direct Ignore is only for owner-approved intentional exclusion|current implementation contract|canonical durable contract/);
    assert.doesNotMatch(source, /Direct Ignore(?: workflow)? as a smoke test|run both workflows with a known current identity/);
  }

  const candidateGuardDesign = await readFile(candidateGuardDesignPath, "utf8");
  assert.match(candidateGuardDesign, /Historical \/ non-canonical after implementation/);
  assert.match(candidateGuardDesign, /openspec\/specs\/contract-global-content-diff-report\/spec\.md/);
  assert.match(candidateGuardDesign, /\.github\/content-sync\/README\.md/);
  assert.match(candidateGuardDesign, /scripts\/global-content-diff-report\/README\.md/);
  assert.match(candidateGuardDesign, /Do not treat it as the current implementation contract/);
});

test("CI validates newly added Ignore rows and contributes to exact CI result", async () => {
  const source = await readFile(ciWorkflowPath, "utf8");
  assert.match(source, /ignore_manifest:/);
  assert.match(source, /\.github\/content-sync\/ignore\.json/);
  assert.match(source, /name: Validate Ignore manifest additions/);
  assert.match(source, /repository: querypie\/corp-web-v2/);
  assert.match(source, /git show [^\n]*\.github\/content-sync\/ignore\.json/);
  assert.match(source, /validate-ignore-pr\.mjs/);
  assert.match(source, /needs:[\s\S]*validate-ignore-pr[\s\S]*if: \$\{\{ always\(\) \}\}/);
  assert.match(source, /VALIDATE_IGNORE_PR_RESULT: \$\{\{ needs\.validate-ignore-pr\.result \}\}/);
  assert.match(source, /check_result 'Validate Ignore manifest additions'/);
  assert.match(source, /permissions:\n  contents: read\n  pull-requests: read/);
});

test("CI cross_cutting scope includes independent workflow and CLI paths", async () => {
  const source = await readFile(ciWorkflowPath, "utf8");
  assert.match(source, /cross_cutting:[\s\S]*- '\.github\/content-sync\/\*\*'/);
  assert.match(source, /cross_cutting:[\s\S]*- '\.github\/workflows\/global-content-diff-report\.yml'/);
  assert.match(source, /cross_cutting:[\s\S]*- '\.github\/workflows\/ignore-global-content-diff\.yml'/);
  assert.match(source, /cross_cutting:[\s\S]*- 'scripts\/global-content-diff-report\/\*\*'/);
  assert.match(source, /cross_cutting:[\s\S]*- 'tests\/global-content-diff-report\/\*\*'/);
});
