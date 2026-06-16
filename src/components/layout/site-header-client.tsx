"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { ComponentNameDebugOverlay } from "./component-name-debug-overlay";
import { PreviewModeToggle } from "./preview-mode-toggle";
import styles from "./site-header.module.css";

type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href?: string;
  description?: string;
  children?: readonly NavChild[];
  grid?: boolean;
};

type SiteHeaderClientProps = {
  previewModeEnabled: boolean;
  showPreviewModeToggle: boolean;
};

function getNavItems(): readonly NavItem[] {
  return [
    {
      label: "サービス",
      description: "QueryPie AIのコアサービス",
      children: [
        { label: "AIプラットフォーム｜AIP", href: "/platforms/aip" },
        { label: "アクセス制御プラットフォーム｜ACP", href: "/platforms/acp" },
        { label: "AI専門家伴走支援｜FDE", href: "/services/fde" },
      ],
    },
    {
      label: "ソリューション",
      description: "課題に合わせたAIソリューション",
      children: [
        { label: "社内業務効率化｜AI Crew", href: "/solutions/ai-crew" },
        { label: "自社サービスAI化｜AI Dashi", href: "/solutions/ai-dashi" },
        { label: "IBM i（AS/400）モダナイゼーション", href: "/solutions/as400-cobol" },
      ],
    },
    {
      label: "デモ",
      description: "QueryPie AIを体験する",
      children: [
        { label: "活用事例", href: "/use-cases" },
        { label: "AIP機能", href: "/demo/aip" },
        { label: "ACP機能", href: "/demo/acp" },
      ],
    },
    {
      label: "リソース",
      description: "学習・活用リソース",
      grid: true,
      children: [
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
      label: "会社情報",
      description: "QueryPie AIについて",
      children: [
        { label: "私たちについて", href: "/about-us" },
        { label: "認証情報", href: "/certifications" },
        { label: "ニュース", href: "/news" },
        { label: "お問い合わせ", href: "/contact-us" },
      ],
    },
  ];
}

export function SiteHeaderClient({
  previewModeEnabled,
  showPreviewModeToggle,
}: SiteHeaderClientProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);
  const [navLeft, setNavLeft] = useState(0);
  const navItems = getNavItems();

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!shellRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    function syncNavLeft() {
      const rect = navListRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      setNavLeft(rect.left);
    }

    syncNavLeft();
    window.addEventListener("resize", syncNavLeft);

    return () => {
      window.removeEventListener("resize", syncNavLeft);
    };
  }, []);

  const activeDropdown = navItems.find((item) => item.label === openMenu && item.children);

  return (
    <>
      <div ref={shellRef} {...componentNameDebugProps("SiteHeaderShell")}>
        <header {...componentNameDebugProps("SiteHeader")} className={styles.siteHeader}>
          <div {...componentNameDebugProps("SiteHeaderContainer")} className={styles.headerContainer}>
            <Link {...componentNameDebugProps("SiteHeaderLogo")} href="/" className={styles.logo}>
              <Image
                src="/header-assets/stage-logo.svg"
                alt="AI Staff"
                width={150}
                height={28}
                className={styles.logoImg}
                priority
              />
            </Link>

            <nav {...componentNameDebugProps("SiteHeaderNav")} className={styles.mainNav}>
              <ul ref={navListRef} className={styles.navList}>
                {navItems.map((item) => {
                  const isOpen = openMenu === item.label;

                  if (!item.children) {
                    return (
                      <li key={item.label} className={styles.navItem}>
                        <Link href={item.href ?? "#"} className={styles.navStandalone}>
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.label} className={styles.navItem}>
                      <button
                        type="button"
                        onClick={() => setOpenMenu(isOpen ? null : item.label)}
                        className={`${styles.navTrigger} ${isOpen ? styles.navTriggerOpen : ""}`}
                        aria-expanded={isOpen}
                        aria-controls={`desktop-menu-${item.label}`}
                      >
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div {...componentNameDebugProps("SiteHeaderActions")} className={styles.rightActions}>
              <Link href="/contact-us" className={styles.cta}>
                お問い合わせ
              </Link>
              {showPreviewModeToggle ? (
                <PreviewModeToggle enabled={previewModeEnabled} />
              ) : null}
            </div>
          </div>
        </header>

        {activeDropdown?.children ? (
          <>
            <div className={styles.dropdownPanel} aria-hidden="true" />
            <div
              id={`desktop-menu-${activeDropdown.label}`}
              className={styles.navDropdown}
              style={{ left: `${navLeft}px` }}
            >
              <div {...componentNameDebugProps("SiteHeaderMegaMenu")} className={styles.megaInner}>
                <div className={styles.megaLeft}>
                  <p className={styles.megaHeading}>{activeDropdown.label}</p>
                  <p className={styles.megaSub}>{activeDropdown.description}</p>
                </div>

                <div
                  className={
                    activeDropdown.grid
                      ? `${styles.megaLinks} ${styles.megaLinksGrid}`
                      : styles.megaLinks
                  }
                >
                  {activeDropdown.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className={styles.dropdownLink}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {openMenu ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className={styles.backdrop}
          onClick={() => setOpenMenu(null)}
        />
      ) : null}
      <ComponentNameDebugOverlay />
    </>
  );
}
