import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/ResourceListPage";
import { querypieJapanWhitepaperItems } from "@/content/publications/querypie-ja-whitepaper-links";

export const metadata: Metadata = {
  title: "ホワイトペーパー | QueryPie AI",
  description: "AI Staff に関する資料や導入検討向けホワイトペーパーをまとめたページです。",
  alternates: {
    canonical: "/whitepapers",
  },
};

export default function WhitepaperPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourceListPage
        title="ホワイトペーパー"
        description="包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。"
        activeCategory="whitepaper"
        items={querypieJapanWhitepaperItems}
      />
      <SiteFooter />
    </main>
  );
}
