export const sampleHomeContent = {
  metadata: {
    title: "QueryPie AI Wireframe",
    description:
      "QueryPie AIのトップページ向けローファイワイヤーフレーム。企業が安心してAI導入を決められ、現場に定着するまでのストーリーを構造化しています。",
  },
  brand: {
    vision: "信頼できるAIを、すべての仕事へ。",
    mission:
      "私たちは、セキュリティを前提としたAI基盤により、誰もが安全に、迅速に、業務でAIを活用できる社会を実現します。",
  },
  header: {
    navItems: [
      {
        label: "ソリューション",
        children: [
          { label: "QueryPie AI Dashi", href: "/solutions/ai-dashi" },
          { label: "QueryPie AI Crew", href: "/solutions/ai-crew" },
        ],
      },
      { label: "できること", href: "#what-you-can-do" },
      { label: "導入事例", href: "#proof" },
      { label: "セキュリティ", href: "#security" },
      { label: "導入の進め方", href: "#adoption-flow" },
      { label: "資料ダウンロード", href: "#download" },
      { label: "お問い合わせ", href: "#contact" },
    ],
    primaryCta: { label: "資料ダウンロード", href: "#download" },
    secondaryCta: { label: "デモを依頼", href: "#contact" },
  },
  hero: {
    sectionName: "Hero",
    purpose:
      "信頼・安全性・現場活用の3点を最速で伝え、意思決定者にも現場にも“検討に値する”と感じてもらう。",
    catch: "信頼できるAIが、現場を動かす。",
    heading: "信頼できるAIが、\n現場を動かす。",
    body:
      "QueryPie AIは、強固なセキュリティとガバナンスを前提に、誰もが安全かつ迅速に業務で使えるAI基盤です。経営層が求める信頼と、現場が求める使いやすさを両立し、AI活用をスモールスタートから実運用・定着まで前に進めます。",
    labels: [],
    proofPills: ["セキュアなAI基盤", "全社展開を見据えた設計", "権限管理を前提に設計"],
    heroImage: {
      src: "/hero-sample-2.png",
      alt: "QueryPie AIの導入イメージを想起させる、オフィスでAIダッシュボードを活用するチーム",
    },
    primaryCta: { label: "デモを依頼", href: "#contact" },
    secondaryCta: { label: "資料をダウンロード", href: "#download" },
    mockTitle: "導入後の利用イメージ",
  },
  whyNow: {
    sectionName: "Why Now",
    purpose:
      "AI導入を単なる効率化施策ではなく、経営課題への対策として位置づける。",
    title: "AI活用は、効率化ではなく経営課題への対策です。",
    body:
      "人手不足、DX格差、生産性の伸び悩みが同時に進む中で、仕事の進め方そのものを変えない企業ほど競争力を失います。100点のシステムを待つより、60点でも今使えるAIを回し始めることが差になります。",
    cards: [
      {
        title: "人手不足",
        body: "採用だけでは埋まらない業務負荷を、AIで先に減らす必要があります。",
        stat: "採用で埋まらない業務量",
      },
      {
        title: "DX格差",
        body: "AI活用の差が、そのまま意思決定速度と改善速度の差になります。",
        stat: "意思決定速度の差",
      },
      {
        title: "生産性の低さ",
        body: "調査、検索、作成、確認といった下準備業務が、利益を圧迫します。",
        stat: "付加価値を生まない時間",
      },
    ],
  },
  whyFails: {
    sectionName: "Why AI Fails",
    purpose:
      "多くのAI導入が止まる理由を整理し、問題が技術だけでないことを伝える。",
    title: "AI導入の失敗要因は、\n技術不足ではなく“全社で安心して使えないこと”です。",
    body:
      "AI導入はITプロジェクトではなく組織変革です。便利でも、現場が使えない。精度が高くても、権限や監査に不安がある。効果が出ても、ROIが見えない。こうした要因で多くの導入は止まります。",
    cards: [
      {
        title: "現場に使われない",
        body: "使い方が業務に合わず、結局いつものやり方に戻ってしまう。",
      },
      {
        title: "データと業務が分断されている",
        body: "必要な情報につながらず、AIが答えても実務で使える形にならない。",
      },
      {
        title: "安全性とROIが見えず意思決定が止まる",
        body: "経営層・情シス・セキュリティ部門が判断できる材料が揃わない。",
      },
    ],
    emphasis: "AI導入は“試すこと”ではなく、“定着させること”まで設計して初めて前に進みます。",
  },
  solution: {
    sectionName: "QueryPie AI Solution",
    purpose:
      "QueryPie AIの提供価値を、信頼・速さ・定着の3軸で最もわかりやすく示す。",
    title: "QueryPie AIは、企業のAI活用に必要な\n3つの条件をまとめて満たします。",
    body:
      "“信頼できるAIが、現場を動かす” を実現するために、QueryPie AIは信頼・速さ・定着を同時に設計します。",
    cards: [
      {
        title: "信頼",
        body: "アクセス制御、権限管理、監査ログ、データガバナンスを前提に、安全に導入判断できる。",
        bullets: ["経営層が説明できる安心感", "情シス・セキュリティ部門が通しやすい設計"],
      },
      {
        title: "速さ",
        body: "既存業務に合わせて素早く使い始められ、まず成果が出る業務から小さく始められる。",
        bullets: ["PoCで終わらせない初期設計", "現場がすぐ試せる導線とUI"],
      },
      {
        title: "定着",
        body: "導入で終わらず、使われるAIとして業務に入り込み、全社展開まで見据えて運用できる。",
        bullets: ["部門別ユースケース設計", "成果の見える化と横展開"],
      },
    ],
    summary: [
      "安全に始められる",
      "すぐに試せる",
      "全社へ広げられる",
    ],
  },
  workReduction: {
    sectionName: "What You Can Do",
    purpose:
      "機能ではなく、減らせる仕事・速くなる仕事で現場価値を可視化する。",
    title: "AIは人の代わりではなく、仕事を減らす装置です。",
    body:
      "情報検索、資料作成、問い合わせ対応、会議後業務、定型業務のような“止まりやすい仕事”を先に減らすことで、人は判断と改善に集中できます。",
    items: [
      {
        title: "情報検索",
        before: "資料・議事録・SaaS・チャットを行き来して探す",
        after: "権限を守りながら必要情報を横断検索して即要約",
      },
      {
        title: "資料作成",
        before: "過去資料を探し、構成を考え、たたき台を作る",
        after: "目的に沿った一次ドラフトと参照情報を自動で提示",
      },
      {
        title: "問い合わせ対応",
        before: "FAQ確認、担当確認、返答文作成に時間がかかる",
        after: "問い合わせ内容に応じて参照先と返答案を即時整理",
      },
      {
        title: "会議後業務",
        before: "議事録整理、ToDo抽出、共有文作成が後回しになる",
        after: "決定事項・担当・期限を会議直後に自動整理",
      },
      {
        title: "定型業務",
        before: "毎回同じ確認・転記・下書きで工数が消える",
        after: "定義済みフローに沿ってAIが前処理を実行",
      },
    ],
  },
  security: {
    sectionName: "Security & Governance",
    purpose:
      "QueryPie AI最大の差別化軸である、企業導入に必要な安全性と運用性を示す。",
    title: "企業で使うAIに必要なのは、賢さだけではありません。",
    body:
      "本番利用で問われるのは、誰が何にアクセスできるか、どう守り、どう記録し、どう全社へ広げるかです。QueryPie AIは、アクセス制御・監査・認証・運用設計を通じて、企業に必要なガードレールを備えます。",
    executiveMessage: {
      title: "経営層が判断しやすい設計。",
      body: "アクセス制御、監査、認証、運用ルールまで見えることが、安心して導入を決める前提になります。",
    },
    operatorMessage: {
      title: "現場が迷わず使える設計。",
      body: "使ってよい範囲が明確で、必要な情報へ安全に届き、操作が追えることが、現場定着の前提になります。",
    },
    badges: [
      "SOC 2 Type II",
      "ISO/IEC 27001",
      "Trust Center",
    ],
    items: [
      {
        title: "アクセス制御",
        body: "ユーザーや役割ごとに、AIが参照できる情報範囲を制御します。",
      },
      {
        title: "権限管理",
        body: "任せる範囲と人の承認を切り分け、安心して運用できる状態をつくります。",
      },
      {
        title: "監査ログ",
        body: "誰が何を見て、どの操作を行ったかを追える状態を保ちます。",
      },
      {
        title: "データガバナンス",
        body: "企業データの扱いを統制し、安全なAI活用を全社へ広げやすくします。",
      },
    ],
    certificationsTitle: "グローバル基準の認証で、選定時の不安を減らす。",
    certificationsBody:
      "SOC 2 Type II や ISO/IEC 27001 などの認証取得と情報開示により、企業導入時に求められる信頼性の確認を進めやすくします。",
    links: [
      { label: "認証情報を見る", href: "https://www.querypie.ai/ja/company/certifications" },
    ],
  },
  useCases: {
    sectionName: "Use Cases",
    purpose:
      "部門ごとに“自分の業務で使える”状態をイメージさせる。",
    title: "部門ごとに、減らしたい仕事から始められます。",
    body:
      "全社一律ではなく、部門ごとに負荷の高い仕事からAIを適用することで、成果を見せながら広げられます。",
    tabs: ["営業", "バックオフィス", "管理職", "情シス / セキュリティ"],
    cards: [
      {
        role: "営業",
        title: "提案前準備を短縮",
        body: "顧客情報、過去提案、議事録、競合情報をまとめ、提案の初速を上げる。",
      },
      {
        role: "バックオフィス",
        title: "問い合わせと社内確認を効率化",
        body: "規程・マニュアル・申請情報を参照し、一次回答と確認先を整理する。",
      },
      {
        role: "管理職",
        title: "会議とレポートの負荷を軽減",
        body: "会議サマリー、論点整理、進捗把握を素早く行い、判断に時間を使える。",
      },
      {
        role: "情シス / セキュリティ",
        title: "安全な全社展開を管理",
        body: "権限、監査、ポリシー運用を前提に、無理なくAIを広げられる。",
      },
    ],
  },
  solutions: {
    sectionName: "Solutions",
    purpose:
      "企業ごとの導入フェーズや提供形態に合わせて、最適なAI活用の入り口を示す。",
    title: "課題に応じて、最適なかたちでAI活用を前に進めます。",
    body:
      "QueryPie AIは、企業ごとの課題や体制、求める導入スピードに応じて、専用AIエージェントの設計・実運用支援から、組み込み型のエンタープライズAI基盤の提供まで、柔軟に支援します。",
    helper:
      "企業ごとのフェーズや提供形態に応じて、最適なソリューションを選べます。",
    cards: [
      {
        title: "AI Crew",
        subtitle: "専用AIエージェント設計・実運用支援",
        body:
          "業務に合わせた専用AIエージェントを設計し、導入から運用、改善までを伴走支援します。PoCで終わらず、現場で使われるAI活用へつなげます。",
        cta: "AI Crewを見る",
        href: "/solutions/ai-crew",
      },
      {
        title: "AI Dashi",
        subtitle: "ホワイトラベルビジネス / 組み込み型エンタープライズAI基盤",
        body:
          "自社サービスや業務基盤に組み込める、エンタープライズ向けAI基盤です。安全性、拡張性、運用性を備えたAI機能を、自社ブランドや既存プロダクトに展開できます。",
        cta: "AI Dashiを見る",
        href: "/solutions/ai-dashi",
      },
    ],
  },
  products: {
    sectionName: "Products & Services",
    purpose:
      "ソリューションを支えるプロダクト群と専門支援をまとめて提示し、実運用への安心感を補強する。",
    title: "AI活用を支えるプロダクトと専門支援。",
    body:
      "安全なAI活用を全社に広げるために、QueryPieはプラットフォーム、アクセス制御、専門家伴走支援、コミュニケーション支援まで、実運用に必要な機能と支援を一体で提供します。",
    helper:
      "専用設計から基盤提供まで、選べるソリューションを支えるのが、以下のプロダクトと専門支援です。",
    footer:
      "プロダクトと専門支援を組み合わせ、企業ごとの課題に合ったAI活用を設計できます。",
    cards: [
      {
        category: "AI Platform",
        title: "QueryPie AIP",
        body:
          "エンタープライズAIプラットフォーム。安全性と使いやすさを両立し、企業のAI活用を全社へ広げます。",
        cta: "AIPを見る",
        href: "#solution",
      },
      {
        category: "Security & Governance",
        title: "QueryPie ACP",
        body:
          "アクセスコントロールにより、権限管理と統制を強化。企業に求められる安全なAI利用を支えます。",
        cta: "ACPを見る",
        href: "#security",
      },
      {
        category: "Expert Support",
        title: "QueryPie FDE",
        body:
          "専門家伴走支援・フォワードデプロイドエンジニア。設計から導入、定着まで、現場と経営の両面を支援します。",
        cta: "FDEを見る",
        href: "#contact",
      },
      {
        category: "Communication",
        title: "Lingo",
        body:
          "リアルタイム翻訳で、言語の壁を越えたコミュニケーションを支援。現場のスピードと連携を高めます。",
        cta: "Lingoを見る",
        href: "#contact",
      },
      {
        category: "Coming Soon",
        title: "CRM / OCR",
        body:
          "AI活用の適用領域をさらに広げる新サービスを開発中です。業務データの活用と現場効率化を、次の段階へ進めます。",
        cta: "近日公開",
        href: "#contact",
      },
    ],
  },
  adoptionFlow: {
    sectionName: "Adoption Flow",
    purpose:
      "小さく始めて大きく広げる導入ストーリーを示し、導入ハードルを下げる。",
    title: "小さく始めて、大きく広げる。だから導入しやすい。",
    body:
      "いきなり全社最適を目指すのではなく、まずは成果の出やすい業務から始めることで、導入判断も現場定着も進みやすくなります。",
    steps: [
      {
        step: "Step 1",
        title: "すぐ効く業務から始める",
        body: "検索、要約、一次ドラフト、定型対応など成果が見えやすい仕事に絞る。",
      },
      {
        step: "Step 2",
        title: "成果を可視化する",
        body: "削減時間、利用率、処理件数、回答速度などを見える化する。",
      },
      {
        step: "Step 3",
        title: "全社へ広げる",
        body: "運用ルールとガバナンスを保ったまま、他部門・他業務へ横展開する。",
      },
    ],
  },
  proof: {
    sectionName: "Case Studies / Proof",
    purpose:
      "導入後の成果イメージを数値と事例で見せ、問い合わせへの最後の後押しを行う。",
    title: "“使われるAI”だから、成果が説明しやすい。",
    body:
      "作業時間削減、利用率向上、問い合わせ削減、資料作成時間短縮など、経営層にも現場にも説明しやすい成果指標で評価できます。",
    stats: [
      { label: "作業時間削減", value: "-35%" },
      { label: "社内利用率", value: "+62%" },
      { label: "問い合わせ一次回答時間", value: "1/3" },
      { label: "資料作成初稿時間", value: "1/4" },
    ],
    cases: [
      {
        title: "営業部門の提案準備を短縮",
        body: "情報収集と提案下書きの時間を削減し、商談前準備を高速化。",
        metric: "提案準備時間を大幅圧縮",
      },
      {
        title: "バックオフィス問い合わせを平準化",
        body: "社内規程やFAQを参照した一次回答で、対応負荷と属人化を軽減。",
        metric: "問い合わせ対応の初動を短縮",
      },
      {
        title: "管理職レポートの集計負荷を軽減",
        body: "会議サマリーと進捗整理を自動化し、判断材料を早く揃える。",
        metric: "報告業務のリードタイムを短縮",
      },
    ],
  },
  finalCta: {
    sectionName: "Final CTA",
    purpose:
      "強い締めコピーと複数CTAで、デモ依頼・資料請求・相談へつなげる。",
    title: "信頼できるAI活用を、ここから前へ。",
    body:
      "大切なのは、AIの派手さではなく、安心して始められ、現場で使われ、定着し、広げられること。QueryPie AIは、その一歩を企業の実運用までつなぐための基盤です。",
    actions: [
      { label: "デモを依頼", href: "#contact" },
      { label: "資料をダウンロード", href: "#download" },
      { label: "導入について相談する", href: "#contact" },
    ],
  },
  footer: {
    columns: [
      {
        title: "製品",
        links: ["製品概要", "できること", "セキュリティ", "導入の進め方"],
      },
      {
        title: "活用情報",
        links: ["導入事例", "資料ダウンロード", "お知らせ", "イベント"],
      },
      {
        title: "会社情報",
        links: ["会社概要", "採用情報", "お問い合わせ", "パートナー"],
      },
    ],
    legal: ["プライバシーポリシー", "セキュリティ", "利用規約"],
  },
} as const;
