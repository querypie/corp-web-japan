import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlansPageContent, type PlansProduct } from "../plans-page-content";

const plansProducts = ["aip", "acp"] as const satisfies readonly PlansProduct[];

const productLabels: Record<PlansProduct, string> = {
  aip: "QueryPie AIP",
  acp: "QueryPie ACP",
};

type PageProps = {
  params: Promise<{
    product: string;
  }>;
};

function isPlansProduct(product: string): product is PlansProduct {
  return plansProducts.includes(product as PlansProduct);
}

export function generateStaticParams() {
  return plansProducts.map((product) => ({ product }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { product } = await params;

  if (!isPlansProduct(product)) {
    return {};
  }

  const title = `${productLabels[product]} プラン | QueryPie AI`;
  const description = "あなたのチームに最適なプランを見つけよう。14日間の無料トライアルで今すぐ始められます。";

  return {
    title,
    description,
    alternates: {
      canonical: `/t/plans/${product}`,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
    },
  };
}

export default async function PlansProductPage({ params }: PageProps) {
  const { product } = await params;

  if (!isPlansProduct(product)) {
    notFound();
  }

  return <PlansPageContent activeProduct={product} />;
}
