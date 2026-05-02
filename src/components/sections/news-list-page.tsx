import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NewsPublicationListItem } from "@/content/publications/news-publication-records";

type NewsListPageProps = {
  title: string;
  description: ReactNode;
  items: readonly NewsPublicationListItem[];
};

type CompanyLink = {
  label: string;
  href: string;
  active?: boolean;
};

const companyLinks: readonly CompanyLink[] = [
  { label: "私たちについて", href: "/about-us" },
  { label: "認証情報", href: "/certifications" },
  { label: "ニュース", href: "/t/news", active: true },
  { label: "お問い合わせ", href: "/contact-us" },
] as const;

function NewsCard({ item }: { item: NewsPublicationListItem }) {
  const cardClassName =
    "group flex h-full flex-col gap-5 rounded-[16px] border border-[#E5E7EB] bg-white p-5 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:border-[#CBD5E1] hover:shadow-[0_24px_56px_-36px_rgba(15,23,42,0.32)]";
  const content = (
    <>
      <div className="aspect-[16/9] overflow-hidden rounded-[12px] bg-[#F3F4F6]">
        <Image
          src={item.imageSrc}
          alt={item.title}
          width={640}
          height={360}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium leading-5 tracking-[0.02em] text-slate-500">
          <span className="inline-flex rounded-full border border-[#D0D5DD] px-3 py-1 text-slate-950">{item.badge}</span>
          <span>{item.sourceLabel}</span>
          <span>{item.opensExternal ? "外部サイト" : "詳細ページ"}</span>
        </div>
        <h2 className="text-[22px] font-medium leading-[1.4] tracking-[-0.02em] text-slate-950">{item.title}</h2>
        <p className="text-sm leading-6 text-slate-500">{item.description}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-2">
          <p className="text-sm leading-6 text-slate-400">{item.date}</p>
          <span className="text-sm font-medium leading-6 text-slate-950">
            {item.opensExternal ? "原文を見る" : "詳細を見る"}
          </span>
        </div>
      </div>
    </>
  );

  if (item.opensExternal) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={cardClassName}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={cardClassName}>
      {content}
    </Link>
  );
}

export function NewsListPage({ title, description, items }: NewsListPageProps) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[89px] pt-[82px] lg:px-[30px] lg:pb-[160px] lg:pt-[105px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[34px] lg:flex-row lg:items-start lg:gap-[60px]">
        <aside className="w-full pt-[20px] lg:w-[210px] lg:flex-shrink-0">
          <p className="sr-only">会社情報</p>
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-visible">
            <ul className="flex min-w-max gap-3 lg:min-w-0 lg:flex-col lg:gap-0">
              {companyLinks.map((link) => (
                <li key={link.label} className="lg:mt-0 lg:[&+li]:mt-3">
                  <Link
                    href={link.href}
                    className={`inline-flex rounded-[12px] px-4 py-3.5 text-[15px] leading-[1.467] transition lg:block lg:rounded-none lg:px-0 lg:py-0 ${
                      link.active
                        ? "bg-[#15181d] font-medium text-white lg:bg-transparent lg:text-[#15181d]"
                        : "bg-[#f9f9fb] font-normal text-slate-700 hover:text-slate-950 lg:bg-transparent lg:text-slate-950"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="text-left">
            <h1 className="text-4xl font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
              {title}
            </h1>
            <p className="mt-5 max-w-[760px] text-base leading-7 text-slate-500">{description}</p>
          </div>

          <ul className="mt-[34px] grid gap-6 lg:mt-[55px] lg:grid-cols-2 lg:gap-8">
            {items.map((item) => (
              <li key={`${item.href}-${item.title}`}>
                <NewsCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
