"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Undo2,
  Redo2,
  Save,
  ImageIcon,
  Type,
  Sparkles,
  Code,
  Loader2,
  Trash2,
  Plus,
  Minus,
  Upload,
  Link2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  GripVertical,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import type { Slide, SlideElement } from "@/stores/card-news";
import SlidePreview, { slideToElements } from "@/components/card-news/slide-preview";

// 태그별 기본 fontSize — 카드뉴스 생성 기본값
const DEFAULT_FONT_SIZE: Record<string, number> = {
  heading: 40,
  subheading: 16,
  body: 17,
};
// 나만의 디자인 학습(positioned mode) 기본값
const DEFAULT_FONT_SIZE_POSITIONED: Record<string, number> = {
  heading: 44,
  subheading: 28,
  body: 18,
};

// fontSize 프리셋 — 카드뉴스 생성
const FONT_SIZE_PRESETS = [
  { label: "S", value: 12 },
  { label: "M", value: 16 },
  { label: "L", value: 24 },
  { label: "XL", value: 32 },
  { label: "2XL", value: 40 },
];
// fontSize 프리셋 — 나만의 디자인 학습
const FONT_SIZE_PRESETS_POSITIONED = [
  { label: "S", value: 16 },
  { label: "M", value: 28 },
  { label: "L", value: 44 },
  { label: "XL", value: 64 },
  { label: "2XL", value: 96 },
];

// fontWeight 옵션
const FONT_WEIGHT_OPTIONS = [
  { label: "Thin", value: 100 },
  { label: "Light", value: 300 },
  { label: "Normal", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semi", value: 600 },
  { label: "Bold", value: 700 },
  { label: "Black", value: 900 },
];

// letterSpacing 옵션
const LETTER_SPACING_OPTIONS = [
  { label: "좁게", value: -0.05 },
  { label: "기본", value: 0 },
  { label: "넓게", value: 0.05 },
  { label: "매우 넓게", value: 0.1 },
  { label: "와이드", value: 0.2 },
];

// 텍스트 색상 프리셋
const COLOR_PRESETS = [
  "#FFFFFF",
  "#F8F8F8",
  "#D4D4D4",
  "#A3A3A3",
  "#525252",
  "#171717",
  "#7C3AED",
  "#6D28D9",
  "#3B82F6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#F97316",
  "#8B5CF6",
];

// 폰트 프리셋 (Google Fonts + CDN 한국어 지원)
const FONT_PRESETS = [
  { label: "기본 (Geist)", value: "", category: "시스템", preview: "가나다 ABC" },
  { label: "Pretendard", value: "Pretendard", category: "고딕", preview: "프리텐다드" },
  { label: "GmarketSans", value: "GmarketSans", category: "디스플레이", preview: "지마켓 산스체" },
  { label: "Noto Sans KR", value: "Noto Sans KR", category: "고딕", preview: "깔끔한 고딕" },
  { label: "Noto Serif KR", value: "Noto Serif KR", category: "명조", preview: "클래식 명조" },
  { label: "Gothic A1", value: "Gothic A1", category: "고딕", preview: "모던 고딕체" },
  { label: "Nanum Gothic", value: "Nanum Gothic", category: "고딕", preview: "나눔고딕" },
  { label: "Nanum Myeongjo", value: "Nanum Myeongjo", category: "명조", preview: "나눔명조" },
  { label: "Black Han Sans", value: "Black Han Sans", category: "디스플레이", preview: "임팩트 제목" },
  { label: "Do Hyeon", value: "Do Hyeon", category: "디스플레이", preview: "둥근 고딕체" },
  { label: "Jua", value: "Jua", category: "디스플레이", preview: "귀여운 서체" },
  { label: "Sunflower", value: "Sunflower", category: "디스플레이", preview: "부드러운 체" },
  { label: "Gamja Flower", value: "Gamja Flower", category: "손글씨", preview: "감자꽃 손글씨" },
  { label: "Nanum Pen Script", value: "Nanum Pen Script", category: "손글씨", preview: "나눔펜 손글씨" },
  { label: "IBM Plex Sans KR", value: "IBM Plex Sans KR", category: "고딕", preview: "IBM 플렉스" },
  { label: "Gowun Dodum", value: "Gowun Dodum", category: "고딕", preview: "고운돋움체" },
  { label: "Gowun Batang", value: "Gowun Batang", category: "명조", preview: "고운바탕체" },
  { label: "Gaegu", value: "Gaegu", category: "손글씨", preview: "개구쟁이체" },
];

// Google Fonts가 아닌 별도 CDN 폰트
const CDN_FONTS = [
  { id: "JP_WEB-pretendard", href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" },
  { id: "JP_WEB-gmarket-sans", href: "https://cdn.jsdelivr.net/gh/fonts-archive/GmarketSans/GmarketSans.css" },
];

// CDN 폰트 이름 목록 (Google Fonts에서 제외)
const CDN_FONT_VALUES = new Set<string>(["Pretendard", "GmarketSans"]);

// Google Fonts URL 생성 (CDN 폰트는 제외)
function getGoogleFontsUrl(): string {
  const families = FONT_PRESETS
    .filter((f) => f.value && !CDN_FONT_VALUES.has(f.value))
    .map((f) => f.value.replace(/ /g, "+") + ":wght@100;300;400;500;600;700;900")
    .join("&family=");
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}


// 요소 목록 → 슬라이드로 합성
// heading 문자열은 항상 제목(line0) → 소제목(line1+) 순서로 저장
function elementsToSlide(original: Slide, elements: SlideElement[]): Slide {
  const imageEl = elements.find((e) => e.type === "image" && e.tag === "background");
  const headingEl = elements.find((e) => e.type === "text" && e.tag === "heading");
  const subheadingEls = elements.filter((e) => e.type === "text" && e.tag === "subheading");
  const bodyEls = elements.filter((e) => e.type === "text" && e.tag === "body");

  // 제목을 항상 첫 줄로, 소제목을 이후 줄로 저장
  const headingParts: string[] = [];
  if (headingEl) headingParts.push(headingEl.content);
  subheadingEls.forEach((el) => headingParts.push(el.content));

  return {
    ...original,
    heading: headingParts.join("\n"),
    body: bodyEls.map((e) => e.content).join("\n"),
    imageUrl: imageEl?.content || original.imageUrl,
    elements,
  };
}


interface SlideEditorProps {
  slides: Slide[];
  initialSlideIndex?: number;
  onSave: (updatedSlides: Slide[]) => void;
  onClose: () => void;
  /** 편집할 때마다 자동 저장 (나만의 디자인 학습 전용) */
  autoSave?: boolean;
}

interface HistoryEntry {
  allElements: SlideElement[][];
}

export default function SlideEditor({
  slides,
  initialSlideIndex = 0,
  onSave,
  onClose,
  autoSave = false,
}: SlideEditorProps) {
  const [currentPage, setCurrentPage] = useState(initialSlideIndex);
  const [allElements, setAllElements] = useState<SlideElement[][]>(() =>
    slides.map((s) => slideToElements(s))
  );
  const [expandedElement, setExpandedElement] = useState<string | null>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState<Record<string, string>>({});
  const [showUrlInput, setShowUrlInput] = useState<Record<string, boolean>>({});
  const [showFontPicker, setShowFontPicker] = useState<Record<string, boolean>>({});
  const [showImageSearch, setShowImageSearch] = useState<Record<string, boolean>>({});
  const [imageSearchQuery, setImageSearchQuery] = useState<Record<string, string>>({});
  const [imageSearchResults, setImageSearchResults] = useState<Record<string, Array<{ id: string; url: string; thumb: string; alt: string; photographer: string }>>>({});
  const [isSearchingImages, setIsSearchingImages] = useState<Record<string, boolean>>({});

  const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // auto-save 전용 refs (stale closure 방지)
  const onSaveRef = useRef(onSave);
  const slidesRef = useRef(slides);
  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);
  useEffect(() => { slidesRef.current = slides; }, [slides]);

  // 언마운트 시 항상 저장 (닫기 방식에 관계없이)
  useEffect(() => {
    return () => {
      if (!autoSave) return;
      const updatedSlides = slidesRef.current.map((slide, i) =>
        elementsToSlide(slide, allElementsRef.current[i] || [])
      );
      onSaveRef.current(updatedSlides);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Google Fonts + CDN 폰트 로드
  useEffect(() => {
    const loadFont = (id: string, href: string) => {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };
    loadFont("JP_WEB-google-fonts", getGoogleFontsUrl());
    CDN_FONTS.forEach((f) => loadFont(f.id, f.href));
  }, []);

  // Undo/Redo
  const [history, setHistory] = useState<HistoryEntry[]>([
    { allElements: slides.map((s) => slideToElements(s)) },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentElements = allElements[currentPage] || [];

  // 나만의 디자인 학습(positioned mode) 여부 — xPercent가 있는 비-배경 요소 존재 시
  const isPositionedMode = currentElements.some(
    (e) => e.tag !== "background" && e.tag !== "logo" && e.xPercent !== undefined
  );
  const effectiveDefaultFontSize = isPositionedMode ? DEFAULT_FONT_SIZE_POSITIONED : DEFAULT_FONT_SIZE;
  const effectiveFontSizePresets = isPositionedMode ? FONT_SIZE_PRESETS_POSITIONED : FONT_SIZE_PRESETS;

  // 편집기 진입 시 첫 번째 빈 이미지 슬롯 자동 열기
  useEffect(() => {
    const els = allElements[initialSlideIndex] || [];
    const firstEmptySlot = els.find(
      (e) => e.type === "image" && e.tag !== "background" && e.tag !== "logo" && !e.content
    );
    if (firstEmptySlot) {
      setExpandedElement(firstEmptySlot.id);
      if (firstEmptySlot.searchKeyword) {
        setImageSearchQuery((prev) => ({
          ...prev,
          [firstEmptySlot.id]: prev[firstEmptySlot.id] || firstEmptySlot.searchKeyword || "",
        }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushHistory = useCallback(
    (newAllElements: SlideElement[][]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ allElements: newAllElements });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setAllElements(history[newIndex].allElements);
  }, [canUndo, history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setAllElements(history[newIndex].allElements);
  }, [canRedo, history, historyIndex]);

  // 키보드 단축키
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          handleRedo();
        } else if (e.key === "s") {
          e.preventDefault();
          handleSave();
        }
      }
      if (e.key === "ArrowLeft" && !isInputFocused()) {
        setCurrentPage((p) => Math.max(0, p - 1));
      }
      if (e.key === "ArrowRight" && !isInputFocused()) {
        setCurrentPage((p) => Math.min(slides.length - 1, p + 1));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  function isInputFocused() {
    const tag = document.activeElement?.tagName;
    return tag === "INPUT" || tag === "TEXTAREA";
  }

  // 요소 업데이트 (content만)
  const updateElement = (elementId: string, content: string) => {
    const newAll = allElements.map((pageEls, i) => {
      if (i !== currentPage) return pageEls;
      return pageEls.map((el) =>
        el.id === elementId
          ? { ...el, content, label: el.type === "text" ? content : el.label }
          : el
      );
    });
    setAllElements(newAll);
    pushHistory(newAll);
  };

  // 요소 부분 업데이트 (여러 필드)
  const updateElementPartial = (elementId: string, updates: Partial<SlideElement>) => {
    const newAll = allElements.map((pageEls, i) => {
      if (i !== currentPage) return pageEls;
      return pageEls.map((el) =>
        el.id === elementId ? { ...el, ...updates } : el
      );
    });
    setAllElements(newAll);
    pushHistory(newAll);
  };

  // 드래그 중 무음 업데이트 (히스토리 미기록)
  const updateElementPartialSilent = useCallback(
    (elementId: string, updates: Partial<SlideElement>) => {
      setAllElements((prev) =>
        prev.map((pageEls, i) => {
          if (i !== currentPage) return pageEls;
          return pageEls.map((el) => (el.id === elementId ? { ...el, ...updates } : el));
        })
      );
    },
    [currentPage]
  );

  // 최신 allElements ref (드래그 종료 시 히스토리 커밋)
  const allElementsRef = useRef(allElements);
  useEffect(() => {
    allElementsRef.current = allElements;
  }, [allElements]);

  // 드래그앤드롭 순서 변경
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const reorderElements = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const newAll = allElements.map((pageEls, i) => {
      if (i !== currentPage) return pageEls;
      const copy = [...pageEls];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
    setAllElements(newAll);
    pushHistory(newAll);
  };

  // 요소 삭제
  const removeElement = (elementId: string) => {
    const newAll = allElements.map((pageEls, i) => {
      if (i !== currentPage) return pageEls;
      return pageEls.filter((el) => el.id !== elementId);
    });
    setAllElements(newAll);
    pushHistory(newAll);
  };

  // 텍스트 요소 추가
  const addTextElement = () => {
    const newEl: SlideElement = {
      id: `el-new-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      type: "text",
      content: "새 텍스트",
      label: "새 텍스트",
      tag: "body",
      fontSize: 14,
    };
    const newAll = allElements.map((pageEls, i) => {
      if (i !== currentPage) return pageEls;
      return [...pageEls, newEl];
    });
    setAllElements(newAll);
    pushHistory(newAll);
    setExpandedElement(newEl.id);
  };

  const addLogoElement = () => {
    const newEl: SlideElement = {
      id: `el-logo-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      type: "image",
      content: "",
      label: "로고",
      tag: "logo",
      opacity: 100,
      logoWidth: 20,
      logoPosition: "bottom-right",
    };
    const newAll = allElements.map((pageEls, i) => {
      if (i !== currentPage) return pageEls;
      return [...pageEls, newEl];
    });
    setAllElements(newAll);
    pushHistory(newAll);
    setExpandedElement(newEl.id);
  };

  // 이미지 파일 업로드 핸들러
  const handleImageUpload = (elementId: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("10MB 이하의 이미지만 업로드할 수 있습니다.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateElement(elementId, dataUrl);
      toast.success("이미지가 교체되었습니다.");
    };
    reader.readAsDataURL(file);
  };

  // 이미지 URL 적용
  const applyImageUrl = (elementId: string) => {
    const url = imageUrlInput[elementId]?.trim();
    if (!url) return;
    updateElement(elementId, url);
    setShowUrlInput((prev) => ({ ...prev, [elementId]: false }));
    setImageUrlInput((prev) => ({ ...prev, [elementId]: "" }));
    toast.success("이미지 URL이 적용되었습니다.");
  };

  // Unsplash 이미지 검색
  const searchImages = async (elementId: string) => {
    const query = imageSearchQuery[elementId]?.trim();
    if (!query) return;
    setIsSearchingImages((prev) => ({ ...prev, [elementId]: true }));
    try {
      const res = await fetch(`/api/unsplash/search?q=${encodeURIComponent(query)}&per_page=20&orientation=portrait`);
      if (!res.ok) throw new Error("검색 실패");
      const data = await res.json();
      setImageSearchResults((prev) => ({ ...prev, [elementId]: data.photos }));
    } catch {
      toast.error("이미지 검색에 실패했습니다.");
    } finally {
      setIsSearchingImages((prev) => ({ ...prev, [elementId]: false }));
    }
  };

  const applySearchImage = (elementId: string, url: string) => {
    updateElement(elementId, url);
    toast.success("이미지가 적용되었습니다.");
  };

  // 이미지 드래그앤드롭
  const handleImageDrop = (elementId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(elementId, file);
  };

  // 저장
  const handleSave = () => {
    const updatedSlides = slides.map((slide, i) =>
      elementsToSlide(slide, allElements[i] || [])
    );
    onSave(updatedSlides);
    toast.success("저장되었습니다.");
  };

  // 저장 후 닫기
  const handleSaveAndClose = () => {
    const updatedSlides = slides.map((slide, i) =>
      elementsToSlide(slide, allElements[i] || [])
    );
    onSave(updatedSlides);
    toast.success("저장 후 닫습니다.");
    onClose();
  };

  // AI 디자이너 요청 — 현재 슬라이드 텍스트를 기반으로 부분 수정
  const handleAiRequest = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      // 현재 슬라이드의 heading/body 텍스트 추출
      const els = currentElements;
      const headingEl = els.find((e) => e.tag === "heading");
      const bodyEl = els.find((e) => e.tag === "body");

      const res = await fetch("/api/card-news/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction: aiPrompt,
          currentHeading: headingEl?.content || "",
          currentBody: bodyEl?.content || "",
        }),
      });
      if (!res.ok) throw new Error("AI 요청 실패");
      const data = await res.json();

      // 수정된 텍스트를 현재 요소에 반영 (이미지/로고 등은 유지)
      const updatedEls = els.map((el) => {
        if (el.tag === "heading" && data.heading) {
          return { ...el, content: data.heading, label: data.heading };
        }
        if (el.tag === "body" && data.body) {
          return { ...el, content: data.body, label: data.body };
        }
        return el;
      });

      const newAll = allElements.map((pageEls, i) =>
        i === currentPage ? updatedEls : pageEls
      );
      setAllElements(newAll);
      pushHistory(newAll);
      toast.success("AI가 요청한 부분만 수정했습니다!");
    } catch {
      toast.error("AI 요청에 실패했습니다.");
    } finally {
      setIsAiLoading(false);
      setAiPrompt("");
    }
  };

  // HTML 생성
  const generateHtml = () => {
    const els = currentElements;
    const bgEl = els.find((e) => e.tag === "background");
    const textEls = els.filter((e) => e.type === "text");

    const slideAspect = (slides[currentPage]?.aspectRatio || "4:5").replace(":", "/");
    let html = `<div style="position:relative; width:100%; aspect-ratio:${slideAspect}; overflow:hidden;">\n`;
    if (bgEl?.content) {
      html += `  <img src="${bgEl.content.substring(0, 50)}..." style="width:100%; height:100%; object-fit:cover;" />\n`;
      html += `  <div style="position:absolute; inset:0; background:rgba(0,0,0,0.4);"></div>\n`;
    }
    html += `  <div style="position:relative; padding:2rem; color:white;">\n`;
    textEls.forEach((el) => {
      const fs = el.fontSize || effectiveDefaultFontSize[el.tag || "body"];
      const fw = el.fontWeight || (el.tag === "heading" ? 900 : el.tag === "subheading" ? 400 : 400);
      const parts = [`font-size:${fs}px`, `font-weight:${fw}`];
      if (el.fontStyle === "italic") parts.push("font-style:italic");
      if (el.textAlign) parts.push(`text-align:${el.textAlign}`);
      if (el.color) parts.push(`color:${el.color}`);
      if (el.letterSpacing) parts.push(`letter-spacing:${el.letterSpacing}em`);
      if (el.textDecoration && el.textDecoration !== "none") parts.push(`text-decoration:${el.textDecoration}`);
      if (el.opacity != null && el.opacity < 100) parts.push(`opacity:${el.opacity / 100}`);
      if (el.fontFamily) parts.push(`font-family:'${el.fontFamily}', sans-serif`);
      if (el.marginBottom != null) parts.push(`margin-bottom:${el.marginBottom}px`);
      if (el.paddingLeft != null) parts.push(`padding-left:${el.paddingLeft}px`);
      html += `    <p style="${parts.join("; ")};">${el.content}</p>\n`;
    });
    html += `  </div>\n`;
    const logoEls = els.filter((e) => e.type === "image" && e.tag === "logo" && e.content);
    logoEls.forEach((logo) => {
      const pos = logo.logoPosition ?? "bottom-right";
      const w = logo.logoWidth ?? 20;
      const op = logo.opacity != null ? logo.opacity / 100 : 1;
      const posCSS = [
        pos.includes("top") ? "top:5%" : "bottom:5%",
        pos.includes("left") ? "left:5%" : "right:5%",
      ].join("; ");
      html += `  <img src="${logo.content.substring(0, 50)}..." style="position:absolute; ${posCSS}; width:${w}%; opacity:${op}; object-fit:contain; z-index:20;" />\n`;
    });
    html += `</div>`;
    return html;
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900">
            {currentPage + 1}페이지 편집
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-600 min-w-[48px] text-center">
              {currentPage + 1} / {allElements.length}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(allElements.length - 1, currentPage + 1))}
              disabled={currentPage === allElements.length - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button
            onClick={() => {
              if (allElements.length <= 1) {
                onClose();
                toast.success("슬라이드가 삭제되었습니다.");
                return;
              }
              const updated = allElements.filter((_, i) => i !== currentPage);
              setAllElements(updated);
              pushHistory(updated);
              const newPage = Math.min(currentPage, updated.length - 1);
              setCurrentPage(newPage);
              toast.success("슬라이드가 삭제되었습니다.");
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="이 슬라이드 삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
            title="실행 취소 (Ctrl+Z)"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
            title="다시 실행 (Ctrl+Shift+Z)"
          >
            <Redo2 size={18} />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save size={14} className="mr-1.5" />
            저장
          </Button>
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700"
            onClick={handleSaveAndClose}
          >
            ✓ 저장 후 닫기
          </Button>
        </div>
      </header>

      {/* 경고 배너 */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center gap-2">
        <span className="text-amber-600 text-xs">⚠</span>
        <p className="text-xs text-amber-700">
          편집 중에는 페이지를 벗어나지 마세요. 변경사항이 사라질 수 있습니다.
        </p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측 패널 */}
        <div className="w-[480px] border-r border-gray-200 flex flex-col overflow-hidden bg-white">
          <Tabs defaultValue="edit" className="flex flex-col flex-1 overflow-hidden">
            <TabsList variant="line" className="px-6 pt-4 pb-0 shrink-0">
              <TabsTrigger value="edit" className="text-sm">
                ✎ 편집
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-sm">
                <Sparkles size={14} className="mr-1" />
                AI 디자이너
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="flex-1 overflow-y-auto px-6 pb-6">
              {/* 빈 이미지 슬롯 경고 */}
              {currentElements.some(
                (e) => e.type === "image" && e.tag !== "background" && e.tag !== "logo" && !e.content
              ) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mt-4 mb-3 flex items-start gap-2">
                  <span className="text-amber-500 text-sm mt-0.5">⚠</span>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    아직 이미지가 채워지지 않은 영역이 있습니다. 이미지를 추가해주세요.
                  </p>
                </div>
              )}

              {/* 안내 문구 */}
              <div className={cn("bg-gray-50 rounded-lg p-3 mb-4", currentElements.some((e) => e.type === "image" && e.tag !== "background" && e.tag !== "logo" && !e.content) ? "" : "mt-4")}>
                <p className="text-xs text-gray-600 leading-relaxed">
                  아래 목록에서 수정할 요소를 클릭하세요. 이미지는 교체하거나
                  검색할 수 있고, 텍스트는 직접 편집할 수 있습니다.
                </p>
                <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-2 flex-wrap">
                  <span>⌘ Ctrl+Z: 실행 취소</span>
                  <span>Ctrl+Shift+Z: 다시 실행</span>
                  <span>Ctrl+S: 저장</span>
                  <span>←→: 페이지 이동</span>
                </p>
              </div>

              {/* AI 추천 링크 */}
              <button className="w-full text-center text-sm text-violet-600 hover:text-violet-700 font-medium mb-4 flex items-center justify-center gap-1.5">
                <Sparkles size={14} />
                더 다양한 조절은 AI에게 요청해보세요 &gt;
              </button>

              {/* 요소 목록 */}
              <div className="space-y-2">
                {currentElements.map((element, elementIndex) => (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={(e) => {
                      setDragIndex(elementIndex);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      setDragOverIndex(elementIndex);
                    }}
                    onDragLeave={() => setDragOverIndex(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragIndex != null) reorderElements(dragIndex, elementIndex);
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    className={cn(
                      "border rounded-xl overflow-hidden bg-white transition-all",
                      dragOverIndex === elementIndex && dragIndex !== elementIndex
                        ? "border-violet-400 ring-2 ring-violet-200"
                        : element.type === "image" && element.tag !== "background" && element.tag !== "logo" && !element.content
                          ? "border-amber-300 bg-amber-50/30"
                          : "border-gray-200 hover:border-gray-300",
                      dragIndex === elementIndex && "opacity-40"
                    )}
                  >
                    {/* 요소 헤더 */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                      onClick={() => {
                        const next = expandedElement === element.id ? null : element.id;
                        setExpandedElement(next);
                        // 이미지 슬롯이고 searchKeyword가 있으면 검색창에 자동 입력
                        if (next && element.type === "image" && element.tag !== "background" && element.tag !== "logo" && element.searchKeyword) {
                          setImageSearchQuery((prev) => ({ ...prev, [element.id]: prev[element.id] || element.searchKeyword || "" }));
                        }
                      }}
                    >
                      {/* 드래그 핸들 */}
                      <div
                        className="shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors"
                        onMouseDown={(e) => e.stopPropagation()}
                        title="드래그하여 순서 변경"
                      >
                        <GripVertical size={16} />
                      </div>

                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          element.tag === "logo"
                            ? "bg-emerald-100"
                            : element.type === "image"
                              ? "bg-violet-100"
                              : "bg-gray-100"
                        )}
                      >
                        {element.tag === "logo" ? (
                          <ImageIcon size={16} className="text-emerald-600" />
                        ) : element.type === "image" ? (
                          <ImageIcon size={16} className="text-violet-600" />
                        ) : (
                          <Type size={16} className="text-gray-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {element.type === "image"
                            ? element.label
                            : element.content || "빈 텍스트"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          {element.tag && (
                            <span className="inline-block text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              {({
                                heading: "헤드 제목",
                                subheading: "서브 제목",
                                body: "본문",
                                background: "배경",
                                logo: "로고",
                                main: "메인 이미지",
                                profile: "프로필",
                                icon: "아이콘",
                              } as Record<string, string>)[element.tag] ?? element.tag}
                            </span>
                          )}
                          {element.type === "text" && (element.fontSize || element.fontSizePercent) && (
                            <span className="inline-block text-[10px] text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded">
                              {element.fontSizePercent
                                ? `${element.fontSizePercent.toFixed(1)}cqw`
                                : `${element.fontSize}px`}
                            </span>
                          )}
                          {element.type === "image" && element.tag !== "background" && element.tag !== "logo" && !element.content && (
                            <span className="inline-block text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
                              이미지 없음
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedElement(
                            expandedElement === element.id ? null : element.id
                          );
                        }}
                      >
                        {expandedElement === element.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>

                      <button
                        className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeElement(element.id);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* 확장된 편집 영역 */}
                    {expandedElement === element.id && (
                      <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                        {element.type === "image" && element.tag === "logo" ? (
                          /* ===== 로고 편집 ===== */
                          <div>
                            {/* 숨겨진 파일 인풋 */}
                            <input
                              ref={(el) => { imageInputRefs.current[element.id] = el; }}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(element.id, file);
                                e.target.value = "";
                              }}
                            />

                            {/* 로고 미리보기 */}
                            {element.content ? (
                              <div className="relative rounded-lg overflow-hidden mb-3 group/img bg-gray-100 p-4 flex items-center justify-center">
                                <img
                                  src={element.content}
                                  alt="로고"
                                  className="max-h-24 object-contain"
                                  style={{ opacity: (element.opacity ?? 100) / 100 }}
                                />
                                <button
                                  onClick={() => updateElement(element.id, "")}
                                  className="absolute top-2 right-2 bg-black/50 text-white rounded-lg p-1.5 opacity-0 group-hover/img:opacity-100 hover:bg-black/70 transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ) : (
                              <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors cursor-pointer"
                                onClick={() => imageInputRefs.current[element.id]?.click()}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => handleImageDrop(element.id, e)}
                              >
                                <Upload size={20} className="text-gray-300 mx-auto mb-2" />
                                <p className="text-xs text-gray-500 mb-1">로고 이미지를 업로드하세요</p>
                                <p className="text-[10px] text-gray-400">PNG, SVG, WEBP (투명 배경 권장)</p>
                              </div>
                            )}

                            {/* 업로드 / 검색 / URL 버튼 */}
                            <div className="flex gap-2 mb-3">
                              <Button variant="outline" size="sm" className="flex-1 text-xs"
                                onClick={() => imageInputRefs.current[element.id]?.click()}>
                                <Upload size={12} className="mr-1" /> 업로드
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 text-xs"
                                onClick={() => {
                                  setShowImageSearch((prev) => ({ ...prev, [element.id]: !prev[element.id] }));
                                  setShowUrlInput((prev) => ({ ...prev, [element.id]: false }));
                                }}>
                                <Search size={12} className="mr-1" /> 검색
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 text-xs"
                                onClick={() => {
                                  setShowUrlInput((prev) => ({ ...prev, [element.id]: !prev[element.id] }));
                                  setShowImageSearch((prev) => ({ ...prev, [element.id]: false }));
                                }}>
                                <Link2 size={12} className="mr-1" /> URL
                              </Button>
                            </div>

                            {/* Unsplash 사진 검색 */}
                            {showImageSearch[element.id] && (
                              <div className="mt-2">
                                <div className="flex gap-2 mb-2">
                                  <input
                                    type="text"
                                    value={imageSearchQuery[element.id] || ""}
                                    onChange={(e) =>
                                      setImageSearchQuery((prev) => ({
                                        ...prev,
                                        [element.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="예: logo, brand, icon..."
                                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") searchImages(element.id);
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    className="bg-violet-600 hover:bg-violet-700 text-xs px-3"
                                    onClick={() => searchImages(element.id)}
                                    disabled={isSearchingImages[element.id] || !imageSearchQuery[element.id]?.trim()}
                                  >
                                    {isSearchingImages[element.id] ? (
                                      <Loader2 size={12} className="animate-spin" />
                                    ) : (
                                      "검색"
                                    )}
                                  </Button>
                                </div>
                                {imageSearchResults[element.id]?.length > 0 && (
                                  <div className="grid grid-cols-3 gap-1.5 max-h-72 overflow-y-auto">
                                    {imageSearchResults[element.id].map((photo) => (
                                      <button
                                        key={photo.id}
                                        onClick={() => applySearchImage(element.id, photo.url)}
                                        className="relative rounded-lg overflow-hidden aspect-square hover:ring-2 hover:ring-violet-500 transition-all group/photo"
                                      >
                                        <img
                                          src={photo.thumb}
                                          alt={photo.alt}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/20 transition-colors" />
                                      </button>
                                    ))}
                                  </div>
                                )}
                                <p className="text-[9px] text-gray-400 mt-1.5">
                                  Photos by Unsplash
                                </p>
                              </div>
                            )}

                            {/* URL 입력 필드 */}
                            {showUrlInput[element.id] && (
                              <div className="mt-2 flex gap-2">
                                <input
                                  type="url"
                                  value={imageUrlInput[element.id] || ""}
                                  onChange={(e) =>
                                    setImageUrlInput((prev) => ({
                                      ...prev,
                                      [element.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="https://example.com/logo.png"
                                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") applyImageUrl(element.id);
                                  }}
                                />
                                <Button
                                  size="sm"
                                  className="bg-violet-600 hover:bg-violet-700 text-xs px-3"
                                  onClick={() => applyImageUrl(element.id)}
                                  disabled={!imageUrlInput[element.id]?.trim()}
                                >
                                  적용
                                </Button>
                              </div>
                            )}

                            {/* 로고 전용 컨트롤 */}
                            <div className="bg-gray-50 rounded-lg p-3 mt-3 space-y-3">
                              {/* 크기 */}
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] text-gray-500 font-medium">로고 크기</span>
                                  <span className="text-[10px] text-violet-600 font-medium">{element.logoWidth ?? 20}%</span>
                                </div>
                                <input
                                  type="range" min={5} max={80} step={5}
                                  value={element.logoWidth ?? 20}
                                  onChange={(e) => updateElementPartial(element.id, { logoWidth: Number(e.target.value) })}
                                  className="w-full h-1.5 accent-violet-600 cursor-pointer"
                                />
                                <div className="flex gap-1 mt-1.5">
                                  {[10, 15, 20, 30, 40].map((v) => (
                                    <button key={v}
                                      onClick={() => updateElementPartial(element.id, { logoWidth: v })}
                                      className={cn(
                                        "flex-1 py-1 rounded text-[9px] transition-colors",
                                        (element.logoWidth ?? 20) === v
                                          ? "bg-violet-600 text-white"
                                          : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                      )}>
                                      {v}%
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* 위치 */}
                              <div>
                                <span className="text-[10px] text-gray-500 font-medium block mb-1.5">위치</span>
                                <div className="grid grid-cols-2 gap-1">
                                  {([
                                    { value: "top-left" as const, label: "좌상단" },
                                    { value: "top-right" as const, label: "우상단" },
                                    { value: "bottom-left" as const, label: "좌하단" },
                                    { value: "bottom-right" as const, label: "우하단" },
                                  ]).map((pos) => (
                                    <button key={pos.value}
                                      onClick={() => updateElementPartial(element.id, { logoPosition: pos.value })}
                                      className={cn(
                                        "py-1.5 rounded-md text-[10px] font-medium transition-colors",
                                        (element.logoPosition ?? "bottom-right") === pos.value
                                          ? "bg-violet-600 text-white"
                                          : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                      )}>
                                      {pos.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* 투명도 */}
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] text-gray-400">투명도</span>
                                  <span className="text-[10px] text-violet-600 font-medium">{element.opacity ?? 100}%</span>
                                </div>
                                <input
                                  type="range" min={0} max={100} step={5}
                                  value={element.opacity ?? 100}
                                  onChange={(e) => updateElementPartial(element.id, { opacity: Number(e.target.value) })}
                                  className="w-full h-1.5 accent-violet-600 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        ) : element.type === "image" ? (
                          /* ===== 배경/슬롯 이미지 편집 ===== */
                          <div>
                            {/* 이미지 슬롯 안내 */}
                            {element.tag !== "background" && (
                              <div className="bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
                                <ImageIcon size={12} className="text-violet-500 shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-[11px] font-medium text-violet-700">{element.label}</p>
                                  {element.searchKeyword && (
                                    <p className="text-[10px] text-violet-400 truncate">추천 검색: {element.searchKeyword}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* 숨겨진 파일 인풋 */}
                            <input
                              ref={(el) => { imageInputRefs.current[element.id] = el; }}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(element.id, file);
                                e.target.value = "";
                              }}
                            />

                            {/* 이미지 프리뷰 / 드래그앤드롭 영역 */}
                            {element.content ? (
                              <div
                                className="relative rounded-lg overflow-hidden mb-3 group/img"
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => handleImageDrop(element.id, e)}
                              >
                                <img
                                  src={element.content}
                                  alt="배경 이미지"
                                  className="w-full h-36 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center">
                                  <span className="text-white text-xs opacity-0 group-hover/img:opacity-100 transition-opacity">
                                    이미지를 드래그하여 교체
                                  </span>
                                </div>
                                <button
                                  onClick={() => updateElement(element.id, "")}
                                  className="absolute top-2 right-2 bg-black/50 text-white rounded-lg p-1.5 hover:bg-black/70 transition-colors"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ) : (
                              <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-3 hover:border-violet-300 hover:bg-violet-50/30 transition-colors cursor-pointer"
                                onClick={() => imageInputRefs.current[element.id]?.click()}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => handleImageDrop(element.id, e)}
                              >
                                <Upload size={24} className="text-gray-300 mx-auto mb-2" />
                                <p className="text-xs text-gray-500 mb-1">
                                  클릭하거나 이미지를 드래그하세요
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  PNG, JPG, WEBP · 최대 10MB
                                </p>
                              </div>
                            )}

                            {/* 이미지 액션 버튼 */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => imageInputRefs.current[element.id]?.click()}
                              >
                                <Upload size={12} className="mr-1" />
                                업로드
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => {
                                  setShowImageSearch((prev) => ({
                                    ...prev,
                                    [element.id]: !prev[element.id],
                                  }));
                                  setShowUrlInput((prev) => ({ ...prev, [element.id]: false }));
                                }}
                              >
                                <Search size={12} className="mr-1" />
                                사진 검색
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => {
                                  setShowUrlInput((prev) => ({
                                    ...prev,
                                    [element.id]: !prev[element.id],
                                  }));
                                  setShowImageSearch((prev) => ({ ...prev, [element.id]: false }));
                                }}
                              >
                                <Link2 size={12} className="mr-1" />
                                URL
                              </Button>
                            </div>

                            {/* Unsplash 사진 검색 */}
                            {showImageSearch[element.id] && (
                              <div className="mt-2">
                                <div className="flex gap-2 mb-2">
                                  <input
                                    type="text"
                                    value={imageSearchQuery[element.id] || ""}
                                    onChange={(e) =>
                                      setImageSearchQuery((prev) => ({
                                        ...prev,
                                        [element.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="예: coffee, nature, office..."
                                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") searchImages(element.id);
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    className="bg-violet-600 hover:bg-violet-700 text-xs px-3"
                                    onClick={() => searchImages(element.id)}
                                    disabled={isSearchingImages[element.id] || !imageSearchQuery[element.id]?.trim()}
                                  >
                                    {isSearchingImages[element.id] ? (
                                      <Loader2 size={12} className="animate-spin" />
                                    ) : (
                                      "검색"
                                    )}
                                  </Button>
                                </div>
                                {imageSearchResults[element.id]?.length > 0 && (
                                  <div className="grid grid-cols-3 gap-1.5 max-h-72 overflow-y-auto">
                                    {imageSearchResults[element.id].map((photo) => (
                                      <button
                                        key={photo.id}
                                        onClick={() => applySearchImage(element.id, photo.url)}
                                        className="relative rounded-lg overflow-hidden aspect-[3/4] hover:ring-2 hover:ring-violet-500 transition-all group/photo"
                                      >
                                        <img
                                          src={photo.thumb}
                                          alt={photo.alt}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/20 transition-colors" />
                                      </button>
                                    ))}
                                  </div>
                                )}
                                <p className="text-[9px] text-gray-400 mt-1.5">
                                  Photos by Unsplash
                                </p>
                              </div>
                            )}

                            {/* URL 입력 필드 */}
                            {showUrlInput[element.id] && (
                              <div className="mt-2 flex gap-2">
                                <input
                                  type="url"
                                  value={imageUrlInput[element.id] || ""}
                                  onChange={(e) =>
                                    setImageUrlInput((prev) => ({
                                      ...prev,
                                      [element.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="https://example.com/image.jpg"
                                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") applyImageUrl(element.id);
                                  }}
                                />
                                <Button
                                  size="sm"
                                  className="bg-violet-600 hover:bg-violet-700 text-xs px-3"
                                  onClick={() => applyImageUrl(element.id)}
                                  disabled={!imageUrlInput[element.id]?.trim()}
                                >
                                  적용
                                </Button>
                              </div>
                            )}

                            {/* 위치 & 크기 (positioned 이미지 슬롯) */}
                            {element.tag !== "background" && element.tag !== "logo" && element.xPercent !== undefined && (
                              <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2.5">
                                <p className="text-[10px] font-medium text-gray-500">위치 & 크기 <span className="text-gray-400 font-normal">미리보기에서 드래그도 가능</span></p>
                                <div>
                                  <div className="flex justify-between mb-0.5">
                                    <span className="text-[10px] text-gray-400">X 위치</span>
                                    <span className="text-[10px] font-mono text-violet-600">{Math.round(element.xPercent ?? 0)}%</span>
                                  </div>
                                  <input type="range" min={0} max={95} step={1}
                                    value={element.xPercent ?? 0}
                                    onChange={(e) => updateElementPartial(element.id, { xPercent: Number(e.target.value) })}
                                    className="w-full h-1.5 accent-violet-600 cursor-pointer"
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-0.5">
                                    <span className="text-[10px] text-gray-400">Y 위치</span>
                                    <span className="text-[10px] font-mono text-violet-600">{Math.round(element.yPercent ?? 0)}%</span>
                                  </div>
                                  <input type="range" min={0} max={95} step={1}
                                    value={element.yPercent ?? 0}
                                    onChange={(e) => updateElementPartial(element.id, { yPercent: Number(e.target.value) })}
                                    className="w-full h-1.5 accent-violet-600 cursor-pointer"
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-0.5">
                                    <span className="text-[10px] text-gray-400">너비</span>
                                    <span className="text-[10px] font-mono text-violet-600">{Math.round(element.widthPercent ?? 80)}%</span>
                                  </div>
                                  <input type="range" min={5} max={100} step={1}
                                    value={element.widthPercent ?? 80}
                                    onChange={(e) => updateElementPartial(element.id, { widthPercent: Number(e.target.value) })}
                                    className="w-full h-1.5 accent-violet-600 cursor-pointer"
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-0.5">
                                    <span className="text-[10px] text-gray-400">높이</span>
                                    <span className="text-[10px] font-mono text-violet-600">{Math.round(element.heightPercent ?? 30)}%</span>
                                  </div>
                                  <input type="range" min={5} max={100} step={1}
                                    value={element.heightPercent ?? 30}
                                    onChange={(e) => updateElementPartial(element.id, { heightPercent: Number(e.target.value) })}
                                    className="w-full h-1.5 accent-violet-600 cursor-pointer"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* ===== 텍스트 편집 ===== */
                          <div>
                            <Textarea
                              value={element.content}
                              onChange={(e) => updateElement(element.id, e.target.value)}
                              rows={element.tag === "body" ? 3 : 2}
                              className="text-sm mb-3"
                              placeholder="텍스트를 입력하세요"
                            />

                            {/* 태그 선택 */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-[10px] text-gray-400 shrink-0">유형</span>
                              <div className="flex gap-1">
                                {(["heading", "subheading", "body"] as const).map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={() => {
                                      updateElementPartial(element.id, {
                                        tag,
                                        fontSize: element.fontSize || effectiveDefaultFontSize[tag],
                                      });
                                    }}
                                    className={cn(
                                      "text-[10px] px-2 py-1 rounded-md transition-colors",
                                      element.tag === tag
                                        ? "bg-violet-100 text-violet-700"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    )}
                                  >
                                    {tag === "heading" ? "제목" : tag === "subheading" ? "소제목" : "본문"}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 텍스트 크기 조절 */}
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-gray-500 font-medium">
                                  텍스트 크기
                                  {element.fontSizePercent && (
                                    <span className="ml-1 text-[9px] text-amber-500 font-normal">(슬라이더로 고정 전환)</span>
                                  )}
                                </span>
                                <span className="text-xs font-semibold text-violet-600">
                                  {element.fontSizePercent
                                    ? `${element.fontSizePercent.toFixed(1)}cqw`
                                    : `${element.fontSize || effectiveDefaultFontSize[element.tag || "body"]}px`}
                                </span>
                              </div>

                              {/* 슬라이더 + 증감 버튼 */}
                              <div className="flex items-center gap-2 mb-2.5">
                                <button
                                  onClick={() => {
                                    const current = element.fontSize || effectiveDefaultFontSize[element.tag || "body"];
                                    updateElementPartial(element.id, {
                                      fontSize: Math.max(8, current - 1),
                                      fontSizePercent: undefined,
                                    });
                                  }}
                                  className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
                                >
                                  <Minus size={12} />
                                </button>
                                <input
                                  type="range"
                                  min={8}
                                  max={120}
                                  step={1}
                                  value={element.fontSize || effectiveDefaultFontSize[element.tag || "body"]}
                                  onChange={(e) =>
                                    updateElementPartial(element.id, {
                                      fontSize: Number(e.target.value),
                                      fontSizePercent: undefined,
                                    })
                                  }
                                  className="flex-1 h-1.5 accent-violet-600 cursor-pointer"
                                />
                                <button
                                  onClick={() => {
                                    const current = element.fontSize || effectiveDefaultFontSize[element.tag || "body"];
                                    updateElementPartial(element.id, {
                                      fontSize: Math.min(120, current + 1),
                                      fontSizePercent: undefined,
                                    });
                                  }}
                                  className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {/* 프리셋 버튼 */}
                              <div className="flex gap-1">
                                {effectiveFontSizePresets.map((preset) => (
                                  <button
                                    key={preset.label}
                                    onClick={() =>
                                      updateElementPartial(element.id, {
                                        fontSize: preset.value,
                                        fontSizePercent: undefined,
                                      })
                                    }
                                    className={cn(
                                      "flex-1 py-1.5 rounded-md text-[10px] font-medium transition-colors",
                                      (element.fontSize || effectiveDefaultFontSize[element.tag || "body"]) === preset.value
                                        ? "bg-violet-600 text-white"
                                        : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600"
                                    )}
                                  >
                                    {preset.label}
                                    <span className="block text-[8px] opacity-60">{preset.value}px</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 폰트 선택 */}
                            <div className="bg-gray-50 rounded-lg p-3 mt-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-gray-500 font-medium">서체</span>
                                <button
                                  onClick={() =>
                                    setShowFontPicker((prev) => ({
                                      ...prev,
                                      [element.id]: !prev[element.id],
                                    }))
                                  }
                                  className="text-[10px] text-violet-600 hover:text-violet-700"
                                >
                                  {showFontPicker[element.id] ? "접기" : "전체 보기"}
                                </button>
                              </div>

                              {/* 현재 선택된 폰트 */}
                              <div
                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg mb-2 cursor-pointer hover:border-violet-300 transition-colors"
                                onClick={() =>
                                  setShowFontPicker((prev) => ({
                                    ...prev,
                                    [element.id]: !prev[element.id],
                                  }))
                                }
                              >
                                <p
                                  className="text-sm text-gray-900 truncate"
                                  style={{ fontFamily: element.fontFamily || "inherit" }}
                                >
                                  {element.fontFamily
                                    ? FONT_PRESETS.find((f) => f.value === element.fontFamily)?.label || element.fontFamily
                                    : "기본 (Geist)"}
                                </p>
                                <p
                                  className="text-lg text-gray-700 mt-0.5"
                                  style={{ fontFamily: element.fontFamily || "inherit" }}
                                >
                                  {FONT_PRESETS.find((f) => f.value === element.fontFamily)?.preview || "가나다 ABC 123"}
                                </p>
                              </div>

                              {/* 폰트 목록 */}
                              {showFontPicker[element.id] && (
                                <div className="max-h-[240px] overflow-y-auto space-y-0.5 border border-gray-200 rounded-lg bg-white">
                                  {["시스템", "고딕", "명조", "디스플레이", "손글씨"].map((category) => {
                                    const fonts = FONT_PRESETS.filter((f) => f.category === category);
                                    if (fonts.length === 0) return null;
                                    return (
                                      <div key={category}>
                                        <p className="text-[9px] text-gray-400 font-medium px-3 pt-2 pb-1 sticky top-0 bg-white">
                                          {category}
                                        </p>
                                        {fonts.map((font) => (
                                          <button
                                            key={font.value}
                                            onClick={() => {
                                              updateElementPartial(element.id, {
                                                fontFamily: font.value || undefined,
                                              });
                                              setShowFontPicker((prev) => ({
                                                ...prev,
                                                [element.id]: false,
                                              }));
                                            }}
                                            className={cn(
                                              "w-full text-left px-3 py-2 hover:bg-violet-50 transition-colors flex items-center justify-between",
                                              (element.fontFamily || "") === font.value && "bg-violet-50"
                                            )}
                                          >
                                            <div className="min-w-0">
                                              <p className="text-[10px] text-gray-500">{font.label}</p>
                                              <p
                                                className="text-base text-gray-800 truncate"
                                                style={{
                                                  fontFamily: font.value || "inherit",
                                                }}
                                              >
                                                {font.preview}
                                              </p>
                                            </div>
                                            {(element.fontFamily || "") === font.value && (
                                              <span className="text-violet-600 text-xs shrink-0 ml-2">✓</span>
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* 텍스트 스타일 */}
                            <div className="bg-gray-50 rounded-lg p-3 mt-3">
                              <span className="text-[10px] text-gray-500 font-medium block mb-2">텍스트 스타일</span>

                              {/* 굵기 / 기울임 / 밑줄 / 취소선 토글 */}
                              <div className="flex gap-1 mb-3">
                                <button
                                  onClick={() =>
                                    updateElementPartial(element.id, {
                                      fontWeight: (element.fontWeight || 400) >= 700 ? 400 : 700,
                                    })
                                  }
                                  className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                                    (element.fontWeight || 400) >= 700
                                      ? "bg-violet-600 text-white"
                                      : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                  )}
                                  title="굵게"
                                >
                                  <Bold size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    updateElementPartial(element.id, {
                                      fontStyle: element.fontStyle === "italic" ? "normal" : "italic",
                                    })
                                  }
                                  className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                                    element.fontStyle === "italic"
                                      ? "bg-violet-600 text-white"
                                      : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                  )}
                                  title="기울임"
                                >
                                  <Italic size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    updateElementPartial(element.id, {
                                      textDecoration: element.textDecoration === "underline" ? "none" : "underline",
                                    })
                                  }
                                  className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                                    element.textDecoration === "underline"
                                      ? "bg-violet-600 text-white"
                                      : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                  )}
                                  title="밑줄"
                                >
                                  <Underline size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    updateElementPartial(element.id, {
                                      textDecoration: element.textDecoration === "line-through" ? "none" : "line-through",
                                    })
                                  }
                                  className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                                    element.textDecoration === "line-through"
                                      ? "bg-violet-600 text-white"
                                      : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                  )}
                                  title="취소선"
                                >
                                  <Strikethrough size={14} />
                                </button>

                                <div className="w-px bg-gray-200 mx-0.5" />

                                {/* 정렬 */}
                                <button
                                  onClick={() => updateElementPartial(element.id, { textAlign: "left" })}
                                  className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                                    (element.textAlign || "left") === "left"
                                      ? "bg-violet-600 text-white"
                                      : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                  )}
                                  title="왼쪽 정렬"
                                >
                                  <AlignLeft size={14} />
                                </button>
                                <button
                                  onClick={() => updateElementPartial(element.id, { textAlign: "center" })}
                                  className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                                    element.textAlign === "center"
                                      ? "bg-violet-600 text-white"
                                      : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                  )}
                                  title="가운데 정렬"
                                >
                                  <AlignCenter size={14} />
                                </button>
                                <button
                                  onClick={() => updateElementPartial(element.id, { textAlign: "right" })}
                                  className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                                    element.textAlign === "right"
                                      ? "bg-violet-600 text-white"
                                      : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                  )}
                                  title="오른쪽 정렬"
                                >
                                  <AlignRight size={14} />
                                </button>
                              </div>

                              {/* 굵기 세부 조절 */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] text-gray-400">굵기</span>
                                  <span className="text-[10px] text-violet-600 font-medium">{element.fontWeight || 400}</span>
                                </div>
                                <div className="flex gap-0.5">
                                  {FONT_WEIGHT_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      onClick={() => updateElementPartial(element.id, { fontWeight: opt.value })}
                                      className={cn(
                                        "flex-1 py-1 rounded text-[9px] transition-colors",
                                        (element.fontWeight || 400) === opt.value
                                          ? "bg-violet-600 text-white"
                                          : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                      )}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* 자간 */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] text-gray-400">자간</span>
                                  <span className="text-[10px] text-violet-600 font-medium">{element.letterSpacing || 0}em</span>
                                </div>
                                <div className="flex gap-0.5">
                                  {LETTER_SPACING_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      onClick={() => updateElementPartial(element.id, { letterSpacing: opt.value })}
                                      className={cn(
                                        "flex-1 py-1 rounded text-[9px] transition-colors",
                                        (element.letterSpacing || 0) === opt.value
                                          ? "bg-violet-600 text-white"
                                          : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                      )}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* 투명도 */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] text-gray-400">투명도</span>
                                  <span className="text-[10px] text-violet-600 font-medium">{element.opacity ?? 100}%</span>
                                </div>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  step={5}
                                  value={element.opacity ?? 100}
                                  onChange={(e) =>
                                    updateElementPartial(element.id, { opacity: Number(e.target.value) })
                                  }
                                  className="w-full h-1.5 accent-violet-600 cursor-pointer"
                                />
                              </div>

                              {/* 아래 간격 */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] text-gray-400">아래 간격</span>
                                  <span className="text-[10px] text-violet-600 font-medium">{element.marginBottom ?? 8}px</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="range"
                                    min={0}
                                    max={60}
                                    step={2}
                                    value={element.marginBottom ?? 8}
                                    onChange={(e) =>
                                      updateElementPartial(element.id, { marginBottom: Number(e.target.value) })
                                    }
                                    className="flex-1 h-1.5 accent-violet-600 cursor-pointer"
                                  />
                                </div>
                                <div className="flex gap-1 mt-1.5">
                                  {[0, 4, 8, 16, 24, 40].map((v) => (
                                    <button
                                      key={v}
                                      onClick={() => updateElementPartial(element.id, { marginBottom: v })}
                                      className={cn(
                                        "flex-1 py-1 rounded text-[9px] transition-colors",
                                        (element.marginBottom ?? 8) === v
                                          ? "bg-violet-600 text-white"
                                          : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                      )}
                                    >
                                      {v}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* 왼쪽 여백 */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] text-gray-400">왼쪽 여백</span>
                                  <span className="text-[10px] text-violet-600 font-medium">{element.paddingLeft ?? 0}px</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="range"
                                    min={0}
                                    max={80}
                                    step={2}
                                    value={element.paddingLeft ?? 0}
                                    onChange={(e) =>
                                      updateElementPartial(element.id, { paddingLeft: Number(e.target.value) })
                                    }
                                    className="flex-1 h-1.5 accent-violet-600 cursor-pointer"
                                  />
                                </div>
                                <div className="flex gap-1 mt-1.5">
                                  {[0, 8, 16, 24, 32, 48].map((v) => (
                                    <button
                                      key={v}
                                      onClick={() => updateElementPartial(element.id, { paddingLeft: v })}
                                      className={cn(
                                        "flex-1 py-1 rounded text-[9px] transition-colors",
                                        (element.paddingLeft ?? 0) === v
                                          ? "bg-violet-600 text-white"
                                          : "bg-white border border-gray-200 text-gray-500 hover:border-violet-300"
                                      )}
                                    >
                                      {v}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* 텍스트 색상 */}
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] text-gray-400">텍스트 색상</span>
                                  <div className="flex items-center gap-1.5">
                                    <div
                                      className="w-4 h-4 rounded border border-gray-300"
                                      style={{ backgroundColor: element.color || "#FFFFFF" }}
                                    />
                                    <span className="text-[10px] text-gray-500 font-mono">
                                      {element.color || "#FFFFFF"}
                                    </span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-8 gap-1">
                                  {COLOR_PRESETS.map((color) => (
                                    <button
                                      key={color}
                                      onClick={() => updateElementPartial(element.id, { color })}
                                      className={cn(
                                        "w-full aspect-square rounded-md border-2 transition-all hover:scale-110",
                                        (element.color || "#FFFFFF") === color
                                          ? "border-violet-500 ring-1 ring-violet-300"
                                          : "border-gray-200"
                                      )}
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                  ))}
                                </div>
                                <div className="mt-2 flex gap-2">
                                  <input
                                    type="color"
                                    value={element.color || "#FFFFFF"}
                                    onChange={(e) =>
                                      updateElementPartial(element.id, { color: e.target.value })
                                    }
                                    className="w-8 h-7 rounded border border-gray-200 cursor-pointer p-0"
                                  />
                                  <input
                                    type="text"
                                    value={element.color || "#FFFFFF"}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
                                        updateElementPartial(element.id, { color: v });
                                      }
                                    }}
                                    placeholder="#FFFFFF"
                                    className="flex-1 px-2 py-1 border border-gray-200 rounded-md text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                  />
                                </div>
                              </div>

                              {/* 위치 조절 (positioned mode에서만) */}
                              {element.xPercent !== undefined && (
                                <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2.5">
                                  <p className="text-[10px] font-medium text-gray-500">
                                    위치{" "}
                                    <span className="text-gray-400 font-normal">
                                      미리보기에서 드래그도 가능
                                    </span>
                                  </p>
                                  {/* X 위치 */}
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[10px] text-gray-400">좌우 위치</span>
                                      <span className="text-[10px] text-violet-600 font-medium">
                                        {Math.round(element.xPercent ?? 0)}%
                                      </span>
                                    </div>
                                    <input
                                      type="range"
                                      min={0}
                                      max={90}
                                      step={1}
                                      value={Math.round(element.xPercent ?? 0)}
                                      onChange={(e) =>
                                        updateElementPartial(element.id, {
                                          xPercent: Number(e.target.value),
                                        })
                                      }
                                      className="w-full h-1.5 accent-violet-600 cursor-pointer"
                                    />
                                  </div>
                                  {/* Y 위치 */}
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[10px] text-gray-400">상하 위치</span>
                                      <span className="text-[10px] text-violet-600 font-medium">
                                        {Math.round(element.yPercent ?? 0)}%
                                      </span>
                                    </div>
                                    <input
                                      type="range"
                                      min={0}
                                      max={90}
                                      step={1}
                                      value={Math.round(element.yPercent ?? 0)}
                                      onChange={(e) =>
                                        updateElementPartial(element.id, {
                                          yPercent: Number(e.target.value),
                                        })
                                      }
                                      className="w-full h-1.5 accent-violet-600 cursor-pointer"
                                    />
                                  </div>
                                  {/* 너비 */}
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[10px] text-gray-400">너비</span>
                                      <span className="text-[10px] text-violet-600 font-medium">
                                        {Math.round(element.widthPercent ?? 80)}%
                                      </span>
                                    </div>
                                    <input
                                      type="range"
                                      min={10}
                                      max={100}
                                      step={1}
                                      value={Math.round(element.widthPercent ?? 80)}
                                      onChange={(e) =>
                                        updateElementPartial(element.id, {
                                          widthPercent: Number(e.target.value),
                                        })
                                      }
                                      className="w-full h-1.5 accent-violet-600 cursor-pointer"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 요소 추가 */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={addTextElement}
                  className="flex-1 border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Type size={14} />
                  텍스트 추가
                </button>
                <button
                  onClick={addLogoElement}
                  className="flex-1 border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-emerald-300 hover:text-emerald-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ImageIcon size={14} />
                  로고 추가
                </button>
              </div>

              {/* HTML 토글 */}
              <div className="mt-4 border-t border-gray-100 pt-3">
                <button
                  onClick={() => setShowHtml(!showHtml)}
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors w-full"
                >
                  <Code size={14} />
                  <span>HTML</span>
                  {showHtml ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {showHtml && (
                  <pre className="mt-2 bg-gray-900 text-green-400 text-[10px] p-3 rounded-lg overflow-x-auto max-h-[200px] overflow-y-auto">
                    {generateHtml()}
                  </pre>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="mt-4">
                <div className="bg-violet-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-violet-600" />
                    <h3 className="text-sm font-semibold text-violet-900">AI 디자이너</h3>
                  </div>
                  <p className="text-xs text-violet-700 leading-relaxed">
                    원하는 수정사항을 자유롭게 설명해주세요. AI가 현재 페이지의
                    디자인과 텍스트를 수정합니다.
                  </p>
                </div>

                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="예: 제목을 더 임팩트있게 바꿔줘, 본문 텍스트를 간결하게 수정해줘"
                  rows={4}
                  className="mb-3 text-sm"
                />

                <Button
                  className="w-full bg-violet-600 hover:bg-violet-700"
                  onClick={handleAiRequest}
                  disabled={isAiLoading || !aiPrompt.trim()}
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin mr-2" />
                      AI 수정 중...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="mr-2" />
                      AI에게 수정 요청
                    </>
                  )}
                </Button>

                <div className="mt-6 space-y-2">
                  <p className="text-xs font-medium text-gray-500">빠른 요청</p>
                  {[
                    "제목을 더 강렬하게",
                    "본문을 더 간결하게",
                    "카피라이팅 스타일로 수정",
                    "전문적인 톤으로 변경",
                    "이모지 추가해서 친근하게",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setAiPrompt(suggestion)}
                      className="block w-full text-left text-xs px-3 py-2 bg-gray-50 hover:bg-violet-50 hover:text-violet-700 rounded-lg transition-colors text-gray-600"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 우측 패널: 미리보기 */}
        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">미리보기</h3>
            {expandedElement && currentElements.find((e) => e.id === expandedElement) && (
              <span className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={11} />
                {currentElements.find((e) => e.id === expandedElement)?.type === "image"
                  ? "이미지 편집 중"
                  : "텍스트 편집 중"}
              </span>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div
              className="w-full max-w-[420px] rounded-xl overflow-hidden shadow-2xl"
              style={{ aspectRatio: (slides[currentPage]?.aspectRatio || "4:5").replace(":", "/") }}
            >
              <SlidePreview
                elements={currentElements}
                slideIndex={currentPage}
                backgroundColor={slides[currentPage]?.backgroundColor}
                backgroundGradient={slides[currentPage]?.backgroundGradient}
                activeElementId={expandedElement ?? undefined}
                onElementUpdate={updateElementPartialSilent}
                onDragEnd={() => pushHistory(allElementsRef.current)}
              />
            </div>
          </div>

          {/* 하단 페이지 인디케이터 */}
          <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                  i === currentPage
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
