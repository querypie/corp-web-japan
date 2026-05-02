import { test, expect } from '@playwright/test';
import {
  blogFixtures,
  fillGatingForm,
  whitepaperFixtures,
} from '../../../helpers/publication-stage-fixtures.mjs';

test.describe('stage publication detail pages', () => {
  test('visible blog post renders the expected local detail page', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${blogFixtures.visiblePost.path}`, { waitUntil: 'networkidle' });

    await expect(page).toHaveTitle(`${blogFixtures.visiblePost.title} | QueryPie AI`);
    await expect(page.getByRole('heading', { name: blogFixtures.visiblePost.title })).toBeVisible();
    await expect(page.getByRole('heading', { name: blogFixtures.visiblePost.bodyHeading })).toBeVisible();
  });

  test('hidden blog post stays reachable directly but remains absent from the list surface', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${blogFixtures.hiddenPost.path}`, { waitUntil: 'networkidle' });

    await expect(page).toHaveTitle(`${blogFixtures.hiddenPost.title} | QueryPie AI`);
    await expect(page.getByRole('heading', { name: blogFixtures.hiddenPost.title }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: blogFixtures.hiddenPost.bodyHeading })).toBeVisible();
  });

  test('gated whitepaper renders preview content, unlock form, and hidden content only after submit', async ({
    page,
    baseURL,
  }) => {
    await page.goto(`${baseURL}${whitepaperFixtures.gatedPost.path}`, { waitUntil: 'networkidle' });

    await expect(page).toHaveTitle(`${whitepaperFixtures.gatedPost.title} | QueryPie AI`);
    await expect(page.getByRole('heading', { name: whitepaperFixtures.gatedPost.title })).toBeVisible();
    await expect(page.getByRole('heading', { name: whitepaperFixtures.gatedPost.previewHeading })).toBeVisible();
    await expect(page.getByRole('heading', { name: whitepaperFixtures.gatedPost.hiddenHeading })).toBeVisible();
    await expect(page.getByText(whitepaperFixtures.gatedPost.revealedHeading, { exact: false })).toHaveCount(0);

    const submitButton = page.getByRole('button', { name: '送信する' });
    await expect(submitButton).toBeDisabled();

    await fillGatingForm(page);

    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.getByRole('heading', { name: whitepaperFixtures.gatedPost.hiddenHeading })).toHaveCount(0);
    await expect(page.getByText(whitepaperFixtures.gatedPost.revealedHeading, { exact: false })).toBeVisible();

    const cookies = await page.context().cookies();
    await expect
      .soft(cookies.some((cookie) => cookie.name === whitepaperFixtures.gatedPost.cookieName && cookie.value === '1'))
      .toBeTruthy();

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByText(whitepaperFixtures.gatedPost.revealedHeading, { exact: false })).toBeVisible();
    await expect(page.getByRole('heading', { name: whitepaperFixtures.gatedPost.hiddenHeading })).toHaveCount(0);
  });

  test('redirect whitepaper record resolves to the canonical whitepaper detail route', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${whitepaperFixtures.redirectPost.path}`, { waitUntil: 'networkidle' });

    await expect(page).toHaveURL(`${baseURL}${whitepaperFixtures.redirectPost.redirectedPath}`);
    await expect(page).toHaveTitle(`${whitepaperFixtures.redirectPost.title} | QueryPie AI`);
    await expect(page.getByRole('heading', { name: whitepaperFixtures.redirectPost.title })).toBeVisible();
  });
});
