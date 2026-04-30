import { test, expect } from '@playwright/test';

const expectedSubmitOutcome = process.env.CONTACT_US_EXPECTED_SUBMIT_OUTCOME ?? 'success';
const sampleEmail = process.env.CONTACT_US_E2E_EMAIL ?? 'stage-e2e@querypie.ai';
const sampleMessage =
  process.env.CONTACT_US_E2E_MESSAGE ??
  'Stage E2E verification from Hermes. Please ignore this test submission.';
const routePath = '/contact-us';

async function gotoContactUs(page, baseURL, query = '') {
  await page.goto(`${baseURL}${routePath}${query}`, { waitUntil: 'networkidle' });
}

async function fillRequiredFields(page, { email = sampleEmail, message = sampleMessage } = {}) {
  await page.getByRole('textbox', { name: '*姓' }).fill('테스트');
  await page.getByRole('textbox', { name: '*名' }).fill('허메스');
  await page.getByRole('textbox', { name: '*ビジネス用メールアドレス' }).fill(email);
  await page.getByRole('textbox', { name: '*会社名' }).fill('QueryPie AI');
  await page.getByRole('textbox', { name: '*部署／役職' }).fill('QA Automation');
  await page.getByRole('textbox', { name: '*ご相談内容' }).fill(message);
}

test('contact-us page renders core form fields on stage', async ({ page, baseURL }) => {
  await gotoContactUs(page, baseURL);

  await expect(page).toHaveTitle('お問い合わせ | QueryPie AI');
  await expect(page.getByRole('heading', { name: 'お問い合わせ' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: '*姓' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: '*名' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: '*ビジネス用メールアドレス' })).toBeVisible();
  await expect(page.getByRole('button', { name: '送信する' })).toBeDisabled();
});

test('contact-us page applies stable query prefills on stage', async ({ page, baseURL }) => {
  await gotoContactUs(page, baseURL, '?inquiry=demo-request&product=aip&product=ai-dashi');

  await expect(page.locator('select[name="inquiry"]')).toHaveValue('demo-request');
  await expect(page.locator('#contact-us-product-aip')).toBeChecked();
  await expect(page.locator('#contact-us-product-ai-dashi')).toBeChecked();
});

test('contact-us page ignores invalid prefills and deduplicates valid product query params on stage', async ({
  page,
  baseURL,
}) => {
  await gotoContactUs(
    page,
    baseURL,
    '?inquiry=invalid-key&product=unknown&product=acp&product=acp&product=partnership',
  );

  await expect(page.locator('select[name="inquiry"]')).toHaveValue('');
  await expect(page.locator('#contact-us-product-acp')).toBeChecked();
  await expect(page.locator('#contact-us-product-partnership')).toBeChecked();
  await expect(page.locator('#contact-us-product-aip')).not.toBeChecked();
  await expect(page.locator('input[name="products"]:checked')).toHaveCount(2);
});

test('contact-us prefills do not bypass the remaining required fields on stage', async ({ page, baseURL }) => {
  await gotoContactUs(page, baseURL, '?inquiry=download&product=aip');

  await fillRequiredFields(page);

  const submitButton = page.getByRole('button', { name: '送信する' });
  await expect(submitButton).toBeDisabled();

  await page.locator('select[name="timeline"]').selectOption({ label: '3ヶ月以内' });

  await expect(submitButton).toBeEnabled();
});

test('contact-us page rejects free-email domains on stage until a business email is provided', async ({
  page,
  baseURL,
}) => {
  await gotoContactUs(page, baseURL, '?inquiry=technical-question&product=fde');

  await fillRequiredFields(page, {
    email: 'stage-e2e@gmail.com',
    message: 'Free email validation coverage for the stage contact-us E2E test.',
  });
  await page.locator('select[name="timeline"]').selectOption({ label: '3ヶ月以内' });
  await page.getByRole('textbox', { name: '*会社名' }).click();

  await expect(page.getByText('会社または教育機関のメールアドレスを入力してください。')).toBeVisible();
  await expect(page.getByRole('button', { name: '送信する' })).toBeDisabled();

  await page.getByRole('textbox', { name: '*ビジネス用メールアドレス' }).fill(sampleEmail);
  await page.getByRole('textbox', { name: '*会社名' }).click();

  await expect(page.getByText('会社または教育機関のメールアドレスを入力してください。')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '送信する' })).toBeEnabled();
});

test('contact-us page submit flow matches the current expected stage outcome', async ({ page, baseURL }) => {
  await gotoContactUs(page, baseURL);

  await page.getByRole('textbox', { name: '*姓' }).fill('테스트');
  await page.getByRole('textbox', { name: '*名' }).fill('허메스');
  await page.getByRole('textbox', { name: '*ビジネス用メールアドレス' }).fill(sampleEmail);
  await page.getByRole('textbox', { name: '*会社名' }).fill('QueryPie AI');
  await page.getByRole('textbox', { name: '*部署／役職' }).fill('QA Automation');
  await page.getByRole('textbox', { name: '電話番号' }).fill('010-1234-5678');
  await page.locator('select[name="inquiry"]').selectOption('demo-request');
  await page.locator('#contact-us-product-aip').check();
  await page.locator('select[name="timeline"]').selectOption({ label: '3ヶ月以内' });
  await page.getByRole('textbox', { name: '*ご相談内容' }).fill(sampleMessage);
  await page.locator('#contact-us-marketing').check();

  const submitButton = page.getByRole('button', { name: '送信する' });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  if (expectedSubmitOutcome === 'success') {
    await expect(page.getByRole('heading', { name: '送信が完了しました。' })).toBeVisible();
    await expect(page.getByText('担当チームより追ってご連絡いたします。')).toBeVisible();
    return;
  }

  await expect(page.getByText('お問い合わせの送信に失敗しました。しばらくしてから再度お試しください。')).toBeVisible();
});
