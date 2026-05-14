import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { readSource } from "./helpers/source-readers.mjs";

const repoRoot = new URL("..", import.meta.url);
const crewDir = path.join(repoRoot.pathname, "public", "crew");
const roleDir = path.join(crewDir, "role");
const movedRoleFiles = [
  "anna.png",
  "liam.png",
  "ken_2.png",
  "victor.png",
  "emma_2.png",
  "oliver.png",
  "sophia.png",
  "daniel.png",
  "grace_2.png",
  "hanna.png",
  "teo.png",
  "jay.png",
  "zoe.png",
  "clara_2.png",
  "noah_2.png",
  "mio_2.png",
  "ian.png",
  "ruby.png",
  "ai-crew-gray.png",
  "ai-crew-white.png",
  "ai-crew-guide.png",
  "chloe.png",
  "clara.png",
  "emma.png",
  "flora.png",
  "grace-v2.png",
  "grace.png",
  "ken.png",
  "leo.png",
  "luna.png",
  "mio.png",
];

test("ai crew avatar uses /crew/role asset paths after the move", () => {
  const source = readSource("src/app/internal/demo-sections/ai-crew-avatar.tsx");

  assert.match(source, /"\/crew\/role\/ai-crew-gray\.png"/);
  assert.match(source, /"\/crew\/role\/ai-crew-white\.png"/);
  assert.doesNotMatch(source, /"\/crew\/ai-crew-gray\.png"/);
  assert.doesNotMatch(source, /"\/crew\/ai-crew-white\.png"/);
});

test("direct public/crew role images are moved under public/crew/role", () => {
  for (const filename of movedRoleFiles) {
    assert.equal(existsSync(path.join(roleDir, filename)), true, `Expected moved file public/crew/role/${filename}`);
    assert.equal(
      existsSync(path.join(crewDir, filename)),
      false,
      `Expected no remaining direct public/crew/${filename}`,
    );
  }
});

test("noah assets are preserved in both intended locations", () => {
  assert.equal(existsSync(path.join(crewDir, "noah.png")), true, "Expected flattened author asset public/crew/noah.png");
  assert.equal(existsSync(path.join(roleDir, "noah.png")), true, "Expected restored role asset public/crew/role/noah.png");
});
