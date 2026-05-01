import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href="/contact-us" />

      <section className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">404 Error</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            お探しのページが見つかりません。
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-slate-600 sm:text-lg">
            URLが変更されたか、ページが移動または削除された可能性があります。トップページから必要な情報をご確認ください。
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">トップページへ戻る</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact-us">お問い合わせ</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
