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
