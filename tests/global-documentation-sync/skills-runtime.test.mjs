import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { SOURCE_FAMILIES } from "../../scripts/global-documentation-sync/source-family-map.mjs";

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), "utf8");

function assertExactDescriptorMatrix(document, label) {
  assert.match(document, /## Supported source families|### Requirement: Exact supported source-family map/);
  assert.match(document, /\| Source section \| Source category \| Production list URL \| Target family \| Target route \|/);
  for (const descriptor of SOURCE_FAMILIES) {
    const row = `| ${descriptor.sourceSection} | ${descriptor.sourceCategory} | \`${descriptor.productionListUrl}\` | \`${descriptor.targetFamily}\` | \`${descriptor.targetRouteRoot}\` |`;
    assert.match(document, new RegExp(row.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${label} missing descriptor row: ${row}`);
  }
}

test("Japanese editorial skill defines an independent evidence-backed review", async () => {
  const skill = await read(".agents/skills/japanese-publication-editorial-review/SKILL.md");
  const rubric = await read(".agents/skills/japanese-publication-editorial-review/references/review-rubric.md");
  assert.match(skill, /^---\nname: japanese-publication-editorial-review\n/m);
  assert.match(skill, /Use when/);
  assert.match(skill, /writer cannot|writer must not|cannot self-approve/i);
  assert.match(skill, /japanese-editorial-review\.json/);
  for (const check of ["です・ます", "である", "translation calque", "repetition", "notation"]) assert.match(`${skill}\n${rubric}`, new RegExp(check, "i"));
  for (const source of ["jtf.jp", "w3.org/TR/jlreq", "learn.microsoft.com", "developers.google.com/style/translation", "bunka.go.jp"]) assert.match(rubric, new RegExp(source.replaceAll(".", "\\.")));
});

test("orchestration skill treats source as data and requires three fresh reviews", async () => {
  const skill = await read(".agents/skills/global-documentation-sync/SKILL.md");
  assert.match(skill, /untrusted data/i);
  assert.match(skill, /mdx-publication-operations/);
  assert.match(skill, /narrowest.*family/i);
  for (const artifact of ["fidelity-review.json", "japanese-editorial-review.json", "contract-review.json"]) assert.match(skill, new RegExp(artifact.replace(".", "\\.")));
  assert.match(skill, /fresh.*Pi|separate.*Pi/i);
  assert.match(skill, /must not.*Git|no Git/i);
});

test("server runtime is a locked oneshot Pi job", async () => {
  const service = await read("ops/global-documentation-sync/global-documentation-sync.service");
  const timer = await read("ops/global-documentation-sync/global-documentation-sync.timer");
  const runner = await read("ops/global-documentation-sync/run-global-documentation-sync.sh");
  const lockRunner = await read("ops/global-documentation-sync/run-with-flock.sh");
  const failureUnit = await read("ops/global-documentation-sync/global-documentation-sync-failure@.service");
  const reportRetention = await read("ops/global-documentation-sync/global-documentation-sync-reports.conf");
  assert.match(service, /Description=QueryPie Global publication sync/);
  assert.match(service, /Type=oneshot/);
  assert.match(service, /User=corp-web-sync/);
  assert.match(service, /flock/);
  assert.match(service, /TimeoutStartSec=1h/);
  assert.match(service, /OnFailure=/);
  assert.match(service, /ProtectSystem=strict/);
  assert.match(timer, /Description=Run QueryPie Global publication sync daily/);
  assert.match(timer, /OnCalendar=/);
  assert.match(timer, /Persistent=true/);
  assert.match(runner, /pi/);
  assert.match(runner, /production-run\.mjs/);
  assert.match(lockRunner, /flock -n/);
  assert.match(lockRunner, /skipped_locked/);
  assert.match(failureUnit, /Description=Report QueryPie Global publication sync failure for %i/);
  assert.match(failureUnit, /report-failure\.sh/);
  assert.match(reportRetention, /^d \/var\/lib\/global-documentation-sync\/reports 0700 corp-web-sync corp-web-sync mM:7d -$/m);
  assert.doesNotMatch(runner, /git push|gh pr create/);
});

test("documentation contract mirrors the exact source-family map and News rules", async () => {
  const scriptReadme = await read("scripts/global-documentation-sync/README.md");
  const opsReadme = await read("ops/global-documentation-sync/README.md");
  const spec = await read("openspec/specs/contract-global-documentation-sync/spec.md");
  const skill = await read(".agents/skills/global-documentation-sync/SKILL.md");
  const artifacts = await read(".agents/skills/global-documentation-sync/references/artifacts.md");

  assertExactDescriptorMatrix(scriptReadme, "script README");
  assert.match(scriptReadme, /# Global publication sync/);
  assert.match(scriptReadme, /Ignore Global publication sync PR/);
  assert.match(scriptReadme, /News is a separate `\/en\/news` source section, not a Documentation category\./);
  assert.match(scriptReadme, /News content records require exact canonical URL evidence in both the production sitemap and the `\/en\/news` list, while News outlink records require exact `\/en\/news` list evidence only\./);
  assert.match(scriptReadme, /News sync is one-way: Global → Japan only; no Japan content writes back to Global\./);

  assertExactDescriptorMatrix(spec, "OpenSpec");
  assert.match(spec, /separate `\/en\/news` source section, not a Documentation category/i);
  assert.match(spec, /outlink.*list evidence only.*sitemap.*false/i);
  assert.match(spec, /News publications SHALL NOT contain author frontmatter/i);
  assert.match(spec, /resolvedSourceLabel.*`公式発表`.*`メディア掲載`/i);
  assert.match(spec, /resolvedRedirectUrl.*outlink/i);

  assertExactDescriptorMatrix(skill, "orchestration skill");
  assert.match(skill, /News is a separate `\/en\/news` source section, not a Documentation category\./);
  assert.match(skill, /News content records require exact canonical URL evidence in both the production sitemap and the `\/en\/news` list, while News outlink records require exact `\/en\/news` list evidence only\./);
  assert.match(skill, /News contract: frontmatter must not contain author/i);
  assert.match(skill, /sourceLabel must equal candidate\.resolvedSourceLabel exactly/i);
  assert.match(skill, /redirectUrl must equal candidate\.resolvedRedirectUrl exactly/i);

  assert.match(artifacts, /Check family frontmatter, author resolution, related IDs, canonical route, asset root, local links, effective PNG Open Graph image, gating, download behavior, required family tests, and News sourceLabel\/redirect behavior\./);
  assert.match(opsReadme, /# Global publication sync 운영 가이드/);
  assert.match(opsReadme, /Ignore Global publication sync PR/);
  assert.match(opsReadme, /Adding News support does not change the production timer, failure alerts, or seven-day report retention\./);
});
