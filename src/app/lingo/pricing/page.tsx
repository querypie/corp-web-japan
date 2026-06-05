"use client"

import {
  Building2,
  Check,
  Clock3,
  CreditCard,
  Gauge,
  Users,
} from "lucide-react"
import { useTranslations } from "@/lib/lingo/intl"
import { Button } from "@/components/lingo/common/Button"
import { Container } from "@/components/layout/lingo/Container"
import { Footer } from "@/components/layout/lingo/Footer"
import { FAQSection } from "@/components/sections/lingo/FAQSection"
import { SubHeroSection } from "@/components/sections/lingo/SubHeroSection"
import { SubPageHeroBackground } from "@/components/sections/lingo/SubPageHeroBackground"

const queryPieUrl = "https://querypie.com"

function formatRateRate(rate: string) {
  const match = rate.match(/^[\d,]+/);
  if (!match) return rate;
  return (
    <>
      <span className="font-semibold text-[var(--brand)]">{match[0]}</span>
      {rate.slice(match[0].length)}
    </>
  );
}

type ComparisonRow = {
  item: string
  subscription: string
  lingo: string
}

type Scenario = {
  title: string
  description: string
  message: string
}

export default function PricingPage() {
  const t = useTranslations("pricing")
  const includedFeatures = t.raw("plan.features") as string[]
  const usageSteps = t.raw("plan.usageSteps") as string[]
  const usageRateRows = t.raw("plan.usageRates.rows") as {
    feature: string
    rate: string
  }[]
  const comparisonRows = t.raw("comparison.rows") as ComparisonRow[]
  const scenarios = t.raw("examples.scenarios") as Scenario[]

  return (
    <main className="min-h-screen bg-[var(--bg)] page-layout-sub">
      <SubPageHeroBackground />

      <div className="w-full page-gutter">
        <div className="container-main relative z-10 w-full">
          <SubHeroSection
            title={
              <>
                {t("hero.title.line1")}{" "}
                {t("hero.title.line2")}
              </>
            }
            description={
              <>
                {t("hero.description.line1")}
                <br />
                {t("hero.description.line2")}
              </>
            }
            descriptionClassName="body-md"
          />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={queryPieUrl} variant="dark">
              {t("hero.secondaryCta")}
            </Button>
          </div>
        </div>
      </div>

      <Container className="section-gap">
        <section className="grid grid-cols-1 gap-5 md:grid-cols-[1.15fr_0.85fr]">
          <div
            className="relative isolate flex min-h-[400px] flex-col justify-between gap-8 overflow-hidden rounded-[var(--corner-box)] p-6 text-[var(--fg)] md:min-h-[440px] md:p-[28px]"
          >
            <img
              src="/lingo/images/feature-03.jpg"
              alt=""
              className="absolute inset-0 -z-10 size-full object-cover scale-y-[-1]"
            />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-white/10" />

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2.5">
                <p className="body-sm font-semibold text-[var(--black)]">
                  {t("plan.eyebrow")}
                </p>
                <h2 className="text-h1">{t("plan.title")}</h2>
                <div className="flex flex-col gap-1.5">
                  <p className="text-h2">{t("plan.price")}</p>
                  <p className="body-md max-w-[34rem] text-[var(--fg)]">
                    {t("plan.description")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button>{t("plan.primaryCta")}</Button>
            </div>
          </div>

          <div className="rounded-[var(--corner-box)] py-6 pr-6 pl-0 md:p-[28px]">
            <h3 className="text-h3 text-[var(--fg)]">{t("plan.includedTitle")}</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2.5">
              {includedFeatures.map((feature) => (
                <li
                  key={feature}
                  className="body-md flex items-start gap-3 text-[var(--fg)]"
                >
                  <Check
                    className="mt-1 size-4 shrink-0 text-[var(--brand)]"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Container>

      <Container className="section-gap">
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-[var(--corner-box)] border border-[var(--border)] bg-[var(--white)] p-6 md:p-[30px]">
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-[var(--brand)]" aria-hidden="true" />
              <h2 className="text-h2 text-[var(--fg)]">
                {t("plan.freeCredits.title")}
              </h2>
            </div>
            <p className="body-md mt-5 text-[var(--fg)]">
              {t("plan.freeCredits.description")}
            </p>
            <p className="body-sm mt-4 rounded-[12px] bg-[var(--card)] p-4 text-[var(--fg)]">
              {t("plan.freeCredits.note")}
            </p>
          </div>

          <div className="rounded-[var(--corner-box)] border border-[var(--border)] bg-[var(--white)] p-6 md:p-[30px]">
            <div className="flex items-center gap-3">
              <Gauge className="size-5 text-[var(--brand)]" aria-hidden="true" />
              <h2 className="text-h2 text-[var(--fg)]">
                {t("plan.usageRates.title")}
              </h2>
            </div>
            <div className="mt-6 overflow-hidden rounded-[12px] border border-[var(--border)]">
              {usageRateRows.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-[1fr_auto] gap-4 border-b border-[var(--border)] px-4 py-4 last:border-b-0"
                >
                  <span className="body-md text-[var(--fg)]">{row.feature}</span>
                  <span className="body-md text-[var(--fg)]">
                    {formatRateRate(row.rate)}
                  </span>
                </div>
              ))}
            </div>
            <p className="body-sm mt-4 text-[var(--fg)]">
              {t("plan.usageRates.note")}
            </p>
          </div>
        </section>
      </Container>

      <Container className="section-gap">
        <section className="grid grid-cols-1 gap-8 md:grid-cols-[0.75fr_1.25fr] md:items-start">
          <div className="flex flex-col gap-4">
            <h2 className="text-h1 text-[var(--fg)]">{t("plan.howItWorksTitle")}</h2>
            <p className="body-md text-[var(--fg)]">{t("plan.accountNote")}</p>
          </div>
          <ol className="grid grid-cols-1 gap-3">
            {usageSteps.map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[auto_1fr] gap-4 rounded-[var(--corner-box)] bg-[var(--card)] p-5"
              >
                <span className="body-sm flex size-8 items-center justify-center rounded-full bg-[var(--black)] text-[var(--white)]">
                  {index + 1}
                </span>
                <p className="body-md self-center text-[var(--fg)]">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </Container>

      <Container className="section-gap">
        <section className="flex flex-col gap-6">
          <div className="flex w-full flex-col gap-4">
            <h2 className="text-h1 text-[var(--fg)]">{t("comparison.title")}</h2>
            <p className="body-md text-[var(--fg)]">{t("comparison.description")}</p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-[0.8fr_1fr_1fr] items-center rounded-[10px] bg-[var(--black)] text-[var(--white)]">
                <div className="body-md px-4 py-[20px] md:px-[30px]">
                  {t("comparison.headers.item")}
                </div>
                <div className="body-md px-4 py-[20px] md:px-[20px]">
                  {t("comparison.headers.subscription")}
                </div>
                <div className="body-md px-4 py-[20px] md:px-[20px]">
                  {t("comparison.headers.lingo")}
                </div>
              </div>
              {comparisonRows.map((row) => (
                <div
                  key={row.item}
                  className="grid grid-cols-[0.8fr_1fr_1fr] items-center border-b border-[var(--border)] py-[20px]"
                >
                  <div className="px-4 text-h3 text-[var(--fg)] md:px-[30px]">
                    {row.item}
                  </div>
                  <div className="px-4 body-sm text-[var(--fg)] md:px-[20px]">
                    {row.subscription}
                  </div>
                  <div className="px-4 body-sm text-[var(--fg)] md:px-[20px]">
                    {row.lingo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>

      <Container className="section-gap">
        <section className="flex flex-col gap-6">
          <div className="flex w-full flex-col gap-4">
            <h2 className="text-h1 text-[var(--fg)]">{t("examples.title")}</h2>
            <p className="body-md text-[var(--fg)]">{t("examples.description")}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {scenarios.map((scenario, index) => {
              const Icon = index === 0 ? Building2 : index === 1 ? Clock3 : Users

              return (
                <article
                  key={scenario.title}
                  className="flex min-h-[220px] flex-col justify-between gap-8 rounded-[var(--corner-box)] bg-[var(--card)] p-6 md:p-[30px]"
                >
                  <div className="flex flex-col gap-4">
                    <Icon className="size-8 text-[var(--brand)]" aria-hidden="true" />
                    <div className="flex flex-col gap-2">
                      <h3 className="text-h3 text-[var(--fg)]">{scenario.title}</h3>
                      <p className="body-sm text-[var(--mute)]">
                        {scenario.description}
                      </p>
                    </div>
                  </div>
                  <p className="body-md text-[var(--fg)]">
                    {scenario.message}
                  </p>
                </article>
              )
            })}
          </div>
        </section>
      </Container>

      <div className="section-gap">
        <FAQSection namespace="pricing.faq" />
      </div>

      <Container className="section-gap">
        <section className="flex flex-col items-center gap-6 text-center md:gap-[30px]">
          <div className="flex flex-col items-center gap-4 text-[var(--fg)] md:gap-[20px]">
            <h2 className="text-h1">{t("cta.title")}</h2>
            <p className="body-md w-full">{t("cta.subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="dark">{t("cta.primary")}</Button>
            <Button href={queryPieUrl} variant="outline">
              {t("cta.secondary")}
            </Button>
          </div>
        </section>
      </Container>

      <div className="section-gap">
        <Footer />
      </div>
    </main>
  )
}
