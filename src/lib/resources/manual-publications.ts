import * as path from "node:path";
import { BaseResourcePublicationRepository } from "@/lib/resources/base-resource-publication";

class ManualPublications extends BaseResourcePublicationRepository {
  protected readonly category = "manuals" as const;
  protected readonly badge = "マニュアル";
  protected readonly contentRoot = path.join(process.cwd(), "src/content/documentation/manuals");
}

export const manualPublications = new ManualPublications();

export const listManualPublicationItems = () => manualPublications.listItems();
export const getManualPublicationRecord = (id: string) => manualPublications.getRecord(id);
export const listManualPublicationParams = () => manualPublications.listParams();
export const listManualPublicationIds = () => manualPublications.listIds();
