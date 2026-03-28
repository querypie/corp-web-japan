import type { Metadata } from "next";
import Link from "next/link";
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
      <Link
        href={homePageContent.floatingCta.href}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center rounded-full bg-[#ED602E] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_-24px_rgba(237,96,46,0.65)] transition hover:bg-[#d45527] sm:bottom-6 sm:right-6 sm:px-6 sm:text-base"
      >
        {homePageContent.floatingCta.label}
      </Link>
      <SiteFooter />
    </main>
  );
}
