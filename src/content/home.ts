export const demoUseCasesUrl = "/demo/use-cases";
export const aiCrewWhitepaperUrl =
  "/whitepapers/24/ai-transformation-japan";
export const aiCrewFloatingCtaUrl = "/contact-us?product=ai-crew";
export const aiCrewConsultUrl = "/contact-us?inquiry=ai-consulting&product=ai-crew";

export const homePageContent = {
  metadata: {
    title: "作業を減らし、成果を増やす。",
    description:
      "調査、データ整理、下書きなど、時間のかかる下準備をAIに任せて効率化。人員を増やすことなく、企業の生産性・利益率の向上を実現します。",
  },
  hero: {
    eyebrow: "専用AIエージェントの設計・実運用支援",
    title: "作業を減らし、\n成果を増やす。",
    subcopy: "利益を生み出す実務特化型AIエージェント",
    body:
      "調査、データ整理、下書きなど、時間のかかる「下準備」をAIに任せて効率化。人員を増やすことなく、企業の生産性・利益率の向上を実現します。",
    primaryCta: { label: "業務に合うAI活用を相談する", href: aiCrewConsultUrl },
    secondaryCta: { label: "活用事例を見る", href: demoUseCasesUrl },
    imageSrc: "/solutions/ai-crew/hero-visual.webp",
    imageAlt: "オフィスでAIアシスタント画面を活用しながら業務を進めるチームのイメージ",
  },
  floatingCta: { label: "業務に合うAI活用を相談する", href: aiCrewFloatingCtaUrl },
  roi: {
    eyebrow: "Technology & Security",
    title: "実務での安全なAI活用を支える\nエンタープライズAI基盤 QueryPie AIP",
    body:
      "自律したAIエージェントを実務で安心安全に活用するために不可欠な要素を兼ね備えています。",
    cards: [
      {
        title: "頭脳 / Brain",
        body:
          "業務特性に合わせて最適なLLMを使い分け\n入力した社内データの外部学習はなし",
        stat: "マルチLLM / データ保護",
      },
      {
        title: "連携 / Connect",
        body:
          "ゼロトラスト基準で社内システムと繋がり文脈を理解\nQueryPieが誇る厳格なアクセス制御",
        stat: "社内連携 / アクセス制御",
      },
      {
        title: "業務知識 / Knowledge",
        body:
          "手順書を記憶しハルシネーションを抑える\n自社の信頼できるデータを参照",
        stat: "業務再現 / 事実参照",
      },
      {
        title: "統制 / Governance",
        body:
          "エンタープライズ水準の監査ログ\nシャドーAIや情報漏洩リスクを低減",
        stat: "監査ログ / 人の承認",
      },
    ],
  },
  roles: {
    eyebrow: "Use Cases",
    title: "まずは、貴社で最も負荷の高い業務から",
    body:
      "改善インパクトの大きい業務を起点に、業務フローや運用ルールに合わせて設計します。まずは、効果が見えやすい領域から小さく始められます。以下は、実際にご相談の多い業務例です。",
    note:
      "他にも、データ分析、開発、製造、審査、見積、SEO分析など、貴社の業務に合わせた活用例をご覧いただけます。",
    primaryCta: { label: "すべての活用事例を見る", href: demoUseCasesUrl },
    secondaryCta: { label: "業務に合うAI活用を相談する", href: aiCrewConsultUrl },
    cards: [
      {
        category: "マーケティング",
        title: "SEO分析",
        body:
          "サイト分析、改善ポイント整理、ダッシュボード化までを短時間で支援。SEOの現状把握と次の打ち手を見えやすくします。",
        videoHref: "https://youtu.be/K-ld_s4Che0",
        detailHref: "https://www.querypie.com/ja/features/demo/use-cases/29/seo-analyst",
      },
      {
        category: "見積・営業",
        title: "見積業務",
        body:
          "見積関連文書の確認から、複雑な見積ロジックに基づく出力までを支援。属人化しやすい見積業務を効率化します。",
        tabs: [
          {
            label: "見積分析",
            body:
              "ローカルファイルやパスワード付きPDFをアップロードせずに分析し、確認や比較の手間を減らします。",
            videoHref: "https://youtu.be/qwvyVcTaDsA",
            detailHref: "https://www.querypie.com/ja/features/demo/use-cases/28/quotation-analyze-ai-agent",
          },
          {
            label: "見積書作成",
            body:
              "複雑な価格表や条件をスキル化し、指定フォーマットで正確な見積書を出力します。",
            videoHref: "https://youtu.be/mKZrCQti0Rc",
            detailHref: "https://www.querypie.com/ja/features/demo/use-cases/27/quotation-ai-agent",
          },
        ],
      },
      {
        category: "開発",
        title: "開発インサイト",
        body:
          "Git、PR、チケット、CI/CD、インシデントを横断し、開発状況とリスクを会話型で可視化。開発チームの意思決定を支援します。",
        videoHref: "https://youtu.be/cWC5lzN1JnE",
        detailHref: "https://www.querypie.com/ja/features/demo/use-cases/16/dev-insight-ai-agent",
      },
      {
        category: "分析・経営",
        title: "データ分析",
        body:
          "自然言語での質問から、データ抽出、可視化、インサイト整理までを支援。アドホックな分析依頼やレポート作成の負荷を下げます。",
        videoHref: "https://youtu.be/f_yM6dinVU4",
        detailHref: "https://www.querypie.com/ja/features/demo/use-cases/7/data-analytics-agent",
      },
    ],
  },
  system: {
    eyebrow: "運用設計",
    title: "AI Crewは、\n安全に実務へつなげて動かします。",
    body:
      "AI Crewは、LLM、社内ドキュメント、SaaS連携、ルール設定を組み合わせながら動きます。だからこそ、ただ会話するだけでなく、実務に必要な情報、権限、承認条件を持った状態で運用できます。",
    inputs: ["Notion", "Slack", "CRM", "Docs", "BI", "Ticketing"],
    guardrails: ["権限範囲の設定", "承認条件の維持", "役割別ルールの分離"],
    flow: [
      "必要な業務コンテキストを読み取り、情報を集めます",
      "草案・整理・分析などの途中工程を先に進めます",
      "レビューと承認を経て、実務成果につなげます",
    ],
  },
  footer: {
    brand: {
      name: "QueryPie AI",
      tagline:
        "人員追加の前に、業務に合うAI Crewを。AI Crewは、止まりやすい仕事の流れをつなぎ直し、既存チームが仕事を前へ進められるよう支える役割型のAIエージェントです。",
    },
    groups: [
      {
        title: "AI Crew",
        links: [
          { label: "AI Crewとは", href: "#about" },
          { label: "ユースケース", href: demoUseCasesUrl },
          { label: "導入効果", href: "#impact" },
        ],
      },
      {
        title: "導入検討",
        links: [
          { label: "活用できるユースケースを見る", href: demoUseCasesUrl },
          { label: "進め方を相談する", href: aiCrewConsultUrl },
        ],
      },
      {
        title: "参考情報",
        links: [
          { label: "なぜ今なのか", href: "#why" },
          { label: "お問い合わせ", href: aiCrewConsultUrl },
        ],
      },
    ],
    legal: {
      copyright: "© 2017-2026 QueryPie AI. All rights reserved.",
      notes: ["QueryPie AI"],
    },
  },
} as const;
