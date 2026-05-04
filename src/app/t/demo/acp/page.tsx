import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/sections/resource-list-page";
import { listAcpDemoPublicationItems } from "@/lib/publications/acp-demo-publication-records";

export const metadata: Metadata = {
  title: "ACP機能 | QueryPie AI",
  description: "QueryPie ACP機能デモをまとめたプレビュー一覧です。",
  alternates: {
    canonical: "/t/demo/acp",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TestAcpDemoPage() {
  const acpDemoItems = await listAcpDemoPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourceListPage
        title="ACP機能"
        description="QueryPie ACPの主要機能デモを一覧で確認できるプレビューページです。各デモから詳細なMDXコンテンツを確認できます。"
        activeCategory="acp-demo"
        items={acpDemoItems}
      />
      <SiteFooter />
    </main>
  );
}
