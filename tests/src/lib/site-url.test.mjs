import test from "node:test";
import assert from "node:assert/strict";

import { createTsModuleLoader } from "../../helpers/ts-module-loader.mjs";

const { importModule } = createTsModuleLoader();
const {
  absoluteUrl,
  getDeployedSiteUrl,
  resolveDeployedSiteOrigin,
} = importModule("src/lib/site-url.ts");

test("deployed site origin resolver uses the current request origin first", () => {
  assert.equal(
    resolveDeployedSiteOrigin({
      requestOrigin: "https://stage.querypie.ai/news/15/post",
      env: { VERCEL_TARGET_ENV: "production" },
    }),
    "https://stage.querypie.ai",
  );

  assert.equal(
    resolveDeployedSiteOrigin({
      requestHost: "localhost:3000",
      requestProtocol: "http",
      env: {},
    }),
    "http://localhost:3000",
  );
});

test("deployed site origin resolver supports production, staging, and preview deployment inputs", () => {
  assert.equal(
    resolveDeployedSiteOrigin({
      env: { VERCEL_TARGET_ENV: "production" },
    }),
    "https://querypie.ai",
  );

  assert.equal(
    resolveDeployedSiteOrigin({
      env: {
        VERCEL_TARGET_ENV: "staging",
        NEXT_PUBLIC_SITE_URL: "https://stage.querypie.ai",
      },
    }),
    "https://stage.querypie.ai",
  );

  assert.equal(
    resolveDeployedSiteOrigin({
      env: {
        VERCEL_TARGET_ENV: "preview",
        VERCEL_URL: "corp-web-japan-git-feature-querypie.vercel.app",
      },
    }),
    "https://corp-web-japan-git-feature-querypie.vercel.app",
  );
});

test("absolute URL helper resolves paths against the provided deployed origin", () => {
  assert.equal(
    absoluteUrl("/news/15/thumbnail.png", getDeployedSiteUrl({
      requestHost: "stage.querypie.ai",
      requestProtocol: "https",
      env: {},
    })),
    "https://stage.querypie.ai/news/15/thumbnail.png",
  );
});
