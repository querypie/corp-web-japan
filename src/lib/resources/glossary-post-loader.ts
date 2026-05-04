import { BaseResourcePublicationPostLoader } from "@/lib/resources/base-resource-publication-post-loader";
import { glossaryPublications } from "@/lib/resources/glossary-publications";

class GlossaryPostLoader extends BaseResourcePublicationPostLoader {
  protected readonly repository = glossaryPublications;
}

const loader = new GlossaryPostLoader();

export const getGlossaryPublicationHref = (id: string, slug: string) => loader.getHref(id, slug);
export const getGlossaryPublicationRecordById = (id: string) => loader.getRecord(id);
export const listGlossaryPublicationParamsByCategory = () => loader.listParams();
export const listGlossaryPublicationIdsByCategory = () => loader.listIds();
export const getGlossaryPublicationPost = (id: string) => loader.getPost(id);
