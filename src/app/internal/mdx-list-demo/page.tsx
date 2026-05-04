import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  ResourceListContentSection,
  ResourceListCtaActions,
  ResourceListCtaBox,
  ResourceListCtaButton,
  ResourceListCtaDescription,
  ResourceListCtaSection,
  ResourceListCtaTitle,
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
  type ResourceCategoryLink,
} from "@/components/sections/resource-list-section";
import { listBlogPublicationItems } from "@/lib/publications/blog-publication-records";

export const metadata: Metadata = {
  title: "Internal MDX List UX Demo | QueryPie AI",
  robots: {
    index: false,
    follow: false,
  },
};

const sidebarLinks: readonly ResourceCategoryLink[] = [
  { label: "全て", href: "/resources" },
  { label: "紹介資料", href: "/introduction-deck" },
  { label: "用語集", href: "/glossary" },
  { label: "マニュアル", href: "/manuals" },
  { label: "ホワイトペーパー", href: "/whitepapers" },
  { label: "ブログ", href: "/blog", active: true },
] as const;

export default async function InternalMdxListDemoPage() {
  const blogItems = await listBlogPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>MDX 컨텐츠의 List 화면 예시</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          MDX 기반 컨텐츠의 공통 List UX 예시입니다. 좌측 Sidebar 링크 구성, 카드형 목록 레이아웃, 하단 CTA 박스까지
          route file 에서 직접 authoring 하는 패턴을 보여줍니다.
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceListSidebar>
          <ResourceListSidebarLabel>カテゴリー</ResourceListSidebarLabel>
          <ResourceListSidebarNav>
            <ResourceListSidebarList>
              {sidebarLinks.map((link) => (
                <ResourceListSidebarItem key={link.label}>
                  <ResourceListSidebarLink href={link.href} active={link.active} label={link.label}>
                    {link.label}
                  </ResourceListSidebarLink>
                </ResourceListSidebarItem>
              ))}
            </ResourceListSidebarList>
          </ResourceListSidebarNav>
        </ResourceListSidebar>

        <ResourceListItems items={blogItems} />
      </ResourceListContentSection>

      <ResourceListCtaSection>
        <ResourceListCtaBox>
          <ResourceListCtaTitle>같은 UX를 다른 MDX 카테고리에도 확장할 수 있습니다.</ResourceListCtaTitle>
          <ResourceListCtaDescription>
            이 internal 데모는 blog 목록 데이터를 예시로 사용하지만, 같은 Sidebar / 카드 리스트 / CTA 조합을
            whitepaper, event, use-case, demo 계열의 MDX 목록 화면에도 그대로 적용할 수 있습니다.
          </ResourceListCtaDescription>
          <ResourceListCtaActions>
            <ResourceListCtaButton href="/blog">Blog 목록 보기</ResourceListCtaButton>
            <ResourceListCtaButton href="/whitepapers" variant="secondary">
              Whitepaper 목록 보기
            </ResourceListCtaButton>
          </ResourceListCtaActions>
        </ResourceListCtaBox>
      </ResourceListCtaSection>

      <SiteFooter />
    </main>
  );
}
