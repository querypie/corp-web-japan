import { getResourceItems } from "@/content/resources";
import { listGlossaryPublicationItems } from "@/lib/resources/glossary-publications";
import { listIntroductionDeckPublicationItems } from "@/lib/resources/introduction-deck-publications";
import { listManualPublicationItems } from "@/lib/resources/manual-publications";

export function listResourcePreviewItems() {
  return [
    ...listIntroductionDeckPublicationItems(),
    ...listGlossaryPublicationItems(),
    ...listManualPublicationItems(),
    ...getResourceItems("whitepaper"),
    ...getResourceItems("blog"),
  ] as const;
}

export function listManualPreviewItems() {
  return listManualPublicationItems();
}
