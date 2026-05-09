export const whitepaperFixtures = {
  listPath: '/whitepapers',
  listTitle: 'ホワイトペーパー | QueryPie AI',
  listHeading: 'ホワイトペーパー',
  visibleCard: {
    title: 'なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか',
    href: '/whitepapers/24/ai-transformation-japan',
  },
  hiddenCardTitle: 'Created only for the Korean translation whitepaper flow.',
  gatedPost: {
    idOnlyPath: '/whitepapers/24',
    path: '/whitepapers/24/ai-transformation-japan',
    mismatchedSlugPath: '/whitepapers/24/not-the-canonical-slug',
    canonicalPath: '/whitepapers/24/ai-transformation-japan',
    title: 'なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか',
    authorName: '寺澤慎祐',
    previewHeading: 'はじめに',
    hiddenHeading: '全文を読む',
    previewText: 'フォームに入力後、限定コンテンツをご覧いただけます。',
    revealedHeading: '■ テクノロジー大手',
    ctaText: 'PDF版ホワイトペーパーを見る',
    ctaHref: '/whitepapers/24/ai-transformation-japan/pdf',
    cookieName: 'qp-gated-whitepaper-24',
    relatedHeading: '関連記事',
  },
  redirectPost: {
    path: '/whitepapers/25/ai-transformation-japan',
    redirectedPath: '/whitepapers/24/ai-transformation-japan',
    title: 'なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか',
  },
};

export const gatingFormSample = {
  email: process.env.GATING_FORM_E2E_EMAIL ?? 'stage-e2e@querypie.ai',
  lastName: process.env.GATING_FORM_E2E_LAST_NAME ?? '테스트',
  firstName: process.env.GATING_FORM_E2E_FIRST_NAME ?? '허메스',
  company: 'QueryPie AI',
  department: 'QA Automation',
  phone: '010-1234-5678',
};

export async function fillGatingForm(page, sample = gatingFormSample) {
  await page.getByRole('textbox', { name: '*姓' }).fill(sample.lastName);
  await page.getByRole('textbox', { name: '*名' }).fill(sample.firstName);
  await page.getByRole('textbox', { name: '*ビジネス用メールアドレス' }).fill(sample.email);
  await page.getByRole('textbox', { name: '*会社名' }).fill(sample.company);
  await page.getByRole('textbox', { name: '*部署／役職' }).fill(sample.department);
  await page.getByRole('textbox', { name: '電話番号' }).fill(sample.phone);
  await page.locator('form select').first().selectOption('demo-request');
  await page.getByLabel('社内業務効率化｜AI Crew').check();
  await page.locator('form select').nth(1).selectOption({ label: '3ヶ月以内' });
}
