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