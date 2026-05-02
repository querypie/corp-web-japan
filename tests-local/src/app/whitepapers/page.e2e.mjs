import { test, expect } from '@playwright/test';
import {
  fillGatingForm,
  whitepaperFixtures,
} from '../../../helpers/whitepaper-stage-fixtures.mjs';
import { gotoStagePath, publicationCardLink } from '../../../helpers/stage-page-helpers.mjs';

test.describe('stage whitepaper pages', () => {
  test('whitepaper list renders the canonical page chrome and visible upstream card href', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, whitepaperFixtures.listPath);

    await expect(page).toHaveTitle(whitepaperFixtures.listTitle);
    await expect(page.getByRole('heading', { name: whitepaperFixtures.listHeading })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ホワイトペーパー' }).first()).toBeVisible();

    const visibleCard = publicationCardLink(page, whitepaperFixtures.visibleCard.title);
    await expect(visibleCard).toBeVisible();
    await expect(visibleCard).toHaveAttribute('href', whitepaperFixtures.visibleCard.href);
  });

  test('whitepaper list excludes hidden redirect shadow records', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, whitepaperFixtures.listPath);

    await expect(page.getByText(whitepaperFixtures.hiddenCardTitle, { exact: false })).toHaveCount(0);
  });

  test('whitepaper id-only route redirects to the canonical slug route', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, whitepaperFixtures.gatedPost.idOnlyPath);

    await expect(page).toHaveURL(`${baseURL}${whitepaperFixtures.gatedPost.canonicalPath}`);
    await expect(page).toHaveTitle(`${whitepaperFixtures.gatedPost.title} | QueryPie AI`);
  });

  test('whitepaper mismatched slug route redirects to the canonical slug route', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, whitepaperFixtures.gatedPost.mismatchedSlugPath);

    await expect(page).toHaveURL(`${baseURL}${whitepaperFixtures.gatedPost.canonicalPath}`);
    await expect(page).toHaveTitle(`${whitepaperFixtures.gatedPost.title} | QueryPie AI`);
  });

  test('gated whitepaper renders preview state with author metadata, CTA, and locked content hidden', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, whitepaperFixtures.gatedPost.path);

    await expect(page).toHaveTitle(`${whitepaperFixtures.gatedPost.title} | QueryPie AI`);
    await expect(page.getByRole('heading', { name: whitepaperFixtures.gatedPost.title })).toBeVisible();
    await expect(page.getByText(whitepaperFixtures.gatedPost.authorName, { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: whitepaperFixtures.gatedPost.previewHeading })).toBeVisible();
    await expect(page.getByRole('heading', { name: whitepaperFixtures.gatedPost.hiddenHeading })).toBeVisible();
    await expect(page.getByText(whitepaperFixtures.gatedPost.previewText)).toBeVisible();
    await expect(page.getByRole('link', { name: whitepaperFixtures.gatedPost.ctaText })).toHaveAttribute(
      'href',
      whitepaperFixtures.gatedPost.ctaHref,
    );
    await expect(page.getByText(whitepaperFixtures.gatedPost.revealedHeading, { exact: false })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: whitepaperFixtures.gatedPost.relatedHeading })).toBeVisible();
    await expect(page.getByRole('button', { name: '送信する' })).toBeDisabled();
  });

  test('gated whitepaper unlocks after submit and persists the unlocked state via cookie', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, whitepaperFixtures.gatedPost.path);

    const submitButton = page.getByRole('button', { name: '送信する' });
    await expect(submitButton).toBeDisabled();

    await fillGatingForm(page);

    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.getByRole('heading', { name: whitepaperFixtures.gatedPost.hiddenHeading })).toHaveCount(0);
    await expect(page.getByText(whitepaperFixtures.gatedPost.revealedHeading, { exact: false })).toBeVisible();

    const cookies = await page.context().cookies();
    expect(
      cookies.some(
        (cookie) =>
          cookie.name === whitepaperFixtures.gatedPost.cookieName && cookie.value === '1',
      ),
    ).toBe(true);

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByText(whitepaperFixtures.gatedPost.revealedHeading, { exact: false })).toBeVisible();
    await expect(page.getByRole('heading', { name: whitepaperFixtures.gatedPost.hiddenHeading })).toHaveCount(0);
  });

  test('hidden redirect whitepaper record resolves to the canonical local whitepaper detail route', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, whitepaperFixtures.redirectPost.path);

    await expect(page).toHaveURL(`${baseURL}${whitepaperFixtures.redirectPost.redirectedPath}`);
    await expect(page).toHaveTitle(`${whitepaperFixtures.redirectPost.title} | QueryPie AI`);
    await expect(page.getByRole('heading', { name: whitepaperFixtures.redirectPost.title })).toBeVisible();
  });
});
