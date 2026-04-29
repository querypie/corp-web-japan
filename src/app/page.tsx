import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { SiteHeader } from "@/components/layout/site-header";
import { TopPageSections } from "@/components/sections/top-page-sections";
import { topPageFloatingCtaUrl, topPageMetadata } from "@/content/top-page";

export const metadata: Metadata = {
  title: topPageMetadata.title,
  description: topPageMetadata.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: topPageMetadata.title,
    description: topPageMetadata.description,
    type: "website",
  },
  twitter: {
    title: topPageMetadata.title,
    description: topPageMetadata.description,
    card: "summary_large_image",
  },
};

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href={topPageFloatingCtaUrl} />
      <TopPageSections />
      <SiteFooter />
    </main>
  );
}
