import type { Metadata } from "next";
import { homePageContent } from "@/content/home";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { HomePageSections } from "@/components/sections/home-page-sections";
import { CONTACT_INQUIRY_URL } from "@/lib/contact";

export const metadata: Metadata = {
  title: `${homePageContent.metadata.title} | AI Crew | QueryPie AI`,
  description: homePageContent.metadata.description,
  openGraph: {
    title: `${homePageContent.metadata.title} | AI Crew | QueryPie AI`,
    description: homePageContent.metadata.description,
    type: "website",
  },
  twitter: {
    title: `${homePageContent.metadata.title} | AI Crew | QueryPie AI`,
    description: homePageContent.metadata.description,
    card: "summary_large_image",
  },
};

export default function AICrewPage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href={CONTACT_INQUIRY_URL} />
      <HomePageSections />
      <SiteFooter />
    </main>
  );
}
