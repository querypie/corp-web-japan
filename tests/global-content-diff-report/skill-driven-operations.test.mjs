import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const ignoreWorkflowPath = path.join(root, ".github/workflows/ignore-global-content-diff.yml");
const ciWorkflowPath = path.join(root, ".github/workflows/ci.yml");
const skillIndexPath = path.join(root, ".agents/skills/README.md");
const operationsSkillPath = path.join(root, ".agents/skills/global-content-operations/SKILL.md");
const publicationSkillPath = path.join(root, ".agents/skills/global-to-japan-publication/SKILL.md");
const ignoreSkillPath = path.join(root, ".agents/skills/global-content-ignore/SKILL.md");

test("replaces Direct Ignore automation with repo-local Global content operation skills", async () => {
  await assert.rejects(access(ignoreWorkflowPath));

  const ci = await readFile(ciWorkflowPath, "utf8");
  assert.doesNotMatch(ci, /validate-ignore-pr|Validate Ignore manifest additions|ignore_manifest/);

  const [index, operations, publication, ignore] = await Promise.all([
    readFile(skillIndexPath, "utf8"),
    readFile(operationsSkillPath, "utf8"),
    readFile(publicationSkillPath, "utf8"),
    readFile(ignoreSkillPath, "utf8"),
  ]);

  assert.match(index, /global-content-operations/);
  assert.match(index, /global-to-japan-publication/);
  assert.match(index, /global-content-ignore/);
  assert.match(operations, /^---\nname: global-content-operations\ndescription: Use when/m);
  assert.match(operations, /latest `main` snapshots/);
  assert.match(operations, /Baseline review gate/);
  assert.match(operations, /title, summary, full body, date, slug, source, and media/);
  assert.match(operations, /Equivalent|Different|Ambiguous/);
  assert.match(operations, /tracking manifests[\s\S]*before generating the final report/);
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
