import { getResourceItems, type ResourceItem } from "@/content/resources";
import { listGlossaryPublicationItems } from "@/lib/resources/glossary-publications";
import { listIntroductionDeckPublicationItems } from "@/lib/resources/introduction-deck-publications";
import { listManualPublicationItems } from "@/lib/resources/manual-publications";

function withResourceListIds(prefix: string, items: readonly ResourceItem[]) {
  return items.map((item) => ({
    ...item,
    id: `${prefix}:${item.id}`,
  }));
}

export function listResourcePreviewItems() {
  return [
    ...withResourceListIds("introduction-deck", listIntroductionDeckPublicationItems()),
    ...withResourceListIds("glossary", listGlossaryPublicationItems()),
    ...withResourceListIds("manuals", listManualPublicationItems()),
    ...withResourceListIds("whitepapers", getResourceItems("whitepaper")),
    ...withResourceListIds("blog", getResourceItems("blog")),
  ];
}

export function listManualPreviewItems() {
  return listManualPublicationItems();
}
