import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { SiteHeader } from "@/components/layout/site-header";
import { TopPageSections } from "@/components/sections/top-page-sections";
import { topPageContent } from "@/content/top-page";

export const metadata: Metadata = {
  title: topPageContent.metadata.title,
  description: topPageContent.metadata.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: topPageContent.metadata.title,
    description: topPageContent.metadata.description,
    type: "website",
  },
  twitter: {
    title: topPageContent.metadata.title,
    description: topPageContent.metadata.description,
    card: "summary_large_image",
  },
};

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href="#contact" />
      <TopPageSections />
      <SiteFooter />
    </main>
  );
}
