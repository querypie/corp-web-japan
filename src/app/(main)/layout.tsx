"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8faf5_48%,#f4f6ef_100%)] text-slate-900">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "transition-all duration-200",
          sidebarCollapsed ? "lg:ml-[52px]" : "lg:ml-56"
        )}
      >
        {/* Mobile hamburger */}
        <div className="flex items-center h-12 px-4 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg border border-black/10 bg-white p-1.5 transition-colors hover:bg-slate-50"
            aria-label="메뉴 열기"
          >
            <Menu size={20} className="text-slate-700" />
          </button>
        </div>
        <main className="p-4 pt-4 lg:px-8 lg:pt-[60px] lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
