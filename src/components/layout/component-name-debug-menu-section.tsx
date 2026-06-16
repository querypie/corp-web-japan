"use client";

import { useSyncExternalStore } from "react";
import {
  activeComponentNameDebugModes,
  componentNameDebugProps,
  isComponentNameDebugEnabled,
  readDefaultComponentNameDebugMode,
  readStoredComponentNameDebugMode,
  subscribeComponentNameDebugModeChange,
  writeComponentNameDebugMode,
  type ComponentNameDebugMode,
} from "@/lib/component-name-debug";
import styles from "./preview-mode-toggle.module.css";

export const componentNameDebugOptions = activeComponentNameDebugModes;

export function ComponentNameDebugMenuSection() {
  const enabled = isComponentNameDebugEnabled();
  const mode = useSyncExternalStore(
    subscribeComponentNameDebugModeChange,
    readStoredComponentNameDebugMode,
    readDefaultComponentNameDebugMode,
  );

  if (!enabled) {
    return null;
  }

  return (
    <div {...componentNameDebugProps("ComponentNameDebugMenuSection")} className={styles.debugSection}>
      <p className={styles.menuEyebrow}>Show Component Name</p>
      <div className={styles.menuItems}>
        {componentNameDebugOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            role="menuitemradio"
            aria-checked={option.value === mode}
            className={`${styles.menuItem} ${option.value === mode ? styles.menuItemActive : ""}`}
            onClick={() => writeComponentNameDebugMode(option.value as ComponentNameDebugMode)}
          >
            <span className={styles.menuItemLabel}>{option.label}</span>
            <span className={styles.menuItemDescription}>{option.description}</span>
          </button>
        ))}
      </div>
      <small className={styles.debugShortcut}>Shortcut: Alt+Shift+N / Alt+Shift+0 Off</small>
    </div>
  );
}
