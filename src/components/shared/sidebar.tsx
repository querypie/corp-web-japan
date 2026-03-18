"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ImageIcon,
  Sparkles,
  Users,
  PenLine,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Settings,
  UserPlus,
  X,
  User,
  LogOut,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isNew?: boolean;
  children?: { label: string; href: string; icon?: React.ReactNode }[];
}

const contentCreationItems: NavItem[] = [
  {
    label: "AI 카드뉴스 만들기",
    href: "/card-news",
    icon: <ImageIcon size={18} />,
    isNew: true,
  },
  {
    label: "AI로 콘텐츠 기획",
    href: "/content-planning",
    icon: <Sparkles size={18} />,
  },
];

const snsMarketingItems: NavItem[] = [
  {
    label: "SNS 계정 관리",
    href: "/accounts",
    icon: <Users size={18} />,
    children: [
      { label: "관리 및 AI 설정", href: "/accounts", icon: <Settings size={16} /> },
      { label: "계정 추가 연동", href: "/accounts/add", icon: <UserPlus size={16} /> },
    ],
  },
  {
    label: "콘텐츠 예약",
    href: "/scheduling",
    icon: <PenLine size={18} />,
  },
  {
    label: "콘텐츠 캘린더",
    href: "/calendar",
    icon: <CalendarDays size={18} />,
  },
];

const allIconItems = [
  ...contentCreationItems,
  ...snsMarketingItems,
];

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  return (
    <div className="mb-1">
      <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          item.children?.some((c) => pathname === c.href);
        const isOpen = openMenus[item.href] || isActive;

        return (
          <div key={item.href}>
            {item.children ? (
              <button
                onClick={() => toggleMenu(item.href)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors",
                  isActive
                    ? "border border-[#d4ff47]/70 bg-[#efffbe] font-medium text-slate-950"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                  size={14}
                  className={cn("transition-transform", isOpen && "rotate-180")}
                />
              </button>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors",
                  isActive
                    ? "border border-[#d4ff47]/70 bg-[#efffbe] font-medium text-slate-950"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.isNew && (
                  <span className="rounded bg-[#d4ff47]/70 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                    NEW
                  </span>
                )}
              </Link>
            )}

            {item.children && isOpen && (
              <div className="ml-5 mt-0.5 space-y-0.5">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-1 text-[13px] transition-colors",
                      pathname === child.href
                        ? "font-medium text-slate-900"
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {child.icon}
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const router = useRouter();

  // 실제 유저 정보 + 통계 조회
  const { data: userInfo } = useQuery({
    queryKey: ["user-me"],
    queryFn: async () => {
      const res = await fetch("/api/user/me");
      if (!res.ok) return null;
      return res.json() as Promise<{
        user: { display_name: string; email: string; ai_credits: number; plan: string };
        stats: { account_count: number; scheduled_count: number };
      }>;
    },
    staleTime: 60_000,
    retry: false,
  });

  const displayName = userInfo?.user?.display_name || "사용자";
  const plan = userInfo?.user?.plan || "free_trial";
  const aiCredits = userInfo?.user?.ai_credits ?? 60;
  const accountCount = userInfo?.stats?.account_count ?? 0;
  const planLabel = plan === "pro" ? "Pro" : plan === "basic" ? "Basic" : "무료체험";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-black/10 bg-white/95 backdrop-blur-xl transition-all duration-200",
        sidebarCollapsed ? "w-[52px]" : "w-56",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-3 h-12 shrink-0">
        {!sidebarCollapsed && (
          <Link href="/" className="flex items-center">
            <Image src="/querypie-logo.svg" alt="AI Staff" width={120} height={23} priority />
          </Link>
        )}
        <button
          onClick={onMobileClose}
          className="rounded p-1 transition-colors hover:bg-slate-100 lg:hidden"
          aria-label="메뉴 닫기"
        >
          <X size={18} className="text-slate-500" />
        </button>
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="hidden rounded p-1 transition-colors hover:bg-slate-100 lg:block"
            aria-label="사이드바 접기"
          >
            <ChevronLeft size={16} className="text-slate-400" />
          </button>
        )}
      </div>

      {sidebarCollapsed ? (
        <>
          <button
            onClick={toggleSidebar}
            className="mx-auto mt-2 hidden rounded-lg p-1.5 transition-colors hover:bg-slate-100 lg:block"
            aria-label="사이드바 펼치기"
          >
            <ChevronLeft size={16} className="rotate-180 text-slate-400" />
          </button>
          <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-0.5">
            {allIconItems.map((item) => {
              const isActive =
                pathname === item.href ||
                item.children?.some((c) => pathname === c.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "flex h-9 w-full items-center justify-center rounded-md transition-colors",
                    isActive
                      ? "bg-[#d4ff47] text-slate-950 shadow-[0_10px_20px_-16px_rgba(161,224,72,0.8)]"
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  )}
                >
                  {item.icon}
                </Link>
              );
            })}
          </nav>
          {/* Collapsed user avatar */}
          <div className="border-t border-black/10 px-1.5 py-2.5">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#efffbe]">
              <User size={14} className="text-slate-700" />
            </div>
          </div>
        </>
      ) : (
        <>
          <nav className="flex-1 overflow-y-auto px-2 pt-1 space-y-0.5">
            <NavSection title="콘텐츠 제작" items={contentCreationItems} />
            <NavSection title="SNS 관리" items={snsMarketingItems} />
          </nav>

          {/* AI 크레딧 + 계정 수 */}
          <div className="px-3 pb-2 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Zap size={11} className="text-lime-600" />
                AI 크레딧
              </span>
              <span className="font-medium text-slate-700">{aiCredits}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Users size={11} className="text-lime-600" />
                연동 계정
              </span>
              <span className="font-medium text-slate-700">{accountCount}개</span>
            </div>
          </div>
          {/* User profile */}
          <div className="border-t border-black/10 px-2 py-2.5">
            <div className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-slate-50">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#efffbe]">
                <User size={14} className="text-slate-700" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{displayName}</p>
                <p className="truncate text-xs text-slate-500">{planLabel}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded p-1 transition-colors hover:bg-slate-200"
                aria-label="로그아웃"
                title="로그아웃"
              >
                <LogOut size={14} className="text-slate-500" />
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
