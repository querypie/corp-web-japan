import Image from "next/image";
import Link from "next/link";
import type { NewsPublicationListItem } from "@/content/publications/news-publication-records";

type NewsListPageProps = {
  items: readonly NewsPublicationListItem[];
};

function NewsCard({ item }: { item: NewsPublicationListItem }) {
  const content = (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-normal leading-7 tracking-[-0.01em] text-slate-500">{item.date}</p>
        <h2 className="mt-2.5 text-[24px] font-medium leading-[1.36] tracking-[-0.03em] text-slate-950 sm:text-[27px] lg:text-[28px]">
          {item.title}
        </h2>
        <p className="mt-3 text-base leading-8 text-slate-600">{item.description}</p>
      </div>
      <div className="w-full shrink-0 lg:w-[400px]">
        <div className="overflow-hidden rounded-[12px] bg-[#F3F5F7]">
          <Image
            src={item.imageSrc}
            alt={item.title}
            width={400}
            height={225}
            className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.01]"
          />
        </div>
      </div>
    </>
  );

  if (item.opensExternal) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col gap-6 text-left transition hover:opacity-90 lg:flex-row lg:items-start lg:gap-[56px]"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className="group flex flex-col gap-6 text-left transition hover:opacity-90 lg:flex-row lg:items-start lg:gap-[56px]">
      {content}
    </Link>
  );
}

export function NewsListPage({ items }: NewsListPageProps) {
  return (
    <>
      <section className="bg-white px-6 pb-[96px] pt-[88px] lg:px-[30px] lg:pb-[118px] lg:pt-[98px]">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="py-[0.4em] text-[44px] font-medium leading-[1.2] tracking-[-0.04em] text-slate-950 sm:text-[52px] lg:text-[56px]">
            News
          </h1>

          <ul className="mt-7 flex flex-col gap-10 lg:mt-[40px] lg:gap-[64px]">
            {items.map((item) => (
              <li key={`${item.href}-${item.title}`}>
                <NewsCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#F6F8FA] px-[22px] py-[72px] lg:px-[30px] lg:py-[112px]">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <h2 className="text-[30px] font-medium leading-[1.35] tracking-[-0.03em] text-slate-950 sm:text-[38px] lg:text-[42px]">
            まずは小さく、失敗しないAXを始めよう
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-500">
            簡単サインアップで、14日間の無料トライアルをお試しください
          </p>
          <a
            href="https://app.querypie.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-[9.375px] rounded-[5.625px] bg-[linear-gradient(100deg,#0762D4_34.93%,#875AC5_76.81%,#C55A8C_99.98%)] px-[26.25px] py-[13.125px] text-[15px] font-medium text-[#F6F6F6] transition hover:brightness-[1.04]"
          >
            <span>無料で試してみる</span>
            <span aria-hidden="true" className="inline-flex items-center justify-center text-[#24292F]">
              <svg viewBox="0 0 7 12" width="1em" height="1em" className="h-3 w-[7px]" focusable="false">
                <path d="M7 6L0.865033 12L0 11.154L5.26381 6L0 0.846L0.865033 0L7 6Z" fill="currentColor" />
              </svg>
            </span>
          </a>
        </div>
      </section>
    </>
  );
}
