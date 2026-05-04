import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/sections/resource-list-page";
import { listAipDemoPublicationItems } from "@/lib/publications/aip-demo-publication-records";

export const metadata: Metadata = {
  title: "AIP機能 | QueryPie AI",
  description: "QueryPie AIP機能デモをまとめたプレビュー一覧です。",
  alternates: {
    canonical: "/t/demo/aip",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TestAipDemoPage() {
  const aipDemoItems = await listAipDemoPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourceListPage
        title="AIP機能"
        description="QueryPie AIPの主要機能デモを一覧で確認できるプレビューページです。各デモから詳細なMDXコンテンツを確認できます。"
        activeCategory="aip-demo"
        items={aipDemoItems}
      />
      <SiteFooter />
    </main>
  );
}
