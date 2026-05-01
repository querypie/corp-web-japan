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