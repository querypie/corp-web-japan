import type { Metadata } from "next";
import { homePageContent } from "@/content/home";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HomePageSections } from "@/components/sections/home-page-sections";

export const metadata: Metadata = {
  title: `${homePageContent.metadata.title} | AI Staff`,
  description: homePageContent.metadata.description,
};

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <HomePageSections />
      <SiteFooter />
    </main>
  );
}
