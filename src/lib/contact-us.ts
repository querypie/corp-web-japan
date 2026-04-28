export type ContactUsOption = {
  key: string;
  label: string;
};

export type ContactUsFormState = {
  lastName: string;
  firstName: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  inquiry: string;
  products: string[];
  timeline: string;
  message: string;
  marketing: boolean;
};

export const inquiryOptions: ContactUsOption[] = [
  { key: "ai-consulting", label: "AI導入・活用について相談" },
  { key: "download", label: "資料ダウンロード" },
  { key: "demo-request", label: "デモを依頼" },
  { key: "quote-request", label: "お見積もり依頼" },
  { key: "technical-question", label: "技術的な質問" },
  { key: "partnership", label: "パートナーシップ" },
  { key: "other", label: "その他" },
];

export const productOptions: ContactUsOption[] = [
  { key: "ai-crew", label: "社内業務効率化｜AI Crew" },
  { key: "ai-dashi", label: "自社サービスAI化｜AI Dashi" },
  { key: "aip", label: "AIプラットフォーム QueryPie AIP" },
  { key: "acp", label: "アクセス制御プラットフォーム QueryPie ACP" },
  { key: "fde", label: "AI専門家伴走 (FDE) サービス" },
  { key: "partnership", label: "パートナーシップ" },
];

export const timelineOptions = [
  "3ヶ月以内",
  "6ヶ月以内",
  "6ヶ月以降",
  "検討段階",
] as const;

export const defaultContactUsFormState: ContactUsFormState = {
  lastName: "",
  firstName: "",
  email: "",
  company: "",
  title: "",
  phone: "",
  inquiry: "",
  products: [],
  timeline: "",
  message: "",
  marketing: false,
};

export const getPrefilledContactUsFormState = (
  searchParams: Pick<URLSearchParams, "get" | "getAll">,
): Partial<ContactUsFormState> => {
  const inquiry = searchParams.get("inquiry");
  const products = searchParams.getAll("product");

  const prefills: Partial<ContactUsFormState> = {};

  if (inquiryOptions.some((option) => option.key === inquiry)) {
    prefills.inquiry = inquiry as string;
  }

  const validProducts = products.filter((product) =>
    productOptions.some((option) => option.key === product),
  );

  if (validProducts.length > 0) {
    prefills.products = Array.from(new Set(validProducts));
  }

  return prefills;
};

const optionLabelMap = new Map(
  [...inquiryOptions, ...productOptions].map((option) => [option.key, option.label]),
);

const toOptionLabel = (key: string) => optionLabelMap.get(key) ?? key;

export const buildContactUsSalesforceBody = (
  form: ContactUsFormState,
  referrerUrl: string,
) => {
  const descriptionParts = [
    `Product: ${form.products.map(toOptionLabel).join(", ")}`,
    `PlannedImplementationDate: ${form.timeline}`,
  ];

  if (form.message.trim()) {
    descriptionParts.unshift(form.message.trim());
  }

  return {
    requestBody: {
      LastName: form.lastName.trim(),
      FirstName: form.firstName.trim(),
      Email: form.email.trim(),
      Company: form.company.trim(),
      Title: form.title.trim(),
      MobilePhone: form.phone.trim() || undefined,
      Objective__c: toOptionLabel(form.inquiry),
      Questions__c: form.message.trim() || undefined,
      Description: descriptionParts.join("\n"),
      HasOptedInMarketing__c: form.marketing,
      Referrer_URL__c: referrerUrl,
    },
    processType: "LEAD_MS",
  };
};

export const isContactUsFormValid = (form: ContactUsFormState) => {
  const requiredTextFields = [
    form.lastName,
    form.firstName,
    form.email,
    form.company,
    form.title,
    form.message,
  ];

  const hasRequiredTextFields = requiredTextFields.every((value) => value.trim().length > 0);
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

  return (
    hasRequiredTextFields &&
    hasValidEmail &&
    form.inquiry.length > 0 &&
    form.products.length > 0 &&
    form.timeline.length > 0
  );
};
