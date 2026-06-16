"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  componentNameDebugAttribute,
  isComponentNameDebugEnabled,
  nextComponentNameDebugMode,
  readDefaultComponentNameDebugMode,
  readStoredComponentNameDebugMode,
  subscribeComponentNameDebugModeChange,
  writeComponentNameDebugMode,
  type ComponentNameDebugMode,
} from "@/lib/component-name-debug";
import styles from "./component-name-debug-overlay.module.css";

export type ComponentNameDebugTarget = {
  getAttribute: (attribute: string) => string | null;
  parentElement: ComponentNameDebugTarget | null;
};

export type ComponentNameDebugResolvedTarget = {
  element: ComponentNameDebugTarget;
  name: string;
};

type ComponentNameDebugLabel = {
  id: string;
  name: string;
  rect: Pick<DOMRect, "bottom" | "height" | "left" | "right" | "top" | "width">;
};

type ShortcutTarget = {
  isContentEditable?: boolean;
  tagName?: string;
};

type ComponentNameDebugViewport = {
  height: number;
  width: number;
};

type ComponentNameDebugMeasuredTarget = ComponentNameDebugTarget & {
  getBoundingClientRect: () => ComponentNameDebugLabel["rect"];
};

type ComponentNameDebugClipboard = {
  writeText: (text: string) => Promise<void>;
};

type ComponentNameDebugQueryableRoot = {
  querySelectorAll: (selector: string) => ArrayLike<ComponentNameDebugMeasuredTarget>;
};

export const maxAlwaysComponentNameDebugLabels = 120;
export const componentNameDebugLabelCopyAttribute = "data-component-name-debug-copy-label";

type ComponentNameDebugLabelCornerStyle = {
  left: number;
  top: number;
  transform?: "translateX(-100%)";
};

export type ComponentNameDebugLabelCornerStyles = {
  leftBottom: ComponentNameDebugLabelCornerStyle;
  rightTop: ComponentNameDebugLabelCornerStyle;
};

function componentNameForTarget(target: ComponentNameDebugTarget | null) {
  const name = target?.getAttribute(componentNameDebugAttribute);
  return name || null;
}

function closestComponentNameDebugTarget(target: ComponentNameDebugTarget | null): ComponentNameDebugResolvedTarget | null {
  let current = target;
  while (current) {
    const name = componentNameForTarget(current);
    if (name) {
      return { element: current, name };
    }
    current = current.parentElement;
  }
  return null;
}

export function collectComponentNameDebugTargets(
  target: ComponentNameDebugTarget | null,
  mode: ComponentNameDebugMode,
): ComponentNameDebugResolvedTarget[] {
  if (mode === "off" || mode === "always") {
    return [];
  }

  const closest = closestComponentNameDebugTarget(target);
  if (!closest) {
    return [];
  }

  if (mode === "pointer") {
    return [closest];
  }

  const targets: ComponentNameDebugResolvedTarget[] = [];
  let current: ComponentNameDebugTarget | null = closest.element;
  while (current) {
    const name = componentNameForTarget(current);
    if (name && !targets.some((targetItem) => targetItem.element === current)) {
      targets.push({ element: current, name });
    }
    current = current.parentElement;
  }
  return targets;
}

function isVisibleInViewport(rect: ComponentNameDebugLabel["rect"], viewport: ComponentNameDebugViewport) {
  return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < viewport.height && rect.left < viewport.width;
}

export function collectVisibleComponentNameDebugTargets(
  root: ComponentNameDebugQueryableRoot,
  viewport: ComponentNameDebugViewport,
  limit = maxAlwaysComponentNameDebugLabels,
) {
  const targets: Array<ComponentNameDebugResolvedTarget & { rect: ComponentNameDebugLabel["rect"] }> = [];

  for (const element of Array.from(root.querySelectorAll(`[${componentNameDebugAttribute}]`))) {
    if (targets.length >= limit) {
      break;
    }

    const name = componentNameForTarget(element);
    if (!name) {
      continue;
    }

    const rect = element.getBoundingClientRect();
    if (!isVisibleInViewport(rect, viewport)) {
      continue;
    }

    targets.push({ element, name, rect });
  }

  return targets;
}

export function shouldIgnoreComponentNameDebugShortcut(target: ShortcutTarget | null) {
  if (!target) {
    return false;
  }

  const tagName = target.tagName?.toUpperCase();
  return Boolean(target.isContentEditable || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT");
}

function eventTargetElement(target: EventTarget | null) {
  return target instanceof Element ? target : null;
}

function isComponentNameDebugCopyLabel(target: Element | null) {
  return Boolean(target?.closest(`[${componentNameDebugLabelCopyAttribute}]`));
}

function isComponentNameDebugCycleShortcut(event: KeyboardEvent) {
  return event.altKey && event.shiftKey && event.code === "KeyN";
}

function isComponentNameDebugOffShortcut(event: KeyboardEvent) {
  return event.altKey && event.shiftKey && (event.code === "Digit0" || event.code === "Numpad0");
}

export async function copyComponentNameToClipboard(
  componentName: string,
  clipboard: ComponentNameDebugClipboard | undefined = typeof navigator === "undefined" ? undefined : navigator.clipboard,
) {
  if (!clipboard) {
    return false;
  }

  await clipboard.writeText(componentName);
  return true;
}

function buildLabels(target: Element | null, mode: ComponentNameDebugMode): ComponentNameDebugLabel[] {
  if (mode === "always") {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return [];
    }

    return collectVisibleComponentNameDebugTargets(document, {
      height: window.innerHeight,
      width: window.innerWidth,
    }).map((targetItem, index) => ({
      id: `${targetItem.name}-${index}`,
      name: targetItem.name,
      rect: targetItem.rect,
    }));
  }

  return collectComponentNameDebugTargets(target, mode).reduce<ComponentNameDebugLabel[]>((labels, targetItem, index) => {
    if (!(targetItem.element instanceof Element)) {
      return labels;
    }

    const rect = targetItem.element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return labels;
    }

    labels.push({
      id: `${targetItem.name}-${index}`,
      name: targetItem.name,
      rect,
    });
    return labels;
  }, []);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function currentLabelViewport() {
  if (typeof window === "undefined") {
    return null;
  }

  return {
    height: window.innerHeight,
    width: window.innerWidth,
  };
}

function labelTop(rect: ComponentNameDebugLabel["rect"], viewport: ComponentNameDebugViewport | null = currentLabelViewport()) {
  if (!viewport) {
    return rect.top + 4;
  }
  return clamp(rect.top + 4, 4, viewport.height - 18);
}

function labelBottom(rect: ComponentNameDebugLabel["rect"], viewport: ComponentNameDebugViewport | null = currentLabelViewport()) {
  if (!viewport) {
    return rect.bottom - 18;
  }
  return clamp(rect.bottom - 18, 4, viewport.height - 18);
}

function labelLeft(rect: ComponentNameDebugLabel["rect"], viewport: ComponentNameDebugViewport | null = currentLabelViewport()) {
  if (!viewport) {
    return rect.left + 4;
  }
  return clamp(rect.left + 4, 4, viewport.width - 4);
}

function labelRight(rect: ComponentNameDebugLabel["rect"], viewport: ComponentNameDebugViewport | null = currentLabelViewport()) {
  if (!viewport) {
    return rect.right - 4;
  }
  return clamp(rect.right - 4, 4, viewport.width - 4);
}

export function componentNameDebugLabelCornerStyles(
  rect: ComponentNameDebugLabel["rect"],
  viewport: ComponentNameDebugViewport | null = currentLabelViewport(),
): ComponentNameDebugLabelCornerStyles {
  return {
    leftBottom: {
      left: labelLeft(rect, viewport),
      top: labelBottom(rect, viewport),
    },
    rightTop: {
      left: labelRight(rect, viewport),
      top: labelTop(rect, viewport),
      transform: "translateX(-100%)",
    },
  };
}

export function ComponentNameDebugOverlay() {
  const enabled = isComponentNameDebugEnabled();
  const mode = useSyncExternalStore(
    subscribeComponentNameDebugModeChange,
    readStoredComponentNameDebugMode,
    readDefaultComponentNameDebugMode,
  );
  const pointerTargetRef = useRef<Element | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const [labels, setLabels] = useState<ComponentNameDebugLabel[]>([]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      const isCycleShortcut = isComponentNameDebugCycleShortcut(event);
      const isOffShortcut = isComponentNameDebugOffShortcut(event);

      if (!isCycleShortcut && !isOffShortcut) {
        return;
      }

      if (shouldIgnoreComponentNameDebugShortcut(eventTargetElement(event.target))) {
        return;
      }

      event.preventDefault();
      writeComponentNameDebugMode(isOffShortcut ? "off" : nextComponentNameDebugMode(readStoredComponentNameDebugMode()));
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);

  useEffect(() => {
    function cancelPendingFrame() {
      if (frameIdRef.current === null) {
        return;
      }

      window.cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }

    if (!enabled || mode === "off") {
      pointerTargetRef.current = null;
      cancelPendingFrame();
      frameIdRef.current = window.requestAnimationFrame(() => {
        frameIdRef.current = null;
        setLabels([]);
      });
      return cancelPendingFrame;
    }

    function scheduleLabels(target?: Element | null) {
      if (target !== undefined) {
        pointerTargetRef.current = target;
      }

      if (frameIdRef.current !== null) {
        return;
      }

      frameIdRef.current = window.requestAnimationFrame(() => {
        frameIdRef.current = null;
        setLabels(buildLabels(pointerTargetRef.current, mode));
      });
    }

    function onPointerMove(event: PointerEvent) {
      const target = eventTargetElement(event.target);
      if (isComponentNameDebugCopyLabel(target)) {
        scheduleLabels();
        return;
      }

      scheduleLabels(target);
    }

    function onPointerLeave() {
      scheduleLabels(null);
    }

    function onViewportChange() {
      scheduleLabels();
    }

    scheduleLabels(mode === "always" ? null : pointerTargetRef.current);

    if (mode !== "always") {
      document.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);

    const observer = mode === "always" ? new MutationObserver(onViewportChange) : null;
    observer?.observe(document.body, {
      attributeFilter: [componentNameDebugAttribute],
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      cancelPendingFrame();
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
      observer?.disconnect();
    };
  }, [enabled, mode]);

  if (!enabled || mode === "off" || !labels.length) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      {labels.flatMap((label) => {
        const labelCornerStyles = componentNameDebugLabelCornerStyles(label.rect);

        return [
          <button
            aria-label={`Copy component name ${label.name}`}
            className={styles.label}
            key={`${label.id}-left`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void copyComponentNameToClipboard(label.name);
            }}
            style={labelCornerStyles.leftBottom}
            tabIndex={-1}
            title={`Copy ${label.name}`}
            type="button"
            {...{ [componentNameDebugLabelCopyAttribute]: "" }}
          >
            {label.name}
          </button>,
          <button
            aria-label={`Copy component name ${label.name}`}
            className={styles.label}
            key={`${label.id}-right`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void copyComponentNameToClipboard(label.name);
            }}
            style={labelCornerStyles.rightTop}
            tabIndex={-1}
            title={`Copy ${label.name}`}
            type="button"
            {...{ [componentNameDebugLabelCopyAttribute]: "" }}
          >
            {label.name}
          </button>,
        ];
      })}
    </div>
  );
}
