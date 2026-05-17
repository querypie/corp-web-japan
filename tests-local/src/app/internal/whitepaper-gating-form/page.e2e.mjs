import { test, expect } from '@playwright/test';

const sampleEmail = process.env.GATING_FORM_E2E_EMAIL ?? 'stage-e2e@querypie.ai';
const sampleLastName = process.env.GATING_FORM_E2E_LAST_NAME ?? '테스트';
const sampleFirstName = process.env.GATING_FORM_E2E_FIRST_NAME ?? '허메스';

const routePath = '/internal/whitepaper-gating-form';
const hiddenSectionHeading = 'Hidden section';
const gatedCookieName = 'qp-gated-internal-whitepaper-gating-form';

test('internal whitepaper gating demo renders the preview content and keeps gated content hidden by default', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}${routePath}`, { waitUntil: 'networkidle' });

  await expect(page).toHaveTitle('Internal Whitepaper Gating Form | QueryPie AI');
  await expect(page.getByRole('heading', { name: 'Gating form demo' })).toBeVisible();
  await expect(
    page.getByText('このページは whitepaper MDX 用 gating form の動作確認用です。ここまでは送信前でも表示されます。'),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: '全文を読む' })).toBeVisible();
  await expect(page.getByRole('button', { name: '送信する' })).toBeDisabled();
  await expect(page.getByRole('heading', { name: hiddenSectionHeading })).toHaveCount(0);
});

test('internal whitepaper gating demo unlocks the hidden content and persists it with a cookie', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}${routePath}`, { waitUntil: 'networkidle' });

  await page.getByRole('textbox', { name: '*姓' }).fill(sampleLastName);
  await page.getByRole('textbox', { name: '*名' }).fill(sampleFirstName);
  await page.getByRole('textbox', { name: '*ビジネス用メールアドレス' }).fill(sampleEmail);
  await page.getByRole('textbox', { name: '*会社名' }).fill('QueryPie AI');
  await page.getByRole('textbox', { name: '*部署／役職' }).fill('QA Automation');
  await page.getByRole('textbox', { name: '電話番号' }).fill('010-1234-5678');
  await page.locator('form select').first().selectOption('demo-request');
  await page.getByLabel('社内業務効率化｜AI Crew').check();
  await page.locator('form select').nth(1).selectOption({ label: '3ヶ月以内' });

  const submitButton = page.getByRole('button', { name: '送信する' });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  await expect(page.getByRole('heading', { name: hiddenSectionHeading })).toBeVisible();
  await expect(
    page.getByText('この見出し以降はフォーム送信後に表示されます。'),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: '全文を読む' })).toHaveCount(0);

  const gatingCookie = await page.context().cookies();
  expect(
    gatingCookie.some((cookie) => cookie.name === gatedCookieName && cookie.value === '1'),
  ).toBe(true);

  await page.reload({ waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { name: hiddenSectionHeading })).toBeVisible();
  await expect(page.getByRole('heading', { name: '全文を読む' })).toHaveCount(0);
});
