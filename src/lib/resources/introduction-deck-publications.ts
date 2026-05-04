import * as path from "node:path";
import { BaseResourcePublicationRepository } from "@/lib/resources/base-resource-publication";

class IntroductionDeckPublications extends BaseResourcePublicationRepository {
  protected readonly category = "introduction-deck" as const;
  protected readonly badge = "紹介資料";
  protected readonly contentRoot = path.join(process.cwd(), "src/content/documentation/introduction-deck");
}

export const introductionDeckPublications = new IntroductionDeckPublications();

export const listIntroductionDeckPublicationItems = () => introductionDeckPublications.listItems();
export const getIntroductionDeckPublicationRecord = (id: string) => introductionDeckPublications.getRecord(id);
export const listIntroductionDeckPublicationParams = () => introductionDeckPublications.listParams();
export const listIntroductionDeckPublicationIds = () => introductionDeckPublications.listIds();
