import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseDocument } from "yaml";

const repoRoot = process.cwd();
const skillsRoot = path.join(repoRoot, ".agents", "skills");

const skillFiles = readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(skillsRoot, entry.name, "SKILL.md"));

const frontmatterPattern = /^---\n([\s\S]*?)\n---/;

test("repo-local skills keep parseable YAML frontmatter with required trigger metadata", () => {
  for (const skillFile of skillFiles) {
    const source = readFileSync(skillFile, "utf8");
    const frontmatterMatch = source.match(frontmatterPattern);

    assert.ok(frontmatterMatch, `missing frontmatter in ${path.relative(repoRoot, skillFile)}`);

    const document = parseDocument(frontmatterMatch[1], {
      prettyErrors: true,
      strict: true,
    });

    assert.equal(
      document.errors.length,
      0,
      `${path.relative(repoRoot, skillFile)} has invalid YAML frontmatter: ${document.errors.map((error) => error.message).join("; ")}`,
    );

    const frontmatter = document.toJS();

    assert.equal(typeof frontmatter?.name, "string", `${path.relative(repoRoot, skillFile)} is missing a string frontmatter name`);
    assert.equal(
      typeof frontmatter?.description,
      "string",
      `${path.relative(repoRoot, skillFile)} is missing a string frontmatter description`,
    );
  }
});
