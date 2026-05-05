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
import { listGlossaryPublicationItems } from "@/lib/resources/glossary-publications";

export const metadata: Metadata = {
  title: "用語集 | QueryPie AI",
  description: "QueryPie AI の主要セキュリティ・AI用語を local MDX detail route で確認できる preview 一覧です。",
  alternates: {
    canonical: "/t/glossary",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewGlossaryPage() {
  const items = listGlossaryPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>用語集</ResourceListHeroTitle>
        <ResourceListHeroDescription>corp-web-contents の glossary-items source を local MDX detail route として移設した preview 一覧です。</ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar links={previewResourceCategorySidebarLinks} activeLabel="用語集" />

        <ResourceListItems items={items} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
