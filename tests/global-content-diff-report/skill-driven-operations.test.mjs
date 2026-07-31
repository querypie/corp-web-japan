import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const ignoreWorkflowPath = path.join(root, ".github/workflows/ignore-global-content-diff.yml");
const reportWorkflowPath = path.join(root, ".github/workflows/global-content-diff-report.yml");
const ciWorkflowPath = path.join(root, ".github/workflows/ci.yml");
const envExamplePath = path.join(root, ".env.example");
const initEnvPath = path.join(root, "scripts/init-global-content-env");
const skillIndexPath = path.join(root, ".agents/skills/README.md");
const operationsSkillPath = path.join(root, ".agents/skills/global-content-operations/SKILL.md");
const publicationSkillPath = path.join(root, ".agents/skills/global-to-japan-publication/SKILL.md");
const ignoreSkillPath = path.join(root, ".agents/skills/global-content-ignore/SKILL.md");

test("replaces Direct Ignore automation with repo-local Global content operation skills", async () => {
  await assert.rejects(access(ignoreWorkflowPath));
  await assert.rejects(access(reportWorkflowPath));

  const ci = await readFile(ciWorkflowPath, "utf8");
  assert.doesNotMatch(ci, /validate-ignore-pr|Validate Ignore manifest additions|ignore_manifest/);

  const [index, operations, publication, ignore, envExample, initEnv] = await Promise.all([
    readFile(skillIndexPath, "utf8"),
    readFile(operationsSkillPath, "utf8"),
    readFile(publicationSkillPath, "utf8"),
    readFile(ignoreSkillPath, "utf8"),
    readFile(envExamplePath, "utf8"),
    readFile(initEnvPath, "utf8"),
  ]);

  assert.match(index, /global-content-operations/);
  assert.match(index, /global-to-japan-publication/);
  assert.match(index, /global-content-ignore/);
  assert.match(operations, /^---\nname: global-content-operations\ndescription: Use when/m);
  assert.match(operations, /local-only/);
  assert.match(operations, /latest `main` snapshots/);
  assert.match(operations, /Baseline review gate/);
  assert.match(operations, /title, summary, full body, date, slug, source, and media/);
  assert.match(operations, /Equivalent|Different|Ambiguous/);
  assert.match(operations, /tracking manifests[\s\S]*before generating the final report/);
  assert.match(operations, /report\.operationsSummary/);
  assert.match(operations, /Global Content Review[\s\S]*default-collapsed content-card[\s\S]*explicit site links/);
  assert.match(operations, /Remaining Untracked review gate/);
  assert.match(operations, /user must explicitly approve every Ignore identity/);
  assert.match(operations, /AI MUST NOT infer or auto-approve Ignore/);
  assert.match(operations, /\.env\.local/);
  assert.match(operations, /npm run global-content:init/);
  assert.doesNotMatch(operations, /Read secrets only at send time with `op read`/);
  assert.match(envExample, /GLOBAL_CONTENT_DIFF_TEST_SLACK_WEBHOOK_URL=/);
  assert.match(envExample, /GLOBAL_CONTENT_DIFF_PROD_SLACK_WEBHOOK_URL=/);
  assert.match(initEnv, /op:\/\/Shared\/corp-web-japan-global-content-webhooks\/test/);
  assert.match(initEnv, /op:\/\/Shared\/corp-web-japan-global-content-webhooks\/prod/);
  assert.match(initEnv, /\.env\.local/);
  assert.match(operations, /explicit send approval/);
  assert.match(operations, /MUST NOT auto-merge/);
  assert.match(publication, /^---\nname: global-to-japan-publication\ndescription: Use when/m);
  assert.match(publication, /Composite identity/);
  assert.match(publication, /baseline\.json/);
  assert.match(publication, /AI semantic review/);
  assert.match(publication, /title, summary, and full body/);
  assert.match(publication, /single unambiguous equivalent/);
  assert.match(publication, /without asking the user to repeat confirmation/);
  assert.match(publication, /normal human-reviewed PR/);
  assert.match(publication, /MUST NOT auto-merge/);
  assert.match(ignore, /^---\nname: global-content-ignore\ndescription: Use when/m);
  assert.match(ignore, /fresh read-only diff/);
  assert.match(ignore, /exclude/);
  assert.match(ignore, /possibleJapanMatches|Possible Japan match/);
  assert.match(ignore, /mappingDrift/);
  assert.match(ignore, /MUST NOT auto-merge/);
});
