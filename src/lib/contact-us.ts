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

export type ContactUsFormErrors = Partial<Record<keyof ContactUsFormState, string>>;

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
  { key: "lingo", label: "会議記録・リアルタイム翻訳AI - Lingo" },
  { key: "notepie", label: "ナレッジベース コンテンツ生成AI - NotePie" },
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

const freeEmailDomains = new Set([
  "gmail.com",
  "gmail.co.jp",
  "gmail.co.kr",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.jp",
  "yahoo.co.kr",
  "hotmail.com",
  "hotmail.co.jp",
  "hotmail.co.kr",
  "outlook.com",
  "outlook.jp",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "zoho.com",
  "gmx.com",
  "mail.com",
  "naver.com",
  "daum.net",
  "kakao.com",
  "nate.com",
  "qq.com",
  "163.com",
  "126.com",
]);

const blockedDomainsRegex = /^(sample\..*|example\..*)$/i;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEducationalDomain = (domain: string) =>
  domain.endsWith(".edu") || /\.edu\.[a-z]{2,}$/i.test(domain) || /\.ac\.[a-z]{2,}$/i.test(domain);

export const isBusinessEmail = (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!emailRegex.test(normalizedEmail)) {
    return false;
  }

  const [, domain = ""] = normalizedEmail.split("@");

  if (!domain) {
    return false;
  }

  if (isEducationalDomain(domain)) {
    return true;
  }

  return !freeEmailDomains.has(domain) && !blockedDomainsRegex.test(domain);
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
    `RequestURI: ${referrerUrl}`,
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

export const getContactUsFormErrors = (form: ContactUsFormState): ContactUsFormErrors => {
  const errors: ContactUsFormErrors = {};

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

  if (!form.message.trim()) {
    errors.message = "ご相談内容を入力してください。";
  }

  return errors;
};

export const isContactUsFormValid = (form: ContactUsFormState) =>
  Object.keys(getContactUsFormErrors(form)).length === 0;
