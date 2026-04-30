export const topPageFloatingCtaUrl = "/contact-us";
export const topPageHeroContactUrl = "/contact-us?inquiry=ai-consulting";
export const topPageDownloadUrl =
  "https://www.querypie.com/ja/features/documentation/aip-introduction-download";
export const topPageFinalDemoUrl = "/contact-us?inquiry=demo-request";
export const topPageFinalConsultUrl = "/contact-us?inquiry=ai-consulting";

export const topPageMetadata = {
    title: "信頼できるAIが、現場を動かす｜QueryPie AI",
    description:
      "QueryPie AIは、社内業務効率化と自社サービスAI化を支援するエンタープライズAI基盤です。安全性と運用性を前提に、AI活用をスモールスタートから実運用・定着まで前に進めます。",
  } as const;

export const topPageHeader = {
    navItems: [
      { label: "ニュース", href: "#news" },
      {
        label: "ソリューション",
        children: [
          { label: "社内業務効率化｜AI Crew", href: "/solutions/ai-crew" },
          { label: "自社サービスAI化｜AI Dashi", href: "/solutions/ai-dashi" },
        ],
      },
      { label: "活用事例", href: "#use-cases" },
      { label: "サポート", href: "#security" },
      { label: "QueryPie AIについて", href: "#about" },
    ],
    cta: { label: "Free Flow", href: "#contact" },
  } as const;
export const topPageWhitepapers = {
    title: "経営層・事業責任者向け ホワイトペーパー",
    body:
      "AI活用の戦略策定や、自社サービスのAI化に向けたインサイトをまとめた資料を無料でダウンロードいただけます。",
    items: [
      {
        title: "なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか",
        tags: ["経営層向け", "組織変革", "社内AI活用"],
        description:
          "本ホワイトペーパーは事業責任者向けに、技術詳細やトレンド紹介ではなく、世界と日本のAI活用の温度差と日本企業の課題を踏まえ、今すぐ経営に組み込むための実務的プロセスと全社最適の変革指針を示す内容です。",
        toc: [
          "はじめに",
          "第1章 世界で進む「AI活用を前提にした経営」",
          "第2章 日本企業が直面する課題",
          "第3章 AIトランスフォーメーションを導入するために",
          "第4章 「なぜ今」取り組むべきなのか",
          "第5章 まとめ ― AIを「導入する」から「経営に組み込む」へ",
          "付録：AI導入準備度チェックリスト",
          "参考サイト",
        ],
        ctaLabel: "無料ダウンロード",
        href: "https://www.querypie.com/ja/features/documentation/white-paper/24/ai-transformation-japan",
        image: {
          src: "/whitepapers/24/thumbnail.png",
          alt: "なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか ホワイトペーパー表紙",
        },
      },
      {
        title: "SaaSの終焉か、進化か 〜AIエージェント時代にSaaS企業が取るべき戦略〜",
        tags: ["プロダクト責任者向け", "SaaS戦略", "組み込みAI"],
        description:
          "本ホワイトペーパーは、AIエージェントがSaaSビジネスに与える影響を分析し、SaaS企業が取るべき戦略と、QueryPie AI自身のSaaSベンダーからAI Native企業への変革の実録をお伝えします。",
        toc: [
          "SaaSの成功とその終わりの兆し",
          "AIエージェントとは何か（SaaSにおけるユーザー側の動作）",
          "UI中心の業務は消える",
          "アプリケーションという概念の崩壊",
          "AIエージェント時代の働き方と組織",
          "AIエージェント時代に何から始めればいいのか？",
          "QueryPie AIの変革 ― 自らの「SaaSの死」を乗り越えた実録",
          "まとめ",
        ],
        ctaLabel: "無料ダウンロード",
        href: "https://www.querypie.com/ja/features/documentation/white-paper/30/saas-end-or-evolution",
        image: {
          src: "/solutions/ai-dashi/the-end-of-saas-or-its-evolution.png",
          alt: "SaaSの終焉か、進化か ホワイトペーパー表紙",
        },
      },
    ],
  } as const;
export const topPageFinalCta = {
    title: "信頼できるAI活用を、ここから前へ。",
    body: {
      line1: "大切なのは、安心して始められ、現場で使われ、定着し、広げられること。",
      line2:
        "どこからAI活用を始めるべきか、何を優先して整えるべきかなど、まずはお気軽にご相談ください。",
    },
    actions: [
      { label: "デモを依頼", href: topPageFinalDemoUrl },
      { label: "資料をダウンロード", href: topPageDownloadUrl },
      { label: "導入について相談する", href: topPageFinalConsultUrl },
    ],
  } as const;
