"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { Slide, SlideElement } from "@/stores/card-news";
import { ImageIcon } from "lucide-react";

export const slideColors = [
  "from-violet-600 to-indigo-700",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-700",
  "from-sky-500 to-blue-600",
  "from-amber-500 to-orange-600",
];

// 슬라이드 → 요소 목록으로 분해
export function slideToElements(slide: Slide, forceRegen = false): SlideElement[] {
  if (!forceRegen && slide.elements && slide.elements.length > 0) {
    return slide.elements;
  }

  const elements: SlideElement[] = [];

  elements.push({
    id: `el-bg-${slide.slideNumber}`,
    type: "image",
    content: slide.imageUrl || "",
    label: "Cover Background Image",
    tag: "background",
  });

  const fullHeading = slide.heading.split("\n").filter((l) => l.trim()).join(" ");
  const fullBody = slide.body.split("\n").filter((l) => l.trim()).join(" ");

  if (fullBody) {
    elements.push({
      id: `el-b-${slide.slideNumber}-0`,
      type: "text",
      content: fullBody,
      label: fullBody,
      tag: "body",
      fontSize: 17,
      fontWeight: 400,
      letterSpacing: 0,
      textAlign: "left",
      color: "#FFFFFF",
      marginBottom: 0,
      paddingLeft: 0,
    });
  }

  if (fullHeading) {
    elements.push({
      id: `el-h-${slide.slideNumber}-0`,
      type: "text",
      content: fullHeading,
      label: fullHeading || "제목",
      tag: "heading",
      fontSize: 40,
      fontWeight: 900,
      letterSpacing: -0.05,
      textAlign: "left",
      color: "#FFFFFF",
      marginBottom: 40,
      paddingLeft: 0,
    });
  }

  return elements;
}

// 요소 → inline style 변환 헬퍼
export function elementStyle(
  el: SlideElement,
  defaults?: { fontSize?: number; fontWeight?: number }
): React.CSSProperties {
  return {
    fontSize: el.fontSize || defaults?.fontSize || 14,
    fontWeight: el.fontWeight || defaults?.fontWeight,
    fontStyle: el.fontStyle || undefined,
    textAlign: el.textAlign || undefined,
    color: el.color || "#FFFFFF",
    letterSpacing: el.letterSpacing ? `${el.letterSpacing}em` : undefined,
    textDecoration:
      el.textDecoration && el.textDecoration !== "none"
        ? el.textDecoration
        : undefined,
    opacity: el.opacity != null ? el.opacity / 100 : undefined,
    fontFamily: el.fontFamily || undefined,
    marginBottom: el.marginBottom != null ? el.marginBottom : undefined,
    paddingLeft: el.paddingLeft != null ? el.paddingLeft : undefined,
  };
}

// tag별 기본 스타일
const TAG_DEFAULTS: Record<
  string,
  { fontSize: number; fontWeight: number; className: string }
> = {
  heading: { fontSize: 40, fontWeight: 900, className: "leading-tight" },
  subheading: { fontSize: 16, fontWeight: 400, className: "leading-snug" },
  body: { fontSize: 17, fontWeight: 400, className: "leading-relaxed" },
};

// ─────────────────────────────────────────────
// 슬라이드 미리보기 컴포넌트
// ─────────────────────────────────────────────
export default function SlidePreview({
  elements,
  slideIndex,
  backgroundColor,
  backgroundGradient,
  activeElementId,
  onElementUpdate,
  onDragEnd,
}: {
  elements: SlideElement[];
  slideIndex: number;
  backgroundColor?: string;
  backgroundGradient?: string;
  activeElementId?: string;
  onElementUpdate?: (id: string, updates: Partial<SlideElement>) => void;
  onDragEnd?: () => void;
}) {
  // ── Drag / Resize (positioned mode 전용)
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    type: "move" | "resize";
    startX: number;
    startY: number;
    startVal: { x: number; y: number; w: number; h: number };
  } | null>(null);

  const handleContainerPointerMove = (e: React.PointerEvent) => {
    const ds = dragRef.current;
    if (!ds || !containerRef.current || !onElementUpdate) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - ds.startX) / rect.width) * 100;
    const dy = ((e.clientY - ds.startY) / rect.height) * 100;
    if (ds.type === "move") {
      onElementUpdate(ds.id, {
        xPercent: Math.max(0, Math.min(90, ds.startVal.x + dx)),
        yPercent: Math.max(0, Math.min(90, ds.startVal.y + dy)),
      });
    } else {
      onElementUpdate(ds.id, {
        widthPercent: Math.max(5, Math.min(100, ds.startVal.w + dx)),
        heightPercent: Math.max(5, Math.min(100, ds.startVal.h + dy)),
      });
    }
  };

  const handleContainerPointerUp = () => {
    if (dragRef.current) {
      dragRef.current = null;
      onDragEnd?.();
    }
  };
  const bgElement = elements.find(
    (e) => e.type === "image" && e.tag === "background"
  );
  const logoElements = elements.filter(
    (e) => e.type === "image" && e.tag === "logo" && e.content
  );

  const hasImage = bgElement?.content;
  const hasSolidBg = backgroundColor || backgroundGradient;
  const gradient = slideColors[slideIndex % slideColors.length];

  // 배경 스타일
  const bgStyle: React.CSSProperties = {};
  if (hasSolidBg && !hasImage) {
    if (backgroundGradient) {
      bgStyle.background = backgroundGradient;
    } else if (backgroundColor) {
      bgStyle.backgroundColor = backgroundColor;
    }
  }

  // ── Positioned 모드: xPercent/yPercent가 있는 요소가 하나라도 있으면
  const positionedElements = elements.filter(
    (e) =>
      e.tag !== "background" &&
      e.tag !== "logo" &&
      e.xPercent !== undefined &&
      e.yPercent !== undefined
  );
  const isPositionedMode = positionedElements.length > 0;

  if (isPositionedMode) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative w-full h-full overflow-hidden",
          !hasImage && !hasSolidBg && "bg-gradient-to-br",
          !hasImage && !hasSolidBg && gradient
        )}
        style={{ ...bgStyle, containerType: "inline-size" } as React.CSSProperties}
        onPointerMove={onElementUpdate ? handleContainerPointerMove : undefined}
        onPointerUp={onElementUpdate ? handleContainerPointerUp : undefined}
        onPointerCancel={onElementUpdate ? handleContainerPointerUp : undefined}
      >
        {/* 배경 이미지 */}
        {hasImage && (
          <img
            src={bgElement!.content}
            alt="배경"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* 포지션 기반 요소들 */}
        {positionedElements.map((el) => {
          const baseStyle: React.CSSProperties = {
            position: "absolute",
            left: `${el.xPercent}%`,
            top: `${el.yPercent}%`,
            width: el.widthPercent ? `${el.widthPercent}%` : "auto",
          };

          const isActive = activeElementId === el.id;

          if (el.type === "image") {
            const isEditable = !!onElementUpdate;
            return (
              <div
                key={el.id}
                style={{
                  ...baseStyle,
                  height: el.heightPercent ? `${el.heightPercent}%` : "15%",
                  outline: isActive ? "2px solid #7C3AED" : undefined,
                  outlineOffset: isActive ? "2px" : undefined,
                  cursor: isEditable ? "grab" : "default",
                  userSelect: "none",
                }}
                className="relative rounded-lg overflow-hidden"
                onPointerDown={isEditable ? (e) => {
                  e.stopPropagation();
                  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                  dragRef.current = {
                    id: el.id,
                    type: "move",
                    startX: e.clientX,
                    startY: e.clientY,
                    startVal: {
                      x: el.xPercent ?? 0,
                      y: el.yPercent ?? 0,
                      w: el.widthPercent ?? 80,
                      h: el.heightPercent ?? 30,
                    },
                  };
                } : undefined}
              >
                {el.content ? (
                  <img
                    src={el.content}
                    alt={el.label}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none block"
                    style={{ transform: "scale(1.08)", transformOrigin: "center" }}
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full border-2 border-dashed border-white/40 rounded-lg flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <ImageIcon size={14} className="text-white/50 mb-0.5" />
                    <span className="text-[8px] text-white/60 text-center px-1 leading-tight">
                      {el.label}
                    </span>
                    {el.searchKeyword && (
                      <span className="text-[7px] text-white/40 mt-0.5 truncate max-w-full px-1">
                        {el.searchKeyword}
                      </span>
                    )}
                  </div>
                )}
                {/* 리사이즈 핸들 */}
                {isEditable && (
                  <div
                    className="absolute bottom-1 right-1 w-5 h-5 bg-violet-600/80 hover:bg-violet-600 rounded flex items-center justify-center z-10 shadow-sm opacity-60 hover:opacity-100 transition-opacity"
                    style={{ cursor: "se-resize" }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                      dragRef.current = {
                        id: el.id,
                        type: "resize",
                        startX: e.clientX,
                        startY: e.clientY,
                        startVal: {
                          x: el.xPercent ?? 0,
                          y: el.yPercent ?? 0,
                          w: el.widthPercent ?? 80,
                          h: el.heightPercent ?? 30,
                        },
                      };
                    }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 6.5L6.5 1.5M4 6.5L6.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          }

          // 텍스트 요소
          const defaults = TAG_DEFAULTS[el.tag || "body"] || TAG_DEFAULTS.body;
          const Tag =
            el.tag === "heading" ? "h2" : el.tag === "subheading" ? "h3" : "p";
          // fontSizePercent가 있으면 cqw 단위(컨테이너 너비 기준)로 렌더링
          // 없으면 절대 px 사용
          const fontSizeStyle: React.CSSProperties = el.fontSizePercent
            ? { fontSize: `${el.fontSizePercent}cqw` }
            : { fontSize: el.fontSize || defaults.fontSize };
          const isTextEditable = !!onElementUpdate;
          return (
            <Tag
              key={el.id}
              style={{
                ...baseStyle,
                // 모든 텍스트 요소: 높이 auto → 실제 텍스트 양에 딱 맞게 조절
                // (fontSizePercent 보정으로 heading도 heightPercent를 자연스럽게 채움)
                ...elementStyle(el, {
                  fontSize: defaults.fontSize,
                  fontWeight: defaults.fontWeight,
                }),
                ...fontSizeStyle,
                lineHeight: el.tag === "heading" ? 1.0 : el.tag === "subheading" ? 1.3 : 1.5,
                overflow: "hidden",
                outline: isActive ? "2px solid #7C3AED" : undefined,
                outlineOffset: isActive ? "3px" : undefined,
                cursor: isTextEditable ? "grab" : "default",
                userSelect: "none",
              }}
              className={defaults.className}
              onPointerDown={isTextEditable ? (e) => {
                e.stopPropagation();
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                dragRef.current = {
                  id: el.id,
                  type: "move",
                  startX: e.clientX,
                  startY: e.clientY,
                  startVal: {
                    x: el.xPercent ?? 0,
                    y: el.yPercent ?? 0,
                    w: el.widthPercent ?? 80,
                    h: el.heightPercent ?? 10,
                  },
                };
              } : undefined}
            >
              {el.content}
            </Tag>
          );
        })}

        {/* 로고 오버레이 */}
        {logoElements.map((logo) => {
          const pos = logo.logoPosition ?? "bottom-right";
          const positionStyle: React.CSSProperties = {
            position: "absolute",
            zIndex: 20,
            width: `${logo.logoWidth ?? 20}%`,
            opacity: logo.opacity != null ? logo.opacity / 100 : 1,
            ...(pos.includes("top") ? { top: "5%" } : { bottom: "5%" }),
            ...(pos.includes("left") ? { left: "5%" } : { right: "5%" }),
          };
          return (
            <img
              key={logo.id}
              src={logo.content}
              alt="로고"
              style={positionStyle}
              className="object-contain pointer-events-none"
            />
          );
        })}
      </div>
    );
  }

  // ── 기본 Flex 모드 (AI 생성 카드뉴스용)
  const textElements = elements.filter((e) => e.type === "text");
  const imageSlotElements = elements.filter(
    (e) => e.type === "image" && e.tag !== "background" && e.tag !== "logo"
  );

  return (
    <div
      className={cn(
        "relative w-full h-full flex flex-col",
        !hasImage && !hasSolidBg && "bg-gradient-to-br",
        !hasImage && !hasSolidBg && gradient
      )}
      style={bgStyle}
    >
      {hasImage && (
        <>
          <img
            src={bgElement!.content}
            alt="배경"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </>
      )}

      {imageSlotElements.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-2 p-4">
          {imageSlotElements.map((slot) => {
            const w = slot.widthPercent || 40;
            const h = slot.heightPercent || 30;
            return (
              <div
                key={slot.id}
                className="relative rounded-lg overflow-hidden flex-shrink-0"
                style={{ width: `${w}%`, paddingBottom: `${h}%` }}
              >
                {slot.content ? (
                  <img
                    src={slot.content}
                    alt={slot.label}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm">
                    <ImageIcon size={20} className="text-white/40 mb-1" />
                    <span className="text-[10px] text-white/50 text-center px-1 leading-tight">
                      {slot.label}
                    </span>
                    {slot.searchKeyword && (
                      <span className="text-[8px] text-white/30 mt-0.5">
                        {slot.searchKeyword}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col justify-end p-8">
        {textElements.map((el) => {
          const defaults =
            TAG_DEFAULTS[el.tag || "body"] || TAG_DEFAULTS.body;
          const Tag =
            el.tag === "heading"
              ? "h2"
              : el.tag === "subheading"
                ? "h3"
                : "p";
          const isActive = activeElementId === el.id;
          return (
            <Tag
              key={el.id}
              className={defaults.className}
              style={{
                ...elementStyle(el, {
                  fontSize: defaults.fontSize,
                  fontWeight: defaults.fontWeight,
                }),
                outline: isActive ? "2px solid #7C3AED" : undefined,
                outlineOffset: isActive ? "3px" : undefined,
              }}
            >
              {el.content}
            </Tag>
          );
        })}
      </div>

      {logoElements.map((logo) => {
        const pos = logo.logoPosition ?? "bottom-right";
        const positionStyle: React.CSSProperties = {
          position: "absolute",
          zIndex: 20,
          width: `${logo.logoWidth ?? 20}%`,
          opacity: logo.opacity != null ? logo.opacity / 100 : 1,
          ...(pos.includes("top") ? { top: "5%" } : { bottom: "5%" }),
          ...(pos.includes("left") ? { left: "5%" } : { right: "5%" }),
        };
        return (
          <img
            key={logo.id}
            src={logo.content}
            alt="로고"
            style={positionStyle}
            className="object-contain pointer-events-none"
          />
        );
      })}
    </div>
  );
}
