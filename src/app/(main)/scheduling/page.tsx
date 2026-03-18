"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ImageIcon,
  Sparkles,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useAccounts } from "@/hooks/use-accounts";
import { useCreatePost } from "@/hooks/use-posts";
import { toast } from "sonner";
import Link from "next/link";

export default function SchedulingPage() {
  const router = useRouter();
  const { accounts } = useAccounts();
  const createPost = useCreatePost();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [content, setContent] = useState("");
  const [publishMode, setPublishMode] = useState("scheduled");
  const [scheduledDate, setScheduledDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  const activeAccounts = accounts.filter((a) => a.isActive);
  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const isOAuthAccount = selectedAccount?.source === "oauth";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalCount = mediaFiles.length + files.length;
    if (totalCount > 10) {
      toast.error("미디어는 최대 10개까지 추가할 수 있습니다.");
      return;
    }

    const validFiles = files.filter((f) => {
      if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) {
        toast.error(`${f.name}: 이미지 또는 비디오 파일만 추가할 수 있습니다.`);
        return false;
      }
      if (f.size > 50 * 1024 * 1024) {
        toast.error(`${f.name}: 50MB 이하 파일만 추가할 수 있습니다.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newPreviews = validFiles.map((f) => URL.createObjectURL(f));
    setMediaFiles((prev) => [...prev, ...validFiles]);
    setMediaPreviews((prev) => [...prev, ...newPreviews]);
    toast.success(`${validFiles.length}개 미디어가 추가되었습니다.`);

    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index]);
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    if (previewIndex >= mediaPreviews.length - 1 && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const fakeEvent = {
      target: { files },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileSelect(fakeEvent);
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "creative",
          prompt: "SNS에 올릴 수 있는 흥미로운 포스트",
          count: 1,
        }),
      });
      if (!res.ok) throw new Error("생성 실패");
      const data = await res.json();
      if (data.ideas?.[0]) {
        const idea = data.ideas[0];
        setContent(
          `${idea.title}\n\n${idea.content}\n\n${idea.hashtags.map((t: string) => `#${t}`).join(" ")}`
        );
        toast.success("AI 콘텐츠가 생성되었습니다!");
      }
    } catch {
      toast.error("AI 콘텐츠 생성에 실패했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadMediaToStorage = async (): Promise<string[]> => {
    if (mediaFiles.length === 0) return [];

    const formData = new FormData();
    mediaFiles.forEach((file) => formData.append("files", file));

    const res = await fetch("/api/media/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "미디어 업로드 실패");
    }

    const data = await res.json();
    return data.urls as string[];
  };

  const publishToInstagram = async (mediaUrls: string[]) => {
    const res = await fetch("/api/instagram/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: selectedAccountId,
        content: content.trim(),
        mediaUrls,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Instagram 발행 실패");
    }

    return res.json();
  };

  const publishToFacebook = async (mediaUrls: string[]) => {
    const res = await fetch("/api/facebook/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: selectedAccountId,
        content: content.trim(),
        mediaUrls,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Facebook 발행 실패");
    }

    return res.json();
  };

  const handleSave = async () => {
    if (!selectedAccountId) {
      toast.error("계정을 선택해주세요.");
      return;
    }
    if (!content.trim()) {
      toast.error("콘텐츠를 입력해주세요.");
      return;
    }

    // OAuth account + 즉시 발행: real publish
    if (isOAuthAccount && publishMode === "now") {
      const platform = selectedAccount?.platform;

      // Instagram requires at least 1 image
      if (platform === "instagram" && mediaFiles.length === 0) {
        toast.error("Instagram 발행에는 최소 1개의 이미지가 필요합니다.");
        return;
      }

      setIsPublishing(true);
      try {
        let uploadedUrls: string[] = [];
        if (mediaFiles.length > 0) {
          toast.info("미디어를 업로드하는 중...");
          uploadedUrls = await uploadMediaToStorage();
        }

        const platformName = platform === "facebook" ? "Facebook" : "Instagram";
        toast.info(`${platformName}에 발행하는 중...`);

        if (platform === "facebook") {
          await publishToFacebook(uploadedUrls);
        } else {
          await publishToInstagram(uploadedUrls);
        }

        // Supabase에 발행 기록 저장 (실패해도 발행은 성공했으므로 무시)
        createPost.mutate({
          sns_account_id: selectedAccountId,
          content: content.trim(),
          media_urls: uploadedUrls,
          media_type: uploadedUrls.length > 1 ? "carousel" : "image",
          status: "published",
        });

        toast.success(`${platformName}에 성공적으로 발행되었습니다!`);
        setContent("");
        setScheduledDate("");
        setMediaFiles([]);
        setMediaPreviews([]);
        setPreviewIndex(0);
        router.push("/calendar");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "발행 중 오류가 발생했습니다."
        );
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    // Demo account or draft/scheduled: local save only
    const status =
      publishMode === "draft"
        ? "draft"
        : publishMode === "now"
          ? "published"
          : "scheduled";

    // Supabase 우선 저장, 실패 시 로컬 폴백은 useCreatePost 내부에서 처리
    createPost.mutate({
      sns_account_id: selectedAccountId,
      content: content.trim(),
      media_urls: mediaPreviews,
      media_type: mediaPreviews.length > 1 ? "carousel" : mediaPreviews.length === 1 ? "image" : undefined,
      status,
      scheduled_at:
        status === "scheduled" && scheduledDate
          ? new Date(scheduledDate).toISOString()
          : null,
    });

    const msg =
      status === "draft"
        ? "임시저장되었습니다."
        : status === "published"
          ? "발행되었습니다!"
          : "예약되었습니다!";

    toast.success(msg);
    setContent("");
    setScheduledDate("");
    setMediaFiles([]);
    setMediaPreviews([]);
    setPreviewIndex(0);
    router.push("/calendar");
  };

  if (activeAccounts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={24} className="text-gray-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          연동된 계정이 없습니다
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          콘텐츠를 예약하려면 먼저 SNS 계정을 연동해주세요.
        </p>
        <Link href="/accounts/add">
          <Button className="bg-violet-600 hover:bg-violet-700">
            계정 연동하기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">콘텐츠 예약</h1>

      {/* Conditional notice based on account type */}
      {selectedAccount && isOAuthAccount && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6">
          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">OAuth 연동 계정</p>
            <p className="text-xs text-green-600">
              실제 {selectedAccount.platform === "facebook" ? "Facebook 페이지" : "Instagram 계정"}와 연동되어 있습니다. &quot;즉시 발행&quot;을 선택하면 직접 게시됩니다.
            </p>
          </div>
        </div>
      )}
      {selectedAccount && !isOAuthAccount && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
          <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">데모 모드</p>
            <p className="text-xs text-amber-600">
              수동으로 등록된 데모 계정입니다. 실제 SNS에 발행되지 않으며,
              예약/임시저장은 앱 내에서만 관리됩니다. 실제 발행은 OAuth 연동 후 가능합니다.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Editor */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold">새 콘텐츠 예약</h3>
            {selectedAccount && (
              <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                {selectedAccount.platform.charAt(0).toUpperCase() +
                  selectedAccount.platform.slice(1)}
              </Badge>
            )}
            {selectedAccount && (
              <Badge
                variant="outline"
                className={
                  isOAuthAccount
                    ? "text-green-600 border-green-300 text-[10px]"
                    : "text-amber-600 border-amber-300 text-[10px]"
                }
              >
                {isOAuthAccount ? "연동됨" : "데모"}
              </Badge>
            )}
          </div>

          {/* Account selector */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              계정 선택
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">계정을 선택하세요</option>
              {activeAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  @{acc.username} ({acc.platform}) — {acc.source === "oauth" ? "연동됨" : "데모"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1"
              onClick={handleAIGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              AI로 콘텐츠 생성
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium">포스트</span>
            <span className="text-xs text-gray-400 ml-auto">
              {content.length}/2200
            </span>
          </div>

          <Textarea
            placeholder="포스트 내용을 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="mb-4"
          />

          {/* Media upload area */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          {mediaPreviews.length > 0 ? (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  미디어 ({mediaPreviews.length}/10)
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                >
                  + 추가
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {mediaPreviews.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square">
                    {mediaFiles[idx]?.type.startsWith("video/") ? (
                      <video
                        src={url}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`미디어 ${idx + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <button
                      onClick={() => removeMedia(idx)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {mediaFiles[idx]?.type.startsWith("video/") && (
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">
                        영상
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg py-6 text-sm text-gray-500 hover:border-violet-300 hover:text-violet-500 transition-colors mb-4"
            >
              <ImageIcon size={20} className="mx-auto mb-1.5" />
              <p>이미지/비디오 추가</p>
              <p className="text-xs text-gray-400 mt-1">
                클릭 또는 드래그 앤 드롭 (최대 10개, 50MB 이하)
              </p>
            </button>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                게시물 상태
              </label>
              <select
                value={publishMode}
                onChange={(e) => setPublishMode(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="scheduled">예약 발행</option>
                <option value="now">즉시 발행</option>
                <option value="draft">임시저장</option>
              </select>
            </div>
            {publishMode === "scheduled" && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  예약 날짜
                </label>
                <Input
                  type="datetime-local"
                  className="text-sm"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {publishMode === "now" && selectedAccount && !isOAuthAccount && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
              <p className="text-xs text-amber-700">
                데모 모드에서는 실제 SNS에 발행되지 않습니다. &quot;발행됨&quot;
                상태로 캘린더에 기록됩니다.
              </p>
            </div>
          )}
          {publishMode === "now" && isOAuthAccount && selectedAccount?.platform === "instagram" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4">
              <p className="text-xs text-blue-700">
                실제 Instagram 계정에 즉시 게시됩니다. 이미지가 최소 1개 필요합니다.
              </p>
            </div>
          )}
          {publishMode === "now" && isOAuthAccount && selectedAccount?.platform === "facebook" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4">
              <p className="text-xs text-blue-700">
                실제 Facebook 페이지에 즉시 게시됩니다. 텍스트만으로도 발행 가능합니다.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-violet-600 hover:bg-violet-700"
              onClick={handleSave}
              disabled={!content.trim() || !selectedAccountId || isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  발행 중...
                </>
              ) : publishMode === "now" && isOAuthAccount ? (
                `${selectedAccount?.platform === "facebook" ? "Facebook" : "Instagram"}에 발행`
              ) : publishMode === "now" ? (
                "지금 발행"
              ) : publishMode === "draft" ? (
                "임시저장"
              ) : (
                "예약 발행"
              )}
            </Button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-3">미리보기</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 p-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-pink-400 rounded-full" />
                <span className="text-sm font-semibold">
                  {selectedAccount?.username || "계정을 선택하세요"}
                </span>
                <span className="ml-auto text-gray-400">...</span>
              </div>

              {/* Preview media carousel */}
              {mediaPreviews.length > 0 ? (
                <div className="relative aspect-square bg-black">
                  {mediaFiles[previewIndex]?.type.startsWith("video/") ? (
                    <video
                      src={mediaPreviews[previewIndex]}
                      className="w-full h-full object-contain"
                      controls
                    />
                  ) : (
                    <img
                      src={mediaPreviews[previewIndex]}
                      alt="미리보기"
                      className="w-full h-full object-contain"
                    />
                  )}
                  {mediaPreviews.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setPreviewIndex((i) =>
                            i === 0 ? mediaPreviews.length - 1 : i - 1
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center shadow"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setPreviewIndex((i) =>
                            i === mediaPreviews.length - 1 ? 0 : i + 1
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center shadow"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                        {mediaPreviews.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${
                              idx === previewIndex
                                ? "bg-blue-500"
                                : "bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-50 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <p className="text-sm">미디어 추가</p>
                    <p className="text-xs">이미지 또는 비디오를 추가하세요</p>
                  </div>
                </div>
              )}

              <div className="p-3">
                <div className="flex items-center gap-4 mb-2">
                  <Heart size={20} className="text-gray-700" />
                  <MessageCircle size={20} className="text-gray-700" />
                  <Send size={20} className="text-gray-700" />
                  <Bookmark size={20} className="text-gray-700 ml-auto" />
                </div>
                {mediaPreviews.length > 1 && (
                  <div className="flex justify-center gap-1 mb-2">
                    {mediaPreviews.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${
                          idx === previewIndex
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <p className="text-sm font-semibold mb-1">0 좋아요</p>
                {content && (
                  <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-line">
                    <span className="font-semibold">
                      {selectedAccount?.username || "username"}
                    </span>{" "}
                    {content}
                  </p>
                )}
                <p className="text-xs text-gray-300 mt-1">방금</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
