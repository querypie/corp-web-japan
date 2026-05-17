import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readSource } from "./helpers/source-readers.mjs";

test("querypie content redirect helper covers runtime-validated exact paths, sitemap-derived top-level, and locale-aware namespaces", () => {
  const file = "src/lib/querypie-content-redirect.ts";

  assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), true, `${file} should exist`);

  const source = readSource(file);

  assert.match(source, /"\/api\/og\/ja"/);
  assert.match(source, /"\/privacy-policy-en\/26-01-15"/);
  assert.match(source, /"\/privacy-policy-ko"/);
  assert.match(source, /isQueryPieExactRedirectPath/);
  assert.match(source, /"company"/);
  assert.match(source, /"features"/);
  assert.match(source, /"solutions"/);
  assert.match(source, /"cookie-preference"/);
  assert.match(source, /"eula"/);
  assert.match(source, /"plans"/);
  assert.match(source, /"sales-deck"/);
  assert.match(source, /"search"/);
  assert.match(source, /"en"/);
  assert.match(source, /"ja"/);
  assert.match(source, /"ko"/);
  assert.match(source, /"\/rss\.xml"/);
  assert.match(source, /"\/rss-ja-blog\.xml"/);
  assert.match(source, /new URL\(redirectPath, querypieOrigin\)/);
});

test("querypie content redirect helper returns runtime-validated exact redirect paths", () => {
  const expression = [
    "import('./src/lib/querypie-content-redirect.ts').then(({ getQueryPieContentRedirectPath }) => {",
    "  console.log(JSON.stringify({",
    "    apiOgJa: getQueryPieContentRedirectPath('/api/og/ja'),",
    "    privacyPolicyEn260115: getQueryPieContentRedirectPath('/privacy-policy-en/26-01-15'),",
    "    privacyPolicyKo: getQueryPieContentRedirectPath('/privacy-policy-ko'),",
    "    missingPages: getQueryPieContentRedirectPath('/missing-pages'),",
    "  }));",
    "})",
  ].join(' ');

  const result = spawnSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "-e", expression], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);

  const payload = JSON.parse(result.stdout.trim());

  assert.equal(payload.apiOgJa, "/api/og/ja");
  assert.equal(payload.privacyPolicyEn260115, "/privacy-policy-en/26-01-15");
  assert.equal(payload.privacyPolicyKo, "/privacy-policy-ko");
  assert.equal(payload.missingPages, null);
});

test("missing route redirects sitemap-matching namespaces to querypie.com before falling back to 404", () => {
  const file = "src/app/[...missing]/page.tsx";
  const source = readSource(file);

  assert.match(source, /buildQueryPieContentRedirectUrl/);
  assert.match(source, /\[runtime-missing-redirect\]/);
  assert.match(source, /redirect\(redirectTarget\.toString\(\)\)/);
  assert.match(source, /\[runtime-404\]/);
  assert.match(source, /notFound\(\);/);
});

test("runtime redirect logging uses info for same-origin 307s and warning for external 307s", () => {
  const expression = [
    "import('./src/lib/runtime-redirect-log.ts').then(({ logRuntimeRedirect }) => {",
    "  const logs = { info: [], warn: [] };",
    "  console.info = (...args) => logs.info.push(args);",
    "  console.warn = (...args) => logs.warn.push(args);",
    "  const request = { nextUrl: { pathname: '/legacy', host: 'stage.querypie.ai' }, url: 'https://stage.querypie.ai/legacy', headers: new Headers() };",
    "  logRuntimeRedirect(request, 'https://stage.querypie.ai/blog/1/post', 307);",
    "  logRuntimeRedirect(request, 'https://www.querypie.com/ja/features', 307);",
    "  console.log(JSON.stringify(logs));",
    "})",
  ].join(' ');

  const result = spawnSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "-e", expression], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);

  const logs = JSON.parse(result.stdout.trim());
  assert.equal(logs.info.length, 1);
  assert.equal(logs.warn.length, 1);
  assert.equal(logs.info[0][0], "[runtime-redirect]");
  assert.equal(logs.warn[0][0], "[runtime-redirect]");
  assert.match(logs.info[0][1], /"redirectScope":"same-origin"/);
  assert.match(logs.warn[0][1], /"redirectScope":"external"/);
  assert.match(logs.info[0][1], /"statusCode":307/);
  assert.match(logs.warn[0][1], /"statusCode":307/);
});

test("missing route logs external querypie.com redirects at warning level", () => {
  const file = "src/app/[...missing]/page.tsx";
  const source = readSource(file);

  assert.match(source, /logRuntimeRedirectFromHeaders\(\{/);
  assert.match(source, /marker: "\[runtime-missing-redirect\]"/);
  assert.match(source, /requestUrl/);
  assert.doesNotMatch(source, /console\.log\(\s*"\[runtime-missing-redirect\]"/);
});

test("querypie locale catch-all sends non-local ja paths to querypie.com after checking local content first", () => {
  const file = "src/app/ja/[[...path]]/route.ts";
  const source = readSource(file);

  assert.match(source, /isCorpWebJapanInternalContentPath/);
  assert.match(source, /if \(isCorpWebJapanInternalContentPath\(strippedPath\)\)/);
  assert.match(source, /new URL\(request\.nextUrl\.pathname, querypieOrigin\)/);
  assert.match(source, /logRuntimeRedirect\(request, redirectedUrl, 307\)/);
  assert.match(source, /logRuntimeRedirect\(request, querypieRedirectedUrl, 307\)/);
  assert.match(source, /NextResponse\.redirect\(querypieRedirectedUrl, 307\)/);
});

test("querypie locale catch-all sends ko paths directly to querypie.com/ko", () => {
  const file = "src/app/ko/[[...path]]/route.ts";
  const source = readSource(file);

  assert.match(source, /const querypieOrigin = "https:\/\/www\.querypie\.com"/);
  assert.match(source, /new URL\(request\.nextUrl\.pathname, querypieOrigin\)/);
  assert.match(source, /querypieRedirectedUrl\.search = request\.nextUrl\.search/);
  assert.match(source, /logRuntimeRedirect\(request, querypieRedirectedUrl, 307\)/);
  assert.match(source, /NextResponse\.redirect\(querypieRedirectedUrl, 307\)/);
});
