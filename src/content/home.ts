const demoUseCasesUrl = "https://www.querypie.ai/ja/features/demo?category=use-cases";

export const homePageContent = {
  metadata: {
    title: "作業を減らし、成果を増やす。",
    description:
      "調査、データ整理、下書きなど、時間のかかる下準備をAIに任せて効率化。人員を増やすことなく、企業の生産性・利益率の向上を実現します。",
  },
  hero: {
    eyebrow: "専用AIエージェントの設計・実運用支援",
    title: "作業を減らし、\n成果を増やす。",
    subcopy: "利益を生み出す実務特化型AIエージェント",
    body:
      "調査、データ整理、下書きなど、時間のかかる「下準備」をAIに任せて効率化。人員を増やすことなく、企業の生産性・利益率の向上を実現します。",
    primaryCta: { label: "業務に合うAI活用を相談する", href: "#contact" },
    secondaryCta: { label: "活用事例を見る", href: "#roles" },
    imageSrc: "/solutions/ai-crew/hero-visual.webp",
    imageAlt: "オフィスでAIアシスタント画面を活用しながら業務を進めるチームのイメージ",
  },
  lostSection: {
    title: "人手不足と見えないコストが、企業の成長を鈍化させる。",
    paragraphs: [
      "労働人口の減少と人件費の高騰が続く中、多くの企業が「人が足りない」「採用できない」という深刻な課題に直面しています。",
      "しかし、本当に人が足りないのでしょうか？ 現場の実態は、情報収集、データの転記、資料の下書きといった付加価値を生まない作業（＝見えないコスト）に、優秀な社員の貴重な時間が奪われているケースがほとんどです。",
      "「残業でカバーする」「人を増やして解決する」という従来のやり方は、もはや限界を迎えています。この非効率を放置し、社員を疲弊させ続けることは、企業の利益を削り落とし、競争力を失う最大の経営リスクなのです。",
    ],
  },
  whitepaperCta: {
    label: "White Paper",
    title: "なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか",
    body:
      "AI活用を単なる業務改善で終わらせず、事業変革につなげるための視点をまとめました。",
    cta: "ホワイトペーパーを読む",
    href: "https://www.querypie.com/ja/features/documentation/white-paper/24/ai-tranformation-japan",
  },
  floatingCta: { label: "業務に合うAI活用を相談する", href: "#contact" },
  featureIntro: {
    eyebrow: "AI Crewの考え方",
    title: "AI Agentではなく、AI Crew",
    body:
      "AIを単なる便利なツールとしてではなく、貴社のチームに加わる**「新しい同僚」**として迎え入れる。それが私たちの考え方です。\n\n企業の業務効率化に必要なのは、人間が指示を考えながら操作しなければならない汎用AIではありません。貴社の業務フローやルールを理解し、面倒な情報収集やデータ整理といった下準備を自律的に巻き取ってくれる、優秀な部下やアシスタントのような存在です。\n\nQueryPie AIが提供するAIプラットフォーム（AIP）は、システムとして裏側で動くだけでなく、各業務に合ったAIエージェントを構築し、現場の仲間（Crew）の一員として実務を分担。チーム全体の生産性を劇的に引き上げる最高品質のAIソリューションです。",
    subtitle: "あなたの実務を担うAI、5つの設計要素",
    imageSrc: "/solutions/ai-crew/concept-team.webp",
    imageAlt: "人とAI Crewが同じチームの一員として業務を分担するイメージ",
  },
  featureTabs: [
    {
      label: "業務定義",
      heading: "任せる業務と期待する成果を明確にする",
      description:
        "任せる業務と成果物を決め、役割を明確にします。",
      cta: "",
      panelTitle: "業務定義",
      panelSubtitle: "任せる業務と成果物の整理",
      tags: ["担当業務", "対象チーム", "成果物", "承認範囲"],
      cards: ["対象業務", "成果物", "期待成果"],
    },
    {
      label: "文脈設定",
      heading: "必要なデータと前提知識をつなぐ",
      description:
        "必要な社内データや前提知識につなぎ、使える状態に整えます。",
      cta: "",
      panelTitle: "文脈設定",
      panelSubtitle: "必要な情報と前提知識の接続",
      tags: ["Notion", "Slack", "CRM", "Docs", "Tickets"],
      cards: ["参照データ", "関連システム", "前提知識"],
    },
    {
      label: "出力設計",
      heading: "現場で使える形でアウトプットさせる",
      description:
        "要約、比較表、一次ドラフトなど、使いやすい形式を定義します。",
      cta: "",
      panelTitle: "出力設計",
      panelSubtitle: "現場で使える形式への最適化",
      tags: ["調査", "作成", "整理", "分析"],
      cards: ["要約", "比較表", "ドラフト"],
    },
    {
      label: "権限管理",
      heading: "任せる範囲と人の承認を明確にする",
      description:
        "アクセス範囲と承認フローを定め、安心して任せられる形にします。",
      cta: "",
      panelTitle: "ガードレール",
      panelSubtitle: "アクセス範囲と承認フローの整理",
      tags: ["承認", "レビュー", "権限", "監査"],
      cards: ["アクセス範囲", "承認条件", "レビュー運用"],
    },
    {
      label: "効果検証",
      heading: "利用量ではなく、業務への貢献で見る",
      description:
        "工数削減や品質改善を確認し、次の改善や横展開につなげます。",
      cta: "",
      panelTitle: "運用ダッシュボード",
      panelSubtitle: "業務への貢献度を確認",
      tags: ["稼働状況", "成果物数", "削減時間", "次の改善候補"],
      cards: ["工数削減", "回答速度", "品質確認"],
    },
  ],
  comparison: {
    eyebrow: "考え方",
    title: "AIに下準備を任せ、人は判断と創造に集中する",
    body:
      "**現場が止まるのは、判断の前にある業務が多すぎるから。**情報収集、データ整理、一次ドラフト作成、ログ確認などの下準備をAIに任せることで、人は最終判断、顧客対応、企画や改善など、本来注力すべき仕事に集中できます。",
  },
  roi: {
    eyebrow: "Technology & Security",
    title: "実務での安全なAI活用を支える\nエンタープライズAI基盤 QueryPie AIP",
    body:
      "自律したAIエージェントを実務で安心安全に活用するために不可欠な要素を兼ね備えています。",
    cards: [
      {
        title: "頭脳 / Brain",
        body:
          "業務特性に合わせて最適なLLMを使い分け\n入力した社内データの外部学習はなし",
        stat: "マルチLLM / データ保護",
      },
      {
        title: "連携 / Connect",
        body:
          "ゼロトラスト基準で社内システムと繋がり文脈を理解\nQueryPieが誇る厳格なアクセス制御",
        stat: "社内連携 / アクセス制御",
      },
      {
        title: "業務知識 / Knowledge",
        body:
          "手順書を記憶しハルシネーションを抑える\n自社の信頼できるデータを参照",
        stat: "業務再現 / 事実参照",
      },
      {
        title: "統制 / Governance",
        body:
          "エンタープライズ水準の監査ログ\nシャドーAIや情報漏洩リスクを低減",
        stat: "監査ログ / 人の承認",
      },
    ],
  },
  problem: {
    eyebrow: "なぜ今なのか",
    title: "一次対応に時間がかかる",
    body: "",
    cards: [
      {
        title: "情報が散らばり調査と確認に時間がかかる",
        body: "",
      },
      {
        title: "下準備が多く本来の判断に時間を使えない",
        body: "",
      },
    ],
  },
  roles: {
    eyebrow: "Use Cases",
    title: "まずは、貴社で最も負荷の高い業務から",
    body:
      "改善インパクトの大きい業務を起点に、業務フローや運用ルールに合わせて設計します。まずは、効果が見えやすい領域から小さく始められます。以下は、実際にご相談の多い業務例です。",
    note:
      "他にも、データ分析、開発、製造、審査、見積、SEO分析など、貴社の業務に合わせた活用例をご覧いただけます。",
    primaryCta: { label: "すべての活用事例を見る", href: demoUseCasesUrl },
    secondaryCta: { label: "業務に合うAI活用を相談する", href: "#contact" },
    cards: [
      {
        category: "マーケティング",
        title: "SEO分析",
        body:
          "サイト分析、改善ポイント整理、ダッシュボード化までを短時間で支援。SEOの現状把握と次の打ち手を見えやすくします。",
        videoHref: "https://youtu.be/K-ld_s4Che0",
        detailHref: "https://www.querypie.ai/ja/features/demo/use-cases/29/seo-analyst",
      },
      {
        category: "見積・営業",
        title: "見積業務",
        body:
          "見積関連文書の確認から、複雑な見積ロジックに基づく出力までを支援。属人化しやすい見積業務を効率化します。",
        tabs: [
          {
            label: "見積分析",
            body:
              "ローカルファイルやパスワード付きPDFをアップロードせずに分析し、確認や比較の手間を減らします。",
            videoHref: "https://youtu.be/qwvyVcTaDsA",
            detailHref: "https://www.querypie.ai/ja/features/demo/use-cases/28/quotation-analyze-ai-agent",
          },
          {
            label: "見積書作成",
            body:
              "複雑な価格表や条件をスキル化し、指定フォーマットで正確な見積書を出力します。",
            videoHref: "https://youtu.be/mKZrCQti0Rc",
            detailHref: "https://www.querypie.ai/ja/features/demo/use-cases/27/quotation-ai-agent",
          },
        ],
      },
      {
        category: "開発",
        title: "開発インサイト",
        body:
          "Git、PR、チケット、CI/CD、インシデントを横断し、開発状況とリスクを会話型で可視化。開発チームの意思決定を支援します。",
        videoHref: "https://youtu.be/cWC5lzN1JnE",
        detailHref: "https://www.querypie.ai/ja/features/demo/use-cases/16/dev-insight-ai-agent",
      },
      {
        category: "分析・経営",
        title: "データ分析",
        body:
          "自然言語での質問から、データ抽出、可視化、インサイト整理までを支援。アドホックな分析依頼やレポート作成の負荷を下げます。",
        videoHref: "https://youtu.be/f_yM6dinVU4",
        detailHref: "https://www.querypie.ai/ja/features/demo/use-cases/7/data-analytics-agent",
      },
    ],
  },
  process: {
    eyebrow: "How It Works",
    title: "導入は5ステップ、任せやすい業務から小さく始める",
    body:
      "業務課題のヒアリングから、テスト導入（PoC）、試作版の構築、本番導入、改善までを一気通貫で支援します。\nいきなり全社導入する必要はありません。まずは1つの業務から始め、成果が見えた領域から広げられます。",
    steps: [
      {
        step: "STEP 01",
        title: "業務課題ヒアリング",
        body: "現場で時間がかかっている業務、分散しているデータ、任せたい作業範囲を整理し、どこで業務が滞っているかを明確にします。",
      },
      {
        step: "STEP 02",
        title: "対象業務の選定・テスト導入設計",
        body: "まず何をAIに任せると効果が出やすいかを定め、対象部門・利用データ・連携先・期待成果・評価指標を設計します。",
      },
      {
        step: "STEP 03",
        title: "試作版の構築",
        body: "貴社の業務フローに合わせて、AIの役割、手順、参照データ、出力形式を設計し、実際に触れる形まで組み上げます。",
      },
      {
        step: "STEP 04",
        title: "PoC実施・評価",
        body: "実際の業務に近い形で検証し、回答品質、工数削減、運用しやすさを確認します。",
      },
      {
        step: "STEP 05",
        title: "本番導入・改善横展開",
        body: "効果が確認できた業務から本番環境へ展開し、既存システム連携や利用権限を整えながら、他部署や他業務へ広げていきます。",
      },
    ],
    note: "",
    primaryCta: { label: "進め方を相談する", href: "#contact" },
    secondaryCta: { label: "活用事例を見る", href: demoUseCasesUrl },
  },
  testimonials: {
    eyebrow: "Impact & Cost",
    title: "現場は仕事が進むスピードを、経営は投資対効果を実感",
    body:
      "負荷が高い業務から始めることで、現場は業務を前に進めやすくなり、経営も効果とコストを確認しながら導入を広げられます。",
    items: [
      {
        comment: "AIツールを1つ増やした感覚ではなく、実務を支えてくれる新しい同僚という感覚に近いです。",
        name: "マーケティング担当者",
        company: "B2B事業会社",
        brand: "MKT",
      },
      {
        comment: "問い合わせ対応の初動が圧倒的に速くなり、担当者が本当に時間を使うべき難易度の高い案件や攻めのサクセス業務に集中できるようになりました。",
        name: "カスタマーサポート責任者",
        company: "SaaS運営チーム",
        brand: "CS",
      },
      {
        comment: "会議前に必要な市場データや議事録が先に整理されているので、分析担当の準備負荷が劇的に軽くなりました。",
        name: "事業企画マネージャー",
        company: "成長フェーズ企業",
        brand: "BD",
      },
      {
        comment: "最初から大きく変えず、まずはこの1つの業務だけと小さく始められたので、現場への導入もスムーズでした。",
        name: "オペレーション統括",
        company: "業務支援組織",
        brand: "OPS",
      },
    ],
    pricing: {
      title: "固定費ではなく、業務量に応じたクレジット制",
      body:
        "専用AIエージェントの導入に、多額の初期費用や固定コストは必要ありません。\n人数ではなく、どれだけの業務を支援したかに応じたクレジット制です。まずは、最もボトルネックの大きい業務から小さく始められます。",
      bullets: [
        {
          title: "必要な分だけ使えるコスト設計",
          body:
            "月額固定ではなく、必要な業務ボリュームに応じて利用量を調整できます。繁忙期と閑散期に合わせて、無駄の少ない運用が可能です。",
        },
        {
          title: "部署をまたいでも管理しやすい",
          body:
            "マーケティング、経理、人事、開発など、複数部署で活用しても、利用は共通のクレジットで管理できます。導入範囲を広げる際も、コストを把握しやすくなります。",
        },
      ],
    },
  },
  system: {
    eyebrow: "運用設計",
    title: "AI Crewは、\n安全に実務へつなげて動かします。",
    body:
      "AI Crewは、LLM、社内ドキュメント、SaaS連携、ルール設定を組み合わせながら動きます。だからこそ、ただ会話するだけでなく、実務に必要な情報、権限、承認条件を持った状態で運用できます。",
    inputs: ["Notion", "Slack", "CRM", "Docs", "BI", "Ticketing"],
    guardrails: ["権限範囲の設定", "承認条件の維持", "役割別ルールの分離"],
    flow: [
      "必要な業務コンテキストを読み取り、情報を集めます",
      "草案・整理・分析などの途中工程を先に進めます",
      "レビューと承認を経て、実務成果につなげます",
    ],
  },
  footer: {
    brand: {
      name: "QueryPie AI",
      tagline:
        "人員追加の前に、業務に合うAI Crewを。AI Crewは、止まりやすい仕事の流れをつなぎ直し、既存チームが仕事を前へ進められるよう支える役割型のAIエージェントです。",
    },
    groups: [
      {
        title: "AI Crew",
        links: [
          { label: "AI Crewとは", href: "#about" },
          { label: "ユースケース", href: demoUseCasesUrl },
          { label: "導入効果", href: "#impact" },
        ],
      },
      {
        title: "導入検討",
        links: [
          { label: "活用できるユースケースを見る", href: demoUseCasesUrl },
          { label: "進め方を相談する", href: "#contact" },
        ],
      },
      {
        title: "参考情報",
        links: [
          { label: "なぜ今なのか", href: "#why" },
          { label: "お問い合わせ", href: "#contact" },
        ],
      },
    ],
    legal: {
      copyright: "© 2017-2026 QueryPie AI. All rights reserved.",
      notes: ["QueryPie AI"],
    },
  },
  contact: {
    eyebrow: "お問い合わせ",
    title: "どの業務から始めるべきか、\nまずは一緒に整理しませんか？",
    body:
      "まだ対象業務が明確でなくても問題ありません。\nQueryPie AIの専門チームが、貴社のボトルネック整理からPoCの進め方までご一緒します。",
    primaryCta: { label: "業務に合うAI活用を相談する", href: "#contact" },
    secondaryCta: { label: "活用事例を見る", href: demoUseCasesUrl },
    partnerBadge: "SaaSやWebサービスのAI化を進めたい企業様へ",
    partnerTitle: "貴社のサービスを、最短でAI化しませんか？",
    partnerBody:
      "自社サービスのAI化を、ゼロから数千万円かけて開発する必要はありません。QueryPie AIの強固なAI基盤を、貴社のブランドとUIのまま組み込めるAIソリューションを提供しています。専門エンジニア（FDE）が伴走し、最短1ヶ月で貴社の顧客に新しいAI体験を届けることが可能です。",
    partnerCta: { label: "自社サービスAI化の進め方を見る", href: "/solutions/ai-dashi" },
  },
} as const;
