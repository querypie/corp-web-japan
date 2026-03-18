import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SlideElement {
  id: string;
  type: "image" | "text";
  content: string;
  label: string;
  tag?: string; // e.g., "background", "heading", "subheading", "body", "logo"
  fontSize?: number; // px 단위 텍스트 크기
  fontWeight?: number; // 100~900
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  color?: string; // hex color
  letterSpacing?: number; // em 단위
  textDecoration?: "none" | "underline" | "line-through";
  opacity?: number; // 0~100
  fontFamily?: string; // Google Fonts 또는 시스템 폰트
  marginBottom?: number; // px 단위 아래 여백
  paddingLeft?: number; // px 단위 왼쪽 여백
  logoWidth?: number; // 슬라이드 너비 대비 % (5~80, 기본 20)
  logoPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  widthPercent?: number;    // 요소 너비 (슬라이드 대비 %)
  heightPercent?: number;  // 요소 높이 (슬라이드 대비 %)
  xPercent?: number;       // 요소 left 위치 (슬라이드 대비 %)
  yPercent?: number;       // 요소 top 위치 (슬라이드 대비 %)
  fontSizePercent?: number; // 폰트 크기 (이미지 너비 대비 %, cqw 렌더링용)
  searchKeyword?: string; // 이미지 슬롯 교체용 검색 키워드
}

export interface Slide {
  slideNumber: number;
  heading: string;
  body: string;
  designNote: string;
  imageUrl?: string; // AI 생성 배경 이미지 (data URL)
  backgroundColor?: string; // 단색 배경 (#hex)
  backgroundGradient?: string; // CSS gradient 문자열
  elements?: SlideElement[]; // 편집기용 요소 목록
  aspectRatio?: string; // 슬라이드 비율 (나만의 디자인 학습에서 레퍼런스 기반 설정)
}

export interface CardNewsItem {
  id: string;
  title: string;
  keyword?: string; // 사용자가 입력한 주제 키워드
  slides: Slide[];
  aspectRatio: string;
  createdAt: string;
}

export interface DesignTemplate {
  id: string;
  name: string;
  styleDescription: string;
  colors: string[];
  fontStyle: string;
  layoutPattern: string;
  createdAt: string;
}

interface CardNewsState {
  history: CardNewsItem[];
  templates: DesignTemplate[];
  addCardNews: (item: Omit<CardNewsItem, "id" | "createdAt">) => string;
  updateCardNews: (id: string, updates: Partial<CardNewsItem>) => void;
  deleteCardNews: (id: string) => void;
  addTemplate: (template: Omit<DesignTemplate, "id" | "createdAt">) => void;
  deleteTemplate: (id: string) => void;
}

export const useCardNewsStore = create<CardNewsState>()(
  persist(
    (set) => ({
      history: [],
      templates: [],
      addCardNews: (item) => {
        const id = `cn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((state) => ({
          history: [
            { ...item, id, createdAt: new Date().toISOString() },
            ...state.history,
          ],
        }));
        return id;
      },
      updateCardNews: (id, updates) =>
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      deleteCardNews: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      addTemplate: (template) =>
        set((state) => ({
          templates: [
            {
              ...template,
              id: `tmpl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              createdAt: new Date().toISOString(),
            },
            ...state.templates,
          ],
        })),
      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),
    }),
    { name: "JP_WEB-card-news" }
  )
);
