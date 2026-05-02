import { test, expect } from '@playwright/test';
import { blogFixtures, whitepaperFixtures } from '../../../helpers/publication-stage-fixtures.mjs';

test.describe('stage publication list pages', () => {
  test('blog list renders visible posts and excludes hidden posts', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${blogFixtures.listPath}`, { waitUntil: 'networkidle' });

    await expect(page).toHaveTitle('ブログ | QueryPie AI');
    await expect(page.getByRole('heading', { name: 'ブログ' })).toBeVisible();
    await expect(page.getByRole('link', { name: new RegExp(blogFixtures.visibleTitle) })).toBeVisible();
    await expect(page.getByText(blogFixtures.hiddenTitle, { exact: true })).toHaveCount(0);
  });

  test('whitepaper list renders visible cards, excludes hidden redirect records, and keeps upstream card hrefs', async ({
    page,
    baseURL,
  }) => {
    await page.goto(`${baseURL}${whitepaperFixtures.listPath}`, { waitUntil: 'networkidle' });

    await expect(page).toHaveTitle('ホワイトペーパー | QueryPie AI');
    await expect(page.getByRole('heading', { name: 'ホワイトペーパー' })).toBeVisible();

    const visibleCard = page.getByRole('link', { name: new RegExp(whitepaperFixtures.visibleTitle) }).first();
    await expect(visibleCard).toBeVisible();
    await expect(visibleCard).toHaveAttribute('href', whitepaperFixtures.visibleListHref);
    await expect(page.getByText(whitepaperFixtures.hiddenTitle, { exact: false })).toHaveCount(0);
  });
});
