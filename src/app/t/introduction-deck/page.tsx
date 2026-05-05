import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
  ResourceListSidebar,
  ResourceListSidebarItem,
  ResourceListSidebarLabel,
  ResourceListSidebarLink,
  ResourceListSidebarList,
  ResourceListSidebarNav,
  ResourceListSidebarViewport,
  type ResourceCategoryLink,
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

const sidebarLinks: readonly ResourceCategoryLink[] = [
  { label: "全て", href: "/t/resources" },
  { label: "紹介資料", href: "/t/introduction-deck" },
  { label: "用語集", href: "/t/glossary" },
  { label: "マニュアル", href: "/t/manuals" },
  { label: "ホワイトペーパー", href: "/t/whitepapers" },
  { label: "ブログ", href: "/t/blog" },
] as const;

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
        <ResourceListSidebar>
          <ResourceListSidebarLabel>カテゴリー</ResourceListSidebarLabel>
          <ResourceListSidebarViewport>
            <ResourceListSidebarNav label="Sidebar Navigation">
              <ResourceListSidebarList>
                {sidebarLinks.map((link) => (
                  <ResourceListSidebarItem key={link.label}>
                    <ResourceListSidebarLink href={link.href} active={link.label === "紹介資料"} label={link.label}>
                      {link.label}
                    </ResourceListSidebarLink>
                  </ResourceListSidebarItem>
                ))}
              </ResourceListSidebarList>
            </ResourceListSidebarNav>
          </ResourceListSidebarViewport>
        </ResourceListSidebar>

        <ResourceListItems items={items} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
