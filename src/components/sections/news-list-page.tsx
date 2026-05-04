import Image from "next/image";
import Link from "next/link";
import type { NewsPublicationListItem } from "@/lib/publications/news-publication-records";

type NewsArticleListProps = {
  items: readonly NewsPublicationListItem[];
};

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

export function NewsArticleList({ items }: NewsArticleListProps) {
  return (
    <ul className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      {items.map((item) => (
        <li key={`${item.href}-${item.title}`}>
          <NewsCard item={item} />
        </li>
      ))}
    </ul>
  );
}
