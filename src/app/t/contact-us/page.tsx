import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ContactUsForm } from "@/components/sections/contact-us-form";
import { getPrefilledContactUsFormState } from "@/lib/contact-us";

export const metadata: Metadata = {
  title: "Contact Us | QueryPie AI Japan",
  description:
    "Local contact-us form route for QueryPie AI Japan, currently served under /t/contact-us while the public /contact-us endpoint remains a redirect.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/t/contact-us",
  },
};

type ContactUsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContactUsPage({
  searchParams,
}: ContactUsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const urlSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => urlSearchParams.append(key, item));
      continue;
    }

    if (typeof value === "string") {
      urlSearchParams.set(key, value);
    }
  }

  const initialPrefills = getPrefilledContactUsFormState(urlSearchParams);

  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <ContactUsForm initialPrefills={initialPrefills} />
      <SiteFooter />
    </main>
  );
}
