"use client";

import jaMessages from "./messages/ja.json";

type MessageRecord = Record<string, unknown>;

function getNestedMessage(namespace: string | undefined, key: string): unknown {
  const path = namespace ? `${namespace}.${key}` : key;
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as MessageRecord)[segment];
    }
    return undefined;
  }, jaMessages);
}

export function useLocale() {
  return "ja";
}

type TranslationFunction = ((key: string) => string) & {
  raw: (key: string) => unknown;
};

export function useTranslations(namespace?: string): TranslationFunction {
  const translate = ((key: string) => {
    const value = getNestedMessage(namespace, key);
    return typeof value === "string" ? value : key;
  }) as TranslationFunction;

  translate.raw = (key: string) => getNestedMessage(namespace, key);

  return translate;
}
