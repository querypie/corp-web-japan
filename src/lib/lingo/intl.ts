"use client"

import jaMessages from "./messages/ja.json"

type MessageRecord = Record<string, unknown>

function getNestedMessage(namespace: string | undefined, key: string): unknown {
  const path = namespace ? `${namespace}.${key}` : key
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as MessageRecord)[segment]
    }
    return undefined
  }, jaMessages)
}

export function useLocale() {
  return "ja"
}

type TranslationValues = Record<string, string | number>

type TranslationFunction = ((
  key: string,
  values?: TranslationValues,
) => string) & {
  raw: (key: string) => unknown
}

export function useTranslations(namespace?: string): TranslationFunction {
  const translate = ((key: string, values?: TranslationValues) => {
    const value = getNestedMessage(namespace, key)
    if (typeof value !== "string") return key
    if (!values) return value
    return value.replace(/\{(\w+)\}/g, (match, name: string) =>
      Object.prototype.hasOwnProperty.call(values, name)
        ? String(values[name])
        : match,
    )
  }) as TranslationFunction

  translate.raw = (key: string) => getNestedMessage(namespace, key)

  return translate
}
