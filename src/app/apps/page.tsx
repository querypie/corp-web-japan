import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
} from "@/components/sections/resource-list-section";

export const metadata: Metadata = {
  title: "アプリ | QueryPie AI",
  description: "QueryPie AIが提供する業務アプリをご紹介します。",
  alternates: {
    canonical: "/apps",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const apps = [
  {
    name: "Lingo",
    category: "会議記録・リアルタイム翻訳AI",
    description:
      "会議の文字起こし、リアルタイム翻訳、要約を一つに。多言語での会話と、その後の業務をスムーズにつなげます。",
    href: "https://lingo.querypie.ai/ja",
    iconSrc: "https://www.querypie.com/assets/pages/home/features/icon-lingo.png",
  },
] as const;

export default function AppsPage() {
  return (
    <main {...componentNameDebugProps("AppsPage")} className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>アプリ</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          QueryPie AIのアプリは、日々の業務にAIを自然に取り入れるためのプロダクトです。
          <br />
          用途に合ったアプリを選び、すぐにご利用いただけます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <section className="mx-auto w-full max-w-[1200px]">
          <ul className="grid gap-5 md:grid-cols-2">
            {apps.map((app) => (
              <li key={app.name}>
                <a
                  href={app.href}
                  className="group flex h-full flex-col rounded-2xl border border-[#d9d9d9] bg-[linear-gradient(135deg,#e9e2ff_0%,#dff2ff_54%,#f4e8f2_100%)] p-7 transition hover:border-slate-950 hover:brightness-[0.98]"
                >
                  <Image
                    src={app.iconSrc}
                    alt=""
                    width={128}
                    height={128}
                    unoptimized
                    className="h-16 w-16 rounded-[14px]"
                  />
                  <p className="mt-6 text-sm font-medium text-slate-500">{app.category}</p>
                  <h3 className="mt-3 text-3xl font-medium tracking-[-0.02em] text-slate-950">{app.name}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">{app.description}</p>
                  <span className="mt-8 text-sm font-medium text-slate-950">{app.name}を見る →</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
