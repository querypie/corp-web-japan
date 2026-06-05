import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("Preview Toggle button is a dropdown trigger while preserving state display", () => {
  const source = readSource("src/components/layout/preview-mode-toggle.tsx");

  assert.match(source, /aria-pressed=\{isEnabled\}/);
  assert.match(source, /aria-haspopup="menu"/);
  assert.match(source, /aria-expanded=\{isMenuOpen\}/);
  assert.match(source, /aria-controls=\{menuId\}/);
  assert.match(source, /onClick=\{\(\) => setIsMenuOpen\(\(current\) => !current\)\}/);
  assert.match(source, /role="menu"/);
  assert.match(source, /role="menuitemradio"/);
  assert.match(source, /aria-checked=\{isEnabled\}/);
  assert.match(source, /aria-checked=\{!isEnabled\}/);
});

test("Preview Toggle dropdown handles dismissal and selection separately from the trigger", () => {
  const source = readSource("src/components/layout/preview-mode-toggle.tsx");

  assert.match(source, /document\.addEventListener\("pointerdown", handlePointerDown\)/);
  assert.match(source, /document\.addEventListener\("keydown", handleEscape\)/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /setIsMenuOpen\(false\);\s*\n\s*if \(nextEnabled === isEnabled\)/s);
  assert.match(source, /body: JSON\.stringify\(\{ enabled: nextEnabled \}\)/);
  assert.match(source, /router\.refresh\(\)/);
});

test("Preview Toggle dropdown styles provide a right-aligned overlay panel", () => {
  const styles = readSource("src/components/layout/preview-mode-toggle.module.css");

  assert.match(styles, /\.menuPanel\s*\{/);
  assert.match(styles, /\.menuPanel\s*\{[^}]*position:\s*absolute;/s);
  assert.match(styles, /\.menuPanel\s*\{[^}]*right:\s*0;/s);
  assert.match(styles, /\.menuItemActive\s*\{/);
});
