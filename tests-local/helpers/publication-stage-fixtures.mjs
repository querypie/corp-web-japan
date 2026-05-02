export const blogFixtures = {
  listPath: '/blog',
  listTitle: 'ブログ | QueryPie AI',
  listHeading: 'ブログ',
  visibleCard: {
    title: 'AI攻撃ツールが55カ国のファイアウォール600台を突破──ファイアウォールの先にある"データ"をどう守るか',
    href:
      '/blog/29/ai-attack-tool-firewall-breach-data-protection',
  },
  hiddenCardTitle: '株式会社ペイロールとQueryPieがAIセキュリティ分野で技術提携',
  visiblePost: {
    idOnlyPath: '/blog/1',
    path: '/blog/1/agentless-philosophy',
    mismatchedSlugPath: '/blog/1/not-the-canonical-slug',
    canonicalPath: '/blog/1/agentless-philosophy',
    title: 'QueryPieがAgentless哲学にこだわる理由',
    bodyHeading: '概要',
    authorName: 'Brant Hwang',
    relatedHeading: '関連記事',
  },
  hiddenPost: {
    path: '/blog/23/querypie-payroll-partnership',
    title: '株式会社ペイロールとQueryPieがAIセキュリティ分野で技術提携',
    bodyHeading: '〜AIサービスの安全・迅速な展開に向け、セキュリティとデータ統合技術で連携〜',
    relatedHeading: '関連記事',
  },
};

export const whitepaperFixtures = {
  listPath: '/whitepapers',
  listTitle: 'ホワイトペーパー | QueryPie AI',
  listHeading: 'ホワイトペーパー',
  visibleCard: {
    title: 'なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか',
    href:
      'https://www.querypie.com/ja/features/documentation/white-paper/24/ai-transformation-japan',
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
    ctaText: 'ホワイトペーパーを入手する 🚀',
    ctaHref:
      'https://www.querypie.com/ja/features/documentation/white-paper/24/ai-transformation-japan/download',
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

export function publicationCardLink(page, title) {
  return page.locator('a').filter({ has: page.getByRole('heading', { name: title }) }).first();
}

export async function gotoStagePath(page, baseURL, path) {
  await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' });
}

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
