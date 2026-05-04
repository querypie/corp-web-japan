import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/sections/resource-list-page";
import { listDocumentationPublicationItems } from "@/lib/documentation-publications";

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
  const items = listDocumentationPublicationItems("glossary");

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourceListPage
        title="用語集"
        description="corp-web-contents の glossary-items source を local MDX detail route として移設した preview 一覧です。"
        activeCategory="glossary"
        items={items}
        sidebarBasePath="/t"
      />
      <SiteFooter />
    </main>
  );
}
