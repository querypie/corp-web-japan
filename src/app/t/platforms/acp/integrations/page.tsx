import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AipIntegrationsCategoryLink,
  AipIntegrationsCategoryList,
  AipIntegrationsHeroCopy,
  AipIntegrationsHeroHeading,
  AipIntegrationsHeroLead,
  AipIntegrationsHeroSection,
  AipIntegrationsProductCard,
  AipIntegrationsProductList,
} from "@/components/sections/aip/integrations-page";
import {
  AcpPageCta,
  AcpPageCtaDescription,
  AcpPageCtaLink,
  AcpPageCtaTitle,
} from "@/components/sections/acp/static-page";

export const metadata: Metadata = {
  title: "QueryPie: インテグレーション | QueryPie AI",
  description: "データソースに直接接続し、すべてのシステム、アプリケーション、およびサービスを完全に把握することが可能です。",
  alternates: {
    canonical: "/t/platforms/acp/integrations",
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
  { key: "data-sources", label: "データソース" },
  { key: "cloud-containers", label: "コンテナとクラウドサービス" },
  { key: "identity-providers", label: "シングルサインオンとアイデンティティプロバイダー" },
  { key: "sql-bi-tools", label: "SQL および BI ツール" },
  { key: "notifications", label: "通知" },
  { key: "siem-soar", label: "SIEM / SOAR" },
  { key: "monitoring", label: "モニタリング" },
  { key: "secret-stores", label: "シークレットストア" },
] as const;

const products: readonly IntegrationProduct[] = [
  {
    "categoryKeys": [
      "notifications"
    ],
    "label": "Agit",
    "svgFilename": "agit-icon"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "AKS",
    "svgFilename": "aks-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Athena",
    "svgFilename": "athena-icon"
  },
  {
    "categoryKeys": [
      "identity-providers"
    ],
    "label": "Auth0",
    "svgFilename": "auth0-icon"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "AWS",
    "svgFilename": "aws-icon"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "Azure",
    "svgFilename": "azure-icon"
  },
  {
    "categoryKeys": [
      "identity-providers"
    ],
    "label": "Azure AD",
    "svgFilename": "azure-ad-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Azure SQL",
    "svgFilename": "azure-sql-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "BigQuery",
    "svgFilename": "big-query-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Cassandra",
    "svgFilename": "cassandra-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "ClickHouse",
    "svgFilename": "clickhouse"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "Cloud SQL",
    "svgFilename": "cloud-sql-icon"
  },
  {
    "categoryKeys": [
      "monitoring"
    ],
    "label": "CloudWatch",
    "svgFilename": "cloud-watch-icon"
  },
  {
    "categoryKeys": [
      "sql-bi-tools"
    ],
    "label": "Databricks",
    "svgFilename": "databricks-icon"
  },
  {
    "categoryKeys": [
      "sql-bi-tools"
    ],
    "label": "DataGrip",
    "svgFilename": "datagrip-icon"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "DigitalOcean",
    "svgFilename": "digital-ocean-icon"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "Docker",
    "svgFilename": "docker-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "DocumentDB",
    "svgFilename": "document-db-icon"
  },
  {
    "categoryKeys": [
      "sql-bi-tools"
    ],
    "label": "Dr.Sum",
    "svgFilename": "dr-sum-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "DynamoDB",
    "svgFilename": "dynamo-db-icon"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "ECS",
    "svgFilename": "ecs-icon"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "EKS",
    "svgFilename": "eks-icon"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "GCP",
    "svgFilename": "gcp-icon"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "GKE",
    "svgFilename": "gke-icon"
  },
  {
    "categoryKeys": [
      "identity-providers"
    ],
    "label": "Gsuite",
    "svgFilename": "gsuite-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "HBase",
    "svgFilename": "h-base-icon"
  },
  {
    "categoryKeys": [
      "secret-stores"
    ],
    "label": "HashiCorp Vault",
    "svgFilename": "hashicorp-vault-icon"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "Heroku",
    "svgFilename": "heroku-icon"
  },
  {
    "categoryKeys": [
      "sql-bi-tools"
    ],
    "label": "Hive",
    "svgFilename": "hive-icon"
  },
  {
    "categoryKeys": [
      "notifications"
    ],
    "label": "HTTP",
    "svgFilename": "http-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Impala",
    "svgFilename": "impala-icon"
  },
  {
    "categoryKeys": [
      "cloud-containers"
    ],
    "label": "Kubernetes",
    "svgFilename": "kubernetes-icon"
  },
  {
    "categoryKeys": [
      "sql-bi-tools"
    ],
    "label": "Looker",
    "svgFilename": "looker-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "MariaDB",
    "svgFilename": "maria-db-icon"
  },
  {
    "categoryKeys": [
      "sql-bi-tools"
    ],
    "label": "Mode",
    "svgFilename": "mode-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "MongoDB",
    "svgFilename": "mongodb-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "MySQL",
    "svgFilename": "mysql-icon"
  },
  {
    "categoryKeys": [
      "identity-providers"
    ],
    "label": "Okta",
    "svgFilename": "okta-icon"
  },
  {
    "categoryKeys": [
      "identity-providers"
    ],
    "label": "OneLogin",
    "svgFilename": "one-login-icon"
  },
  {
    "categoryKeys": [
      "identity-providers"
    ],
    "label": "OpenLDAP",
    "svgFilename": "open-ldap-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Oracle",
    "svgFilename": "oracle-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "PostgreSQL",
    "svgFilename": "postgresql-icon"
  },
  {
    "categoryKeys": [
      "sql-bi-tools"
    ],
    "label": "Power BI",
    "svgFilename": "power-bi-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Presto",
    "svgFilename": "presto-icon"
  },
  {
    "categoryKeys": [
      "monitoring"
    ],
    "label": "Prometheus",
    "svgFilename": "prometheus-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Redis",
    "svgFilename": "redis-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Redshift",
    "svgFilename": "redshift-icon"
  },
  {
    "categoryKeys": [
      "identity-providers"
    ],
    "label": "SAML",
    "svgFilename": "saml-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "SAP HANA",
    "svgFilename": "sap-hana-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "ScyllaDB",
    "svgFilename": "scylla-db-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "SingleStore",
    "svgFilename": "single-store-icon"
  },
  {
    "categoryKeys": [
      "notifications"
    ],
    "label": "Slack",
    "svgFilename": "slack-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Snowflake",
    "svgFilename": "snowflake-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Spanner",
    "svgFilename": "spanner-icon"
  },
  {
    "categoryKeys": [
      "siem-soar"
    ],
    "label": "Splunk",
    "svgFilename": "splunk-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "SQL Server",
    "svgFilename": "sql-server-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "SwivelSecure",
    "svgFilename": "swivel-secure-icon"
  },
  {
    "categoryKeys": [
      "siem-soar"
    ],
    "label": "Syslog",
    "svgFilename": "syslog-icon"
  },
  {
    "categoryKeys": [
      "sql-bi-tools"
    ],
    "label": "Tableau",
    "svgFilename": "tableau-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "TmaxTibero",
    "svgFilename": "tmax-tibero-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Trino",
    "svgFilename": "trino-icon"
  },
  {
    "categoryKeys": [
      "data-sources"
    ],
    "label": "Vertica",
    "svgFilename": "vertica-icon"
  },
  {
    "categoryKeys": [
      "sql-bi-tools"
    ],
    "label": "Workbench",
    "svgFilename": "workbench-icon"
  },
  {
    "categoryKeys": [
      "sql-bi-tools"
    ],
    "label": "Zeppelin",
    "svgFilename": "zeppelin-icon"
  }
] as const;

function readCurrentCategory(searchParams: Record<string, string | string[] | undefined> | undefined) {
  const raw = searchParams?.category;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && (value === "all" || categories.some((category) => category.key === value)) ? value : "all";
}

function getCategoryCount(categoryKey: string) {
  return products.filter((product) => product.categoryKeys.includes(categoryKey)).length;
}

export default async function AcpIntegrationsPage({ searchParams }: IntegrationsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const currentCategory = readCurrentCategory(resolvedSearchParams);
  const filteredProducts = products
    .filter((product) => currentCategory === "all" || product.categoryKeys.includes(currentCategory))
    .sort((left, right) => left.label.localeCompare(right.label));

  return (
    <main className="bg-white text-slate-950">
      <SiteHeader />
      <AipIntegrationsHeroSection variant="acp">
        <AipIntegrationsHeroCopy>
          <AipIntegrationsHeroHeading>ACP統合機能</AipIntegrationsHeroHeading>
          <AipIntegrationsHeroLead>
            50種類以上の組み込み統合機能を装備し、アクセス制御を一元管理。
            <br />
            お使いのデータソースに直接接続し、すべてのシステム、アプリ、サービスを完全に可視化します。
            <br />
            データベース、サーバー、Kubernetes、Webアプリケーションなど、幅広く対応しています。
          </AipIntegrationsHeroLead>
        </AipIntegrationsHeroCopy>
        <AipIntegrationsCategoryList>
          <AipIntegrationsCategoryLink href="/t/platforms/acp/integrations?category=all" active={currentCategory === "all"}>
            すべて ({products.length})
          </AipIntegrationsCategoryLink>
          {categories.map((category) => (
            <AipIntegrationsCategoryLink
              key={category.key}
              href={`/t/platforms/acp/integrations?category=${category.key}`}
              active={currentCategory === category.key}
            >
              {category.label} ({getCategoryCount(category.key)})
            </AipIntegrationsCategoryLink>
          ))}
        </AipIntegrationsCategoryList>
        <AipIntegrationsProductList>
          {filteredProducts.map((product) => (
            <AipIntegrationsProductCard
              key={`${product.label}-${product.svgFilename}`}
              iconSrc={`/platforms/acp/integrations/icons/${product.svgFilename}.svg`}
              label={product.label}
            />
          ))}
        </AipIntegrationsProductList>
      </AipIntegrationsHeroSection>
      <AcpPageCta>
        <AcpPageCtaTitle>まずは小さく、失敗しないAXを始めよう</AcpPageCtaTitle>
        <AcpPageCtaDescription>
          簡単サインアップで、14日間の無料トライアルをお試しください
        </AcpPageCtaDescription>
        <AcpPageCtaLink>無料で試してみる</AcpPageCtaLink>
      </AcpPageCta>
      <SiteFooter />
    </main>
  );
}
