import Image from "next/image";
import Link from "next/link";
import styles from "./site-footer.module.css";

const footerColumns = [
  {
    title: "サービス",
    links: [
      { label: "AIプラットフォーム｜AIP", href: "/services/aip" },
      { label: "アクセス制御プラットフォーム｜ACP", href: "/services/acp" },
      { label: "AI専門家伴走支援｜FDE", href: "/services/fde" },
    ],
  },
  {
    title: "ソリューション",
    links: [
      { label: "社内業務効率化｜AI Crew", href: "/solutions/ai-crew" },
      { label: "自社サービスAI化｜AI Dashi", href: "/solutions/ai-dashi" },
    ],
  },
  {
    title: "デモ",
    links: [
      { label: "活用事例", href: "/demo/use-cases" },
      { label: "AIP 機能", href: "/demo/aip" },
      { label: "ACP 機能", href: "/demo/acp" },
    ],
  },
  {
    title: "リソース",
    links: [
      { label: "全てのリソース", href: "/resources" },
      { label: "紹介資料", href: "https://www.querypie.com/ja/features/documentation?category=introduction-deck" },
      { label: "用語集", href: "/glossary" },
      { label: "マニュアル", href: "/manuals" },
      { label: "ホワイトペーパー", href: "/whitepapers" },
      { label: "ブログ", href: "/blog" },
      { label: "イベント", href: "/events" },
    ],
  },
  {
    title: "会社情報",
    links: [
      { label: "会社概要", href: "/about-us" },
      { label: "認定・認証", href: "/certifications" },
      { label: "ニュース", href: "/news" },
      { label: "お問い合わせ", href: "/contact-us" },
    ],
  },
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
  { label: "Cookie設定", href: "https://www.querypie.com/ja/cookie-preference" },
  { label: "利用規約", href: "https://www.querypie.com/ja/terms-of-service" },
  { label: "プライバシーポリシー", href: "https://www.querypie.com/ja/privacy-policy" },
  { label: "EULA", href: "https://www.querypie.com/ja/eula" },
] as const;

const addresses = [
  "© 2017-2025 QueryPie, Inc. All rights reserved.",
  "本社: 3003 North 1st Street, Suite 221, San Jose, CA 95134",
  "ソウル麻谷: ソウル特別市江西区麻谷中央1路26 7F",
  "ソウル江南: ソウル特別市江南区江南大路464 3F",
  "日本: 〒105-6490 東京都港区虎ノ門1丁目17-1 15F",
] as const;

export function SiteFooter() {
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
              <Link key={social.label} href={social.href} target="_blank" rel="noreferrer">
                <Image src={social.icon} alt={social.label} width={16} height={16} />
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.footerLinks}>
          {footerColumns.map((column) => (
            <div key={column.title} className={styles.linkColumn}>
              <h4>{column.title}</h4>
              <ul>
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
