import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/sections/resource-list-page";
import { listDocumentationPublicationItems } from "@/lib/documentation-publications";

const manualExternalItems = [
  {
    href: "https://aip-docs.app.querypie.com/ja/user-guide",
    imageSrc: "/documentation/docu-thumb-aip-manual.png",
    badge: "マニュアル",
    title: "QueryPie AIP マニュアル",
    description: "AIP のユーザーガイドを外部ドキュメントサイトで確認できます。",
  },
  {
    href: "https://docs.querypie.com/ja",
    imageSrc: "/documentation/docu-thumb-acp-manual.png",
    badge: "マニュアル",
    title: "QueryPie ACP マニュアル",
    description: "ACP の管理者・利用者向けドキュメントを外部ドキュメントサイトで確認できます。",
  },
  {
    href: "/api-docs.html",
    imageSrc: "/documentation/docu-thumb-api.png",
    badge: "マニュアル",
    title: "API Docs",
    description: "API リファレンスと関連開発資料への入口です。",
  },
] as const;

export const metadata: Metadata = {
  title: "マニュアル | QueryPie AI",
  description: "Community Edition インストールガイドと外部マニュアル導線をまとめた preview 一覧です。",
  alternates: {
    canonical: "/t/manuals",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewManualsPage() {
  const items = [...listDocumentationPublicationItems("manuals"), ...manualExternalItems];

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourceListPage
        title="マニュアル"
        description="corp-web-contents の manual source を local MDX detail route として移設し、既存の外部マニュアル導線も合わせて確認できる preview 一覧です。"
        activeCategory="manuals"
        items={items}
        sidebarBasePath="/t"
      />
      <SiteFooter />
    </main>
  );
}
