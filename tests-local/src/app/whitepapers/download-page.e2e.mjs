import { test, expect } from '@playwright/test';
import {
  fillGatingForm,
  whitepaperFixtures,
} from '../../../helpers/whitepaper-stage-fixtures.mjs';
import { gotoStagePath } from '../../../helpers/stage-page-helpers.mjs';

const gatedPost = whitepaperFixtures.gatedPost;
const downloadGate = gatedPost.downloadGate;

test.describe('stage whitepaper download gate page', () => {
  test('article CTA opens the canonical pdf gate page with the localized cover image and locked form state', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, gatedPost.path);

    await page.getByRole('link', { name: gatedPost.ctaText }).click();

    await expect(page).toHaveURL(`${baseURL}${downloadGate.path}`);
    await expect(page).toHaveTitle(`${gatedPost.title} | QueryPie AI`);
    await expect(page.getByRole('heading', { name: gatedPost.title })).toBeVisible();
    await expect(page.getByText(downloadGate.helperText)).toBeVisible();
    await expect(page.getByRole('button', { name: downloadGate.buttonText })).toBeDisabled();
    const coverImage = page.locator(`img[alt="${gatedPost.title}"]`).first();
    await expect(coverImage).toBeVisible();
    await expect(coverImage).toHaveAttribute('src', /download-cover\.png/);
  });

  test('pdf gate form submit unlocks and triggers the localized pdf asset download', async ({ page, baseURL }) => {
    await gotoStagePath(page, baseURL, downloadGate.path);

    const submitButton = page.getByRole('button', { name: downloadGate.buttonText });
    await expect(submitButton).toBeDisabled();

    await fillGatingForm(page);

    await expect(submitButton).toBeEnabled();
    const unlockResponse = page.waitForResponse(
      (response) => response.url().includes('/api/gating-form/unlock') && response.status() === 200,
    );
    const download = page.waitForEvent('download');
    await submitButton.click();
    await unlockResponse;
    const pdfDownload = await download;

    await expect(page).toHaveURL(`${baseURL}${downloadGate.path}`);
    expect(pdfDownload.url()).toBe(`${baseURL}${downloadGate.pdfPath}`);
    expect(pdfDownload.suggestedFilename()).toBe('QP_Whitepaper_AI_Transformation_JP.pdf');

    const cookies = await page.context().cookies();
    expect(
      cookies.some(
        (cookie) => cookie.name === gatedPost.cookieName && cookie.value === '1',
      ),
    ).toBe(true);
  });

  test('preview mode auto-unlocks the pdf gate and triggers the same localized pdf asset download from the article CTA path', async ({
    page,
    baseURL,
  }) => {
    await page.context().addCookies([
      {
        name: downloadGate.previewCookieName,
        value: downloadGate.previewCookieValue,
        url: baseURL,
      },
    ]);

    await gotoStagePath(page, baseURL, gatedPost.path);
    const previewUnlockResponse = page.waitForResponse(
      (response) => response.url().includes('/api/gating-form/preview-unlock') && response.status() === 200,
    );
    const download = page.waitForEvent('download');
    await page.getByRole('link', { name: gatedPost.ctaText }).click();
    await previewUnlockResponse;
    const pdfDownload = await download;

    await expect(page).toHaveURL(`${baseURL}${downloadGate.path}`);
    expect(pdfDownload.url()).toBe(`${baseURL}${downloadGate.pdfPath}`);
    expect(pdfDownload.suggestedFilename()).toBe('QP_Whitepaper_AI_Transformation_JP.pdf');

    const cookies = await page.context().cookies();
    expect(
      cookies.some(
        (cookie) => cookie.name === gatedPost.cookieName && cookie.value === '1',
      ),
    ).toBe(true);
  });
});
