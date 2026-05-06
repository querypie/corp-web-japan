import * as path from "node:path";
import { BaseResourcePublicationRepository } from "@/lib/resources/base-resource-publication";

class GlossaryPublications extends BaseResourcePublicationRepository {
  protected readonly category = "glossary" as const;
  protected readonly badge = "用語集";
  protected readonly contentRoot = path.join(process.cwd(), "src/content/glossary");
}

export const glossaryPublications = new GlossaryPublications();

export const listGlossaryPublicationItems = () => glossaryPublications.listItems();
export const getGlossaryPublicationRecord = (id: string) => glossaryPublications.getRecord(id);
export const listGlossaryPublicationParams = () => glossaryPublications.listParams();
export const listGlossaryPublicationIds = () => glossaryPublications.listIds();
