import { BaseResourcePublicationPostLoader } from "@/lib/resources/base-resource-publication-post-loader";
import { manualPublications } from "@/lib/resources/manual-publications";

class ManualPostLoader extends BaseResourcePublicationPostLoader {
  protected readonly repository = manualPublications;
}

const loader = new ManualPostLoader();

export const getManualPublicationHref = (id: string, slug: string) => loader.getHref(id, slug);
export const getManualPublicationRecordById = (id: string) => loader.getRecord(id);
export const listManualPublicationParamsByCategory = () => loader.listParams();
export const listManualPublicationIdsByCategory = () => loader.listIds();
export const getManualPublicationPost = (id: string) => loader.getPost(id);
