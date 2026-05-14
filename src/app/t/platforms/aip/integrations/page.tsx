import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AipIntegrationsCategoryLink,
  AipIntegrationsCategoryList,
  AipIntegrationsContent,
  AipIntegrationsHeroCopy,
  AipIntegrationsHeroHeading,
  AipIntegrationsHeroLead,
  AipIntegrationsHeroSection,
  AipIntegrationsProductCard,
  AipIntegrationsProductList,
} from "@/components/sections/aip/integrations-page";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";

export const metadata: Metadata = {
  title: "QueryPie AI: インテグレーション",
  description:
    "MCPサーバーを介して業務ツールへ接続し、ワークフローを自動化する QueryPie AIP インテグレーションページ。",
  alternates: {
    canonical: "/t/platforms/aip/integrations",
  },
  robots: {
    index: false,
    follow: false,
  },
};

type IntegrationsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type IntegrationCategory = {
  key: string;
  label: string;
};

type IntegrationProduct = {
  categoryKeys: readonly string[];
  label: string;
  svgFilename: string;
};

const categories: readonly IntegrationCategory[] = [
  { key: "0", label: "ワークフロー自動化" },
  { key: "1", label: "コミュニケーション & コラボレーション" },
  { key: "2", label: "顧客関係管理" },
  { key: "3", label: "Googleサービス" },
  { key: "4", label: "Microsoftサービス" },
  { key: "5", label: "プロジェクト管理" },
  { key: "6", label: "開発 & DevOps" },
  { key: "7", label: "データベース接続" },
  { key: "8", label: "検索 & ナビゲーション" },
  { key: "9", label: "ローカル統合" },
] as const;

const products: readonly IntegrationProduct[] = [
  { categoryKeys: ["7"], label: "AirTable", svgFilename: "airtable" },
  { categoryKeys: ["6"], label: "AWS", svgFilename: "aws-icon" },
  { categoryKeys: ["8"], label: "Brave Search", svgFilename: "brave-search" },
  { categoryKeys: ["7"], label: "ClickHouse", svgFilename: "clickhouse" },
  { categoryKeys: ["6"], label: "Code Executor", svgFilename: "querypie" },
  { categoryKeys: ["5"], label: "Confluence Cloud", svgFilename: "confluence" },
  { categoryKeys: ["6"], label: "Context7", svgFilename: "context7" },
  { categoryKeys: ["6"], label: "Datadog", svgFilename: "datadog" },
  { categoryKeys: ["8"], label: "Daum Search", svgFilename: "daum-search" },
  { categoryKeys: ["0"], label: "Dify API Access", svgFilename: "dify" },
  { categoryKeys: ["1"], label: "Discord", svgFilename: "discord" },
  { categoryKeys: ["1"], label: "Discord with OAuth", svgFilename: "discord" },
  { categoryKeys: ["6", "9"], label: "Filesystem", svgFilename: "mcp" },
  { categoryKeys: ["1"], label: "GitHub", svgFilename: "github" },
  { categoryKeys: ["3"], label: "Google Calendar", svgFilename: "google-calendar" },
  { categoryKeys: ["3"], label: "Google Drive", svgFilename: "google-drive" },
  { categoryKeys: ["3"], label: "Google Gmail", svgFilename: "google-gmail" },
  { categoryKeys: ["3"], label: "Google Sheets", svgFilename: "google-sheets" },
  { categoryKeys: ["3"], label: "Google Slides", svgFilename: "google-slides" },
  { categoryKeys: ["6"], label: "Grafana", svgFilename: "grafana" },
  { categoryKeys: ["5"], label: "Jira Cloud", svgFilename: "jira" },
  { categoryKeys: ["8"], label: "Kakao Map", svgFilename: "kakao" },
  { categoryKeys: ["8"], label: "Kakao Navigation", svgFilename: "kakao" },
  { categoryKeys: ["6"], label: "Kubernetes", svgFilename: "kubernetes-icon" },
  { categoryKeys: ["7"], label: "MariaDB", svgFilename: "maria-db-icon" },
  { categoryKeys: ["4"], label: "Microsoft 365", svgFilename: "microsoft-365" },
  { categoryKeys: ["7"], label: "MySQL", svgFilename: "mysql-icon" },
  { categoryKeys: ["0"], label: "n8n Chat", svgFilename: "n8n-chat" },
  { categoryKeys: ["0"], label: "n8n Webhook", svgFilename: "n8n-webhook" },
  { categoryKeys: ["8"], label: "Naver Search", svgFilename: "naver-search" },
  { categoryKeys: ["1"], label: "Notion", svgFilename: "notion" },
  { categoryKeys: ["7"], label: "Oracle Database", svgFilename: "oracle-icon" },
  { categoryKeys: ["8"], label: "Perplexity Ask", svgFilename: "perplexity-ask" },
  { categoryKeys: ["7"], label: "PostgreSQL", svgFilename: "postgresql-icon" },
  { categoryKeys: ["6"], label: "QueryPie Customer Center", svgFilename: "querypie" },
  { categoryKeys: ["7"], label: "Redis", svgFilename: "redis-icon" },
  { categoryKeys: ["2"], label: "Salesforce", svgFilename: "salesforce" },
  { categoryKeys: ["2"], label: "Salesforce with OAuth", svgFilename: "salesforce" },
  { categoryKeys: ["0"], label: "Sequential Thinking", svgFilename: "querypie" },
  { categoryKeys: ["1"], label: "Slack", svgFilename: "slack-icon" },
  { categoryKeys: ["7"], label: "Snowflake", svgFilename: "snowflake-icon" },
  { categoryKeys: ["7"], label: "SQL Server", svgFilename: "sql-server-icon" },
  { categoryKeys: ["6"], label: "SSH", svgFilename: "ssh" },
  { categoryKeys: ["6", "7"], label: "Supabase", svgFilename: "supabase" },
  { categoryKeys: ["6", "9"], label: "Terminal", svgFilename: "ssh" },
] as const;

function readCurrentCategory(searchParams: Record<string, string | string[] | undefined> | undefined) {
  const raw = searchParams?.category;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && (value === "all" || categories.some((category) => category.key === value)) ? value : "all";
}

function getCategoryCount(categoryKey: string) {
  return products.filter((product) => product.categoryKeys.includes(categoryKey)).length;
}

export default async function AipIntegrationsPage({ searchParams }: IntegrationsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const currentCategory = readCurrentCategory(resolvedSearchParams);
  const filteredProducts = products
    .filter((product) => currentCategory === "all" || product.categoryKeys.includes(currentCategory))
    .sort((left, right) => left.label.localeCompare(right.label));

  return (
    <main className="bg-white text-slate-950">
      <SiteHeader />

      <AipIntegrationsHeroSection>
        <AipIntegrationsHeroCopy>
          <AipIntegrationsHeroHeading>AIPインテグレーション</AipIntegrationsHeroHeading>
          <AipIntegrationsHeroLead>
            MCPサーバーを介してお使いのビジネスツールに接続。システム、アプリ、サービス間のワークフローを自動化します。
            <br />
            Slack、GitHub、AWS、データベース、ワークフロープラットフォームなど、AI統合であらゆるニーズに対応します。
          </AipIntegrationsHeroLead>
        </AipIntegrationsHeroCopy>

        <AipIntegrationsContent>
          <AipIntegrationsCategoryList>
            <AipIntegrationsCategoryLink href="/t/platforms/aip/integrations?category=all" active={currentCategory === "all"}>
              全て ({products.length})
            </AipIntegrationsCategoryLink>
            {categories.map((category) => (
              <AipIntegrationsCategoryLink
                key={category.key}
                href={`/t/platforms/aip/integrations?category=${category.key}`}
                active={currentCategory === category.key}
              >
                {category.label} ({getCategoryCount(category.key)})
              </AipIntegrationsCategoryLink>
            ))}
          </AipIntegrationsCategoryList>
        </AipIntegrationsContent>

        <AipIntegrationsContent>
          <AipIntegrationsProductList>
            {filteredProducts.map((product) => (
              <AipIntegrationsProductCard
                key={`${product.label}-${product.svgFilename}`}
                iconSrc={`/services/aip/integrations/icons/${product.svgFilename}.svg`}
                label={product.label}
              />
            ))}
          </AipIntegrationsProductList>
        </AipIntegrationsContent>
      </AipIntegrationsHeroSection>

      <AipFreeTrialCtaSection />

      <SiteFooter />
    </main>
  );
}
