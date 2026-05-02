import { test, expect } from '@playwright/test';
import { newsFixtures } from '../../../../helpers/news-stage-fixtures.mjs';
import { gotoStagePath, publicationCardLink } from '../../../../helpers/stage-page-helpers.mjs';

test.describe('stage news list page', () => {
  test('news list renders the canonical page chrome and local news detail card hrefs', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, newsFixtures.listPath);

    await expect(page).toHaveTitle(newsFixtures.listTitle);
    await expect(page.getByRole('heading', { name: newsFixtures.listHeading })).toBeVisible();
    await expect(page.getByText(newsFixtures.listDescription, { exact: true })).toBeVisible();

    for (const card of newsFixtures.visibleCards) {
      const cardLink = publicationCardLink(page, card.title);
      await expect(cardLink).toBeVisible();
      await expect(cardLink).toHaveAttribute('href', card.href);
    }
  });
});
