import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  previewResourceCategorySidebarLinks,
  ResourceCategorySidebar,
} from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
} from "@/components/sections/resource-list-section";
import { listIntroductionDeckPublicationItems } from "@/lib/resources/introduction-deck-publications";

export const metadata: Metadata = {
  title: "紹介資料 | QueryPie AI",
  description: "AIP / ACP の製品紹介資料カテゴリを local MDX loader で確認できる preview 一覧です。",
  alternates: {
    canonical: "/t/introduction-deck",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewIntroductionDeckPage() {
  const items = listIntroductionDeckPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>紹介資料</ResourceListHeroTitle>
        <ResourceListHeroDescription>corp-web-contents の introduction-deck source を local MDX detail route として移設した preview 一覧です。</ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar links={previewResourceCategorySidebarLinks} activeLabel="紹介資料" />

        <ResourceListItems items={items} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
