import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), "utf8");

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
  assert.match(service, /Type=oneshot/);
  assert.match(service, /User=corp-web-sync/);
  assert.match(service, /flock/);
  assert.match(service, /TimeoutStartSec=2h/);
  assert.match(service, /OnFailure=/);
  assert.match(service, /ProtectSystem=strict/);
  assert.match(timer, /OnCalendar=/);
  assert.match(timer, /Persistent=true/);
  assert.match(runner, /pi/);
  assert.match(runner, /production-run\.mjs/);
  assert.match(lockRunner, /flock -n/);
  assert.match(lockRunner, /skipped_locked/);
  assert.match(failureUnit, /report-failure\.sh/);
  assert.doesNotMatch(runner, /git push|gh pr create/);
});
