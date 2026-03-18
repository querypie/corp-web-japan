"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

const navItems: readonly NavItem[] = [
  {
    label: "サービス",
    description: "QueryPie AIのコアサービス",
    children: [
      { label: "AI Platform (AIP)", href: "#" },
      { label: "Access Control Platform (ACP)", href: "#" },
      { label: "Forward Deployed Engineer Service (FDES)", href: "#" },
    ],
  },
  {
    label: "ソリューション",
    description: "課題に合わせたAIソリューション",
    children: [{ label: "AI 出汁", href: "#" }],
  },
  {
    label: "デモ",
    description: "QueryPie AIを体験する",
    children: [
      { label: "ユースケース", href: "#" },
      { label: "AIP機能", href: "#" },
      { label: "ACP機能", href: "#" },
    ],
  },
  {
    label: "リソース",
    description: "学習・活用リソース",
    grid: true,
    children: [
      { label: "紹介資料", href: "#" },
      { label: "用語集", href: "#" },
      { label: "マニュアル", href: "#" },
      { label: "ホワイトペーパー", href: "#" },
      { label: "ブログ", href: "#" },
      { label: "イベント", href: "#" },
    ],
  },
  {
    label: "会社情報",
    description: "QueryPie AIについて",
    children: [
      { label: "私たちについて", href: "#" },
      { label: "認証情報", href: "#" },
      { label: "ニュース", href: "#" },
      { label: "お問い合わせ", href: "#contact" },
    ],
  },
  {
    label: "プラン",
    href: "#",
  },
];

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);
  const [navLeft, setNavLeft] = useState(0);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
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
      <header ref={headerRef} className={styles.siteHeader}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/header-assets/stage-logo.svg"
              alt="AI Staff"
              width={150}
              height={28}
              className={styles.logoImg}
              priority
            />
          </Link>

          <nav className={styles.mainNav}>
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

          <div>
            <Link href="#contact" className={styles.cta}>
              お問い合わせ
            </Link>
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
            <div className={styles.megaInner}>
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
                    onClick={() => setOpenMenu(null)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {openMenu ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className={styles.backdrop}
          onClick={() => setOpenMenu(null)}
        />
      ) : null}
    </>
  );
}
