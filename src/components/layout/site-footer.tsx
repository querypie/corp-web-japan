import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  PREVIEW_NAVIGATION_COOKIE,
  getPreviewNavigationState,
  t,
} from "@/lib/preview-navigation";
import styles from "./site-footer.module.css";

export async function SiteFooter() {
  const cookieStore = await cookies();
  const previewCookieValue = cookieStore.get(PREVIEW_NAVIGATION_COOKIE)?.value;
  const { enabled: previewModeEnabled } = getPreviewNavigationState(previewCookieValue);

  const internalFooterColumn = {
    title: "Internal",
    links: [
      { label: "Internal Hub", href: "/internal" },
      { label: "Whitepaper Gating Demo", href: "/internal/whitepaper-gating-demo" },
      { label: "MDX List Demo", href: "/internal/mdx-list-demo" },
      { label: "Events Demo", href: "/internal/events-demo" },
      { label: "Load More Demo", href: "/internal/load-more" },
    ],
  } as const;

  const footerColumns = [
    {
      title: "サービス",
      mobileLayout: "single",
      links: [
        { label: "AIプラットフォーム｜AIP", href: t("/platforms/aip", previewModeEnabled) },
        { label: "アクセス制御プラットフォーム｜ACP", href: t("/platforms/acp", previewModeEnabled) },
        { label: "AI専門家伴走支援｜FDE", href: t("/services/fde", previewModeEnabled) },
      ],
    },
    {
      title: "ソリューション",
      mobileLayout: "compact",
      links: [
        { label: "社内業務効率化｜AI Crew", href: "/solutions/ai-crew" },
        { label: "自社サービスAI化｜AI Dashi", href: "/solutions/ai-dashi" },
      ],
    },
    {
      title: "デモ",
      mobileLayout: "compact",
      links: [
        { label: "活用事例", href: "/demo/use-cases" },
        { label: "AIP 機能", href: "/demo/aip" },
        { label: "ACP 機能", href: "/demo/acp" },
      ],
    },
    {
      title: "リソース",
      mobileLayout: "compact",
      links: [
        { label: "全て", href: "/resources" },
        { label: "紹介資料", href: "/introduction-deck" },
        { label: "用語集", href: "/glossary" },
        { label: "マニュアル", href: "/manuals" },
        { label: "ホワイトペーパー", href: "/whitepapers" },
        { label: "ブログ", href: "/blog" },
        { label: "イベント", href: "/events" },
      ],
    },
    {
      title: "会社情報",
      mobileLayout: "compact",
      links: [
        { label: "私たちについて", href: "/about-us" },
        { label: "認証情報", href: "/certifications" },
        { label: "ニュース", href: "/news" },
        { label: "お問い合わせ", href: "/contact-us" },
      ],
    },
    ...(previewModeEnabled ? [{ ...internalFooterColumn, mobileLayout: "single" as const }] : []),
  ] as const;

  const socialLinks = [
    {
      label: "LinkedIn",
      href: "https://kr.linkedin.com/company/querypie-01",
      icon: "/footer-assets/social-linkedin.svg",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@querypie",
      icon: "/footer-assets/social-youtube.svg",
    },
    {
      label: "X",
      href: "https://x.com/querypie",
      icon: "/footer-assets/social-x.svg",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/querypie",
      icon: "/footer-assets/social-facebook.svg",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/querypie.ai/",
      icon: "/footer-assets/social-instagram.svg",
    },
  ] as const;

  const legalLinks = [
    { label: "Cookie設定", href: "/cookie-preference" },
    { label: "利用規約", href: "/terms-of-service" },
    { label: "プライバシーポリシー", href: "/privacy-policy" },
    { label: "EULA", href: "/eula" },
  ] as const;

  const addresses = [
    "© 2026 QueryPie AI All rights reserved.",
    "本社: 2525 West 8th Street, Suite 300, Los Angeles, CA 90057",
    "R&D: ソウル特別市江西区麻谷中央1路26 7F",
    "日本: 〒105-6490 東京都港区虎ノ門1丁目17-1 虎ノ門ヒルズ ビジネスタワー15F",
  ] as const;

  return (
    <footer id="company-info" className={styles.siteFooter}>
      <div className={`${styles.container} ${styles.footerContent}`}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <Image
              src="/header-assets/stage-logo.svg"
              alt="QueryPie"
              width={160}
              height={30}
              priority
            />
          </div>

          <div className={styles.socialLinks}>
            {socialLinks.map((social) => (
              <Link key={social.label} href={social.href}>
                <Image src={social.icon} alt={social.label} width={16} height={16} />
              </Link>
            ))}
          </div>
        </div>

        <div
          className={previewModeEnabled ? `${styles.footerLinks} ${styles.footerLinksPreview}` : styles.footerLinks}
        >
          {footerColumns.map((column) => (
            <div key={column.title} className={styles.linkColumn}>
              <h4>{column.title}</h4>
              <ul
                className={
                  column.mobileLayout === "compact" ? `${styles.linkList} ${styles.linkListCompact}` : styles.linkList
                }
              >
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.container} ${styles.footerBottom}`}>
        <div className={styles.legalLinks}>
          {legalLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.copyright}>
          {addresses.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}
