import Image from "next/image";
import Link from "next/link";
import { AuthorBox } from "@/components/AuthorBox";
import { PublicationShareButtons } from "@/components/sections/publication/share-buttons";
import { ResourcePostGated } from "@/components/sections/publication/gated-content";
import { ResourcePostToc } from "@/components/sections/publication/toc";
import type { PublicationPost, PublicationPostDownloadCta } from "@/lib/publications/types";

const publicationPostContactUrl = "/contact-us";

type PublicationPostPageProps = {
  post: PublicationPost;
};

function isExternalPublicationHref(href: string) {
  return /^https?:\/\//.test(href);
}

function isDocumentNavigationDownloadHref(href: string) {
  return href.startsWith("/") && href.endsWith("/pdf");
}

function PublicationDownloadCta({ downloadCta }: { downloadCta: PublicationPostDownloadCta }) {
  if (
    downloadCta.external ||
    isExternalPublicationHref(downloadCta.href) ||
    isDocumentNavigationDownloadHref(downloadCta.href)
  ) {
    const externalProps = downloadCta.external || isExternalPublicationHref(downloadCta.href)
      ? { target: "_blank", rel: "noopener noreferrer" as const }
      : {};

    return (
      <a href={downloadCta.href} className="article-content-btn" {...externalProps}>
        {downloadCta.label}
      </a>
    );
  }

  return (
    <Link href={downloadCta.href} className="article-content-btn">
      {downloadCta.label}
    </Link>
  );
}

export const publicationBodyClassName = [
  "text-base leading-6 text-slate-500",
  "[&_a]:font-inherit [&_a]:text-slate-950 [&_a]:no-underline [&_a:hover]:text-slate-950 [&_a:hover]:underline [&_a:hover]:decoration-[1px] [&_a:hover]:underline-offset-[3px] [&_a:focus-visible]:underline [&_a:focus-visible]:decoration-[1px] [&_a:focus-visible]:underline-offset-[3px]",
  "[&_h1]:mt-12 [&_h1]:text-[22px] [&_h1]:font-semibold [&_h1]:leading-[1.4] [&_h1]:tracking-[-0.01em] [&_h1]:text-slate-950",
  "[&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:font-normal [&_h2]:leading-[1.455] [&_h2]:text-slate-950",
  "[&_h3]:mt-8 [&_h3]:text-[17px] [&_h3]:font-medium [&_h3]:leading-[1.4] [&_h3]:text-slate-950",
  "[&_h4]:mt-7 [&_h4]:text-[15px] [&_h4]:font-medium [&_h4]:leading-[1.5] [&_h4]:text-slate-950",
  "[&_p]:mt-4 [&_p]:text-base [&_p]:leading-6 [&_p]:text-slate-500",
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-4",
  "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-4",
  "[&_li]:mb-2 [&_li]:text-base [&_li]:leading-6 [&_li]:text-slate-500",
  "[&_strong]:font-medium [&_strong]:text-slate-950 [&_a_strong]:font-inherit [&_a_strong]:text-inherit",
  "[&_figure.wp-figure]:my-8 [&_figure.wp-figure]:flex [&_figure.wp-figure]:flex-col [&_figure.wp-figure]:items-center [&_figure.wp-figure]:text-center",
  "[&_figure.wp-figure_img]:block [&_figure.wp-figure_img]:w-full [&_figure.wp-figure_img]:max-w-full",
  "[&_figure.wp-figure_img]:rounded-[8px]",
  "[&_figure.wp-figure_img]:border [&_figure.wp-figure_img]:border-[#e5e7eb]",
  "[&_figure.wp-figure_figcaption]:mt-[10px] [&_figure.wp-figure_figcaption]:text-sm [&_figure.wp-figure_figcaption]:leading-6 [&_figure.wp-figure_figcaption]:text-slate-400",
  "[&_blockquote]:my-[20px] [&_blockquote]:border-l [&_blockquote]:border-[#d1d5db] [&_blockquote]:pl-[30px]",
  "[&_blockquote_p]:mt-0 [&_blockquote_p]:text-base [&_blockquote_p]:leading-6 [&_blockquote_p]:text-slate-500",
  "[&_blockquote_li]:text-base [&_blockquote_li]:leading-6 [&_blockquote_li]:text-slate-500",
  "[&_table]:my-[34px] [&_table]:w-full [&_table]:border-collapse [&_table]:border-t [&_table]:border-b [&_table]:border-[#d1d5db] [&_table]:text-sm",
  "[&_th]:border-b [&_th]:border-[#d1d5db] [&_th]:bg-[#f9f9fb] [&_th]:px-5 [&_th]:py-[14px] [&_th]:text-left [&_th]:font-medium [&_th]:leading-[1.5] [&_th]:text-slate-950",
  "[&_td]:border-b [&_td]:border-[#e5e7eb] [&_td]:px-5 [&_td]:py-[14px] [&_td]:align-top [&_td]:leading-6 [&_td]:text-slate-500",
  "[&_tr:nth-child(even)_td]:bg-[#f6f8fa]",
  "[&_tr:last-child_td]:border-b-0",
  "[&_.article-content-btn]:mb-7 [&_.article-content-btn]:flex [&_.article-content-btn]:w-full [&_.article-content-btn]:items-center [&_.article-content-btn]:justify-center [&_.article-content-btn]:gap-2 [&_.article-content-btn]:rounded-[6px] [&_.article-content-btn]:bg-[#111827] [&_.article-content-btn]:px-8 [&_.article-content-btn]:py-[10px] [&_.article-content-btn]:text-base [&_.article-content-btn]:font-medium [&_.article-content-btn]:text-white [&_.article-content-btn]:no-underline hover:[&_.article-content-btn]:opacity-85 hover:[&_.article-content-btn]:text-white",
  "[&_p+_.article-content-btn]:mt-4 [&_ul+_.article-content-btn]:mt-4 [&_ol+_.article-content-btn]:mt-4",
  "[&_hr]:hidden",
  "[&>br]:hidden",
].join(" ");

export function PublicationPostPage({ post }: PublicationPostPageProps) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-[60px]">
          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-col gap-5">
              <div className="flex flex-col gap-5">
                <span className="inline-flex self-start rounded-full border border-[#353c45] px-3 py-1 text-xs font-medium leading-[1.417] tracking-[0.015rem] text-slate-950">
                  {post.categoryLabel}
                </span>
                <h1 className="text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">
                  {post.title}
                </h1>
                {post.author ? <AuthorBox author={post.author} /> : null}
                <div className="mt-2 flex flex-col gap-4 border-t border-[#d1d5db] pt-[18px] sm:flex-row sm:items-center sm:justify-between">
                  {post.date ? <p className="text-sm leading-6 text-slate-400">{post.date}</p> : <span />}
                  <PublicationShareButtons title={post.title} />
                </div>
              </div>

              {post.hideHeroImageOnDetail ? null : (
                <div className="aspect-[16/9] overflow-hidden bg-[#eceff3]">
                  <Image
                    src={post.heroImageSrc}
                    alt={post.title}
                    width={1280}
                    height={720}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="pb-[89px]">
              {post.bodyMdx ? (
                <div className={publicationBodyClassName}>
                  {post.category === "whitepaper" && post.gating && post.downloadCta ? <PublicationDownloadCta downloadCta={post.downloadCta} /> : null}
                  {post.bodyMdx}
                  {post.gating ? (
                    <ResourcePostGated
                      contentKey={post.gating.contentKey}
                      initiallyUnlocked={post.gating.initiallyUnlocked}
                      gatedContent={post.gatedBodyMdx}
                      bodyClassName={publicationBodyClassName}
                      downloadCta={post.category === "whitepaper" ? null : post.downloadCta}
                    />
                  ) : post.downloadCta ? (
                    <PublicationDownloadCta downloadCta={post.downloadCta} />
                  ) : null}
                </div>
              ) : post.bodyHtml ? (
                <div className={publicationBodyClassName}>
                  <div
                    dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
                  />
                  {post.downloadCta ? <PublicationDownloadCta downloadCta={post.downloadCta} /> : null}
                </div>
              ) : null}
            </div>
          </div>

          <aside className="w-full lg:w-[280px] lg:flex-shrink-0">
            <div className="space-y-[60px]">
              {post.toc.length > 0 ? (
                <div>
                  <h2 className="mb-[13px] text-[15px] font-medium leading-[1.467] text-slate-950">目次</h2>
                  <hr className="mb-[21px] border-0 border-t border-[#e5e7eb]" />
                  <ResourcePostToc items={post.toc} />
                </div>
              ) : null}
              {post.relatedItems.length > 0 ? (
                <div>
                  <h2 className="mb-[13px] text-[15px] font-medium leading-[1.467] text-slate-950">
                    {post.relatedTitle}
                  </h2>
                  <hr className="mb-[21px] border-0 border-t border-[#e5e7eb]" />
                  <div className="space-y-10">
                    {post.relatedItems.map((item) => {
                      const isExternalHref = /^https?:\/\//.test(item.href);
                      const card = (
                        <>
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
                        </>
                      );

                      if (isExternalHref) {
                        return (
                          <a
                            key={`${item.href}-${item.title}`}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col gap-3 transition hover:opacity-70"
                          >
                            {card}
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={`${item.href}-${item.title}`}
                          href={item.href}
                          className="flex flex-col gap-3 transition hover:opacity-70"
                        >
                          {card}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <div className="rounded-[10px] bg-[#f9f9fb] px-[30px] py-10 text-center">
                <h3 className="mb-[10px] text-base font-medium text-slate-950">お問い合わせ</h3>
                <p className="mb-[30px] text-sm leading-6 text-slate-500">
                  当社のコンサルタントと繋がってAI活用を加速しませんか？
                </p>
                <Link
                  href={publicationPostContactUrl}
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
