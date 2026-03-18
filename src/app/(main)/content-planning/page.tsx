"use client";

import { useState } from "react";
import { Sparkles, Search, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Idea {
  id: string;
  title: string;
  content: string;
  hashtags: string[];
  status: "pending" | "draft_generated" | "draft_used";
}

const modes = [
  {
    id: "creative",
    label: "창작 기반",
    icon: <Sparkles size={20} />,
    description:
      "외부 자료 없이 AI가 창의적인 아이디어를 생성합니다.",
  },
  {
    id: "search",
    label: "검색 기반",
    icon: <Search size={20} />,
    description:
      "실시간 트렌드와 검색 데이터를 분석하여 아이디어를 생성합니다.",
  },
  {
    id: "knowledge",
    label: "내부 지식 기반",
    icon: <Globe size={20} />,
    description:
      "업로드한 내부 자료를 기반으로 아이디어를 생성합니다.",
  },
];

const kanbanColumns = [
  { key: "pending" as const, label: "작성 대기중", color: "bg-yellow-50 border-yellow-200" },
  { key: "draft_generated" as const, label: "초안 생성됨", color: "bg-violet-50 border-violet-200" },
  { key: "draft_used" as const, label: "초안 사용됨", color: "bg-green-50 border-green-200" },
];

export default function ContentPlanningPage() {
  const [selectedMode, setSelectedMode] = useState("creative");
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: selectedMode, prompt, count }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "생성 실패");
      }

      const data = await res.json();
      const newIdeas: Idea[] = data.ideas.map(
        (idea: { title: string; content: string; hashtags: string[] }, i: number) => ({
          id: `${Date.now()}-${i}`,
          title: idea.title,
          content: idea.content,
          hashtags: idea.hashtags,
          status: "pending" as const,
        })
      );

      setIdeas((prev) => [...newIdeas, ...prev]);
      toast.success(`${newIdeas.length}개의 아이디어가 생성되었습니다!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "아이디어 생성에 실패했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const moveIdea = (id: string, newStatus: Idea["status"]) => {
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === id ? { ...idea, status: newStatus } : idea))
    );
  };

  const getIdeasByStatus = (status: Idea["status"]) =>
    ideas.filter((idea) => idea.status === status);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        AI 콘텐츠 기획
      </h1>

      {/* Idea Generation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">
          콘텐츠 아이디어 생성
        </h3>

        {/* Mode Selection */}
        <p className="text-sm text-gray-500 mb-3">아이디어 모드</p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                selectedMode === mode.id
                  ? "border-violet-500 bg-violet-50"
                  : "border-gray-200 hover:border-violet-200"
              )}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    selectedMode === mode.id
                      ? "bg-violet-100 text-violet-600"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {mode.icon}
                </div>
                <span className="text-sm font-medium">{mode.label}</span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mb-2">
          구체적인 방향을 입력하면 더 맞춤화된 콘텐츠가 생성됩니다
        </p>

        <Textarea
          placeholder="예: 서비스 개발 비하인드, 시행착오"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-4"
          rows={3}
        />

        <div className="flex items-center gap-3">
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value={5}>5개</option>
            <option value={10}>10개</option>
            <option value={20}>20개</option>
          </select>
          <Button
            className="flex-1 bg-violet-600 hover:bg-violet-700"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                생성 중...
              </>
            ) : (
              "✨ 콘텐츠 아이디어 생성하기"
            )}
          </Button>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kanbanColumns.map((col) => {
          const columnIdeas = getIdeasByStatus(col.key);
          return (
            <div
              key={col.key}
              className={cn("rounded-xl border p-4 min-h-[200px]", col.color)}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-sm">{col.label}</h4>
                <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
                  {columnIdeas.length}
                </span>
              </div>

              {columnIdeas.length === 0 ? (
                <p className="text-sm text-gray-400 text-center mt-8">
                  생성된 아이디어가 없습니다.
                </p>
              ) : (
                <div className="space-y-3">
                  {columnIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
                    >
                      <h5 className="text-sm font-medium text-gray-900 mb-1">
                        {idea.title}
                      </h5>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {idea.content}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {idea.hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        {col.key === "pending" && (
                          <button
                            onClick={() => moveIdea(idea.id, "draft_generated")}
                            className="text-[11px] text-violet-600 hover:underline"
                          >
                            초안 생성 →
                          </button>
                        )}
                        {col.key === "draft_generated" && (
                          <button
                            onClick={() => moveIdea(idea.id, "draft_used")}
                            className="text-[11px] text-green-600 hover:underline"
                          >
                            사용 완료 →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
