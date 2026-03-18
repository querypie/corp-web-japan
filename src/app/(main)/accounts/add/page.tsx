"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Trash2,
  Database,
  Monitor,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccountsStore, Platform } from "@/stores/accounts";
import { toast } from "sonner";

const INSTAGRAM_CONFIGURED =
  process.env.NEXT_PUBLIC_INSTAGRAM_CONFIGURED === "true";
const FACEBOOK_CONFIGURED =
  process.env.NEXT_PUBLIC_FACEBOOK_CONFIGURED === "true";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  instagram_denied: "Instagram 연동이 취소되었습니다.",
  facebook_denied: "Facebook 연동이 취소되었습니다.",
  invalid_callback: "잘못된 인증 응답입니다.",
  csrf_mismatch: "보안 검증에 실패했습니다. 다시 시도해주세요.",
  token_exchange_failed: "인증 토큰 교환에 실패했습니다.",
  long_token_failed: "장기 토큰 발급에 실패했습니다.",
  profile_fetch_failed: "프로필 정보를 가져올 수 없습니다.",
  pages_fetch_failed: "Facebook 페이지 정보를 가져올 수 없습니다.",
  no_facebook_pages:
    "관리 중인 Facebook 페이지가 없습니다. 페이지를 먼저 만들어주세요.",
  no_project: "프로젝트를 찾을 수 없습니다.",
  save_failed: "계정 저장에 실패했습니다.",
  unexpected: "예기치 않은 오류가 발생했습니다.",
};

function InstagramLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <path
        fill="url(#ig-grad)"
        d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
      />
    </svg>
  );
}

function FacebookLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function XLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill="#000"
        d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"
      />
    </svg>
  );
}

function YouTubeLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.81Z"
        fill="#FF0000"
      />
      <path d="m9.75 15.02 6.25-3.02-6.25-3.02v6.04Z" fill="#fff" />
    </svg>
  );
}

function NoteLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="22" fill="#000" />
      <path
        d="M33 72V38h10v4c3-3 7-5 12-5 10 0 15 7 15 17v18H60V56c0-6-3-10-8-10s-9 4-9 10v16H33z"
        fill="#fff"
      />
    </svg>
  );
}

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <FacebookLogo />,
  instagram: <InstagramLogo />,
  x: <XLogo />,
  youtube: <YouTubeLogo />,
  note: <NoteLogo />,
};

const platforms = {
  recommended: [
    { id: "instagram" as Platform, name: "Instagram" },
    { id: "facebook" as Platform, name: "Facebook" },
    { id: "x" as Platform, name: "X" },
  ],
  other: [
    { id: "youtube" as Platform, name: "YouTube" },
    { id: "note" as Platform, name: "Note" },
  ],
};

function AccountAddContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addAccount = useAccountsStore((s) => s.addAccount);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );
  const [step, setStep] = useState<"select" | "form">("select");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const allPlatforms = [...platforms.recommended, ...platforms.other];
  const selectedName = allPlatforms.find(
    (p) => p.id === selectedPlatform
  )?.name;

  // Handle OAuth error/success from query params
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(
        OAUTH_ERROR_MESSAGES[error] || "연동 중 오류가 발생했습니다."
      );
    }
  }, [searchParams]);

  const handleConnect = () => {
    if (!selectedPlatform) return;

    // Instagram with OAuth configured → real OAuth flow
    if (selectedPlatform === "instagram" && INSTAGRAM_CONFIGURED) {
      setIsOAuthLoading(true);
      window.location.href = "/api/instagram/authorize";
      return;
    }

    // Facebook with OAuth configured → real OAuth flow
    if (selectedPlatform === "facebook" && FACEBOOK_CONFIGURED) {
      setIsOAuthLoading(true);
      window.location.href = "/api/facebook/authorize";
      return;
    }

    // Other platforms → demo form
    setStep("form");
  };

  const handleSubmit = () => {
    if (!selectedPlatform || !username.trim() || !displayName.trim()) {
      toast.error("모든 정보를 입력해주세요.");
      return;
    }

    addAccount({
      platform: selectedPlatform,
      username: username.trim(),
      displayName: displayName.trim(),
      isActive: true,
    });

    toast.success(`${selectedName} 계정이 연동되었습니다!`);
    router.push("/accounts");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href="/accounts"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={16} /> 뒤로
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            새 계정 추가
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            새로운 SNS 계정을 연동하세요
          </p>

          {step === "select" ? (
            <>
              <p className="text-xs text-gray-400 mb-6">
                1000+ 팀이 사용 중
              </p>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                    추천
                  </Badge>
                  <span className="text-xs text-gray-400">
                    가장 최적화된 경험을 제공합니다
                  </span>
                </div>
                <div className="flex gap-4">
                  {platforms.recommended.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={cn(
                        "w-36 h-24 rounded-xl border-2 bg-white flex flex-col items-center justify-center gap-2 transition-all",
                        selectedPlatform === p.id
                          ? "border-violet-500 bg-violet-50"
                          : "border-gray-200 hover:border-violet-200"
                      )}
                    >
                      {platformIcons[p.id]}
                      <span className="text-sm font-medium">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-4">기타 플랫폼</p>
                <div className="flex gap-4">
                  {platforms.other.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={cn(
                        "w-36 h-24 rounded-xl border-2 bg-white flex flex-col items-center justify-center gap-2 transition-all",
                        selectedPlatform === p.id
                          ? "border-violet-500 bg-violet-50"
                          : "border-gray-200 hover:border-violet-200"
                      )}
                    >
                      {platformIcons[p.id]}
                      <span className="text-sm font-medium">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedPlatform === "instagram" && INSTAGRAM_CONFIGURED && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-green-700">
                    Instagram OAuth가 설정되어 있습니다. 버튼을 클릭하면
                    Instagram 로그인 페이지로 이동합니다.
                  </p>
                </div>
              )}

              {selectedPlatform === "instagram" && !INSTAGRAM_CONFIGURED && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-amber-700">
                    Instagram OAuth가 아직 설정되지 않았습니다. 데모 모드로
                    수동 입력합니다.
                  </p>
                </div>
              )}

              {selectedPlatform === "facebook" && FACEBOOK_CONFIGURED && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-green-700">
                    Facebook OAuth가 설정되어 있습니다. 버튼을 클릭하면
                    Facebook 로그인 페이지로 이동합니다. 관리 중인 페이지가 자동으로 연동됩니다.
                  </p>
                </div>
              )}

              {selectedPlatform === "facebook" && !FACEBOOK_CONFIGURED && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-amber-700">
                    Facebook OAuth가 아직 설정되지 않았습니다. 데모 모드로
                    수동 입력합니다.
                  </p>
                </div>
              )}

              <button
                onClick={handleConnect}
                disabled={!selectedPlatform || isOAuthLoading}
                className="w-48 px-6 py-3 rounded-lg transition-colors font-medium disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-violet-600 text-white hover:bg-violet-700 flex items-center justify-center gap-2"
              >
                {isOAuthLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    연동 중...
                  </>
                ) : selectedName ? (
                  `${selectedName} 연동하기`
                ) : (
                  "플랫폼을 선택하세요"
                )}
              </button>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                {selectedPlatform && platformIcons[selectedPlatform]}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedName} 계정 연동
                  </h3>
                  <p className="text-xs text-gray-500">
                    계정 정보를 입력해주세요
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    사용자 이름 (아이디)
                  </label>
                  <Input
                    placeholder="예: jp_web_official"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    표시 이름
                  </label>
                  <Input
                    placeholder="예: JP_WEB 공식계정"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    {selectedPlatform === "instagram"
                      ? "Instagram OAuth 설정 후 자동 연동이 가능합니다. 현재는 데모 모드로 수동 입력합니다."
                      : `실제 서비스에서는 ${selectedName} OAuth를 통해 자동 연동됩니다. 현재는 데모 모드로 수동 입력합니다.`}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("select")}
                  >
                    뒤로
                  </Button>
                  <Button
                    className="flex-1 bg-violet-600 hover:bg-violet-700"
                    onClick={handleSubmit}
                    disabled={!username.trim() || !displayName.trim()}
                  >
                    연동 완료
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Shield size={18} /> 안심하고 연동하세요
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              데이터를 소중히 다룹니다
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Database
                  size={18}
                  className="text-gray-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    안전한 데이터 보관
                  </p>
                  <p className="text-xs text-gray-500">
                    모든 계정 정보는 업계 표준 암호화로 안전하게 저장됩니다
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield
                  size={18}
                  className="text-gray-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    데이터 악용 절대 불가
                  </p>
                  <p className="text-xs text-gray-500">
                    어떠한 경우에도 제3자와 공유하거나 마케팅에 악용하지 않습니다
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Trash2
                  size={18}
                  className="text-gray-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    완전 삭제 보장
                  </p>
                  <p className="text-xs text-gray-500">
                    연동 해제 시 모든 데이터가 즉시 완전 삭제됩니다
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              연동이 안된다면?
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  VPN 사용 시 유의사항
                </p>
                <p className="text-xs text-blue-600">
                  VPN을 사용 중이라면 끄고 진행해주세요.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-800 mb-1 flex items-center gap-1">
                  <Monitor size={14} /> 데스크톱 환경에서 연동하기
                </p>
                <p className="text-xs text-gray-500">
                  브라우저에서 SNS에 로그인 후 연동 버튼을 클릭하세요
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <p className="text-sm font-medium text-amber-800 mb-1 flex items-center gap-1">
                  <AlertTriangle size={14} /> 계정 여러개 연동 방법
                </p>
                <p className="text-xs text-amber-600">
                  먼저 SNS에서 로그아웃 후, 원하는 계정으로 다시 로그인하고
                  연동하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountAddPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto py-16 text-center text-gray-400">로딩 중...</div>}>
      <AccountAddContent />
    </Suspense>
  );
}
