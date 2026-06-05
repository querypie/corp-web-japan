"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { isComponentNameDebugEnabled } from "@/lib/component-name-debug";
import { ComponentNameDebugMenuSection } from "./component-name-debug-menu-section";
import styles from "./preview-mode-toggle.module.css";

type PreviewModeToggleProps = {
  enabled: boolean;
  showPreviewModeControls?: boolean;
};

export function PreviewModeToggle({ enabled, showPreviewModeControls = true }: PreviewModeToggleProps) {
  const router = useRouter();
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const componentNameDebugEnabled = isComponentNameDebugEnabled();
  const menuLabel = showPreviewModeControls
    ? `Preview mode menu: ${isEnabled ? "ON" : "OFF"}`
    : "Reviewer tools menu";

  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!menuRef.current?.contains(target)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  async function updatePreviewMode(nextEnabled: boolean) {
    setIsEnabled(nextEnabled);
    setError(null);

    try {
      const response = await fetch("/api/preview-navigation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled: nextEnabled }),
      });

      if (!response.ok) {
        throw new Error("Failed to update preview mode.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setIsEnabled(!nextEnabled);
      setError("Preview mode を更新できませんでした。時間をおいて再度お試しください。");
    }
  }

  async function handlePreviewModeSelection(nextEnabled: boolean) {
    setIsMenuOpen(false);

    if (nextEnabled === isEnabled) {
      return;
    }

    await updatePreviewMode(nextEnabled);
  }

  return (
    <div ref={menuRef} className={styles.toggleContainer}>
      <button
        type="button"
        className={`${styles.toggleButton} ${isEnabled ? styles.toggleButtonEnabled : styles.toggleButtonDisabled}`}
        onClick={() => setIsMenuOpen((current) => !current)}
        aria-pressed={isEnabled}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-controls={menuId}
        aria-label={menuLabel}
        title={menuLabel}
        disabled={isPending}
      >
        <span className={styles.toggleInner}>
          <span className={styles.toggleDot} aria-hidden="true" />
          <span className={styles.toggleLabel} aria-hidden="true">
            {showPreviewModeControls ? "P" : "D"}
          </span>
        </span>
      </button>

      {isMenuOpen ? (
        <div id={menuId} className={styles.menuPanel} role="menu" aria-label="Reviewer tools">
          {showPreviewModeControls ? (
            <div>
              <p className={styles.menuEyebrow}>Preview mode</p>
              <p className={styles.menuStatus}>{isEnabled ? "Currently ON" : "Currently OFF"}</p>
              <div className={styles.menuItems}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={isEnabled}
                  className={`${styles.menuItem} ${isEnabled ? styles.menuItemActive : ""}`}
                  onClick={() => void handlePreviewModeSelection(true)}
                  disabled={isPending}
                >
                  <span className={styles.menuItemLabel}>ON</span>
                  <span className={styles.menuItemDescription}>Use preview navigation and reviewer unlocks.</span>
                </button>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={!isEnabled}
                  className={`${styles.menuItem} ${!isEnabled ? styles.menuItemActive : ""}`}
                  onClick={() => void handlePreviewModeSelection(false)}
                  disabled={isPending}
                >
                  <span className={styles.menuItemLabel}>OFF</span>
                  <span className={styles.menuItemDescription}>Use public navigation and normal gates.</span>
                </button>
              </div>
            </div>
          ) : null}
          {componentNameDebugEnabled ? <ComponentNameDebugMenuSection /> : null}
        </div>
      ) : null}

      {error ? (
        <p className={styles.errorText} role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
