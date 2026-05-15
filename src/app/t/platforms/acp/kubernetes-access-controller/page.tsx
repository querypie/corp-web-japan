import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AcpFeatureCard,
  AcpFeatureCardDescription,
  AcpFeatureCardTitle,
  AcpFeatureGrid,
  AcpFeatureSection,
  AcpHeroEyebrow,
  AcpHeroLeadGroup,
  AcpHeroSection,
  AcpHeroTitle,
  AcpPageCta,
  AcpPageCtaDescription,
  AcpPageCtaLink,
  AcpPageCtaTitle,
  AcpSectionHeading,
  AcpSectionIntro,
  AcpSectionLeadGroup,
  AcpSplitFeatureBody,
  AcpSplitFeatureSection,
  AcpSplitFeatureTitle,
  AcpStaticPageShell,
  AcpWorksSection,
} from "@/components/sections/acp/static-page";

export const metadata: Metadata = {
  title: "QueryPie KAC:  Kubernetes Access Controller | QueryPie AI",
  description: "QueryPie KAC は、Kubernetes API 保護や AWS EKS、オンプレミスクラスタなどのクーバネティスを管理します。",
  alternates: {
    canonical: "/t/platforms/acp/kubernetes-access-controller",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function KubernetesAccessControllerPage() {
  return (
    <AcpStaticPageShell>
      <SiteHeader />
      <AcpHeroSection media={{"kind": "youtube", "src": "https://www.youtube.com/embed/OzxB0qqmCTQ?si=qbFYGIDUg2GPuzfU"}} mediaTitle="Kubernetes Access Controller">
        <AcpHeroEyebrow>QueryPie ACP</AcpHeroEyebrow>
        <AcpHeroTitle>Kubernetes Access Controller</AcpHeroTitle>
        <AcpHeroLeadGroup>
          <p>
            QueryPie KAC はクバネティスAPI保護ソリューションで、AWS EKS のようなクラウドインフラおよびオンプレミスクラスターの
          </p>
          <p>
            集中管理を可能にします。管理者はアクセス管理、API リクエストの監視、実行したコンテナコマンドの再生を行うことができます。
          </p>
        </AcpHeroLeadGroup>
      </AcpHeroSection>
      <AcpFeatureSection>
        <AcpSectionIntro>
          <AcpSectionHeading>KACの注目機能</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>
              QueryPie KAC は、クバネティスの正確なアクセス管理のために、RBAC およびABAC のコントロールを提供し、IAM パーミッションを自動的に取得します。
            </p>
            <p>
              また、監査ログやセッション記録、効率的なマルチクラスターアクセスを通じてリアルタイムで状況を把握することが可能です。
            </p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
        <AcpFeatureGrid>
          <AcpFeatureCard icon="/platforms/acp/icons/iam.svg">
            <AcpFeatureCardTitle>RBAC / ABACベースのアクセス制御</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              クバネティス クラスタに対して、役割ベースアクセス制御（RBAC）を実装し、API アクセスをカスタマイズしたポリシーで管理します。また、属性ベースアクセス制御（ABAC）を使用して、ユーザー属性に基づいた権限に適合させます。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/gateway.svg">
            <AcpFeatureCardTitle>自動化されたアクセス許可</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              AWS EKS のようなクラウドベースのクバネティス クラスタに対して、IAM 権限を割り当てるだけで、管理者のアクセス権限を自動的に登録します。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/audit.svg">
            <AcpFeatureCardTitle>監査ログとセッションの記録</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              監査ログとポッドセッションの記録を通じて、複数のクラスタにわたるユーザーの行動をほぼリアルタイムで可視化します。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/cluster.svg">
            <AcpFeatureCardTitle>マルチクラスターアクセスの集中化</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              ユーザーがコンテナに接続した際のセッションを自動的に記録し、ユーザーのアクションを監視。標準の K8S RBAC ではサポートされていない、K8S(クバネティス)リソース名（RegEx）に基づくアクセス制御ルールを適用します。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/config.svg">
            <AcpFeatureCardTitle>自動 KUBECONFIG の設定</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              分散リソースを同期し、複数のクバネティス統合を管理することで、クラウド環境を最適化します。スケジューリング機能により、リソースの同期を自動化し、変更履歴を追跡します。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
        </AcpFeatureGrid>
      </AcpFeatureSection>
      <AcpWorksSection imageSrc="/platforms/acp/kubernetes-access-controller/works.png" imageAlt="QueryPie KAC の仕組み" imageWidth={1000} imageHeight={400}>
        <AcpSectionIntro>
          <AcpSectionHeading>QueryPie KAC の仕組み</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>
              QueryPie KAC は、強力なアクセス制御と監査機能を備えたKubernetes クラスタにユーザーをシームレスに接続します。
            </p>
            <p>
              QueryPie Agent はセキュアなkubeconfig ファイルを生成し、ユーザはkubectl、Lens などのツールを使用して簡単にKubernetes クラスタに接続できます。
            </p>
            <p>
              QueryPie KAC は、コントロール ハブとして機能し、すべてのKubernetes アクティビティに対する正確なロールベース アクセス管理と包括的な監査を保証します。
            </p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
      </AcpWorksSection>
      <AcpWorksSection imageSrc="/platforms/acp/kubernetes-access-controller/protect-k8s.png" imageAlt="クバネティスを完全に保護する" imageWidth={1000} imageHeight={440}>
        <AcpSectionIntro>
          <AcpSectionHeading>クバネティスを完全に保護する</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>QueryPie は、クバネティス環境のセキュリティを強化し、ネームスペース内外を問わず、すべての環境を安全に保護します。</p>
            <p>SAC（System Access Controller） は、厳密なアクセス制御とノードのSSH 接続に関する監査機能を担当し、KAC（Kubernetes Access Controller） はクバネティス リソースにおけるすべてのAPIインタラクションを管理・監視する役割を果たします。</p>
            <p>これにより、すべてのタスクがシームレスかつ安全に実行されるよう、包括的なセキュリティを提供いたします。</p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
      </AcpWorksSection>
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/kubernetes-access-controller/cloud-sync.png" imageAlt="簡単で高速なクラウド同期" imageWidth={620} imageHeight={530} imageWidthClassName="lg:basis-[51.7%]">
        <AcpSplitFeatureTitle>簡単で高速なクラウド同期</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>QueryPie でクラウドリソースを簡単に同期！クラウド環境に最適化され、クバネティス統合をシンプル化し、スマートなスケジューリング機能でリソース同期を自動化し、変更を簡単に追跡できます。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse imageSrc="/platforms/acp/kubernetes-access-controller/management-env.png" imageAlt="Multi-K8S 環境統合管理" imageWidth={640} imageHeight={610}>
        <AcpSplitFeatureTitle>Multi-K8S 環境統合管理</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>単一のコンソールで権限を管理することで、クバネティス クラスタごとにロールベースアクセス制御（RBAC） 設定を個別に構成する必要がなくなります。ワイルドカードを使用して、複数のクラスタに同じ権限ポリシーを適用してアクセス制御をシンプル化します。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/kubernetes-access-controller/management-policy.png" imageAlt="きめ細かいK8S リソースユニットのポリシー管理" imageWidth={580} imageHeight={460} imageWidthClassName="lg:basis-[48.3%]">
        <AcpSplitFeatureTitle>きめ細かいK8Sリソースユニットのポリシー管理</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>ワイルドカードと正規表現のサポートにより、リソースへのアクセス制御をシンプル化し、ユーザー権限に応じて応答をフィルタリングし、変数名に適応できます。 API グループ、アクション、リソースタイプ、名前空間、およびリソース名の詳細なポリシー管理により、正確な制御が可能です。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse imageSrc="/platforms/acp/kubernetes-access-controller/logging-api.png" imageAlt="クバネティスAPI 実行履歴のログ記録" imageWidth={610} imageHeight={760} imageWidthClassName="lg:basis-[50.8%]">
        <AcpSplitFeatureTitle>クバネティスAPI 実行履歴のログ記録</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>クバネティスAPI 監査ログの混乱にさよならを言いましょう！ QueryPie のプロキシは、複数のクラスタにわたるすべてのAPI リクエストを記録し、効率的な追跡に必要なアクションに焦点を当てながら、マスターサーバーへの不要な負荷を軽減します。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/kubernetes-access-controller/session-replay.png" imageAlt="コンテナシェルコマンドの実行履歴" imageWidth={600} imageHeight={590} imageWidthClassName="lg:basis-1/2">
        <AcpSplitFeatureTitle>コンテナシェルコマンドの実行履歴</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>ユーザーがポッドに接続した後に実行したすべてのタスクを再生できるセッション記録を使用して、コンテナ内で発生したユーザーアクティビティを徹底的に追跡します。この機能は、ユーザーが実行したコマンド、API リクエスト、およびタスクを細かく記録し、全体の監査と制御を強化し、問題が発生したときに迅速に対応できるようにします。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse last imageSrc="/platforms/acp/kubernetes-access-controller/auto-setup.png" imageAlt="クバネティスアクセス権の自動設定" imageWidth={580} imageHeight={510} imageWidthClassName="lg:basis-[48.3%]">
        <AcpSplitFeatureTitle>クバネティスアクセス権の自動設定</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>各ユーザーに割り当てられたロールに基づいて、kubeconfig ファイルを自動的に生成します。ユーザーはQueryPie エージェントを通じてこれらのファイルに簡単にアクセスでき、kubectx などの既存のクバネティス ツールを使用してアクセス可能なクラスターを選択できます。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpPageCta>
        <AcpPageCtaTitle>まずは小さく、失敗しないAXを始めよう</AcpPageCtaTitle>
        <AcpPageCtaDescription>
          簡単サインアップで、14日間の無料トライアルをお試しください
        </AcpPageCtaDescription>
        <AcpPageCtaLink>無料で試してみる</AcpPageCtaLink>
      </AcpPageCta>
      <SiteFooter />
    </AcpStaticPageShell>
  );
}
