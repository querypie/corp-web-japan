import {
  buildContactUsSalesforceBody,
  inquiryOptions,
  isBusinessEmail,
  productOptions,
  timelineOptions,
} from "@/lib/contact-us";

export type GatingFormState = {
  lastName: string;
  firstName: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  inquiry: string;
  products: string[];
  timeline: string;
  marketing: boolean;
};

export type GatingFormErrors = Partial<Record<keyof GatingFormState, string>>;

export { inquiryOptions, productOptions, timelineOptions };

export const defaultGatingFormState: GatingFormState = {
  lastName: "",
  firstName: "",
  email: "",
  company: "",
  title: "",
  phone: "",
  inquiry: "",
  products: [],
  timeline: "",
  marketing: false,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getGatingFormErrors = (form: GatingFormState): GatingFormErrors => {
  const errors: GatingFormErrors = {};

  if (!form.lastName.trim()) {
    errors.lastName = "姓を入力してください。";
  }

  if (!form.firstName.trim()) {
    errors.firstName = "名を入力してください。";
  }

  if (!form.email.trim()) {
    errors.email = "ビジネス用メールアドレスを入力してください。";
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = "有効なメールアドレスを入力してください。";
  } else if (!isBusinessEmail(form.email)) {
    errors.email = "会社または教育機関のメールアドレスを入力してください。";
  }

  if (!form.company.trim()) {
    errors.company = "会社名を入力してください。";
  }

  if (!form.title.trim()) {
    errors.title = "部署／役職を入力してください。";
  }

  if (!form.inquiry) {
    errors.inquiry = "お問い合わせの種類を選択してください。";
  }

  if (form.products.length === 0) {
    errors.products = "関心のある製品・サービスを1つ以上選択してください。";
  }

  if (!form.timeline) {
    errors.timeline = "導入予定時期を選択してください。";
  }

  return errors;
};

export const isGatingFormValid = (form: GatingFormState) =>
  Object.keys(getGatingFormErrors(form)).length === 0;

export const buildGatingSalesforceBody = (
  form: GatingFormState,
  referrerUrl: string,
  contentKey: string,
) => {
  const baseBody = buildContactUsSalesforceBody(
    {
      ...form,
      message: "",
    },
    referrerUrl,
  );

  const existingDescription =
    typeof baseBody.requestBody.Description === "string"
      ? baseBody.requestBody.Description.trim()
      : "";

  const descriptionParts = [`GatedContentKey: ${contentKey.trim()}`];
  if (existingDescription) {
    descriptionParts.push(existingDescription);
  }

  return {
    ...baseBody,
    requestBody: {
      ...baseBody.requestBody,
      Questions__c: undefined,
      Description: descriptionParts.join("\n"),
    },
  };
};
