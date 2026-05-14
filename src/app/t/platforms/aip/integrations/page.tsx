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
  legacyQueryValue: string;
};

type IntegrationProduct = {
  categoryKeys: readonly string[];
  label: string;
  svgFilename: string;
};

const categories: readonly IntegrationCategory[] = [
  { key: "workflow-automation", label: "ワークフロー自動化", legacyQueryValue: "0" },
  { key: "collaboration", label: "コミュニケーション & コラボレーション", legacyQueryValue: "1" },
  { key: "crm", label: "顧客関係管理", legacyQueryValue: "2" },
  { key: "google-workspace", label: "Googleサービス", legacyQueryValue: "3" },
  { key: "microsoft-365", label: "Microsoftサービス", legacyQueryValue: "4" },
  { key: "project-management", label: "プロジェクト管理", legacyQueryValue: "5" },
  { key: "devops", label: "開発 & DevOps", legacyQueryValue: "6" },
  { key: "databases", label: "データベース接続", legacyQueryValue: "7" },
  { key: "search-navigation", label: "検索 & ナビゲーション", legacyQueryValue: "8" },
  { key: "local-tools", label: "ローカル統合", legacyQueryValue: "9" },
] as const;

const products: readonly IntegrationProduct[] = [
  { categoryKeys: ["databases"], label: "AirTable", svgFilename: "airtable" },
  { categoryKeys: ["devops"], label: "AWS", svgFilename: "aws-icon" },
  { categoryKeys: ["search-navigation"], label: "Brave Search", svgFilename: "brave-search" },
  { categoryKeys: ["databases"], label: "ClickHouse", svgFilename: "clickhouse" },
  { categoryKeys: ["devops"], label: "Code Executor", svgFilename: "querypie" },
  { categoryKeys: ["project-management"], label: "Confluence Cloud", svgFilename: "confluence" },
  { categoryKeys: ["devops"], label: "Context7", svgFilename: "context7" },
  { categoryKeys: ["devops"], label: "Datadog", svgFilename: "datadog" },
  { categoryKeys: ["search-navigation"], label: "Daum Search", svgFilename: "daum-search" },
  { categoryKeys: ["workflow-automation"], label: "Dify API Access", svgFilename: "dify" },
  { categoryKeys: ["collaboration"], label: "Discord", svgFilename: "discord" },
  { categoryKeys: ["collaboration"], label: "Discord with OAuth", svgFilename: "discord" },
  { categoryKeys: ["devops", "local-tools"], label: "Filesystem", svgFilename: "mcp" },
  { categoryKeys: ["collaboration"], label: "GitHub", svgFilename: "github" },
  { categoryKeys: ["google-workspace"], label: "Google Calendar", svgFilename: "google-calendar" },
  { categoryKeys: ["google-workspace"], label: "Google Drive", svgFilename: "google-drive" },
  { categoryKeys: ["google-workspace"], label: "Google Gmail", svgFilename: "google-gmail" },
  { categoryKeys: ["google-workspace"], label: "Google Sheets", svgFilename: "google-sheets" },
  { categoryKeys: ["google-workspace"], label: "Google Slides", svgFilename: "google-slides" },
  { categoryKeys: ["devops"], label: "Grafana", svgFilename: "grafana" },
  { categoryKeys: ["project-management"], label: "Jira Cloud", svgFilename: "jira" },
  { categoryKeys: ["search-navigation"], label: "Kakao Map", svgFilename: "kakao" },
  { categoryKeys: ["search-navigation"], label: "Kakao Navigation", svgFilename: "kakao" },
  { categoryKeys: ["devops"], label: "Kubernetes", svgFilename: "kubernetes-icon" },
  { categoryKeys: ["databases"], label: "MariaDB", svgFilename: "maria-db-icon" },
  { categoryKeys: ["microsoft-365"], label: "Microsoft 365", svgFilename: "microsoft-365" },
  { categoryKeys: ["databases"], label: "MySQL", svgFilename: "mysql-icon" },
  { categoryKeys: ["workflow-automation"], label: "n8n Chat", svgFilename: "n8n-chat" },
  { categoryKeys: ["workflow-automation"], label: "n8n Webhook", svgFilename: "n8n-webhook" },
  { categoryKeys: ["search-navigation"], label: "Naver Search", svgFilename: "naver-search" },
  { categoryKeys: ["collaboration"], label: "Notion", svgFilename: "notion" },
  { categoryKeys: ["databases"], label: "Oracle Database", svgFilename: "oracle-icon" },
  { categoryKeys: ["search-navigation"], label: "Perplexity Ask", svgFilename: "perplexity-ask" },
  { categoryKeys: ["databases"], label: "PostgreSQL", svgFilename: "postgresql-icon" },
  { categoryKeys: ["devops"], label: "QueryPie Customer Center", svgFilename: "querypie" },
  { categoryKeys: ["databases"], label: "Redis", svgFilename: "redis-icon" },
  { categoryKeys: ["crm"], label: "Salesforce", svgFilename: "salesforce" },
  { categoryKeys: ["crm"], label: "Salesforce with OAuth", svgFilename: "salesforce" },
  { categoryKeys: ["workflow-automation"], label: "Sequential Thinking", svgFilename: "querypie" },
  { categoryKeys: ["collaboration"], label: "Slack", svgFilename: "slack-icon" },
  { categoryKeys: ["databases"], label: "Snowflake", svgFilename: "snowflake-icon" },
  { categoryKeys: ["databases"], label: "SQL Server", svgFilename: "sql-server-icon" },
  { categoryKeys: ["devops"], label: "SSH", svgFilename: "ssh" },
  { categoryKeys: ["devops", "databases"], label: "Supabase", svgFilename: "supabase" },
  { categoryKeys: ["devops", "local-tools"], label: "Terminal", svgFilename: "ssh" },
] as const;

function readCurrentCategory(searchParams: Record<string, string | string[] | undefined> | undefined) {
  const raw = searchParams?.category;
  const value = Array.isArray(raw) ? raw[0] : raw;

  if (!value || value === "all") {
    return "all";
  }

  const matchedCategory = categories.find((category) => category.key === value || category.legacyQueryValue === value);

  return matchedCategory?.key ?? "all";
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
