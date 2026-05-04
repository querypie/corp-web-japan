import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/sections/resource-list-page";
import { listManualPreviewItems } from "@/lib/resources/resource-preview-items";

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
  const items = listManualPreviewItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourceListPage
        title="マニュアル"
        description="corp-web-contents の manual source を local MDX detail route として移設し、既存の外部マニュアル導線도合わせて確認できる preview 一覧です。"
        activeCategory="manuals"
        items={items}
        sidebarBasePath="/t"
      />
      <SiteFooter />
    </main>
  );
}
