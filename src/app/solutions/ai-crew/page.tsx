import type { Metadata } from "next";
import { homePageContent } from "@/content/home";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { HomePageSections } from "@/components/sections/home-page-sections";

export const metadata: Metadata = {
  title: "作業を減らし、成果を増やす。| AI Crew | QueryPie AI",
  description: homePageContent.metadata.description,
  alternates: {
    canonical: "/solutions/ai-crew",
  },
  openGraph: {
    title: "作業を減らし、成果を増やす。| AI Crew | QueryPie AI",
    description: homePageContent.metadata.description,
    type: "website",
  },
  twitter: {
    title: "作業を減らし、成果を増やす。| AI Crew | QueryPie AI",
    description: homePageContent.metadata.description,
    card: "summary_large_image",
  },
};

export default function AICrewPage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href="/contact-us" />
      <HomePageSections />
      <SiteFooter />
    </main>
  );
}
