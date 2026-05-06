import * as path from "node:path";
import { BaseResourcePublicationRepository } from "@/lib/resources/base-resource-publication";

class ManualPublications extends BaseResourcePublicationRepository {
  protected readonly category = "manuals" as const;
  protected readonly badge = "マニュアル";
  protected readonly contentRoot = path.join(process.cwd(), "src/content/manuals");

  protected override listSourceFiles() {
    return [
      "1-querypie-acp-community-install-guide.mdx",
      "2-acp-administrator-manual.mdx",
      "3-acp-user-manual.mdx",
      "4-acp-api-reference.mdx",
      "5-acp-manual.mdx",
      "6-aip-manual.mdx",
      "7-acp-release-notes.mdx",
    ] as const;
  }
}

export const manualPublications = new ManualPublications();

export const listManualPublicationItems = () => manualPublications.listItems();
export const getManualPublicationRecord = (id: string) => manualPublications.getRecord(id);
export const listManualPublicationParams = () => manualPublications.listParams();
export const listManualPublicationIds = () => manualPublications.listIds();
