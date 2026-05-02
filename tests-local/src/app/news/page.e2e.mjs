import { test, expect } from '@playwright/test';
import { newsFixtures } from '../../../helpers/news-stage-fixtures.mjs';
import { gotoStagePath } from '../../../helpers/stage-page-helpers.mjs';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function waitForExactUrl(page, url) {
  await page.waitForURL(url, { timeout: 20_000 });
  await expect(page).toHaveURL(url);
}

test.describe('stage news detail routes', () => {
  test('redirect-backed news id-only path resolves to the configured external target', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, newsFixtures.redirectPost.idOnlyPath);

    await page.waitForURL(new RegExp(`^${escapeRegex(newsFixtures.redirectPost.redirectTargetPrefix)}`), {
      timeout: 20_000,
    });
    await expect(page).toHaveURL(new RegExp(`^${escapeRegex(newsFixtures.redirectPost.redirectTargetPrefix)}`));
  });

  test('redirect-backed news canonical path resolves to the configured external target', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, newsFixtures.redirectPost.path);

    await page.waitForURL(new RegExp(`^${escapeRegex(newsFixtures.redirectPost.redirectTargetPrefix)}`), {
      timeout: 20_000,
    });
    await expect(page).toHaveURL(new RegExp(`^${escapeRegex(newsFixtures.redirectPost.redirectTargetPrefix)}`));
  });

  for (const post of newsFixtures.localBodyPosts) {
    test(`${post.title} id-only path redirects to the canonical local slug route`, async ({ page, baseURL }) => {
      await gotoStagePath(page, baseURL, post.idOnlyPath);

      await waitForExactUrl(page, `${baseURL}${post.canonicalPath}`);
      await expect(page).toHaveTitle(`${post.title} | QueryPie AI`);
    });

    test(`${post.title} mismatched slug route redirects to the canonical local slug route`, async ({ page, baseURL }) => {
      await gotoStagePath(page, baseURL, post.mismatchedSlugPath);

      await waitForExactUrl(page, `${baseURL}${post.canonicalPath}`);
      await expect(page).toHaveTitle(`${post.title} | QueryPie AI`);
    });

    test(`${post.title} renders the local MDX body instead of redirecting away`, async ({ page, baseURL }) => {
      await gotoStagePath(page, baseURL, post.path);

      await waitForExactUrl(page, `${baseURL}${post.canonicalPath}`);
      await expect(page).toHaveTitle(`${post.title} | QueryPie AI`);
      await expect(page.getByRole('heading', { name: post.title }).first()).toBeVisible();
      await expect(page.getByText(post.authorName, { exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: post.bodyHeading })).toBeVisible();
      await expect(page.getByRole('heading', { name: post.relatedHeading })).toBeVisible();
    });
  }
});
