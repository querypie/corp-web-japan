import Image from "next/image";
import Link from "next/link";
import { Copy, Facebook, Link2, Linkedin, Twitter } from "lucide-react";
import type { BlogPostPageData } from "@/lib/blog-posts";

const contactUrl = "/contact-us";
const shareIcons = [Facebook, Twitter, Linkedin, Link2] as const;

type BlogPostPageProps = {
  post: BlogPostPageData;
};

export function BlogPostPage({ post }: BlogPostPageProps) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-[60px]">
          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-col gap-5">
              <div className="flex flex-col gap-5">
                <span className="inline-flex self-start rounded-full border border-[#353c45] px-3 py-1 text-xs font-medium leading-[1.417] tracking-[0.015rem] text-slate-950">
                  ブログ
                </span>
                <h1 className="text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">
                  {post.title}
                </h1>
                {post.author ? (
                  <div className="flex items-start gap-[14px] rounded-[10px] bg-[#F9FAFB] px-[26px] py-5">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-[#E5E7EB] bg-white">
                      <Image
                        src={post.author.avatarSrc}
                        alt={post.author.avatarAlt || post.author.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-[6px] flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[15px] font-medium leading-[1.4] text-slate-950">
                            {post.author.name}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {post.author.role}
                          </p>
                        </div>
                        {post.author.profileUrl ? (
                          <Link
                            href={post.author.profileUrl}
                            className="inline-flex h-7 w-7 items-center justify-center text-[#6B7280] transition hover:text-slate-950"
                            aria-label={`${post.author.name} profile`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Linkedin className="h-[15px] w-[15px]" />
                          </Link>
                        ) : null}
                      </div>
                      <p className="text-sm leading-6 text-slate-500">{post.author.bio}</p>
                    </div>
                  </div>
                ) : null}
                <div className="mt-2 flex flex-col gap-4 border-t border-[#d1d5db] pt-[18px] sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-slate-400">{post.date}</p>
                  <div className="flex items-center gap-2.5">
                    {shareIcons.map((Icon, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label="共有"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] text-slate-400 transition hover:border-slate-950 hover:text-slate-950"
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    ))}
                    <button
                      type="button"
                      aria-label="リンクをコピー"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] text-slate-400 transition hover:border-slate-950 hover:text-slate-950"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="aspect-[16/9] overflow-hidden bg-[#eceff3]">
                <Image
                  src={post.imageSrc}
                  alt={post.title}
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="pb-[89px]">
              <div
                className={[
                  "text-base leading-6 text-slate-500",
                  "[&_h1]:mt-12 [&_h1]:text-[22px] [&_h1]:font-semibold [&_h1]:leading-[1.4] [&_h1]:tracking-[-0.01em] [&_h1]:text-slate-950",
                  "[&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:font-normal [&_h2]:leading-[1.455] [&_h2]:text-slate-950",
                  "[&_h3]:mt-8 [&_h3]:text-[17px] [&_h3]:font-medium [&_h3]:leading-[1.4] [&_h3]:text-slate-950",
                  "[&_h4]:mt-7 [&_h4]:text-[15px] [&_h4]:font-medium [&_h4]:leading-[1.5] [&_h4]:text-slate-950",
                  "[&_p]:mt-4 [&_p]:text-base [&_p]:leading-6 [&_p]:text-slate-500",
                  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-4",
                  "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-4",
                  "[&_li]:mb-2 [&_li]:text-base [&_li]:leading-6 [&_li]:text-slate-500",
                  "[&_strong]:font-medium [&_strong]:text-slate-950",
                  "[&_figure]:my-8",
                  "[&_blockquote]:my-[20px] [&_blockquote]:border-l [&_blockquote]:border-[#d1d5db] [&_blockquote]:pl-[30px]",
                  "[&_blockquote_p]:mt-0 [&_blockquote_p]:text-base [&_blockquote_p]:leading-6 [&_blockquote_p]:text-slate-500",
                  "[&_blockquote_li]:text-base [&_blockquote_li]:leading-6 [&_blockquote_li]:text-slate-500",
                  "[&_table]:my-[34px] [&_table]:w-full [&_table]:border-collapse [&_table]:border-t [&_table]:border-b [&_table]:border-[#d1d5db] [&_table]:text-sm",
                  "[&_th]:border-b [&_th]:border-[#d1d5db] [&_th]:bg-[#f9f9fb] [&_th]:px-5 [&_th]:py-[14px] [&_th]:text-left [&_th]:font-medium [&_th]:leading-[1.5] [&_th]:text-slate-950",
                  "[&_td]:border-b [&_td]:border-[#e5e7eb] [&_td]:px-5 [&_td]:py-[14px] [&_td]:align-top [&_td]:leading-6 [&_td]:text-slate-500",
                  "[&_tr:nth-child(even)_td]:bg-[#f6f8fa]",
                  "[&_tr:last-child_td]:border-b-0",
                  "[&_hr]:my-10 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-[#e5e7eb]",
                ].join(" ")}
              >
                {post.content}
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-[280px] lg:flex-shrink-0">
            <div className="space-y-[60px]">
              <div>
                <h2 className="mb-[13px] text-[15px] font-medium leading-[1.467] text-slate-950">
                  関連記事
                </h2>
                <hr className="mb-[21px] border-0 border-t border-[#e5e7eb]" />
                <div className="space-y-10">
                  {post.relatedItems.map((item) => (
                    <Link
                      key={`${item.href}-${item.title}`}
                      href={item.href}
                      className="flex flex-col gap-3 transition hover:opacity-70"
                    >
                      <div className="aspect-[16/9] overflow-hidden rounded-[8px] bg-[#eceff3]">
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          width={560}
                          height={315}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <h3 className="line-clamp-3 text-[14px] font-normal leading-[1.571] tracking-[0.0175rem] text-slate-950">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-6 text-slate-400">{item.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="rounded-[10px] bg-[#f9f9fb] px-[30px] py-10 text-center">
                <h3 className="mb-[10px] text-base font-medium text-slate-950">お問い合わせ</h3>
                <p className="mb-[30px] text-sm leading-6 text-slate-500">
                  当社のコンサルタントと繋がってAI活用を加速しませんか？
                </p>
                <Link
                  href={contactUrl}
                  className="inline-flex w-full items-center justify-center gap-[6px] rounded-[6px] bg-[#24292F] px-[18px] py-[12px] text-[14px] font-medium leading-none text-white transition hover:opacity-80"
                >
                  今すぐお問い合わせ
                  <Image
                    src="/header-assets/stage-arrow-right.svg"
                    alt=""
                    width={11}
                    height={11}
                    className="h-[11px] w-[11px] invert"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
