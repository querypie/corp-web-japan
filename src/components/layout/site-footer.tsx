import Image from "next/image";
import Link from "next/link";
import styles from "./site-footer.module.css";

const footerColumns = [
  {
    title: "サービス",
    links: [
      { label: "AIP", href: "#" },
      { label: "ACP", href: "#" },
      { label: "FDE", href: "#" },
    ],
  },
  {
    title: "ソリューション",
    links: [{ label: "AI 出汁", href: "#" }],
  },
  {
    title: "デモ",
    links: [
      { label: "活用事例", href: "#" },
      { label: "AIP 機能", href: "#" },
      { label: "ACP 機能", href: "#" },
    ],
  },
  {
    title: "リソース",
    links: [
      { label: "紹介資料", href: "#" },
      { label: "用語集", href: "#" },
      { label: "マニュアル", href: "#" },
      { label: "ホワイトペーパー", href: "#" },
      { label: "ブログ", href: "/blog.html" },
      { label: "イベント", href: "#" },
    ],
  },
  {
    title: "会社情報",
    links: [
      { label: "会社概要", href: "#" },
      { label: "認定・認証", href: "#" },
      { label: "ニュース", href: "#" },
      { label: "お問い合わせ", href: "#" },
    ],
  },
  {
    title: "料金プラン",
    links: [
      { label: "AIP", href: "#" },
      { label: "ACP", href: "#" },
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
  { label: "Cookie設定", href: "#" },
  { label: "利用規約", href: "#" },
  { label: "プライバシーポリシー", href: "#" },
  { label: "EULA", href: "#" },
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
