import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import path from "node:path";
import { readSource, sourceExists } from "./helpers/source-readers.mjs";

const legalMdxPaths = [
  "src/app/t/eula/content.mdx",
  "src/app/t/terms-of-service/content.mdx",
  ...readdirSync(path.resolve("src/content/privacy-policy"))
    .filter((entry) => entry.endsWith(".mdx"))
    .sort()
    .map((entry) => `src/content/privacy-policy/${entry}`),
];

const frontmatterRange = (source) => {
  if (!source.startsWith("---\n")) {
    return { start: -1, end: -1 };
  }

  const end = source.indexOf("\n---", 4);
  return { start: 0, end: end === -1 ? -1 : end + 4 };
};

const withoutFrontmatter = (source) => {
  const range = frontmatterRange(source);

  if (range.end === -1) {
    return source;
  }

  return source.slice(range.end);
};

const brOutsideTableCellCount = (source) => {
  let tableCellDepth = 0;
  let count = 0;

  for (const line of source.split("\n")) {
    if (/<Table\.(?:Td|Th)\b/.test(line)) {
      tableCellDepth += 1;
    }

    if (/<br\s*\/?>/i.test(line) && tableCellDepth === 0) {
      count += 1;
    }

    if (/<\/Table\.(?:Td|Th)>/.test(line)) {
      tableCellDepth = Math.max(0, tableCellDepth - 1);
    }
  }

  return count;
};

test("legal MDX source follows the documented refactoring rules", () => {
  assert.equal(sourceExists("docs/legal-mdx-refactoring-rules.md"), true);

  const docsSource = readSource("docs/legal-mdx-refactoring-rules.md");
  assert.match(docsSource, /Source comparison findings/);
  assert.match(docsSource, /\.\.\/corp-web-contents\/pages\/eula\/en\/content\.mdx/);
  assert.match(docsSource, /Wrapper components such as `Box` and `CenterSection`/);
  assert.match(docsSource, /The same rules should be reused when the Korean legal documents are refactored/);

  for (const mdxPath of legalMdxPaths) {
    const source = readSource(mdxPath);
    const body = withoutFrontmatter(source);

    assert.doesNotMatch(
      body,
      /^[ \t]+#{1,6}\s/m,
      `${mdxPath} should not indent Markdown headings`,
    );
    assert.doesNotMatch(
      body,
      /<(?:Box|CenterSection)\b/,
      `${mdxPath} should not use wrapper-only layout components in MDX`,
    );
    assert.equal(
      brOutsideTableCellCount(body),
      0,
      `${mdxPath} should not use <br /> outside table cells`,
    );
    assert.doesNotMatch(
      body,
      /^\s*\{["'][^{}<>]+["']\}\s*$/m,
      `${mdxPath} should avoid unnecessary JSX string expressions for plain text`,
    );
  }
});
