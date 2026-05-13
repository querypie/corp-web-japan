import Image from "next/image";
import Link from "next/link";
import type { NewsPublicationListItem } from "@/lib/publications/news/records";

type NewsArticleListProps = {
  items: readonly NewsPublicationListItem[];
};

function NewsCard({ item }: { item: NewsPublicationListItem }) {
  const cardClassName = "group block transition [text-decoration:none]";
  const content = (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <div className="min-w-0 flex-1">
        <p className="text-[16px] leading-[1.75] text-[#6B7280]">{item.date}</p>
        <h2 className="mt-3 text-[30px] font-medium leading-[1.35] tracking-[-0.03em] text-slate-950 lg:text-[36px]">
          {item.title}
        </h2>
        <p className="mt-4 text-[16px] leading-8 text-[#6B7280]">{item.description}</p>
      </div>
      <div className="h-[225px] w-full max-w-[400px] flex-shrink-0 overflow-hidden rounded-[8px] bg-[#F3F4F6]">
        <Image
          src={item.imageSrc}
          alt={item.title}
          width={400}
          height={225}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
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
    <ul className="space-y-20 lg:space-y-[80px]">
      {items.map((item) => (
        <li key={item.id}>
          <NewsCard item={item} />
        </li>
      ))}
    </ul>
  );
}
