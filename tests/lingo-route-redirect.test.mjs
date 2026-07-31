import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";
import { createTsModuleLoader, toPlainJson } from "./helpers/ts-module-loader.mjs";

const retiredLingoImplementationRoots = [
  "src/app/lingo",
  "src/components/layout/lingo",
  "src/components/sections/lingo",
  "src/components/lingo",
  "src/lib/lingo",
  "public/lingo",
];

test("Lingo root and descendant paths permanently redirect to the external Japanese site", async () => {
  const { default: nextConfig } = createTsModuleLoader().importModule("next.config.ts");
  const redirects = toPlainJson(await nextConfig.redirects());
  const lingoRedirect = redirects.find(({ source }) => source === "/lingo/:path*");

  assert.deepEqual(lingoRedirect, {
    source: "/lingo/:path*",
    destination: "https://lingo.querypie.ai/ja",
    permanent: true,
  });
});

test("retired local Lingo implementation is removed", () => {
  for (const relativePath of retiredLingoImplementationRoots) {
    assert.equal(existsSync(relativePath), false, `${relativePath} should be removed`);
  }

  assert.doesNotMatch(readSource("src/app/globals.css"), /\.lingo-scope/);
});

test("Lingo OpenSpec records the redirect and removal contract", () => {
  const spec = readSource("openspec/specs/contract-lingo-route-redirect/spec.md");

  assert.match(spec, /Requirement: route-family redirect/);
  assert.match(spec, /https:\/\/lingo\.querypie\.ai\/ja/);
  assert.match(spec, /Requirement: permanent redirect semantics/);
  assert.match(spec, /Requirement: local Lingo implementation removal/);
});
