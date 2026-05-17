import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { PlansProduct } from "@/components/sections/plans/section";
import PlansAIPPage from "./aip/page";

export const metadata: Metadata = {
  title: "プラン | QueryPie AI",
  description: "あなたのチームに最適なプランを見つけよう。14日間の無料トライアルで今すぐ始められます。",
  alternates: {
    canonical: "/plans",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "プラン | QueryPie AI",
    description: "あなたのチームに最適なプランを見つけよう。14日間の無料トライアルで今すぐ始められます。",
    type: "website",
  },
  twitter: {
    title: "プラン | QueryPie AI",
    description: "あなたのチームに最適なプランを見つけよう。14日間の無料トライアルで今すぐ始められます。",
    card: "summary_large_image",
  },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getLegacyProductQueryRedirect(searchParams: Record<string, string | string[] | undefined>) {
  const product: PlansProduct | null = "acp" in searchParams ? "acp" : "aip" in searchParams ? "aip" : null;

  if (!product) {
    return null;
  }

  const nextSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "acp" || key === "aip" || value === undefined) {
      continue;
    }

    const values = Array.isArray(value) ? value : [value];

    for (const item of values) {
      nextSearchParams.append(key, item);
    }
  }

  const remainingQuery = nextSearchParams.toString();

  return `/plans/${product}${remainingQuery ? `?${remainingQuery}` : ""}`;
}

export default async function PlansPage({ searchParams }: PageProps) {
  const redirectTarget = getLegacyProductQueryRedirect(await searchParams);

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  return <PlansAIPPage />;
}
