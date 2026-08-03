import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../helpers/source-readers.mjs";

test("the app spotlight CTA uses the shared visual arrow cue instead of a text glyph", () => {
  const source = readSource("src/components/sections/app-spotlight-card.tsx");

  assert.match(source, /import \{ ArrowRight \} from "lucide-react"/);
  assert.match(source, /gap-2[\s\S]*<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" \/>/);
  assert.doesNotMatch(source, /<span aria-hidden="true">→<\/span>/);
});
