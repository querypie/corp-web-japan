import { BaseResourcePublicationPostLoader } from "@/lib/resources/base-resource-publication-post-loader";
import { introductionDeckPublications } from "@/lib/resources/introduction-deck-publications";

class IntroductionDeckPostLoader extends BaseResourcePublicationPostLoader {
  protected readonly repository = introductionDeckPublications;
}

const loader = new IntroductionDeckPostLoader();

export const getIntroductionDeckPublicationHref = (id: string, slug: string) => loader.getHref(id, slug);
export const getIntroductionDeckPublicationRecord = (id: string) => loader.getRecord(id);
export const listIntroductionDeckPublicationParamsByCategory = () => loader.listParams();
export const listIntroductionDeckPublicationIdsByCategory = () => loader.listIds();
export const getIntroductionDeckPublicationPost = (id: string) => loader.getPost(id);
