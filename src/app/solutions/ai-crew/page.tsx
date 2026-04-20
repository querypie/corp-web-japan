import type { Metadata } from "next";
import { homePageContent } from "@/content/home";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { HomePageSections } from "@/components/sections/home-page-sections";

export const metadata: Metadata = {
  title: `${homePageContent.metadata.title} | AI Crew`,
  description: homePageContent.metadata.description,
};

export default function AICrewPage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href="#contact" />
      <HomePageSections />
      <SiteFooter />
    </main>
  );
}
