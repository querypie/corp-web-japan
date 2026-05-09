import { test, expect } from '@playwright/test';
import { newsFixtures } from '../../../helpers/news-stage-fixtures.mjs';
import { gotoStagePath, publicationCardLink } from '../../../helpers/stage-page-helpers.mjs';

async function waitForExactUrl(page, url) {
  await page.waitForURL(url, { timeout: 20_000 });
  await expect(page).toHaveURL(url);
}

test.describe('stage news routes', () => {
  test('news list renders the canonical page chrome and local news detail card hrefs', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, newsFixtures.listPath);

    await expect(page).toHaveTitle(newsFixtures.listTitle);
    await expect(page.getByRole('heading', { name: newsFixtures.listHeading })).toBeVisible();
    await expect(page.getByRole('heading', { name: newsFixtures.listCtaHeading })).toBeVisible();
    await expect(page.getByText(newsFixtures.listCtaBody, { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: newsFixtures.listCtaLabel })).toBeVisible();

    for (const card of newsFixtures.visibleCards) {
      const cardLink = publicationCardLink(page, card.title);
      await expect(cardLink).toBeVisible();
      await expect(cardLink).toHaveAttribute('href', card.href);
    }
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
