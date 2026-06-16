import type { SiteNoticeFeaturedContent } from "@/lib/site-notice";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type SiteNoticeDataDebugPanelProps = {
  content: SiteNoticeFeaturedContent;
};

const sourceFilePath = "src/content/site-notice/featured.ja.yaml";

const codeClassName = "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-950";

export function SiteNoticeDataDebugPanel({ content }: SiteNoticeDataDebugPanelProps) {
  return (
    <section
      {...componentNameDebugProps("SiteNoticeDataDebugPanel")}
      className="border-b border-slate-200 bg-slate-50 px-6 py-12 text-slate-950 sm:px-10 lg:px-16 lg:py-16"
      aria-labelledby="site-notice-data-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-3">
          <p className="text-sm font-semibold uppercase text-blue-600">Internal data</p>
          <h1 id="site-notice-data-heading" className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Site Notice Data
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Inspect the JA-only Site Notice YAML values that feed the announcement bar and floating spotlight card.
          </p>
        </div>

        <dl className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <dt className="text-sm text-slate-500">Locale</dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-950">ja</dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <dt className="text-sm text-slate-500">Source file</dt>
            <dd className="mt-2 break-all text-lg font-semibold text-slate-950">
              <code className={codeClassName}>{sourceFilePath}</code>
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <dt className="text-sm text-slate-500">Items</dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-950">{content.items.length}</dd>
          </div>
        </dl>

        <div className="mt-5 grid gap-5">
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white" aria-labelledby="site-notice-labels-heading">
            <h2 id="site-notice-labels-heading" className="border-b border-slate-200 px-5 py-4 text-xl font-semibold text-slate-950">
              Surface labels
            </h2>
            <dl className="grid md:grid-cols-2">
              {[
                ["ariaLabel", content.ariaLabel],
                ["badgeLabel", content.badgeLabel],
                ["spotlightLabel", content.spotlightLabel],
                ["spotlightCtaLabel", content.spotlightCtaLabel],
                ["spotlightDismissLabel", content.spotlightDismissLabel],
                ["viewAllLabel", content.viewAllLabel],
                ["viewAllHref", content.viewAllHref],
                ["previousLabel", content.previousLabel],
                ["nextLabel", content.nextLabel],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-slate-200 px-5 py-4 md:[&:nth-last-child(-n+2)]:border-b-0">
                  <dt className="text-sm text-slate-500">{label}</dt>
                  <dd className="mt-2 break-words text-sm font-semibold leading-6 text-slate-950">
                    {label.endsWith("Href") ? <code className={codeClassName}>{value}</code> : value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white" aria-labelledby="site-notice-items-heading">
            <h2 id="site-notice-items-heading" className="border-b border-slate-200 px-5 py-4 text-xl font-semibold text-slate-950">
              Items
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-[1080px] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                      ID
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                      Title
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                      Meta
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                      Href
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                      Image
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                      Spotlight date
                    </th>
                    <th className="border-b border-slate-200 px-4 py-3 font-semibold" scope="col">
                      Visible until
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {content.items.map((item) => (
                    <tr key={item.id}>
                      <td className="border-b border-slate-200 px-4 py-3 align-top">
                        <code className={codeClassName}>{item.id}</code>
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3 align-top font-medium text-slate-950">
                        {item.title}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3 align-top text-slate-600">{item.meta}</td>
                      <td className="border-b border-slate-200 px-4 py-3 align-top">
                        <code className={codeClassName}>{item.href}</code>
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3 align-top">
                        <code className={codeClassName}>{item.imageSrc}</code>
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3 align-top text-slate-600">
                        {item.spotlightMeta}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3 align-top">
                        <time dateTime={item.visibleUntil}>{item.visibleUntil}</time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
