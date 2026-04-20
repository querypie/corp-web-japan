import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  DatabaseZap,
  FileText,
  FolderLock,
  Gauge,
  LayoutGrid,
  MessageSquareMore,
  Shield,
  Sparkles,
  WandSparkles,
  Users,
} from "lucide-react";
import { sampleHomeContent } from "@/content/sample-home";

type SectionIntroProps = {
  sectionName: string;
  title: string;
  body: string;
};

type ButtonLinkProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
};

type HeaderNavItem = {
  label: string;
  href?: string;
  children?: readonly {
    label: string;
    href: string;
  }[];
};

function ButtonLink({ href, label, variant = "primary" }: ButtonLinkProps) {
  const classes = {
    primary: "border-slate-900 bg-slate-900 text-white hover:bg-slate-800",
    secondary: "border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
    ghost: "border-transparent bg-transparent text-slate-600 hover:bg-slate-100",
  } as const;

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${classes[variant]}`}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function WireframeBadge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
      {children}
    </div>
  );
}

function renderSectionTitle(sectionName: string, title: string) {
  const highlightMap: Record<string, string> = {
    "Why Now": "経営課題への対策",
    "What You Can Do": "仕事を減らす",
  };

  const highlight = highlightMap[sectionName];

  if (!highlight || !title.includes(highlight)) {
    return title;
  }

  const [before, after] = title.split(highlight);

  return (
    <>
      {before}
      <span className="bg-gradient-to-r from-[#E45A2A] via-[#ED602E] to-[#F08A3C] bg-clip-text text-transparent [animation:heroAccentGlow_3.2s_ease-in-out_infinite] motion-reduce:animate-none">
        {highlight}
      </span>
      {after}
    </>
  );
}

function SectionIntro({ sectionName, title, body }: SectionIntroProps) {
  const wrapperClassMap: Record<string, string> = {
    "Why Now": "max-w-[1240px]",
    "Why AI Fails": "max-w-[1180px]",
    "QueryPie AI Solution": "max-w-[980px]",
    "What You Can Do": "max-w-[1240px]",
    "Security & Governance": "max-w-[1240px]",
    "Use Cases": "max-w-[1240px]",
    "Adoption Flow": "max-w-[1240px]",
    "Case Studies / Proof": "max-w-[1240px]",
  };
  const titleClassMap: Record<string, string> = {
    "Why Now": "lg:whitespace-nowrap",
    "What You Can Do": "lg:whitespace-nowrap",
    "Security & Governance": "lg:whitespace-nowrap",
    "Use Cases": "lg:whitespace-nowrap",
    "Adoption Flow": "lg:whitespace-nowrap",
  };
  const bodyClassMap: Record<string, string> = {
    "Case Studies / Proof": "max-w-[1040px]",
  };
  const wrapperClass = wrapperClassMap[sectionName] ?? "max-w-[860px]";
  const titleClass = titleClassMap[sectionName] ?? "whitespace-pre-line";
  const bodyClass = bodyClassMap[sectionName] ?? "max-w-[760px]";

  return (
    <div className={wrapperClass}>
      <WireframeBadge>{sectionName}</WireframeBadge>
      <h2 className={`mt-4 text-[32px] font-semibold leading-[1.18] tracking-[-0.04em] text-slate-950 sm:text-[42px] ${titleClass}`}>
        {renderSectionTitle(sectionName, title)}
      </h2>
      <p className={`mt-4 text-sm leading-7 text-slate-600 sm:text-[15px] ${bodyClass}`}>{body}</p>
    </div>
  );
}

function GridCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`rounded-[1.5rem] border border-slate-200 bg-white p-6 ${className}`}>{children}</article>;
}

export function SampleHomeSections() {
  const {
    header,
    hero,
    whyNow,
    whyFails,
    solution,
    workReduction,
    security,
    useCases,
    solutions,
    products,
    adoptionFlow,
    proof,
    finalCta,
    footer,
  } = sampleHomeContent;

  return (
    <div className="bg-[#f3f4f6] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">QueryPie AI</p>
              <p className="text-xs text-slate-500">Wireframe / Top Page</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            {(header.navItems as readonly HeaderNavItem[]).map((item) =>
              item.children ? (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-slate-950"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 rotate-90 transition group-hover:text-slate-950" />
                  </button>

                  <div className="invisible absolute left-0 top-full z-20 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[240px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.28)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={item.label} href={item.href ?? "#"} className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ButtonLink href={header.primaryCta.href} label={header.primaryCta.label} variant="secondary" />
            <ButtonLink href={header.secondaryCta.href} label={header.secondaryCta.label} />
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
          <Image
            src={hero.heroImage.src}
            alt={hero.heroImage.alt}
            fill
            priority
            className="object-cover object-[58%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.72)_34%,rgba(2,6,23,0.36)_60%,rgba(2,6,23,0.18)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.22),transparent_24%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.14),transparent_18%),linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.16)_62%,rgba(15,23,42,0.56)_100%)]" />

          <div className="relative mx-auto flex min-h-[760px] max-w-[1440px] flex-col justify-between px-6 py-10 lg:px-10 lg:py-12">
            <div className="flex justify-start">
              <div className="hidden flex-wrap items-center gap-1.5 lg:flex">
                {hero.proofPills.map((item) => (
                  <div key={item} className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/88 backdrop-blur">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,668px)_1fr] lg:items-start">
              <div className="-mt-3 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.05)_100%)] p-7 text-white shadow-[0_32px_120px_-60px_rgba(15,23,42,0.75)] backdrop-blur-xl sm:p-8 lg:-mt-14 lg:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">Enterprise AI Platform</p>
                <h1 className="mt-2 whitespace-pre-line text-[42px] font-semibold leading-[1.04] tracking-[-0.065em] sm:text-[58px] lg:text-[72px]">
                  {hero.heading}
                </h1>
                <p className="mt-5 max-w-[628px] text-[15px] leading-[2.05] text-white/84 lg:text-base">
                  {hero.body}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={hero.primaryCta.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    {hero.primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={hero.secondaryCta.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
                  >
                    {hero.secondaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="relative hidden min-h-[520px] lg:block">
                <div className="absolute inset-0" />
              </div>
            </div>
          </div>
        </section>

        <section id="solutions" className="border-b border-slate-200 bg-[#f8fafc]">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <SectionIntro {...whyNow} />
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {[Users, Gauge, Building2].map((Icon, index) => {
                const card = whyNow.cards[index];
                return (
                  <GridCard key={card.title}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-[22px] font-semibold tracking-[-0.03em] text-slate-950">{card.title}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
                    <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                      {card.stat}
                    </div>
                  </GridCard>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <SectionIntro {...whyFails} />
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {[MessageSquareMore, DatabaseZap, FolderLock].map((Icon, index) => {
                const card = whyFails.cards[index];
                return (
                  <GridCard key={card.title} className="bg-slate-50">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Failure point</p>
                      <Icon className="h-5 w-5 text-slate-500" />
                    </div>
                    <p className="mt-4 text-[20px] font-semibold tracking-[-0.03em] text-slate-950">{card.title}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
                  </GridCard>
                );
              })}
            </div>
            <div className="mt-8 rounded-[1.5rem] border border-slate-900 bg-slate-900 px-6 py-5 text-white">
              <p className="text-sm font-semibold tracking-[0.02em]">{whyFails.emphasis}</p>
            </div>
          </div>
        </section>

        <section id="solution" className="border-b border-slate-200 bg-[#f8fafc]">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <SectionIntro {...solution} />
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {[Shield, Sparkles, ClipboardCheck].map((Icon, index) => {
                const card = solution.cards[index];
                return (
                  <GridCard key={card.title}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-[24px] font-semibold tracking-[-0.04em] text-slate-950">{card.title}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
                    <div className="mt-5 grid gap-2">
                      {card.bullets.map((bullet) => (
                        <div key={bullet} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
                          <p className="text-sm leading-6 text-slate-600">{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </GridCard>
                );
              })}
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {solution.summary.map((item) => (
                <div key={item} className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 text-center text-sm font-semibold text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="what-you-can-do" className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <SectionIntro {...workReduction} />
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {workReduction.items.map((item) => (
                <GridCard key={item.title}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[20px] font-semibold tracking-[-0.03em] text-slate-950">{item.title}</p>
                    <LayoutGrid className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Before</p>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.before}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">After</p>
                      <p className="mt-3 text-sm leading-7 text-slate-800">{item.after}</p>
                    </div>
                  </div>
                </GridCard>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="border-b border-slate-200 bg-[#f8fafc]">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <SectionIntro {...security} />
            <div className="mt-8 flex flex-wrap gap-2">
              {security.badges.map((badge) => (
                <div key={badge} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {badge}
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.18fr)_minmax(300px,0.82fr)] lg:items-stretch">
              <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
                {security.items.map((item) => (
                  <GridCard key={item.title} className="h-full bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Guardrail</p>
                    <p className="mt-2.5 text-[18px] font-semibold tracking-[-0.03em] text-slate-950">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                  </GridCard>
                ))}
              </div>

              <div className="space-y-4">
                <GridCard className="self-start p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">For operators</p>
                  <p className="mt-2.5 text-[18px] font-semibold tracking-[-0.03em] text-slate-950">{security.operatorMessage.title}</p>
                  <p className="mt-2 max-w-[300px] text-sm leading-6 text-slate-600">{security.operatorMessage.body}</p>
                </GridCard>
                <GridCard className="bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Trusted certifications</p>
                  <p className="mt-2.5 text-[18px] font-semibold tracking-[-0.03em] text-slate-950">
                    {security.certificationsTitle}
                  </p>
                  <p className="mt-2 max-w-[300px] text-sm leading-6 text-slate-600">{security.certificationsBody}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {security.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </GridCard>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <SectionIntro {...useCases} />
            <div className="mt-8 flex flex-wrap gap-2">
              {useCases.tabs.map((tab, index) => (
                <div
                  key={tab}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${index === 0 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-500"}`}
                >
                  {tab}
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[BriefcaseBusiness, FileText, Gauge, Shield].map((Icon, index) => {
                const card = useCases.cards[index];
                return (
                  <GridCard key={card.title} className="bg-slate-50">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{card.role}</p>
                    <p className="mt-3 text-[20px] font-semibold tracking-[-0.03em] text-slate-950">{card.title}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
                  </GridCard>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#f8fafc]">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <SectionIntro {...solutions} />
            <p className="mt-6 max-w-[760px] text-sm leading-7 text-slate-600 sm:text-[15px]">
              {solutions.helper}
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {[Sparkles, WandSparkles].map((Icon, index) => {
                const card = solutions.cards[index];

                return (
                  <GridCard key={card.title} className="bg-white">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-[26px] font-semibold tracking-[-0.04em] text-slate-950">
                      {card.title}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                      {card.subtitle}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{card.body}</p>
                    <Link
                      href={card.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-slate-700"
                    >
                      {card.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </GridCard>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <SectionIntro {...products} />
            <p className="mt-6 max-w-[920px] text-sm leading-7 text-slate-600 sm:text-[15px]">
              {products.helper}
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[Building2, Shield, Users, MessageSquareMore, LayoutGrid].map((Icon, index) => {
                const card = products.cards[index];

                return (
                  <GridCard key={card.title} className="bg-slate-50">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {card.category}
                    </p>
                    <p className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-slate-950">
                      {card.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
                    <Link
                      href={card.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-slate-700"
                    >
                      {card.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </GridCard>
                );
              })}
            </div>
            <p className="mt-8 max-w-[920px] text-sm leading-7 text-slate-600 sm:text-[15px]">
              {products.footer}
            </p>
          </div>
        </section>

        <section id="adoption-flow" className="border-b border-slate-200 bg-[#f8fafc]">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <SectionIntro {...adoptionFlow} />
            <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
              {adoptionFlow.steps.map((step, index) => (
                <div key={step.step} className="contents">
                  <GridCard>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{step.step}</p>
                    <p className="mt-4 text-[22px] font-semibold tracking-[-0.03em] text-slate-950">{step.title}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
                  </GridCard>
                  {index < adoptionFlow.steps.length - 1 ? (
                    <div className="hidden lg:flex lg:justify-center">
                      <ChevronRight className="h-8 w-8 text-slate-300" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <SectionIntro {...proof} />
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {proof.stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-5 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{stat.label}</p>
                  <p className="mt-4 text-[34px] font-semibold tracking-[-0.05em] text-slate-950">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {proof.cases.map((item) => (
                <GridCard key={item.title}>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Case study placeholder</p>
                  <p className="mt-4 text-[22px] font-semibold tracking-[-0.03em] text-slate-950">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                  <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                    {item.metric}
                  </div>
                </GridCard>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#0f172a] text-white">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <div className="rounded-[2rem] border border-white/12 bg-white/5 px-6 py-8 shadow-[0_28px_100px_-60px_rgba(15,23,42,0.55)] backdrop-blur xl:px-10 xl:py-10">
              <div className="mx-auto max-w-[880px] text-center">
                <h2 className="text-[34px] font-semibold leading-[1.15] tracking-[-0.04em] sm:text-[46px]">
                  {finalCta.title}
                </h2>
                <p className="mx-auto mt-5 max-w-[760px] text-sm leading-8 text-white/75 sm:text-[15px]">
                  {finalCta.body}
                </p>
              </div>

              <div id="download" className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap">
                {finalCta.actions.map((action, index) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`flex min-h-[44px] w-full max-w-[220px] items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-center text-[13px] font-semibold transition sm:w-[220px] ${
                      index === 0
                        ? "border-white bg-white text-slate-950 hover:bg-slate-100"
                        : "border-white/15 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {action.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#0b1220] text-white/80">
        <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-10 lg:py-11">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1fr_1fr_1fr] lg:gap-8">
            <div>
              <p className="text-sm font-semibold text-white">QueryPie AI</p>
            </div>

            {footer.columns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{column.title}</p>
                <div className="mt-3 grid gap-2.5">
                  {column.links.map((link) => (
                    <div key={link} className="text-sm text-white/70">
                      {link}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-white/50 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-4">
              {footer.legal.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <p>© QueryPie AI Wireframe</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
