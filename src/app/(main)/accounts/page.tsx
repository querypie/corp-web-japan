"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2, ToggleLeft, ToggleRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Platform } from "@/stores/accounts";
import { usePostsStore } from "@/stores/posts";
import { useAccounts, useDeleteAccount } from "@/hooks/use-accounts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const platformMeta: Record<
  Platform,
  { name: string; color: string; bg: string }
> = {
  instagram: {
    name: "Instagram",
    color: "text-pink-600",
    bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  },
  facebook: { name: "Facebook", color: "text-blue-600", bg: "bg-[#1877F2]" },
  x: { name: "X", color: "text-gray-900", bg: "bg-gray-900" },
  youtube: { name: "YouTube", color: "text-red-600", bg: "bg-red-600" },
  note: { name: "note", color: "text-gray-900", bg: "bg-gray-900" },
};

function AccountsContent() {
  const { accounts, toggleAccount } = useAccounts();
  const deleteAccount = useDeleteAccount();
  const posts = usePostsStore((s) => s.posts);
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "instagram_connected") {
      toast.success("Instagram 계정이 연동되었습니다!");
    }
    if (success === "facebook_connected") {
      const count = searchParams.get("count");
      toast.success(
        count && Number(count) > 1
          ? `Facebook 페이지 ${count}개가 연동되었습니다!`
          : "Facebook 페이지가 연동되었습니다!"
      );
    }
  }, [searchParams]);

  const handleRemove = (
    id: string,
    name: string,
    source: "demo" | "oauth"
  ) => {
    deleteAccount.mutate(
      { accountId: id, source },
      {
        onSuccess: () => {
          toast.success(`${name} 계정이 연동 해제되었습니다.`);
        },
        onError: () => {
          toast.error("계정 해제에 실패했습니다.");
        },
      }
    );
  };

  const hasDemoAccounts = accounts.some((a) => a.source === "demo");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SNS 계정 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            전체 {accounts.length}개의 계정 표시 중
          </p>
        </div>
        <Link href="/accounts/add">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus size={16} className="mr-1" />새 계정 추가
          </Button>
        </Link>
      </div>

      {hasDemoAccounts && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
          <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">데모 모드</p>
            <p className="text-xs text-amber-600">
              수동으로 입력된 데모 계정은 실제 SNS와 연결되어 있지 않습니다.
              자동 발행은 OAuth 연동 계정에서만 가능합니다.
            </p>
          </div>
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gray-400"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              연동된 SNS 계정이 없습니다
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              SNS 계정을 연동하여 자동 포스팅을 시작해보세요
            </p>
            <Link href="/accounts/add">
              <Button variant="outline">
                <Plus size={16} className="mr-1" />새 계정 추가
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => {
            const meta = platformMeta[account.platform];
            const accountPosts = posts.filter(
              (p) => p.accountId === account.id
            );
            const scheduled = accountPosts.filter(
              (p) => p.status === "scheduled"
            ).length;
            const published = accountPosts.filter(
              (p) => p.status === "published"
            ).length;

            return (
              <div
                key={account.id}
                className={cn(
                  "bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 transition-opacity",
                  !account.isActive && "opacity-60"
                )}
              >
                {account.profileImage ? (
                  <img
                    src={account.profileImage}
                    alt={account.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold",
                      meta.bg
                    )}
                  >
                    {account.displayName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 truncate">
                      {account.displayName}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        account.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {account.isActive ? "활성" : "비활성"}
                    </span>
                    {account.source === "oauth" ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-green-100 text-green-600 border border-green-200">
                        연동됨
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-600 border border-amber-200">
                        데모
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    @{account.username} · {meta.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    예약 {scheduled}건 · 발행 {published}건 · 연동일{" "}
                    {new Date(account.connectedAt).toLocaleDateString("ko-KR")}
                    {account.source === "oauth" &&
                      account.tokenExpiresAt && (
                        <>
                          {" "}
                          · 토큰 만료{" "}
                          {new Date(
                            account.tokenExpiresAt
                          ).toLocaleDateString("ko-KR")}
                        </>
                      )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAccount(account.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={account.isActive ? "비활성화" : "활성화"}
                  >
                    {account.isActive ? (
                      <ToggleRight size={24} className="text-violet-600" />
                    ) : (
                      <ToggleLeft size={24} className="text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleRemove(
                        account.id,
                        account.displayName,
                        account.source
                      )
                    }
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                    title="연동 해제"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AccountsPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-16 text-center text-gray-400">로딩 중...</div>}>
      <AccountsContent />
    </Suspense>
  );
}
