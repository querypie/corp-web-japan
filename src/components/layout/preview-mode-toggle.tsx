"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import styles from "./preview-mode-toggle.module.css";

type PreviewModeToggleProps = {
  enabled: boolean;
};

export function PreviewModeToggle({ enabled }: PreviewModeToggleProps) {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  async function handleClick() {
    const nextEnabled = !isEnabled;

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

  return (
    <div className={styles.toggleContainer}>
      <button
        type="button"
        className={`${styles.toggleButton} ${isEnabled ? styles.toggleButtonEnabled : styles.toggleButtonDisabled}`}
        onClick={handleClick}
        aria-pressed={isEnabled}
        aria-label={isEnabled ? "Disable preview mode navigation" : "Enable preview mode navigation"}
        title={isEnabled ? "Preview mode: ON" : "Preview mode: OFF"}
        disabled={isPending}
      >
        <span className={styles.toggleInner}>
          <span className={styles.toggleDot} aria-hidden="true" />
          <span className={styles.toggleLabel} aria-hidden="true">
            P
          </span>
        </span>
      </button>

      {error ? (
        <p className={styles.errorText} role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
