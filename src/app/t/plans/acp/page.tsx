import type { Metadata } from "next";
import { PlansPageContent } from "../plans-page-content";

const description = "あなたのチームに最適なプランを見つけよう。14日間の無料トライアルで今すぐ始められます。";

export const metadata: Metadata = {
  title: "QueryPie ACP プラン | QueryPie AI",
  description,
  alternates: {
    canonical: "/t/plans/acp",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "QueryPie ACP プラン | QueryPie AI",
    description,
    type: "website",
  },
  twitter: {
    title: "QueryPie ACP プラン | QueryPie AI",
    description,
    card: "summary_large_image",
  },
};

export default function PlansACPPage() {
  return <PlansPageContent activeProduct="acp" />;
}
