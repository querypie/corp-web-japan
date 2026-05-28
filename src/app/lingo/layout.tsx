import type { ReactNode } from "react";
import { GNB } from "@/components/layout/lingo/GNB";
import { CookieConsent } from "@/components/layout/lingo/CookieConsent";

export default function LingoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="lingo-scope locale-ja font-sans antialiased">
      <GNB />
      {children}
      <CookieConsent />
    </div>
  );
}
