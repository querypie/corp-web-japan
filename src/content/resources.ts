export type ResourceCategory = "blog" | "whitepaper" | "events";

export type ResourceItem = {
  href: string;
  imageSrc: string;
  badge: string;
  title: string;
  description: string;
  date?: string;
};

export const blogItems = [
  {
    href: "/posts/blog/b-001",
    imageSrc: "/assets/images/07-blog/b-thumb-28.png",
    badge: "ブログ",
    title: "AIセキュリティ脅威マップ2026｜CxOが備えるべき7つの攻撃ベクトルと実務対策フレームワーク",
    description:
      "AIセキュリティは従来のサイバー対策の延長ではなく「追加層」です。プロンプトインジェクション、データポイズニング、モデルサプライチェーン攻撃など7つの攻撃ベクトルと、OWASP・NIST準拠の実務対策フレームワークをCxO向けに体系解説します。",
    date: "2026年3月3日",
  },
  {
    href: "/posts/blog/b-002",
    imageSrc: "/assets/images/07-blog/b-thumb-27.png",
    badge: "ブログ",
    title: "【2026年最新】シャドーAIリスクの全貌｜情報漏洩・コンプライアンス違反を防ぐCxOの5つの対策",
    description:
      "シャドーAIは経営リスクそのものである。IBM調査によるとシャドーAI起因のデータ侵害コストは平均463万ドル。情報漏洩、コンプライアンス違反、NDA違反を防ぐCxO層向けの5つの具体的対策を最新データとともに解説します。",
    date: "2026年2月20日",
  },
  {
    href: "/posts/blog/b-010",
    imageSrc: "/assets/images/07-blog/news-21.png",
    badge: "ブログ",
    title: "QueryPie AI、株式会社テラスカイと協業しAIエージェント「mitoco Buddy」を発表",
    description:
      "QueryPie AI合同会社は、株式会社テラスカイと、AIエージェント「mitoco Buddy」開発に関する協業を発表しました。企業向けAIエージェントのセキュリティとデータ統制の基盤を共同で構築します。",
    date: "2025年11月7日",
  },
  {
    href: "/posts/blog/b-003",
    imageSrc: "/assets/images/07-blog/news-20.png",
    badge: "ブログ",
    title: "株式会社ペイロールとQueryPieがAIセキュリティ分野で技術提携",
    description:
      "株式会社ペイロールとQueryPie, Inc.は、AIとセキュリティ分野における技術提携に合意。AIサービスの安全・迅速な展開に向け、セキュリティとデータ統合技術で連携します。",
    date: "2025年8月5日",
  },
  {
    href: "/posts/blog/b-004",
    imageSrc: "/assets/images/07-blog/b-thumb-22.png",
    badge: "ブログ",
    title: "AIはどこまで信じていいのか？Replit事件から振り返るAIエージェントセキュリティの現実",
    description:
      "Replit AIエージェントがプロダクションDBを削除した事件を通じて、AIエージェントを実環境に導入する際に必ず考慮すべきセキュリティ構造の重要性を解説します。",
    date: "2025年7月29日",
  },
  {
    href: "/posts/blog/b-005",
    imageSrc: "/assets/images/07-blog/b-thumb-21.png",
    badge: "ブログ",
    title: "AIが命令を聞かなかった：なぜAI Red Teamingが必要なのか",
    description:
      "AIはもはや回答を生成するだけでなく、現実世界でアクションを実行します。実際の事件や事例を通じて、AIセキュリティ脅威とAI Red Teamingの必要性を解説します。",
    date: "2025年6月9日",
  },
] as const;

export const whitepaperItems = [
  {
    href: "/posts/whitepaper/wp-001",
    imageSrc: "/assets/images/07-blog/wp-thumb-28.png",
    badge: "ホワイトペーパー",
    title: "AIエージェント時代のガードレール設計（2026年版）── 前編：思想・設計編",
    description:
      "AIエージェントが「実行するAI」に変わりつつある今、企業が最優先で整備すべき権限・承認・監査ログ・停止手順の実務フレームを体系的に解説します。",
    date: "2026年2月27日",
  },
  {
    href: "/posts/whitepaper/wp-003",
    imageSrc: "/assets/images/07-blog/wp-thumb-26.png",
    badge: "ホワイトペーパー",
    title: "コード生成およびAgentic RAGタスクを中心とした特定ドメインのためのLLM比較評価【前編】",
    description:
      "コード生成・Agentic RAGタスクに特化したLLM比較評価。研究背景・システムアーキテクチャ・実験設計を前編で詳解します。",
    date: "2026年2月13日",
  },
  {
    href: "/posts/whitepaper/wp-016",
    imageSrc: "/assets/images/07-blog/wp-thumb-24-jp.png",
    badge: "ホワイトペーパー",
    title: "なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか",
    description:
      "事業責任者向けに、世界の先進事例・日本の課題・10ステップの導入プロセスとAI導入準備度チェックリストを体系的に解説します。",
    date: "2025年11月17日",
  },
  {
    href: "/posts/whitepaper/wp-005",
    imageSrc: "/assets/images/07-blog/wp-thumb-23.png",
    badge: "ホワイトペーパー",
    title: "RAG 2.0 セキュリティ – Microsoft・Metaの戦略、QueryPieが繋ぐ",
    description:
      "RAGアーキテクチャの構造的欠陥を分析し、Microsoft・Metaのセキュリティ戦略とQueryPieが提供するソリューションを詳説します。",
    date: "2025年5月28日",
  },
  {
    href: "/posts/whitepaper/wp-006",
    imageSrc: "/assets/images/07-blog/wp-thumb-22.png",
    badge: "ホワイトペーパー",
    title: "MCPとAIエージェントが対決：あなたの設計は安全か？",
    description:
      "MCP・AIエージェントアーキテクチャの設計上の安全性を徹底解剖。役割分離・インターフェース設計の違いを実例で解説します。",
    date: "2025年5月21日",
  },
  {
    href: "/posts/whitepaper/wp-007",
    imageSrc: "/assets/images/07-blog/wp-thumb-21.png",
    badge: "ホワイトペーパー",
    title: "コードは止まり、エージェントが動く – AgentSecOpsの時代へ",
    description:
      "DevSecOpsを超えるAgentSecOpsの必要性。AIエージェント時代のセキュリティ設計とパイプライン防御を体系的に解説します。",
    date: "2025年5月13日",
  },
] as const;

export const eventItems = [
  {
    href: "/posts/event/ev-001",
    imageSrc: "/assets/images/07-blog/event-thumb-1.png",
    badge: "イベント",
    title: "【ウェビナー】AIエージェント導入の現場から──失敗しない進め方と組織変革のリアル",
    description:
      "AIエージェントを業務に導入した企業の実践者が登壇。「小さく始めて大きく育てる」戦略の具体的な手順と、導入過程で直面した組織的課題・技術的課題の両面を赤裸々に語ります。",
    date: "2026年3月18日",
  },
  {
    href: "/posts/event/ev-002",
    imageSrc: "/assets/images/07-blog/event-thumb-2.png",
    badge: "イベント",
    title: "【オンラインセミナー】企業AIのセキュリティ設計入門──ゼロトラストとRAGの組み合わせ",
    description:
      "社内AIを安全に運用するためのゼロトラストアーキテクチャとRAG活用の基礎を解説。アクセス権限管理から監査ログの設計まで、実務担当者向けに体系的に紹介します。",
    date: "2026年3月5日",
  },
  {
    href: "/posts/event/ev-003",
    imageSrc: "/assets/images/07-blog/event-thumb-3.png",
    badge: "イベント",
    title: "【東京開催】QueryPie AI Summit 2026──AIガバナンスと競争優位の新地平",
    description:
      "国内外のAIリーダーが集う年次カンファレンス。AIガバナンス・データ戦略・エージェント設計の最前線を、KeynoteとBreakout Sessionを通じて深掘りします。参加無料・事前登録制。",
    date: "2026年2月14日",
  },
  {
    href: "/posts/event/ev-004",
    imageSrc: "/assets/images/07-blog/event-thumb-4.png",
    badge: "イベント",
    title: "【ハンズオン】AIP×MCP実践ワークショップ──エージェントを30分で動かす",
    description:
      "QueryPie AIPとMCPを使ったAIエージェントの構築を、ハンズオン形式で体験。環境構築から最初のエージェント稼働まで、エンジニア・技術リーダー向けの少人数集中セッションです。",
    date: "2026年1月22日",
  },
  {
    href: "/posts/event/ev-005",
    imageSrc: "/assets/images/07-blog/event-thumb-5.png",
    badge: "イベント",
    title: "【ウェビナー録画】SaaSベンダー向けAI出汁活用戦略──自社プロダクトにAIを組み込む方法",
    description:
      "AI出汁を活用してSaaSプロダクトにAI機能を組み込んだ事例を紹介。APIインテグレーションの設計ポイントと、顧客体験向上につながるAI活用の具体的なアプローチを解説します。",
    date: "2025年12月11日",
  },
  {
    href: "/posts/event/ev-006",
    imageSrc: "/assets/images/07-blog/event-thumb-6.png",
    badge: "イベント",
    title: "【大阪開催】関西AI実践ミートアップ Vol.3──現場エンジニアが語るLLMの本音",
    description:
      "関西圏のAI実践者が集まる交流イベント。LLM活用の現場ナレッジ・ハルシネーション対策・プロンプト設計のコツなど、教科書には載っていないリアルな知見を共有し合う場です。",
    date: "2025年11月28日",
  },
] as const;

export function getResourceItems(category: ResourceCategory) {
  if (category === "blog") return blogItems;
  if (category === "whitepaper") return whitepaperItems;
  return eventItems;
}
