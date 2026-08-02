import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { ResourceListLoadMore } from "@/components/sections/resource-list-load-more";
import { ResourceCategorySidebar } from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
} from "@/components/sections/resource-list-section";
import { listWhitepaperPublicationItems } from "@/lib/publications/whitepapers/records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "ホワイトペーパー | QueryPie AI",
  description: "AI導入・活用、ガバナンス、業務変革に関する実践的な知見をまとめたホワイトペーパー一覧です。",
  alternates: {
    canonical: "/whitepapers",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type WhitepaperPageProps = {
  searchParams?: Promise<{
    until?: string | string[];
  }>;
};

export default async function WhitepaperPage({ searchParams }: WhitepaperPageProps) {
  const [whitepaperItems, resolvedSearchParams] = await Promise.all([listWhitepaperPublicationItems(), searchParams]);
  const initialVisibleCount = resolveResourceListVisibleCount(whitepaperItems, resolvedSearchParams?.until);

  return (
    <main {...componentNameDebugProps("WhitepapersPage")} className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection className="text-left lg:pl-[300px]">
        <ResourceListHeroTitle className="!mx-0 max-w-[760px]">ホワイトペーパー</ResourceListHeroTitle>
        <ResourceListHeroDescription className="!mx-0 max-w-[728px] text-left text-[16px] leading-[26px] lg:text-[16px] lg:leading-[26px]">
          AI導入・活用、ガバナンス、業務変革に関する実践的な知見を、ダウンロード資料として公開しています。
          検討の論点整理から社内提案まで、AI活用を前に進めるためにご活用ください。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar activeLabel="ホワイトペーパー" />

        <ResourceListLoadMore
          key={`whitepaper:${initialVisibleCount}`}
          items={whitepaperItems}
          initialVisibleCount={initialVisibleCount}
        />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
