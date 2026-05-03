import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/sections/resource-list-page";
import { listUseCasePublicationItems } from "@/content/publications/use-case-publication-records";

export const metadata: Metadata = {
  title: "活用事例 | QueryPie AI",
  description: "QueryPie AIの活用事例やAIエージェントデモをまとめたプレビュー一覧です。",
  alternates: {
    canonical: "/t/use-cases",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TestUseCasesPage() {
  const useCaseItems = await listUseCasePublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourceListPage
        title="活用事例"
        description="QueryPie AIの活用事例やAIエージェントデモを一覧で確認できるプレビューページです。各事例から詳細なMDXコンテンツを確認できます。"
        activeCategory="use-cases"
        items={useCaseItems}
      />
      <SiteFooter />
    </main>
  );
}
