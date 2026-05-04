import { getResourceItems, type ResourceItem } from "@/content/resources";
import { listGlossaryPublicationItems } from "@/lib/resources/glossary-publications";
import { listIntroductionDeckPublicationItems } from "@/lib/resources/introduction-deck-publications";
import { listManualPublicationItems } from "@/lib/resources/manual-publications";

const manualExternalItems: ResourceItem[] = [
  {
    href: "https://aip-docs.app.querypie.com/ja/user-guide",
    imageSrc: "/manuals/aip-guide/thumbnail.png",
    badge: "マニュアル",
    title: "QueryPie AIP マニュアル",
    description: "AIP のユーザーガイドを外部ドキュメントサイトで確認できます。",
  },
  {
    href: "https://docs.querypie.com/ja",
    imageSrc: "/manuals/acp-guide/thumbnail.png",
    badge: "マニュアル",
    title: "QueryPie ACP マニュアル",
    description: "ACP の管理者・利用者向けドキュメントを外部ドキュメントサイトで確認できます。",
  },
  {
    href: "/api-docs.html",
    imageSrc: "/manuals/api-docs/thumbnail.png",
    badge: "マニュアル",
    title: "API Docs",
    description: "API リファレンスと関連開発資料への入口です。",
  },
];

export function listResourcePreviewItems() {
  return [
    ...listIntroductionDeckPublicationItems(),
    ...listGlossaryPublicationItems(),
    ...listManualPublicationItems(),
    ...manualExternalItems,
    ...getResourceItems("whitepaper"),
    ...getResourceItems("blog"),
  ] as const;
}

export function listManualPreviewItems() {
  return [...listManualPublicationItems(), ...manualExternalItems] as const;
}
