import { whitepaperItems } from "@/content/whitepapers";
import { eventItems } from "./resources/events";

export type ResourceCategory = "blog" | "whitepaper" | "events";

export type ResourceItem = {
  href: string;
  imageSrc: string;
  badge: string;
  title: string;
  description: string;
  date?: string;
};

export const externalBlogUrlBySlug = {
  "b-001": "https://www.querypie.com/ja/features/documentation/blog/28/ai-security-threat-map-2026-cxo",
  "b-002": "https://www.querypie.com/ja/features/documentation/blog/27/shadow-ai-risk-cxo-countermeasures",
  "b-003": "https://www.querypie.com/ja/features/documentation/blog/23/querypie-payroll-partnership",
  "b-004": "https://www.querypie.com/ja/features/documentation/blog/22/ai-agent-security-replit-case",
  "b-005": "https://www.querypie.com/ja/features/documentation/blog/21/why-we-need-ai-red-teaming",
  "b-009": "https://www.querypie.com/ja/features/documentation/blog/26/mitoco-buddy-release",
  "b-010": "https://www.querypie.com/ja/features/documentation/blog/25/terrasky-mitoco-buddy",
} as const;

export function getExternalBlogUrl(slug: string) {
  const normalizedSlug = slug.replace(/\.html$/i, "");
  return externalBlogUrlBySlug[normalizedSlug as keyof typeof externalBlogUrlBySlug] ?? null;
}

export const blogItems = [
  {
    href: externalBlogUrlBySlug["b-001"],
    imageSrc: "/assets/images/07-blog/b-thumb-28.png",
    badge: "ブログ",
    title: "AIセキュリティ脅威マップ2026｜CxOが備えるべき7つの攻撃ベクトルと実務対策フレームワーク",
    description:
      "AIセキュリティは従来のサイバー対策の延長ではなく「追加層」です。プロンプトインジェクション、データポイズニング、モデルサプライチェーン攻撃など7つの攻撃ベクトルと、OWASP・NIST準拠の実務対策フレームワークをCxO向けに体系解説します。",
    date: "2026年3月3日",
  },
  {
    href: externalBlogUrlBySlug["b-002"],
    imageSrc: "/assets/images/07-blog/b-thumb-27.png",
    badge: "ブログ",
    title: "【2026年最新】シャドーAIリスクの全貌｜情報漏洩・コンプライアンス違反を防ぐCxOの5つの対策",
    description:
      "シャドーAIは経営リスクそのものである。IBM調査によるとシャドーAI起因のデータ侵害コストは平均463万ドル。情報漏洩、コンプライアンス違反、NDA違反を防ぐCxO層向けの5つの具体的対策を最新データとともに解説します。",
    date: "2026年2月20日",
  },
  {
    href: externalBlogUrlBySlug["b-010"],
    imageSrc: "/assets/images/07-blog/news-21.png",
    badge: "ブログ",
    title: "QueryPie AI、株式会社テラスカイと協業しAIエージェント「mitoco Buddy」を発表",
    description:
      "QueryPie AI合同会社は、株式会社テラスカイと、AIエージェント「mitoco Buddy」開発に関する協業を発表しました。企業向けAIエージェントのセキュリティとデータ統制の基盤を共同で構築します。",
    date: "2025年11月7日",
  },
  {
    href: externalBlogUrlBySlug["b-003"],
    imageSrc: "/assets/images/07-blog/news-20.png",
    badge: "ブログ",
    title: "株式会社ペイロールとQueryPieがAIセキュリティ分野で技術提携",
    description:
      "株式会社ペイロールとQueryPie, Inc.は、AIとセキュリティ分野における技術提携に合意。AIサービスの安全・迅速な展開に向け、セキュリティとデータ統合技術で連携します。",
    date: "2025年8月5日",
  },
  {
    href: externalBlogUrlBySlug["b-004"],
    imageSrc: "/assets/images/07-blog/b-thumb-22.png",
    badge: "ブログ",
    title: "AIはどこまで信じていいのか？Replit事件から振り返るAIエージェントセキュリティの現実",
    description:
      "Replit AIエージェントがプロダクションDBを削除した事件を通じて、AIエージェントを実環境に導入する際に必ず考慮すべきセキュリティ構造の重要性を解説します。",
    date: "2025年7月29日",
  },
  {
    href: externalBlogUrlBySlug["b-005"],
    imageSrc: "/assets/images/07-blog/b-thumb-21.png",
    badge: "ブログ",
    title: "AIが命令を聞かなかった：なぜAI Red Teamingが必要なのか",
    description:
      "AIはもはや回答を生成するだけでなく、現実世界でアクションを実行します。実際の事件や事例を通じて、AIセキュリティ脅威とAI Red Teamingの必要性を解説します。",
    date: "2025年6月9日",
  },
] as const;

export function getResourceItems(category: ResourceCategory) {
  if (category === "blog") return blogItems;
  if (category === "whitepaper") return whitepaperItems;
  return eventItems;
}
