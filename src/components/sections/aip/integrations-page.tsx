import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./integrations-page.module.css";
import { componentNameDebugProps } from "@/lib/component-name-debug";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type ClassNameProps = {
  className?: string;
};

export function AipIntegrationsSection({ children, className, ...props }: { children: ReactNode } & ClassNameProps & Omit<ComponentPropsWithoutRef<"section">, "children" | "className">) {
  return <section {...props} className={cx(styles.section, className)}>{children}</section>;
}

export function AipIntegrationsContent({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <div className={cx(styles.content, className)}>{children}</div>;
}

export function AipIntegrationsHeroSection({
  children,
  className,
}: {
  children: ReactNode;
} & ClassNameProps) {
  return (
    <AipIntegrationsSection {...componentNameDebugProps("AipIntegrationsHeroSection")} className={cx(styles.heroSection, className)}>
      <AipIntegrationsContent>
        <div className={styles.heroContent}>{children}</div>
      </AipIntegrationsContent>
    </AipIntegrationsSection>
  );
}

export function AipIntegrationsHeroCopy({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AipIntegrationsHeroCopy")} className={styles.heroCopy}>{children}</div>;
}

export function AipIntegrationsHeroHeading({ children }: { children: ReactNode }) {
  return <h1 {...componentNameDebugProps("AipIntegrationsHeroHeading")} className={styles.heroHeading}>{children}</h1>;
}

export function AipIntegrationsHeroLead({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AipIntegrationsHeroLead")} className={styles.heroLead}>{children}</p>;
}

export function AipIntegrationsCategoryList({ children }: { children: ReactNode }) {
  return <ul {...componentNameDebugProps("AipIntegrationsCategoryList")} className={styles.categoryList}>{children}</ul>;
}

export function AipIntegrationsCategoryLink({
  href,
  active = false,
  children,
}: {
  href: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <li {...componentNameDebugProps("AipIntegrationsCategoryLink")}>
      <Link href={href} replace className={cx(styles.categoryItem, active && styles.categoryItemActive)}>
        {children}
      </Link>
    </li>
  );
}

export function AipIntegrationsProductList({ children }: { children: ReactNode }) {
  return <ul {...componentNameDebugProps("AipIntegrationsProductList")} className={styles.productList}>{children}</ul>;
}

export function AipIntegrationsProductCard({
  iconSrc,
  label,
}: {
  iconSrc: string;
  label: string;
}) {
  return (
    <li {...componentNameDebugProps("AipIntegrationsProductCard")} className={styles.productItem}>
      <div className={styles.icon}>
        <Image src={iconSrc} alt={label} width={68} height={68} className={styles.iconImage} unoptimized />
      </div>
      <p className={styles.productLabel}>{label}</p>
    </li>
  );
}
