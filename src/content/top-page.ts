export const topPageFloatingCtaUrl = "/contact-us";
export const topPageHeroContactUrl = "/contact-us?inquiry=ai-consulting";
export const topPageDownloadUrl =
  "https://www.querypie.com/ja/features/documentation/aip-introduction-download";
export const topPageFinalDemoUrl = "/contact-us?inquiry=demo-request";
export const topPageFinalConsultUrl = "/contact-us?inquiry=ai-consulting";

export const topPageMetadata = {
    title: "信頼できるAIが、現場を動かす｜QueryPie AI",
    description:
      "QueryPie AIは、社内業務効率化と自社サービスAI化を支援するエンタープライズAI基盤です。安全性と運用性を前提に、AI活用をスモールスタートから実運用・定着まで前に進めます。",
  } as const;

export const topPageHeader = {
    navItems: [
      { label: "ニュース", href: "#news" },
      {
        label: "ソリューション",
        children: [
          { label: "社内業務効率化｜AI Crew", href: "/solutions/ai-crew" },
          { label: "自社サービスAI化｜AI Dashi", href: "/solutions/ai-dashi" },
        ],
      },
      { label: "活用事例", href: "#use-cases" },
      { label: "サポート", href: "#security" },
      { label: "QueryPie AIについて", href: "#about" },
    ],
    cta: { label: "Free Flow", href: "#contact" },
  } as const;
export const topPageCoreValue = {
    title: {
      before: "AI導入の壁は、技術ではなく",
      highlight: "信頼と定着",
      after: "",
    },
    body:
      "QueryPie AIは、企業のAI活用を前に進めるために不可欠な3つの条件を備えています。",
    cards: [
      {
        number: "01",
        title: "信頼",
        subtitle: "安全性とガバナンス",
        bullets: [
          "組織・役割に応じた緻密な権限管理と監査対応",
          "入力データの外部学習なし",
          "エンタープライズ基準の安全な環境",
        ],
      },
      {
        number: "02",
        title: "速さ",
        subtitle: "開発・導入スピード",
        bullets: [
          "既存の社内データや業務システムとシームレスに連携",
          "ゼロからの開発を省略",
          "業務で使える状態を素早く構築",
        ],
      },
      {
        number: "03",
        title: "現場定着",
        subtitle: "運用・活用支援",
        bullets: [
          "現場が迷わず使えるUIとワークフロー設計",
          "テスト導入で終わらせない",
          "全社展開に向けた運用改善まで伴走",
        ],
      },
    ],
  } as const;
export const topPageRoadmap = {
    sectionName: "Roadmap",
    title: {
      line1: "小さく始めて、確実に広げる",
      before: "",
      highlight: "失敗しない",
      after: "AI導入へのロードマップ",
    },
    body:
      "社内業務の効率化でも、自社サービスへのAI組み込みでも、大切なのは成果の出る領域から始めて、検証しながら運用へ広げることです。QueryPie AIは、両方のアプローチに対応できる現実的な導入ステップで、AI活用を定着へつなげます。",
    tabs: [
      {
        key: "crew",
        label: "社内業務効率化",
        description:
          "社内業務の負荷が高い領域から、専用AIエージェントを小さく導入し、全社展開へ広げるロードマップです。",
        steps: [
          {
            number: "01",
            label: "特定業務でのスモールスタート",
            title: {
              before: "",
              highlight: "成果の出る",
              after: "領域を見極める",
            },
            body: [
              { text: "既存の業務フローを分析し、最も負荷が高く、", strong: false },
              { text: "AIによるコスト削減や価値向上が見込める業務に絞ってAIエージェントを適用", strong: true },
              { text: "します。まずは一つの部門で確実な成功体験を作ります。", strong: false },
            ],
          },
          {
            number: "02",
            label: "効果測定と現場へのチューニング",
            title: {
              before: "現場が",
              highlight: "使い続ける",
              after: "仕組みを作る",
            },
            body: [
              { text: "単なるツールの提供で終わらず、", strong: false },
              { text: "現場のフィードバックをもとにプロンプトや参照データを調整", strong: true },
              { text: "します。使われるためのUI/UXと運用ルールを固め、ROI（投資対効果）を可視化します。", strong: false },
            ],
          },
          {
            number: "03",
            label: "ガバナンスを効かせた全社展開",
            title: {
              before: "安全に、",
              highlight: "会社全体の基盤",
              after: "へ拡張する",
            },
            body: [
              { text: "QueryPie AIの強みである", strong: false },
              { text: "緻密な権限制御と監査ログを活用し、セキュリティを担保したまま他部門や自社サービスへ横展開", strong: true },
              { text: "します。一部署のツールから、全社の経営基盤へと進化させます。", strong: false },
            ],
          },
        ],
      },
      {
        key: "dashi",
        label: "自社サービスAI化",
        description:
          "自社サービスにAI機能を組み込み、試作から商用リリース、継続運用へ進めるロードマップです。",
        steps: [
          {
            number: "01",
            label: "対象機能と要件の定義",
            title: {
              before: "",
              highlight: "事業価値の高い",
              after: "AI機能を定める",
            },
            body: [
              { text: "既存のSaaSやWebサービスを分析し、", strong: false },
              { text: "顧客体験の向上やアップセルにつながるAI機能を特定", strong: true },
              { text: "します。まずは一つの導線・一つの業務体験から設計を始めます。", strong: false },
            ],
          },
          {
            number: "02",
            label: "API連携と導入検証",
            title: {
              before: "",
              highlight: "既存システムと安全に",
              after: "つなぐ",
            },
            body: [
              { text: "UI/UXを変えすぎず、", strong: false },
              { text: "既存データや業務システムとAPI経由で統合", strong: true },
              { text: "します。導入前の検証で精度・運用性・ガードレールを確認しながら調整します。", strong: false },
            ],
          },
          {
            number: "03",
            label: "自社ブランドでの本番展開",
            title: {
              before: "",
              highlight: "継続提供できる",
              after: "AI機能へ育てる",
            },
            body: [
              { text: "リリース後も", strong: false },
              { text: "監査・権限制御・改善運用を前提に継続提供", strong: true },
              { text: "し、単発機能ではなく自社サービスの競争力として育てます。", strong: false },
            ],
          },
        ],
      },
    ],
    links: [
      {
        title: "AIで社内業務を大幅に効率化したい",
        body:
          "専用AIエージェントで、調査・整理・下書きなどの下準備を任せ、人が本来の判断や改善に集中できる状態をつくります。",
        ctaLabel: "社内業務効率化の進め方を見る",
        href: "/solutions/ai-crew",
        image: {
          src: "/top-assets/roadmap-links/ai-crew-link.svg",
          alt: "AI Crew の具体的な業務ユースケースを示す背景イメージ",
        },
      },
      {
        title: "SaaSやWebサービスのAI化を進めたい",
        body:
          "既存のSaaSやWebサービスにAI機能を組み込み、顧客体験の向上や新たな収益機会につなげます。",
        ctaLabel: "自社サービスAI化の進め方を見る",
        href: "/solutions/ai-dashi",
        image: {
          src: "/top-assets/roadmap-links/ai-dashi-link.svg",
          alt: "AI Dashi の組み込み方を示す背景イメージ",
        },
      },
    ],
  } as const;
export const topPagePlatformRequirements = {
    title: {
      before: "企業がAIを",
      highlight: "安全に使いこなす",
      after: "ための、3つの基盤要件",
    },
    body:
      "AI導入を阻む壁を乗り越え、現場での定着と全社レベルのガバナンスを両立するために。QueryPie AIは、エンタープライズ企業が求める3つのシステム要件と支援体制を提供します。",
    videoUrl: "https://www.youtube.com/embed/B-BAQRoMUnU?start=5&rel=0",
    blocks: [
      {
        align: "left",
        label: "ガバナンス＆セキュリティの壁に対応",
        title: "権限制御と監査ログによる、強固なガバナンス統制",
        image: {
          src: "/top-assets/platform-requirements/governance.webp",
          alt: "権限制御と監査ログによるガバナンス統制のイメージ",
        },
        body:
          "「誰がどのデータにアクセスし、どう操作したか」を厳密に制御・記録します。情報漏洩リスクを排除する緻密なアクセス権限（RBAC）を設定し、エンタープライズの導入審査で必ず壁となるデータガバナンスとコンプライアンス要件を完全にクリアします。",
      },
      {
        align: "right",
        label: "技術的負債と運用泥沼の壁に対応",
        title: "ハルシネーションを防ぎ、既存システムと繋がるセキュアな統合",
        image: {
          src: "/top-assets/platform-requirements/integration.jpg",
          alt: "既存システムと繋がるセキュアな統合のイメージ",
        },
        body:
          "現在お使いのデータベースや業務システムを変更せず、API経由で安全にAIと接続できます。企業データのみに基づく事実回答（ガードレール）を実装し、業務利用で許されないAIの嘘（ハルシネーション）を防止。日進月歩のAIアーキテクチャへの追従もプラットフォーム側で吸収するので、技術的負債を防ぎます。",
      },
      {
        align: "left",
        label: "AI人材不足の壁に対応",
        title: "専門家伴走による、確実なプロトタイプ開発と定着",
        image: {
          src: "/top-assets/platform-requirements/fde-support.jpg",
          alt: "専門家伴走によるプロトタイプ開発と定着支援のイメージ",
        },
        body:
          "採用が極めて困難なAI専門エンジニアを自社で抱える必要はありません。当社のFDE（フォワード・デプロイド・エンジニア）がお客様の現場と対話しながら要件を定義し、素早く試作品（プロトタイプ）を構築。導入から運用、現場への定着までを伴走し、最速で事業のAI化を実現します。",
      },
    ],
  } as const;
export const topPageSecurity = {
    sectionName: "国際基準のセキュリティ認証",
    title: "国際基準のセキュリティ認証",
    body:
      "企業がAIを導入する際の最大の壁である「情報セキュリティ」と「コンプライアンス」。QueryPie AIは、SOC 2 Type II や ISO/IEC 27001 など、グローバル最高水準のセキュリティ認証を取得し、厳格な監査基準をクリアしています。",
    certifications: [
      {
        title: "SOC 2 Type II",
        src: "/top-assets/certifications/soc2.webp",
        alt: "SOC 2 Type II certification logo",
      },
      {
        title: "ISO/IEC 27001",
        src: "/top-assets/certifications/iso27001.png",
        alt: "ISO/IEC 27001 certification logo",
      },
      {
        title: "ISO/IEC 27701",
        src: "/top-assets/certifications/iso27701.png",
        alt: "ISO/IEC 27701 certification logo",
      },
      {
        title: "CSA STAR",
        src: "/top-assets/certifications/csastar.svg",
        alt: "CSA STAR certification logo",
      },
    ],
    link: {
      label: "セキュリティ・コンプライアンス（Trust Center）の詳細を見る",
      href: "https://trust.querypie.com/",
    },
  } as const;
export const topPageWhitepapers = {
    title: "経営層・事業責任者向け ホワイトペーパー",
    body:
      "AI活用の戦略策定や、自社サービスのAI化に向けたインサイトをまとめた資料を無料でダウンロードいただけます。",
    items: [
      {
        title: "なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか",
        tags: ["経営層向け", "組織変革", "社内AI活用"],
        description:
          "本ホワイトペーパーは事業責任者向けに、技術詳細やトレンド紹介ではなく、世界と日本のAI活用の温度差と日本企業の課題を踏まえ、今すぐ経営に組み込むための実務的プロセスと全社最適の変革指針を示す内容です。",
        toc: [
          "はじめに",
          "第1章 世界で進む「AI活用を前提にした経営」",
          "第2章 日本企業が直面する課題",
          "第3章 AIトランスフォーメーションを導入するために",
          "第4章 「なぜ今」取り組むべきなのか",
          "第5章 まとめ ― AIを「導入する」から「経営に組み込む」へ",
          "付録：AI導入準備度チェックリスト",
          "参考サイト",
        ],
        ctaLabel: "無料ダウンロード",
        href: "https://www.querypie.com/ja/features/documentation/white-paper/24/ai-tranformation-japan",
        image: {
          src: "/whitepapers/24/thumbnail.png",
          alt: "なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか ホワイトペーパー表紙",
        },
      },
      {
        title: "SaaSの終焉か、進化か 〜AIエージェント時代にSaaS企業が取るべき戦略〜",
        tags: ["プロダクト責任者向け", "SaaS戦略", "組み込みAI"],
        description:
          "本ホワイトペーパーは、AIエージェントがSaaSビジネスに与える影響を分析し、SaaS企業が取るべき戦略と、QueryPie AI自身のSaaSベンダーからAI Native企業への変革の実録をお伝えします。",
        toc: [
          "SaaSの成功とその終わりの兆し",
          "AIエージェントとは何か（SaaSにおけるユーザー側の動作）",
          "UI中心の業務は消える",
          "アプリケーションという概念の崩壊",
          "AIエージェント時代の働き方と組織",
          "AIエージェント時代に何から始めればいいのか？",
          "QueryPie AIの変革 ― 自らの「SaaSの死」を乗り越えた実録",
          "まとめ",
        ],
        ctaLabel: "無料ダウンロード",
        href: "https://www.querypie.com/ja/features/documentation/white-paper/30/saas-end-or-evolution",
        image: {
          src: "/solutions/ai-dashi/the-end-of-saas-or-its-evolution.png",
          alt: "SaaSの終焉か、進化か ホワイトペーパー表紙",
        },
      },
    ],
  } as const;
export const topPageFinalCta = {
    title: "信頼できるAI活用を、ここから前へ。",
    body: {
      line1: "大切なのは、安心して始められ、現場で使われ、定着し、広げられること。",
      line2:
        "どこからAI活用を始めるべきか、何を優先して整えるべきかなど、まずはお気軽にご相談ください。",
    },
    actions: [
      { label: "デモを依頼", href: topPageFinalDemoUrl },
      { label: "資料をダウンロード", href: topPageDownloadUrl },
      { label: "導入について相談する", href: topPageFinalConsultUrl },
    ],
  } as const;
