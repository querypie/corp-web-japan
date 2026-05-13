import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("/internal/demo-sections exists as a noindex UI demo route for preserved orphan section components", () => {
  const file = "src/app/internal/demo-sections/page.tsx";
  assert.equal(sourceExists(file), true, `${file} should exist`);

  const source = readSource(file);
  assert.match(source, /title:\s*"Internal Demo Sections \| QueryPie AI"/);
  assert.match(source, /canonical:\s*"\/internal\/demo-sections"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /@\/components\/sections\/internal-demo\/role-slides/);
  assert.match(source, /@\/components\/sections\/internal-demo\/use-case-showcase/);
  assert.equal(sourceExists("src/components/sections/internal-demo/role-slides.tsx"), true);
  assert.equal(sourceExists("src/components/sections/internal-demo/use-case-showcase.tsx"), true);
  assert.equal(sourceExists("src/components/sections/role-slides.tsx"), false);
  assert.equal(sourceExists("src/components/sections/use-case-showcase.tsx"), false);
  assert.match(source, /RoleSlides/);
  assert.match(source, /UseCaseShowcase/);
  assert.match(source, /roleSlidesDemoProps/);
  assert.match(source, /useCaseShowcaseDemoProps/);
  assert.match(source, /section component を削除せず/);
  assert.match(source, /RoleSlides component demo/);
  assert.match(source, /UseCaseShowcase component demo/);
  assert.match(source, /\/demo\/use-cases/);
  assert.match(source, /\/contact-us\?inquiry=ai-consulting&product=ai-crew/);
});
