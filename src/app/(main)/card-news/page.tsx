"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Upload,
  ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Trash2,
  Edit3,
  X,
  Save,
  Send,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useCardNewsStore, Slide, SlideElement } from "@/stores/card-news";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import dynamic from "next/dynamic";
import SlidePreviewComponent, { slideToElements } from "@/components/card-news/slide-preview";

const SlideEditor = dynamic(
  () => import("@/components/card-news/slide-editor"),
  { ssr: false }
);

const aspectRatios = [
  { value: "1:1", label: "1:1" },
  { value: "4:5", label: "4:5" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "3:4", label: "3:4" },
];

const topicSuggestions = [
  "공간 소개",
  "숨은 카페 추천",
  "제주도 핫플 5곳",
  "마케팅 전략",
  "서비스 제안서",
  "비 오는 날 플리",
  "주간 트렌드",
  "공간",
];

// 인스타 카드뉴스 레이아웃 패턴
type CardLayout =
  | "photo-bottom-text"    // 사진 위 + 하단 텍스트 블록
  | "photo-overlay-center" // 전체 사진 + 중앙 텍스트 오버레이
  | "photo-overlay-bottom" // 전체 사진 + 하단 그라데이션 텍스트
  | "split-left"           // 좌측 컬러블록 텍스트 + 우측 사진
  | "magazine"             // 매거진 스타일 (큰 제목 + 소제목)
  | "minimal-center";      // 미니멀 중앙 정렬

interface BuiltInTemplate {
  id: string;
  name: string;
  category: string;
  topic: string;
  description: string;
  gradient: string; // 폴백 + 오버레이 색상
  imagePrompt: string; // Imagen 프롬프트 (텍스트 없는 배경 사진)
  preview: {
    title: string;
    subtitle: string;
    tag?: string;
    layout: CardLayout;
    overlayColor: string; // 오버레이 CSS 클래스
    textColor: string;    // 텍스트 색상
    tagColor?: string;    // 태그 배경
  };
}

const builtInTemplates: BuiltInTemplate[] = [
  {
    id: "t1",
    name: "오피스 투어",
    category: "공간 소개",
    topic: "우리 오피스를 소개합니다. 크리에이티브한 업무 공간 투어",
    description: "모던한 오피스 공간을 소개하는 카드뉴스",
    gradient: "from-gray-800 to-gray-900",
    imagePrompt: "Modern creative office workspace interior, minimalist design, natural light through large windows, wooden desk with plants, warm lighting, architectural photography, no people, no text",
    preview: {
      title: "우리가 일하는\n공간을 소개합니다",
      subtitle: "OFFICE TOUR",
      tag: "공간 소개",
      layout: "photo-overlay-bottom",
      overlayColor: "from-transparent via-black/20 to-black/70",
      textColor: "text-white",
      tagColor: "bg-white/20",
    },
  },
  {
    id: "t2",
    name: "카페 메뉴",
    category: "F&B",
    topic: "오늘의 카페 메뉴를 소개합니다",
    description: "카페/레스토랑 메뉴 소개 카드뉴스",
    gradient: "from-amber-700 to-orange-800",
    imagePrompt: "Aesthetic cafe latte art on marble table, warm cozy cafe interior background, golden hour lighting, overhead shot, food photography style, no people, no text",
    preview: {
      title: "Today's\nSpecial",
      subtitle: "매일 새로운 시그니처 메뉴",
      tag: "MENU",
      layout: "photo-overlay-center",
      overlayColor: "bg-black/40",
      textColor: "text-white",
      tagColor: "bg-amber-500",
    },
  },
  {
    id: "t3",
    name: "서울 감성 여행",
    category: "여행",
    topic: "서울 감성 여행 스팟 추천 5곳",
    description: "감성적인 여행지를 추천하는 카드뉴스",
    gradient: "from-rose-600 to-pink-800",
    imagePrompt: "Beautiful Seoul cityscape at golden hour, Bukchon Hanok Village traditional Korean houses with modern city skyline in background, cherry blossoms, dreamy atmosphere, travel photography, no people, no text",
    preview: {
      title: "서울,\n감성을 입다",
      subtitle: "놓치면 후회할 감성 스팟 5곳",
      layout: "photo-overlay-bottom",
      overlayColor: "from-transparent via-rose-900/20 to-rose-900/80",
      textColor: "text-white",
      tagColor: "bg-rose-500/80",
    },
  },
  {
    id: "t4",
    name: "트렌드 리포트",
    category: "비즈니스",
    topic: "이번 주 주목할 마케팅 트렌드 리포트",
    description: "주간 트렌드 분석 카드뉴스",
    gradient: "from-violet-700 to-indigo-900",
    imagePrompt: "Minimalist flat lay of modern workspace with laptop, smartphone, colorful sticky notes, coffee cup, pastel gradient background, top down view, clean editorial style, no people, no text",
    preview: {
      title: "이번 주\n트렌드 리포트",
      subtitle: "WEEKLY TREND",
      tag: "TREND",
      layout: "magazine",
      overlayColor: "bg-violet-900/60",
      textColor: "text-white",
      tagColor: "bg-violet-400",
    },
  },
  {
    id: "t5",
    name: "신제품 런칭",
    category: "제품",
    topic: "신제품 출시 소식을 전해드립니다",
    description: "제품/서비스 런칭 카드뉴스",
    gradient: "from-emerald-600 to-teal-800",
    imagePrompt: "Elegant minimal product photography, white premium packaging on clean surface, soft studio lighting, modern minimalist style, luxury brand aesthetic, no people, no text",
    preview: {
      title: "NEW\nARRIVAL",
      subtitle: "당신을 위한 새로운 경험",
      tag: "NEW",
      layout: "photo-overlay-center",
      overlayColor: "bg-black/50",
      textColor: "text-white",
      tagColor: "bg-emerald-500",
    },
  },
  {
    id: "t6",
    name: "스텝 가이드",
    category: "교육",
    topic: "초보자를 위한 단계별 가이드",
    description: "단계별 가이드 카드뉴스",
    gradient: "from-blue-600 to-cyan-800",
    imagePrompt: "Clean minimalist desk setup with notebook, pen, and small plant, soft blue toned lighting, study workspace, calm and organized aesthetic, overhead angle, no people, no text",
    preview: {
      title: "초보자를 위한\nStep-by-Step",
      subtitle: "쉽게 따라하는 단계별 가이드",
      tag: "GUIDE",
      layout: "photo-bottom-text",
      overlayColor: "bg-blue-600",
      textColor: "text-white",
      tagColor: "bg-blue-400",
    },
  },
  {
    id: "t7",
    name: "꿀팁 모음",
    category: "라이프",
    topic: "알아두면 좋은 생활 꿀팁 5가지",
    description: "유용한 팁 모음 카드뉴스",
    gradient: "from-fuchsia-600 to-purple-800",
    imagePrompt: "Bright colorful flat lay of everyday items, headphones, sunglasses, notebook, fruit, on pastel pink background, cheerful lifestyle photography, overhead shot, no people, no text",
    preview: {
      title: "알아두면 좋은\n꿀팁 5가지",
      subtitle: "TIPS & TRICKS",
      tag: "꿀팁",
      layout: "photo-overlay-bottom",
      overlayColor: "from-transparent via-fuchsia-900/20 to-fuchsia-900/80",
      textColor: "text-white",
      tagColor: "bg-fuchsia-500/80",
    },
  },
  {
    id: "t8",
    name: "이벤트 공지",
    category: "프로모션",
    topic: "특별 할인 이벤트를 진행합니다",
    description: "이벤트/프로모션 카드뉴스",
    gradient: "from-red-600 to-rose-800",
    imagePrompt: "Festive celebration confetti and ribbons on dark background, gold and red colors, party decorations, bokeh lights, celebratory mood, no people, no text",
    preview: {
      title: "SPECIAL\nEVENT",
      subtitle: "놓치지 마세요!",
      tag: "EVENT",
      layout: "photo-overlay-center",
      overlayColor: "bg-black/50",
      textColor: "text-white",
      tagColor: "bg-red-500",
    },
  },
];

const slideColors = [
  "from-violet-600 to-indigo-700",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-700",
  "from-sky-500 to-blue-600",
  "from-amber-500 to-orange-600",
];

function Stepper({
  steps,
  currentStep = 0,
}: {
  steps: string[];
  currentStep?: number;
}) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                i <= currentStep
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                "text-sm",
                i <= currentStep
                  ? "text-gray-900 font-medium"
                  : "text-gray-400"
              )}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-12 h-px mx-3",
                i < currentStep ? "bg-violet-300" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// 참고 이미지에서 특정 영역을 크롭하는 헬퍼 (% 좌표 기반)
function cropImageRegion(
  file: File,
  x: number,
  y: number,
  w: number,
  h: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const sx = Math.floor((img.naturalWidth * x) / 100);
        const sy = Math.floor((img.naturalHeight * y) / 100);
        const sw = Math.max(1, Math.floor((img.naturalWidth * w) / 100));
        const sh = Math.max(1, Math.floor((img.naturalHeight * h) / 100));
        const canvas = document.createElement("canvas");
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("canvas ctx null"));
          return;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("image load failed"));
    };
    img.src = objectUrl;
  });
}

export default function CardNewsPage() {
  const [topic, setTopic] = useState("");
  const [selectedRatio, setSelectedRatio] = useState("4:5");
  const [slideCount, setSlideCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [cardTitle, setCardTitle] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const [editHeading, setEditHeading] = useState("");
  const [editBody, setEditBody] = useState("");
  const [copied, setCopied] = useState(false);
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorSlideIndex, setEditorSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("create");
  const [templateImages, setTemplateImages] = useState<Record<string, string>>({}); // id → data URL
  const [loadingTemplates, setLoadingTemplates] = useState<Set<string>>(new Set());

  const selectedTemplate = selectedTemplateId
    ? builtInTemplates.find((t) => t.id === selectedTemplateId) ?? null
    : null;

  // 템플릿 갤러리 열릴 때 AI 이미지 생성
  useEffect(() => {
    if (!showTemplateGallery) return;

    // localStorage 캐시에서 먼저 로드
    const cached = localStorage.getItem("JP_WEB-template-previews");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setTemplateImages(parsed);
        // 이미 모든 템플릿에 이미지가 있으면 스킵
        const allLoaded = builtInTemplates.every((t) => parsed[t.id]);
        if (allLoaded) return;
      } catch {
        // 캐시 파싱 실패 시 무시
      }
    }

    // 이미지가 없는 템플릿만 생성
    builtInTemplates.forEach((tmpl) => {
      if (templateImages[tmpl.id] || loadingTemplates.has(tmpl.id)) return;

      setLoadingTemplates((prev) => new Set(prev).add(tmpl.id));

      fetch("/api/card-news/template-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagePrompt: tmpl.imagePrompt,
          aspectRatio: "9:16",
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("생성 실패");
          return res.json();
        })
        .then((data) => {
          const dataUrl = `data:${data.image.mimeType};base64,${data.image.base64}`;
          setTemplateImages((prev) => {
            const updated = { ...prev, [tmpl.id]: dataUrl };
            // localStorage에 캐싱
            localStorage.setItem("JP_WEB-template-previews", JSON.stringify(updated));
            return updated;
          });
        })
        .catch(() => {
          // 실패 시 무시 — 기존 그라데이션 폴백 유지
        })
        .finally(() => {
          setLoadingTemplates((prev) => {
            const next = new Set(prev);
            next.delete(tmpl.id);
            return next;
          });
        });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTemplateGallery]);

  // Design learning state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [customInstruction, setCustomInstruction] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [learnStep, setLearnStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 분석된 템플릿 임시 저장 (수정 가능)
  const [draftTemplate, setDraftTemplate] = useState<{
    name: string;
    styleDescription: string;
    colors: string[];
    fontStyle: string;
    layoutPattern: string;
  } | null>(null);

  // 레퍼런스 편집기 + 슬라이드
  const [showLearnEditor, setShowLearnEditor] = useState(false);
  const [learnSlides, setLearnSlides] = useState<Slide[]>([]);
  const [isAiModifying, setIsAiModifying] = useState(false);

  const {
    history,
    templates,
    addCardNews,
    updateCardNews,
    deleteCardNews,
    addTemplate,
    deleteTemplate,
  } = useCardNewsStore();

  // ===== Tab 1: Create =====
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("주제를 입력해주세요.");
      return;
    }

    setIsGenerating(true);
    setCurrentStep(1); // 콘텐츠 입력/생성 중 상태
    try {
      const res = await fetch("/api/card-news/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          aspectRatio: selectedRatio,
          slideCount,
          templateStyle: selectedTemplate
            ? {
                name: selectedTemplate.name,
                category: selectedTemplate.category,
                layout: selectedTemplate.preview.layout,
                imagePrompt: selectedTemplate.imagePrompt,
              }
            : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "생성 실패");
      }

      const data = await res.json();
      setCardTitle(data.cardNews.title);

      // 커버 이미지가 있으면 첫 슬라이드에 적용
      const generatedSlides = data.cardNews.slides as Slide[];
      if (data.coverImage) {
        const coverDataUrl = `data:${data.coverImage.mimeType};base64,${data.coverImage.base64}`;
        generatedSlides[0] = { ...generatedSlides[0], imageUrl: coverDataUrl };
      }
      setSlides(generatedSlides);
      setCurrentStep(2);
      setCurrentSlide(0);
      toast.success(
        data.templateApplied
          ? "템플릿이 적용된 카드뉴스가 생성되었습니다!"
          : "카드뉴스가 생성되었습니다!"
      );
    } catch (error) {
      setCurrentStep(0); // 실패 시 원래 단계로 복귀
      toast.error(
        error instanceof Error
          ? error.message
          : "카드뉴스 생성에 실패했습니다."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    addCardNews({
      title: cardTitle,
      keyword: topic,
      slides,
      aspectRatio: selectedRatio,
    });
    toast.success("카드뉴스가 저장되었습니다!");
    handleReset();
  };

  const handleReset = () => {
    setSlides([]);
    setCardTitle("");
    setCurrentStep(0);
    setCurrentSlide(0);
    setTopic("");
    setEditingSlide(null);
    setViewingHistoryId(null);
    setSelectedTemplateId(null);
  };

  const openEditor = (index: number) => {
    setEditorSlideIndex(index);
    setShowEditor(true);
  };

const saveEditSlide = () => {
    if (editingSlide === null) return;
    const updated = [...slides];
    updated[editingSlide] = {
      ...updated[editingSlide],
      heading: editHeading,
      body: editBody,
    };
    setSlides(updated);
    setEditingSlide(null);

    // If viewing from history, also update the stored version
    if (viewingHistoryId) {
      updateCardNews(viewingHistoryId, { slides: updated });
    }
    toast.success("슬라이드가 수정되었습니다.");
  };

  const cancelEdit = () => {
    setEditingSlide(null);
  };

  const handleCopyAll = async () => {
    const text = slides
      .map((s) => `[슬라이드 ${s.slideNumber}]\n${s.heading}\n${s.body}`)
      .join("\n\n");
    await navigator.clipboard.writeText(`${cardTitle}\n\n${text}`);
    setCopied(true);
    toast.success("전체 텍스트가 복사되었습니다!");
    setTimeout(() => setCopied(false), 2000);
  };

  // ===== Tab 2: Design Learning =====
  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    setUploadedFiles((prev) => [...prev, ...files].slice(0, 10));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/")
    );
    setUploadedFiles((prev) => [...prev, ...files].slice(0, 10));
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyzeDesign = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("참고 이미지를 업로드해주세요.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => formData.append("images", file));
      if (customInstruction.trim()) {
        formData.append("customInstruction", customInstruction.trim());
      }

      const res = await fetch("/api/card-news/learn-design", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "분석 실패");
      }

      const data = await res.json();
      setDraftTemplate(data.template);

      const bgColor = data.template.backgroundColor || "#1a1a2e";
      const bgGradient = data.template.backgroundGradient || null;

      // ── 레퍼런스 이미지에서 비율 감지
      const refFile = uploadedFiles[0];
      let detectedRatio = "4:5";
      if (refFile) {
        // 실제 픽셀 비율 감지
        detectedRatio = await new Promise<string>((resolve) => {
          const img = new Image();
          const url = URL.createObjectURL(refFile);
          img.onload = () => {
            const { naturalWidth: w, naturalHeight: h } = img;
            URL.revokeObjectURL(url);
            const r = w / h;
            if (Math.abs(r - 1) < 0.05) resolve("1:1");
            else if (Math.abs(r - 4 / 5) < 0.06) resolve("4:5");
            else if (Math.abs(r - 3 / 4) < 0.06) resolve("3:4");
            else if (Math.abs(r - 9 / 16) < 0.06) resolve("9:16");
            else if (Math.abs(r - 16 / 9) < 0.1) resolve("16:9");
            else resolve(`${w}:${h}`); // 정확한 비율 그대로 유지
          };
          img.onerror = () => { URL.revokeObjectURL(url); resolve("4:5"); };
          img.src = url;
        });
      }

      // 배경 요소: 분석된 색상/그라데이션 사용
      const bgElement: SlideElement = {
        id: "el-learn-bg",
        type: "image",
        content: "",
        label: "배경",
        tag: "background",
      };

      // API 응답 타입
      type RawElement = {
        id?: string;
        type: string;
        tag: string;
        label: string;
        content?: string;
        color?: string;
        fontSize?: number;
        fontSizePercent?: number;
        searchKeyword?: string;
        xPercent?: number;
        yPercent?: number;
        widthPercent?: number;
        heightPercent?: number;
      };

      // 텍스트 요소: AI가 추출한 실제 텍스트 + 위치 데이터 그대로 사용
      // 노이즈 필터: 너무 짧은 텍스트(2자 미만) 또는 caption이면서 8자 미만은 제거
      const rawTextEls = (data.elements || []).filter((el: RawElement) => el.type === "text");
      const filteredTextEls = rawTextEls.filter((el: RawElement) => {
        const text = (el.content || "").trim();
        if (text.length < 2) return false;
        if (el.tag === "caption" && text.length < 8) return false;
        return true;
      });
      // caption 태그가 전체의 절반 이상이면 noise로 판단하고 heading/subheading/body만 유지
      const captionRatio = filteredTextEls.filter((el: RawElement) => el.tag === "caption").length / (filteredTextEls.length || 1);
      const finalTextRaw = captionRatio >= 0.5
        ? filteredTextEls.filter((el: RawElement) => el.tag !== "caption")
        : filteredTextEls;

      // 카드 세로/가로 비율 — heading fontSizePercent 보정에 사용
      const [ratioW, ratioH] = (detectedRatio || "4:5").split(":").map(Number);
      const cardAspect = (ratioH || 5) / (ratioW || 4); // height ÷ width

      const textEls = finalTextRaw
        .map((el: RawElement, i: number) => {
          const fontSize = el.fontSize
            || (el.tag === "heading" ? 40 : el.tag === "subheading" ? 24 : el.tag === "caption" ? 12 : 17);
          const fontWeight = el.tag === "heading" ? 900 : el.tag === "subheading" ? 600 : 400;

          // heading: heightPercent × cardAspect ÷ 2줄 기준으로 fontSizePercent 재계산
          // → heading 텍스트가 AI가 측정한 바운딩박스 높이를 채우도록
          let fontSizePercent = el.fontSizePercent;
          if (el.tag === "heading" && el.heightPercent && fontSizePercent) {
            const target = (el.heightPercent * cardAspect) / 2;
            fontSizePercent = Math.max(fontSizePercent, target);
          }

          return {
            id: el.id || `el-text-${Date.now()}-${i}`,
            type: "text" as const,
            content: el.content || "",
            label: el.label || el.content?.slice(0, 20) || "텍스트",
            tag: el.tag,
            fontSize,
            fontWeight,
            color: el.color || "#FFFFFF",
            textAlign: "left" as const,
            letterSpacing: el.tag === "heading" ? -0.03 : 0,
            // 위치 + 크기 데이터 (positioned mode 용)
            fontSizePercent,
            xPercent: el.xPercent,
            yPercent: el.yPercent,
            widthPercent: el.widthPercent,
            heightPercent: el.heightPercent,
          };
        });

      // 이미지 슬롯 요소: 위치 포함한 빈 교체 가능 슬롯
      const imageEls = (data.elements || [])
        .filter((el: RawElement) => el.type === "image" && el.tag !== "background")
        .map((el: RawElement, i: number) => ({
          id: el.id || `el-img-${Date.now()}-${i}`,
          type: "image" as const,
          content: "",
          label: el.label || `이미지 ${i + 1}`,
          tag: el.tag,
          xPercent: el.xPercent,
          yPercent: el.yPercent,
          widthPercent: el.widthPercent ?? 40,
          heightPercent: el.heightPercent ?? 30,
          searchKeyword: el.searchKeyword || "",
        }));

      // 레퍼런스 이미지에서 각 슬롯 영역을 크롭하여 미리보기 자동 채움
      const imageElsWithContent = await Promise.all(
        imageEls.map(async (el: { xPercent?: number; yPercent?: number; widthPercent?: number; heightPercent?: number; content: string }) => {
          if (refFile && el.xPercent !== undefined && el.yPercent !== undefined) {
            try {
              const cropped = await cropImageRegion(
                refFile,
                el.xPercent,
                el.yPercent,
                el.widthPercent ?? 80,
                el.heightPercent ?? 30
              );
              return { ...el, content: cropped };
            } catch {
              return el;
            }
          }
          return el;
        })
      );

      // 왼쪽 여백 정렬: 텍스트 최소 xPercent → 이미지 슬롯에 동일 적용
      // (레퍼런스에서 heading/이미지가 같은 왼쪽 기준선을 공유하도록)
      const textXValues = textEls
        .map((el: { xPercent?: number }) => el.xPercent)
        .filter((x: number | undefined): x is number => x !== undefined);
      const alignX = textXValues.length > 0 ? Math.min(...textXValues) : undefined;
      const alignedImageEls = alignX !== undefined
        ? imageElsWithContent.map((el: { xPercent?: number }) => ({ ...el, xPercent: alignX }))
        : imageElsWithContent;

      // === 위치 정규화 ===
      // 이미지 슬롯보다 아래에 잘못 배치된 텍스트 요소를 이미지 위로 올림
      let finalTextEls = textEls;
      if (alignedImageEls.length > 0 && textEls.some((e: { yPercent?: number }) => e.yPercent !== undefined)) {
        const minImageY = Math.min(...alignedImageEls.map((e: { yPercent?: number }) => e.yPercent ?? 100));
        const textAbove = textEls.filter((el: { yPercent?: number }) => (el.yPercent ?? 0) < minImageY);
        const textBelow = textEls.filter((el: { yPercent?: number }) => (el.yPercent ?? 0) >= minImageY);

        if (textBelow.length > 0) {
          // 이미지 위에 있는 마지막 텍스트 요소 다음 위치에 재배치
          const lastAboveEl = textAbove.length > 0
            ? textAbove[textAbove.length - 1]
            : textEls.find((e: { tag: string }) => e.tag === "heading");
          let nextY = lastAboveEl
            ? ((lastAboveEl as { yPercent?: number; heightPercent?: number }).yPercent ?? 5)
              + ((lastAboveEl as { heightPercent?: number }).heightPercent ?? 35) + 2
            : Math.max(5, minImageY - 15);

          const repositioned = textBelow.map((el: { yPercent?: number; heightPercent?: number }) => {
            const result = { ...el, yPercent: nextY };
            nextY += (el.heightPercent ?? 10) + 2;
            return result;
          });

          finalTextEls = [...textAbove, ...repositioned];
        }
      }

      // 요소 순서: 배경 → 이미지 슬롯 → 텍스트 (z-index 순)
      const slideElements: SlideElement[] = [bgElement, ...alignedImageEls, ...finalTextEls];

      setLearnSlides([
        {
          slideNumber: 1,
          heading: textEls.find((e: { tag: string }) => e.tag === "heading")?.content || "",
          body: textEls.find((e: { tag: string }) => e.tag === "body")?.content || "",
          designNote: data.template.styleDescription || "",
          backgroundColor: bgColor,
          backgroundGradient: bgGradient,
          aspectRatio: detectedRatio,
          elements: slideElements,
        },
      ]);

      setLearnStep(1);
      toast.success("디자인 분석이 완료되었습니다! 확인 후 수정하세요.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "디자인 분석에 실패했습니다."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLearnReset = () => {
    setUploadedFiles([]);
    setCustomInstruction("");
    setLearnStep(0);
    setDraftTemplate(null);
    setLearnSlides([]);
    setShowLearnEditor(false);
  };

  const handleSaveTemplate = () => {
    if (!draftTemplate) return;
    addTemplate(draftTemplate);
    setLearnStep(2);
    toast.success("템플릿이 저장되었습니다!");
  };

  // AI로 템플릿 빠른 수정
  const handleAiTemplateModify = async (instruction: string) => {
    if (!draftTemplate || isAiModifying) return;
    setIsAiModifying(true);
    try {
      const res = await fetch("/api/card-news/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction: `현재 디자인 템플릿을 "${instruction}" 스타일로 수정해줘. 색상과 분위기를 조정해줘.`,
          currentHeading: draftTemplate.name,
          currentBody: draftTemplate.styleDescription,
        }),
      });
      if (!res.ok) throw new Error("AI 요청 실패");
      const data = await res.json();
      setDraftTemplate({
        ...draftTemplate,
        name: data.heading || draftTemplate.name,
        styleDescription: data.body || draftTemplate.styleDescription,
      });
      toast.success(`"${instruction}" 스타일이 적용되었습니다!`);
    } catch {
      toast.error("AI 수정에 실패했습니다.");
    } finally {
      setIsAiModifying(false);
    }
  };

  // ===== Tab 3: History =====
  const viewFromHistory = (id: string) => {
    const item = history.find((h) => h.id === id);
    if (!item) return;
    setCardTitle(item.title);
    setSlides(item.slides);
    setSelectedRatio(item.aspectRatio);
    setCurrentStep(2);
    setCurrentSlide(0);
    setViewingHistoryId(id);
    setActiveTab("create");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">카드뉴스</h1>
      <p className="text-sm text-gray-500 mb-6">
        AI로 카드뉴스를 디자인하고 관리하세요
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line" className="mb-8">
          <TabsTrigger value="create">카드뉴스 생성</TabsTrigger>
          <TabsTrigger value="learn">나만의 디자인 학습</TabsTrigger>
          <TabsTrigger value="history">
            카드뉴스 생성기록 {history.length > 0 && `(${history.length})`}
          </TabsTrigger>
        </TabsList>

        {/* ====== Tab 1: Create ====== */}
        <TabsContent value="create">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <Stepper
              steps={["디자인 선택", "콘텐츠 입력", "결과 확인"]}
              currentStep={currentStep}
            />

            {/* Step 1 (generating): Loading */}
            {currentStep === 1 && isGenerating && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-6">
                  <Loader2 size={28} className="text-violet-600 animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  카드뉴스를 만들고 있어요
                </h2>
                <p className="text-sm text-gray-500 mb-1">
                  AI가 &quot;{topic}&quot; 주제로 {slideCount}장의 슬라이드를 구성하고 있습니다
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  잠시만 기다려주세요...
                </p>
              </div>
            )}

            {/* Step 0: Topic Input */}
            {currentStep === 0 && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    어떤 카드뉴스를 만들어볼까요?
                  </h2>
                  <p className="text-sm text-gray-500">
                    내용만 입력하면 AI가 최적의 디자인을 찾아 카드뉴스를
                    만들어드려요
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {topicSuggestions.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={cn(
                        "px-4 py-2 border rounded-lg text-sm transition-all",
                        topic === t
                          ? "bg-violet-50 border-violet-300 text-violet-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="max-w-2xl mx-auto">
                  <Textarea
                    placeholder="만들고 싶은 주제를 입력하세요. (예: 마케팅 강의, 카페 소개)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={4}
                    className="mb-3"
                  />
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{topic.length}/5,000</span>
                      <span className="text-gray-300">|</span>
                      <span>이미지 비율</span>
                      {aspectRatios.map((r) => (
                        <button
                          key={r.value}
                          onClick={() => setSelectedRatio(r.value)}
                          className={cn(
                            "px-2 py-1 rounded-lg text-xs transition-all",
                            selectedRatio === r.value
                              ? "bg-violet-600 text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          )}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slide count control */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs text-gray-500">슬라이드 수</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setSlideCount(Math.max(1, slideCount - 1))
                        }
                        className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {slideCount}
                      </span>
                      <button
                        onClick={() =>
                          setSlideCount(Math.min(10, slideCount + 1))
                        }
                        className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">(1~10장)</span>
                  </div>

                  {/* 선택된 템플릿 표시 */}
                  {selectedTemplate && (
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg">
                      <div className={cn("w-6 h-6 rounded bg-gradient-to-br flex-shrink-0", selectedTemplate.gradient)} />
                      <span className="text-sm text-violet-700 font-medium flex-1">
                        {selectedTemplate.name} 템플릿 적용됨
                      </span>
                      <button
                        onClick={() => setSelectedTemplateId(null)}
                        className="text-violet-400 hover:text-violet-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      내 디자인 학습
                    </Button>
                    <Button
                      className="flex-1 bg-violet-600 hover:bg-violet-700"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin mr-2"
                          />
                          생성 중...
                        </>
                      ) : (
                        "카드뉴스 생성하기"
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Result Preview */}
            {currentStep === 2 && slides.length > 0 && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {cardTitle}
                  </h2>
                  <p className="text-sm text-gray-500">
                    슬라이드를 클릭하여 텍스트를 수정할 수 있습니다
                  </p>
                </div>

                {/* Slide Preview */}
                <div className="max-w-md mx-auto mb-6">
                  {editingSlide === currentSlide ? (
                    <div className="bg-white border-2 border-violet-500 rounded-2xl p-6 min-h-[400px]">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-500">
                          슬라이드 {currentSlide + 1} 수정 중
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
                          >
                            <X size={16} />
                          </button>
                          <button
                            onClick={saveEditSlide}
                            className="p-1.5 rounded-lg hover:bg-violet-100 text-violet-600"
                          >
                            <Save size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            제목
                          </label>
                          <input
                            value={editHeading}
                            onChange={(e) => setEditHeading(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            본문
                          </label>
                          <Textarea
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                            rows={6}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="rounded-2xl overflow-hidden relative group cursor-pointer min-h-[400px]"
                      style={{ aspectRatio: "4/5" }}
                      onClick={() => openEditor(currentSlide)}
                    >
                      <SlidePreviewComponent
                        elements={slideToElements(slides[currentSlide], true)}
                        slideIndex={currentSlide}
                      />
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="bg-white/20 backdrop-blur rounded-lg p-2 text-white">
                          <Edit3 size={16} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Slide Navigation */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      onClick={() =>
                        setCurrentSlide(Math.max(0, currentSlide - 1))
                      }
                      disabled={currentSlide === 0}
                      className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-1.5">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentSlide(i);
                            setEditingSlide(null);
                          }}
                          className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            i === currentSlide
                              ? "bg-violet-600"
                              : "bg-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentSlide(
                          Math.min(slides.length - 1, currentSlide + 1)
                        )
                      }
                      disabled={currentSlide === slides.length - 1}
                      className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* 슬라이드 삭제 */}
                  <button
                    onClick={() => {
                      if (slides.length <= 1) {
                        if (viewingHistoryId) {
                          deleteCardNews(viewingHistoryId);
                        }
                        handleReset();
                        toast.success("슬라이드가 삭제되었습니다.");
                        return;
                      }
                      const updated = slides.filter((_, i) => i !== currentSlide).map((s, i) => ({ ...s, slideNumber: i + 1 }));
                      setSlides(updated);
                      setCurrentSlide(Math.min(currentSlide, updated.length - 1));
                      if (viewingHistoryId) {
                        updateCardNews(viewingHistoryId, { slides: updated });
                      }
                      toast.success("슬라이드가 삭제되었습니다.");
                    }}
                    className="mt-2 mx-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                    이 슬라이드 삭제
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 max-w-md mx-auto mb-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleReset}
                  >
                    다시 만들기
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCopyAll}
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="mr-1" /> 복사됨
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="mr-1" /> 전체 복사
                      </>
                    )}
                  </Button>
                  <Button
                    className="flex-1 bg-violet-600 hover:bg-violet-700"
                    onClick={handleSave}
                  >
                    <Save size={14} className="mr-1" /> 저장하기
                  </Button>
                </div>

                <div className="text-center">
                  <Link
                    href="/scheduling"
                    className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700"
                  >
                    <Send size={14} /> SNS에 바로 발행하기
                  </Link>
                </div>
              </div>
            )}
          </div>

          {currentStep === 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ImageIcon size={18} className="text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    디자인을 직접 선택하고 싶다면
                  </p>
                </div>
                <button
                  onClick={() => setShowTemplateGallery(!showTemplateGallery)}
                  className="text-sm text-violet-600 hover:text-violet-700 font-medium whitespace-nowrap"
                >
                  전체 템플릿 보기 &gt;
                </button>
              </div>

              {showTemplateGallery && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {builtInTemplates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        setTopic(tmpl.topic);
                        setSelectedTemplateId(tmpl.id);
                        toast.success(`"${tmpl.name}" 템플릿이 적용되었습니다.`);
                      }}
                      className="group relative rounded-xl border border-gray-200 overflow-hidden text-left transition-all hover:shadow-lg hover:border-violet-300 hover:-translate-y-1"
                    >
                      {/* 인스타 카드뉴스 프리뷰 */}
                      <div
                        className={cn(
                          "relative overflow-hidden bg-gradient-to-br",
                          tmpl.gradient
                        )}
                        style={{ aspectRatio: "4/5" }}
                      >
                        {/* 배경: AI 이미지 또는 그라데이션 폴백 */}
                        {templateImages[tmpl.id] && (
                          <img
                            src={templateImages[tmpl.id]}
                            alt={tmpl.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}

                        {/* 로딩 인디케이터 */}
                        {loadingTemplates.has(tmpl.id) && !templateImages[tmpl.id] && (
                          <div className="absolute top-2 right-2 z-10">
                            <Loader2 size={14} className="text-white/60 animate-spin" />
                          </div>
                        )}

                        {/* 레이아웃별 텍스트 오버레이 */}
                        {tmpl.preview.layout === "photo-overlay-bottom" && (
                          <div className="absolute inset-0 flex flex-col justify-end">
                            <div className={cn("bg-gradient-to-t p-4 pt-16", tmpl.preview.overlayColor)}>
                              {tmpl.preview.tag && (
                                <span className={cn("inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full mb-2", tmpl.preview.tagColor, tmpl.preview.textColor)}>
                                  {tmpl.preview.tag}
                                </span>
                              )}
                              <h4 className={cn("text-sm font-bold leading-snug whitespace-pre-line mb-1", tmpl.preview.textColor)}>
                                {tmpl.preview.title}
                              </h4>
                              <p className={cn("text-[10px] opacity-80", tmpl.preview.textColor)}>
                                {tmpl.preview.subtitle}
                              </p>
                            </div>
                          </div>
                        )}

                        {tmpl.preview.layout === "photo-overlay-center" && (
                          <div className={cn("absolute inset-0 flex flex-col items-center justify-center text-center p-4", tmpl.preview.overlayColor)}>
                            {tmpl.preview.tag && (
                              <span className={cn("inline-block text-[9px] font-bold tracking-wider px-2.5 py-0.5 rounded-full mb-3", tmpl.preview.tagColor, "text-white")}>
                                {tmpl.preview.tag}
                              </span>
                            )}
                            <h4 className={cn("text-base font-extrabold leading-tight whitespace-pre-line mb-1.5", tmpl.preview.textColor)}>
                              {tmpl.preview.title}
                            </h4>
                            <p className={cn("text-[10px] opacity-80", tmpl.preview.textColor)}>
                              {tmpl.preview.subtitle}
                            </p>
                          </div>
                        )}

                        {tmpl.preview.layout === "magazine" && (
                          <div className={cn("absolute inset-0 flex flex-col p-4", tmpl.preview.overlayColor)}>
                            {tmpl.preview.tag && (
                              <span className={cn("inline-block self-start text-[9px] font-bold tracking-widest px-2 py-0.5 rounded mb-auto", tmpl.preview.tagColor, "text-white")}>
                                {tmpl.preview.tag}
                              </span>
                            )}
                            <div>
                              <h4 className={cn("text-base font-black leading-tight whitespace-pre-line mb-1 tracking-tight", tmpl.preview.textColor)}>
                                {tmpl.preview.title}
                              </h4>
                              <div className="w-6 h-0.5 bg-white/50 rounded-full mb-1.5" />
                              <p className={cn("text-[10px] opacity-70", tmpl.preview.textColor)}>
                                {tmpl.preview.subtitle}
                              </p>
                            </div>
                          </div>
                        )}

                        {tmpl.preview.layout === "photo-bottom-text" && (
                          <div className="absolute inset-0 flex flex-col">
                            {/* 상단: 사진 영역 (투명) */}
                            <div className="flex-1" />
                            {/* 하단: 컬러 블록 + 텍스트 */}
                            <div className={cn("p-4 pt-3", tmpl.preview.overlayColor)}>
                              {tmpl.preview.tag && (
                                <span className={cn("inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mb-2", tmpl.preview.tagColor, "text-white")}>
                                  {tmpl.preview.tag}
                                </span>
                              )}
                              <h4 className={cn("text-sm font-bold leading-snug whitespace-pre-line mb-1", tmpl.preview.textColor)}>
                                {tmpl.preview.title}
                              </h4>
                              <p className={cn("text-[10px] opacity-80", tmpl.preview.textColor)}>
                                {tmpl.preview.subtitle}
                              </p>
                            </div>
                          </div>
                        )}

                        {(tmpl.preview.layout === "split-left" || tmpl.preview.layout === "minimal-center") && (
                          <div className={cn("absolute inset-0 flex flex-col items-center justify-center text-center p-4", tmpl.preview.overlayColor)}>
                            <h4 className={cn("text-sm font-bold leading-snug whitespace-pre-line mb-1.5", tmpl.preview.textColor)}>
                              {tmpl.preview.title}
                            </h4>
                            <p className={cn("text-[10px] opacity-80", tmpl.preview.textColor)}>
                              {tmpl.preview.subtitle}
                            </p>
                          </div>
                        )}

                        {/* 호버 오버레이 */}
                        <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            이 스타일로 만들기
                          </span>
                        </div>
                      </div>

                      {/* 하단 정보 */}
                      <div className="p-2.5 bg-white">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {tmpl.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {tmpl.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* ====== Tab 2: Design Learning ====== */}
        <TabsContent value="learn">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <Stepper
              steps={["디자인 학습", "확인 및 수정", "저장"]}
              currentStep={learnStep}
            />

            {/* Step 0: 이미지 업로드 */}
            {learnStep === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <h3 className="text-lg font-semibold mb-1">
                    참고 이미지 업로드
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    따라하고 싶은 카드뉴스 디자인을 업로드하세요
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-12 text-center mb-4 hover:border-violet-300 hover:bg-violet-50/30 transition-colors cursor-pointer"
                  >
                    <Upload
                      size={32}
                      className="text-gray-400 mx-auto mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-1">
                      이미지를 드래그하거나 클릭하여 업로드
                    </p>
                    <p className="text-xs text-gray-400">
                      최대 10장 · PNG, JPG, WEBP 지원
                    </p>
                  </div>

                  {/* Uploaded file previews */}
                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {uploadedFiles.map((file, i) => (
                        <div
                          key={`${file.name}-${i}`}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(i);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-3">
                    인스타그램이나 핀터레스트에서 마음에 드는 카드뉴스를
                    캡처해서 업로드해보세요
                  </p>
                </div>

                <div className="lg:col-span-2 bg-gray-50 rounded-xl p-5">
                  <h3 className="text-base font-semibold mb-4">설정</h3>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      이미지 비율
                    </p>
                    <div className="space-y-2">
                      {[
                        { value: "1:1", label: "1:1 (정사각형)" },
                        { value: "4:5", label: "4:5 (인스타그램 권장)" },
                        { value: "9:16", label: "9:16 (릴스/스토리)" },
                        { value: "16:9", label: "16:9 (PPT/YouTube)" },
                        { value: "3:4", label: "3:4 (세로형)" },
                      ].map((r) => (
                        <label
                          key={r.value}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="learn-ratio"
                            value={r.value}
                            checked={selectedRatio === r.value}
                            onChange={() => setSelectedRatio(r.value)}
                            className="accent-violet-600"
                          />
                          {r.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      커스텀 지시사항 (선택)
                    </p>
                    <Textarea
                      placeholder="예: 배경 이미지는 무시하고, 텍스트 레이아웃과 색상만 참고해주세요"
                      value={customInstruction}
                      onChange={(e) => setCustomInstruction(e.target.value)}
                      rows={3}
                      className="text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      어떤 요소를 중점적으로 추출하거나 무시할지 자유롭게
                      입력하세요
                    </p>
                  </div>

                  <Button
                    className="w-full bg-violet-600 hover:bg-violet-700"
                    onClick={handleAnalyzeDesign}
                    disabled={isAnalyzing || uploadedFiles.length === 0}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin mr-2"
                        />
                        분석 중...
                      </>
                    ) : (
                      "템플릿 생성하기"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 1: 확인 및 수정 */}
            {learnStep === 1 && draftTemplate && (
              <div>
                {/* 상단: 생성된 템플릿 + 수정 버튼 */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">생성된 템플릿</h3>
                      <p className="text-sm text-gray-500">
                        AI가 분석한 디자인입니다. 클릭하여 수정할 수 있습니다
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => setShowLearnEditor(true)}
                    >
                      <Edit3 size={14} />
                      템플릿 수정
                    </Button>
                  </div>

                  {/* 슬라이드 미리보기 (엘리먼트 기반 렌더링) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {learnSlides.map((slide, i) => (
                      <div
                        key={i}
                        className="relative border border-gray-200 rounded-xl overflow-hidden bg-white cursor-pointer hover:shadow-md transition-shadow group"
                        onClick={() => setShowLearnEditor(true)}
                      >
                        <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                          <span className="text-xs font-medium text-gray-600">
                            템플릿 {i + 1}
                          </span>
                        </div>
                        <div
                          className="overflow-hidden"
                          style={{ aspectRatio: (slide.aspectRatio || "4:5").replace(":", "/") }}
                        >
                          <SlidePreviewComponent
                            elements={slide.elements || slideToElements(slide)}
                            slideIndex={i}
                            backgroundColor={slide.backgroundColor}
                            backgroundGradient={slide.backgroundGradient}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI로 템플릿 수정 */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-violet-600" />
                    <h4 className="text-sm font-bold text-gray-900">AI로 템플릿 수정</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "더 밝게",
                      "더 어둡게",
                      "미니멀하게",
                      "화려하게",
                      "따뜻한 톤",
                      "차가운 톤",
                    ].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleAiTemplateModify(chip)}
                        disabled={isAiModifying}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors disabled:opacity-50"
                      >
                        {isAiModifying ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          chip
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setLearnStep(0)}
                  >
                    이전으로
                  </Button>
                  <Button
                    className="flex-1 bg-violet-600 hover:bg-violet-700"
                    onClick={handleSaveTemplate}
                    disabled={!draftTemplate.name.trim()}
                  >
                    템플릿 저장하기
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: 저장 완료 */}
            {learnStep === 2 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  템플릿이 저장되었습니다!
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  저장된 템플릿은 카드뉴스 생성 시 활용할 수 있습니다
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleLearnReset}>
                    새 디자인 학습하기
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Templates */}
          {templates.length > 0 && (
            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-semibold mb-4">
                내 디자인 템플릿 ({templates.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {tmpl.name}
                      </h4>
                      <button
                        onClick={() => {
                          deleteTemplate(tmpl.id);
                          toast.success("템플릿이 삭제되었습니다.");
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      {tmpl.styleDescription}
                    </p>
                    <div className="flex gap-1.5 mb-2">
                      {tmpl.colors.map((color, ci) => (
                        <div
                          key={ci}
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {format(parseISO(tmpl.createdAt), "yyyy.MM.dd HH:mm", {
                        locale: ko,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ====== Tab 3: History ====== */}
        <TabsContent value="history">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">카드뉴스 생성기록</h3>
              {history.length > 0 && (
                <span className="text-sm text-gray-500">
                  {history.length}개
                </span>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  아직 생성기록이 없습니다
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  카드뉴스를 생성하면 여기에 자동 저장됩니다
                </p>
                <Button variant="outline">첫 카드뉴스 만들기</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div
                      className={cn(
                        "relative h-[160px] overflow-hidden cursor-pointer",
                        !item.slides[0]?.imageUrl && "bg-gradient-to-br",
                        !item.slides[0]?.imageUrl && slideColors[history.indexOf(item) % slideColors.length]
                      )}
                      onClick={() => viewFromHistory(item.id)}
                    >
                      {item.slides[0]?.imageUrl ? (
                        <img
                          src={item.slides[0].imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full p-6 text-center">
                          <h4 className="text-lg font-bold text-white">{item.title}</h4>
                        </div>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium rounded-full">
                        {item.keyword || item.title.split(" ")[0]}
                      </span>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {format(
                            parseISO(item.createdAt),
                            "yyyy.MM.dd HH:mm",
                            { locale: ko }
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          deleteCardNews(item.id);
                          toast.success("삭제되었습니다.");
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 슬라이드 편집기 (카드뉴스 생성) */}
      {showEditor && slides.length > 0 && (
        <SlideEditor
          slides={slides}
          initialSlideIndex={editorSlideIndex}
          onSave={(updatedSlides) => {
            setSlides(updatedSlides);
            if (viewingHistoryId) {
              updateCardNews(viewingHistoryId, { slides: updatedSlides });
            }
          }}
          onClose={() => setShowEditor(false)}
        />
      )}

      {/* 슬라이드 편집기 (디자인 학습 템플릿) */}
      {showLearnEditor && learnSlides.length > 0 && (
        <SlideEditor
          slides={learnSlides}
          initialSlideIndex={0}
          onSave={(updatedSlides) => {
            setLearnSlides(updatedSlides);
          }}
          onClose={() => setShowLearnEditor(false)}
        />
      )}
    </div>
  );
}
