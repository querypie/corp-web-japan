import Image from "next/image";
import Link from "next/link";

type ResourceCategoryLink = {
  label: string;
  href: string;
  active?: boolean;
};

type ResourceItem = {
  href: string;
  imageSrc: string;
  badge: string;
  title: string;
  description: string;
  date?: string;
};

type ResourcePageProps = {
  title: string;
  description: string;
  activeCategory: string;
  items: readonly ResourceItem[];
};

const sidebarLinks = [
  { label: "全てのリソース", href: "/resources", key: "resources" },
  { label: "紹介資料", href: "https://www.querypie.com/ja/features/documentation?category=introduction-deck" },
  { label: "用語集", href: "/glossary", key: "glossary" },
  { label: "マニュアル", href: "/manuals", key: "manuals" },
  { label: "ホワイトペーパー", href: "/whitepapers", key: "whitepaper" },
  { label: "ブログ", href: "/blog", key: "blog" },
  { label: "イベント", href: "/events", key: "events" },
] as const;

export function ResourcePage({
  title,
  description,
  activeCategory,
  items,
}: ResourcePageProps) {
  const categoryLinks: ResourceCategoryLink[] = sidebarLinks.map((link) => ({
    label: link.label,
    href: link.href,
    active: "key" in link ? link.key === activeCategory : false,
  }));

  return (
    <>
      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[34px] pt-[111px] lg:px-[30px] lg:pb-[34px] lg:pt-[143px]">
        <div className="mx-auto max-w-[1200px] text-center">
          <h1 className="text-4xl font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-[760px] text-base leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[89px] pt-[34px] lg:px-[30px] lg:pb-[160px] lg:pt-[55px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-[34px] lg:flex-row lg:items-start lg:gap-[60px]">
          <aside className="w-full lg:w-[210px] lg:flex-shrink-0">
            <p className="sr-only">カテゴリー</p>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-visible">
              <ul className="flex min-w-max gap-3 lg:min-w-0 lg:flex-col lg:gap-0">
                {categoryLinks.map((link) => (
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
            <ul className="grid gap-[34px] lg:grid-cols-2 lg:gap-[60px]">
              {items.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="flex flex-col gap-5 transition hover:opacity-70">
                    <div className="aspect-[16/9] overflow-hidden rounded-[8px] bg-[#eceff3]">
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        width={640}
                        height={360}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-[10px]">
                      <span className="inline-flex self-start rounded-full border border-[#353c45] px-3 py-1 text-xs font-medium leading-[1.42] tracking-[0.015rem] text-slate-950">
                        {item.badge}
                      </span>
                      <h2 className="text-[20px] font-medium leading-[1.4] text-slate-950">
                        {item.title}
                      </h2>
                      <p className="text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                      {item.date ? (
                        <p className="text-sm leading-6 text-slate-400">
                          {item.date}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
