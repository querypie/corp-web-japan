import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

const contractSource = readSource("src/lib/component-name-debug.ts");
const overlaySource = readSource("src/components/layout/component-name-debug-overlay.tsx");
const menuSectionSource = readSource("src/components/layout/component-name-debug-menu-section.tsx");
const previewToggleSource = readSource("src/components/layout/preview-mode-toggle.tsx");
const siteHeaderSource = readSource("src/components/layout/site-header-client.tsx");
const overlayStyles = readSource("src/components/layout/component-name-debug-overlay.module.css");

test("Component Name Debug uses a production-capable build-time code constant", () => {
  assert.match(contractSource, /export const COMPONENT_NAME_DEBUG_ENABLED = true;/);
  assert.doesNotMatch(contractSource, /process\.env/);
  assert.match(contractSource, /export function isComponentNameDebugEnabled\(\)/);
  assert.match(siteHeaderSource, /showPreviewModeToggle \|\| componentNameDebugEnabled/);
});

test("Component Name Debug exposes the required mode order and shortcut cycle", () => {
  assert.match(contractSource, /value: "off",[\s\S]*?label: "Off"/);
  assert.match(contractSource, /value: "pointer",[\s\S]*?label: "Pointer"/);
  assert.match(contractSource, /value: "ancestors",[\s\S]*?label: "Pointer \+ Ancestors"/);
  assert.match(contractSource, /value: "always",[\s\S]*?label: "Always"/);
  assert.match(contractSource, /nextComponentNameDebugMode/);
  assert.match(overlaySource, /event\.altKey/);
  assert.match(overlaySource, /event\.shiftKey/);
  assert.match(overlaySource, /event\.code !== "KeyN"/);
  assert.match(overlaySource, /shouldIgnoreComponentNameDebugShortcut/);
  assert.match(overlaySource, /tagName === "INPUT"/);
  assert.match(overlaySource, /tagName === "TEXTAREA"/);
  assert.match(overlaySource, /tagName === "SELECT"/);
});

test("Component Name Debug reads validated data-component-name markers", () => {
  assert.match(contractSource, /componentNameDebugAttribute = "data-component-name"/);
  assert.ok(contractSource.includes("const componentNamePattern = /^[A-Z][A-Za-z0-9_]*$/;"));
  assert.match(contractSource, /throw new Error\(`Invalid component name debug marker/);
  assert.ok(overlaySource.includes("querySelectorAll(`[${componentNameDebugAttribute}]`)"));
  assert.match(siteHeaderSource, /componentNameDebugProps\("SiteHeader"\)/);
  assert.match(siteHeaderSource, /componentNameDebugProps\("SiteHeaderNav"\)/);
  assert.match(siteHeaderSource, /componentNameDebugProps\("SiteHeaderActions"\)/);
});

test("Component Name Debug overlay implements pointer, ancestors, Always, and label placement", () => {
  assert.match(overlaySource, /mode === "always"/);
  assert.match(overlaySource, /collectVisibleComponentNameDebugTargets/);
  assert.match(overlaySource, /maxAlwaysComponentNameDebugLabels = 120/);
  assert.match(overlaySource, /mode === "pointer"/);
  assert.match(overlaySource, /leftBottom/);
  assert.match(overlaySource, /rightTop/);
  assert.match(overlaySource, /translateX\(-100%\)/);
  assert.doesNotMatch(overlaySource, /topLeft/);
  assert.match(overlayStyles, /pointer-events:\s*none;/);
  assert.match(overlayStyles, /pointer-events:\s*auto;/);
  assert.match(overlayStyles, /cursor:\s*copy;/);
});

test("Component Name Debug labels copy component names to Clipboard", () => {
  assert.match(overlaySource, /navigator\.clipboard/);
  assert.match(overlaySource, /writeText\(componentName\)/);
  assert.match(overlaySource, /componentNameDebugLabelCopyAttribute/);
  assert.match(overlaySource, /isComponentNameDebugCopyLabel/);
  assert.match(overlaySource, /void copyComponentNameToClipboard\(label\.name\)/);
});

test("Preview toggle menu hosts Component Name Debug independently from preview controls", () => {
  assert.match(previewToggleSource, /showPreviewModeControls\?: boolean/);
  assert.match(previewToggleSource, /Reviewer tools menu/);
  assert.match(previewToggleSource, /showPreviewModeControls \? "P" : "D"/);
  assert.match(previewToggleSource, /showPreviewModeControls \? \(/);
  assert.match(previewToggleSource, /<ComponentNameDebugMenuSection \/>/);
  assert.match(menuSectionSource, /Show Component Name/);
  assert.match(menuSectionSource, /Shortcut: Alt\+Shift\+N/);
  assert.match(menuSectionSource, /writeComponentNameDebugMode/);
});
