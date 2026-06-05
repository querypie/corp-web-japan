export const componentNameDebugAttribute = "data-component-name" as const;
export const componentNameDebugStorageKey = "corpWebJapan.componentNameDebugMode";
export const componentNameDebugEvent = "corp-web-japan-component-name-debug-mode-change";

export type ComponentNameDebugMode = "off" | "pointer" | "ancestors" | "always";

export const COMPONENT_NAME_DEBUG_ENABLED = true;
export const defaultComponentNameDebugMode: ComponentNameDebugMode = "off";

export const activeComponentNameDebugModes: Array<{
  value: ComponentNameDebugMode;
  label: string;
  description: string;
}> = [
  {
    value: "off",
    label: "Off",
    description: "Hide component name labels.",
  },
  {
    value: "pointer",
    label: "Pointer",
    description: "Show the nearest marked component.",
  },
  {
    value: "ancestors",
    label: "Pointer + Ancestors",
    description: "Show the nearest marked component and its marked ancestors.",
  },
  {
    value: "always",
    label: "Always",
    description: "Show every marked component currently visible in the viewport.",
  },
];

const componentNamePattern = /^[A-Z][A-Za-z0-9_]*$/;

export function isComponentNameDebugEnabled() {
  return COMPONENT_NAME_DEBUG_ENABLED;
}

export function componentNameDebugProps(componentName: string) {
  if (!componentNamePattern.test(componentName)) {
    throw new Error(`Invalid component name debug marker: "${componentName}". Use a non-empty React component name without spaces.`);
  }

  return { [componentNameDebugAttribute]: componentName } as const;
}

export function isComponentNameDebugMode(value: unknown): value is ComponentNameDebugMode {
  return typeof value === "string" && activeComponentNameDebugModes.some((mode) => mode.value === value);
}

export function readDefaultComponentNameDebugMode(): ComponentNameDebugMode {
  return defaultComponentNameDebugMode;
}

export function readStoredComponentNameDebugMode(): ComponentNameDebugMode {
  if (typeof window === "undefined") {
    return defaultComponentNameDebugMode;
  }

  const stored = window.localStorage.getItem(componentNameDebugStorageKey);
  return isComponentNameDebugMode(stored) ? stored : defaultComponentNameDebugMode;
}

export function writeComponentNameDebugMode(mode: ComponentNameDebugMode) {
  window.localStorage.setItem(componentNameDebugStorageKey, mode);
  window.dispatchEvent(new CustomEvent(componentNameDebugEvent, { detail: mode }));
}

export function subscribeComponentNameDebugModeChange(onStoreChange: () => void) {
  window.addEventListener(componentNameDebugEvent, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(componentNameDebugEvent, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function nextComponentNameDebugMode(mode: ComponentNameDebugMode): ComponentNameDebugMode {
  const currentIndex = activeComponentNameDebugModes.findIndex((option) => option.value === mode);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % activeComponentNameDebugModes.length;
  return activeComponentNameDebugModes[nextIndex]?.value ?? defaultComponentNameDebugMode;
}
