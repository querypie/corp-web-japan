"use client"

import { useTranslations } from "@/lib/lingo/intl"
import { Container } from "@/components/layout/lingo/Container"

export function ReviewsSection() {
  const t = useTranslations()

  return (
    <Container>
      <div className="flex flex-col gap-4 md:gap-[20px]">
        <h2 className="text-h1 text-[var(--fg)]">{t("reviews.title")}</h2>
        <div className="flex flex-col gap-4 md:flex-row md:gap-[20px]">
          {/* 첫 번째 리뷰 카드 */}
          <div className="flex flex-1 flex-col gap-5 rounded-[var(--corner-box)] bg-[var(--card)] p-5 md:gap-[30px] md:p-[30px]">
            <p className="body-md text-[var(--fg)]">{t("reviews.quote1")}</p>
            <div className="flex items-start gap-3">
              <div className="relative size-9 overflow-hidden rounded-full md:size-[40px]">
                <img
                  src="/lingo/images/author-1.png"
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col body-sm">
                <span className="text-[var(--fg)]">{t("reviews.author1Name")}</span>
                <span className="text-[var(--mute)]">{t("reviews.author1Role")}</span>
              </div>
            </div>
          </div>

          {/* 두 번째 리뷰 카드 */}
          <div className="flex flex-1 flex-col gap-5 rounded-[var(--corner-box)] bg-[var(--card)] p-5 md:gap-[30px] md:p-[30px]">
            <p className="body-md text-[var(--fg)]">{t("reviews.quote2")}</p>
            <div className="flex items-start gap-3">
              <div className="relative size-9 overflow-hidden rounded-full md:size-[40px]">
                <img
                  src="/lingo/images/author-2.png"
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col body-sm">
                <span className="text-[var(--fg)]">{t("reviews.author2Name")}</span>
                <span className="text-[var(--mute)]">{t("reviews.author2Role")}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-[20px]">
          {/* 세 번째 리뷰 카드 */}
          <div className="flex flex-1 flex-col gap-5 rounded-[var(--corner-box)] bg-[var(--card)] p-5 md:gap-[30px] md:p-[30px]">
            <p className="body-md text-[var(--fg)]">{t("reviews.quote3")}</p>
            <div className="flex items-start gap-3">
              <div className="relative size-9 overflow-hidden rounded-full md:size-[40px]">
                <img
                  src="/lingo/images/author-1.png"
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col body-sm">
                <span className="text-[var(--fg)]">{t("reviews.author3Name")}</span>
                <span className="text-[var(--mute)]">{t("reviews.author3Role")}</span>
              </div>
            </div>
          </div>

          {/* 네 번째 리뷰 카드 */}
          <div className="flex flex-1 flex-col gap-5 rounded-[var(--corner-box)] bg-[var(--card)] p-5 md:gap-[30px] md:p-[30px]">
            <p className="body-md text-[var(--fg)]">{t("reviews.quote4")}</p>
            <div className="flex items-start gap-3">
              <div className="relative size-9 overflow-hidden rounded-full md:size-[40px]">
                <img
                  src="/lingo/images/author-2.png"
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col body-sm">
                <span className="text-[var(--fg)]">{t("reviews.author4Name")}</span>
                <span className="text-[var(--mute)]">{t("reviews.author4Role")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
